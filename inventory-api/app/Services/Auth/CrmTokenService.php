<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\CrmToken;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CrmTokenService
{
  protected string $crmUrl;
  protected string $tokenEndpoint;
  protected string $userEndpoint;
  protected bool $cacheEnabled;
  protected int $cacheTtl;
  protected string $cachePrefix;

  public function __construct()
  {
    $this->crmUrl = config('crm-auth.crm_url');
    $this->tokenEndpoint = config('crm-auth.token_endpoint');
    $this->userEndpoint = config('crm-auth.user_endpoint');
    $this->cacheEnabled = config('crm-auth.cache.enabled');
    $this->cacheTtl = config('crm-auth.cache.ttl');
    $this->cachePrefix = config('crm-auth.cache.prefix');
  }

  /**
   * Validate token with CRM and return user data
   */
  public function validateToken(string $token): ?array
  {
    // Check cache first
    if ($this->cacheEnabled) {
      $cacheKey = $this->getCacheKey($token);

      if (Cache::has($cacheKey)) {
        return Cache::get($cacheKey);
      }
    }

    try {
      // Verify token with CRM
      $response = Http::withHeaders([
        'Authorization' => "Bearer {$token}",
        'Accept' => 'application/json',
        'X-App-Secret' => config('crm-auth.token.secret'),
      ])->post($this->crmUrl . $this->tokenEndpoint);

      if (!$response->successful()) {
        Log::warning('CRM token validation failed', [
          'status' => $response->status(),
          'body' => $response->body(),
        ]);
        return null;
      }

      $tokenData = $response->json();

      if (!isset($tokenData['valid']) || !$tokenData['valid']) {
        return null;
      }

      // Fetch user data from CRM
      $userData = $this->fetchUserFromCrm($token);

      if (!$userData) {
        return null;
      }

      // Prepare user data
      $userPayload = [
        'crm_user_id' => $userData['id'],
        'email' => $userData['email'],
        'name' => $userData['name'],
        'roles' => $userData['roles'] ?? [],
        'permissions' => $userData['permissions'] ?? [],
        'token_metadata' => $tokenData['metadata'] ?? [],
        'expires_at' => $tokenData['expires_at'] ?? null,
      ];

      // Cache the validated token
      if ($this->cacheEnabled) {
        Cache::put(
          $this->getCacheKey($token),
          $userPayload,
          Carbon::now()->addSeconds($this->cacheTtl)
        );
      }

      return $userPayload;
    } catch (\Exception $e) {
      Log::error('CRM token validation error', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);
      return null;
    }
  }

  /**
   * Fetch user data from CRM
   */
  protected function fetchUserFromCrm(string $token): ?array
  {
    try {
      $response = Http::withHeaders([
        'Authorization' => "Bearer {$token}",
        'Accept' => 'application/json',
      ])->get($this->crmUrl . $this->userEndpoint);

      if (!$response->successful()) {
        return null;
      }

      return $response->json()['data'] ?? null;
    } catch (\Exception $e) {
      Log::error('Failed to fetch user from CRM', [
        'error' => $e->getMessage(),
      ]);
      return null;
    }
  }

  /**
   * Generate cache key for token
   */
  protected function getCacheKey(string $token): string
  {
    return $this->cachePrefix . hash('sha256', $token);
  }

  /**
   * Revoke cached token
   */
  public function revokeCachedToken(string $token): void
  {
    if ($this->cacheEnabled) {
      Cache::forget($this->getCacheKey($token));
    }
  }
}
