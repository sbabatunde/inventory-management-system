<?php
// Modules/Integration/app/Services/CrmApiClient.php

namespace Modules\Integration\app\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CrmApiClient
{
  protected string $baseUrl;
  protected string $appSecret;
  protected int $maxAttempts;
  protected int $delaySeconds;
  protected int $circuitBreakerThreshold;
  protected int $circuitBreakerTimeout;

  public function __construct()
  {
    $this->baseUrl = config('crm.base_url');
    $this->appSecret = config('crm.app_secret');
    $this->maxAttempts = config('crm.retry.max_attempts');
    $this->delaySeconds = config('crm.retry.delay_seconds');
    $this->circuitBreakerThreshold = config('crm.retry.circuit_breaker_threshold');
    $this->circuitBreakerTimeout = config('crm.retry.circuit_breaker_timeout');
  }

  /**
   * Make GET request with retry and circuit breaker
   */
  public function get(string $endpoint, array $params = []): ?array
  {
    return $this->request('GET', $endpoint, $params);
  }

  /**
   * Make POST request with retry and circuit breaker
   */
  public function post(string $endpoint, array $data = []): ?array
  {
    return $this->request('POST', $endpoint, $data);
  }

  /**
   * Make PUT request with retry and circuit breaker
   */
  public function put(string $endpoint, array $data = []): ?array
  {
    return $this->request('PUT', $endpoint, $data);
  }

  /**
   * Check if CRM is available
   */
  public function isAvailable(): bool
  {
    return !$this->isCircuitOpen();
  }

  /**
   * Core request method with retry logic
   */
  protected function request(string $method, string $endpoint, array $data = []): ?array
  {
    // Check circuit breaker
    if ($this->isCircuitOpen()) {
      Log::warning('CRM circuit breaker is open, skipping request');
      return null;
    }

    // Check cache for GET requests
    if ($method === 'GET' && config('crm.cache.enabled')) {
      $cacheKey = $this->getCacheKey($endpoint, $data);

      if (Cache::has($cacheKey)) {
        return Cache::get($cacheKey);
      }
    }

    $attempts = 0;
    $lastException = null;

    while ($attempts < $this->maxAttempts) {
      try {
        $response = $this->makeRequest($method, $endpoint, $data);

        if ($response->successful()) {
          $result = $response->json();

          // Cache successful GET responses
          if ($method === 'GET' && config('crm.cache.enabled')) {
            Cache::put(
              $this->getCacheKey($endpoint, $data),
              $result,
              now()->addSeconds(config('crm.cache.ttl'))
            );
          }

          // Reset circuit breaker on success
          $this->resetCircuitBreaker();

          return $result;
        }

        if ($response->status() === 404) {
          Log::warning("CRM resource not found: {$endpoint}");
          return null;
        }

        if ($response->status() === 401 || $response->status() === 403) {
          Log::error('CRM authentication failed');
          return null;
        }

        // Record failure for circuit breaker
        $this->recordFailure();

        throw new \Exception("CRM request failed with status: {$response->status()}");
      } catch (\Exception $e) {
        $lastException = $e;
        $attempts++;

        Log::warning("CRM request attempt {$attempts} failed: {$e->getMessage()}");

        if ($attempts < $this->maxAttempts) {
          sleep($this->delaySeconds);
        }
      }
    }

    // All attempts failed
    $this->recordFailure();
    Log::error("CRM request failed after {$this->maxAttempts} attempts: {$endpoint}");

    return null;
  }

  /**
   * Make HTTP request
   */
  protected function makeRequest(string $method, string $endpoint, array $data = [])
  {
    $url = $this->baseUrl . $endpoint;

    $request = Http::withHeaders([
      'Accept' => 'application/json',
      'X-App-Secret' => $this->appSecret,
    ])->timeout(config('crm.timeout.request'));

    return match ($method) {
      'GET' => $request->get($url, $data),
      'POST' => $request->post($url, $data),
      'PUT' => $request->put($url, $data),
      default => throw new \Exception("Unsupported HTTP method: {$method}"),
    };
  }

  /**
   * Check if circuit is open
   */
  protected function isCircuitOpen(): bool
  {
    $failures = Cache::get('crm:circuit_breaker_failures', 0);
    return $failures >= $this->circuitBreakerThreshold;
  }

  /**
   * Record failure for circuit breaker
   */
  protected function recordFailure(): void
  {
    $failures = Cache::get('crm:circuit_breaker_failures', 0);
    Cache::put(
      'crm:circuit_breaker_failures',
      $failures + 1,
      now()->addSeconds($this->circuitBreakerTimeout)
    );
  }

  /**
   * Reset circuit breaker
   */
  protected function resetCircuitBreaker(): void
  {
    Cache::forget('crm:circuit_breaker_failures');
  }

  /**
   * Generate cache key
   */
  protected function getCacheKey(string $endpoint, array $params = []): string
  {
    return config('crm.cache.prefix') . md5($endpoint . serialize($params));
  }
}
