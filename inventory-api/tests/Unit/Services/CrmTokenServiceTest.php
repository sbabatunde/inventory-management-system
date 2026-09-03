<?php
// tests/Unit/Services/CrmTokenServiceTest.php

namespace Tests\Unit\Services;

use App\Services\Auth\CrmTokenService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CrmTokenServiceTest extends TestCase
{
  protected CrmTokenService $crmTokenService;

  protected function setUp(): void
  {
    parent::setUp();
    $this->crmTokenService = new CrmTokenService();
  }

  #[Test]
  public function validates_token_with_crm()
  {
    // Mock HTTP response
    Http::fake([
      'crm.example.com/api/auth/verify' => Http::response([
        'valid' => true,
        'metadata' => [],
        'expires_at' => now()->addHours(1)->toISOString(),
      ], 200),
      'crm.example.com/api/auth/user' => Http::response([
        'data' => [
          'id' => 'CRM-001',
          'name' => 'Test User',
          'email' => 'test@crm.com',
          'roles' => ['engineer'],
          'permissions' => ['view-assets'],
        ],
      ], 200),
    ]);

    config([
      'crm-auth.crm_url' => 'http://crm.example.com',
      'crm-auth.token_endpoint' => '/api/auth/verify',
      'crm-auth.user_endpoint' => '/api/auth/user',
      'crm-auth.cache.enabled' => false,
    ]);

    $result = $this->crmTokenService->validateToken('valid-token');

    $this->assertNotNull($result);
    $this->assertEquals('CRM-001', $result['crm_user_id']);
    $this->assertEquals('Test User', $result['name']);
  }

  #[Test]
  public function returns_null_for_invalid_token()
  {
    Http::fake([
      'crm.example.com/api/auth/verify' => Http::response([
        'valid' => false,
      ], 401),
    ]);

    config([
      'crm-auth.crm_url' => 'http://crm.example.com',
      'crm-auth.token_endpoint' => '/api/auth/verify',
      'crm-auth.cache.enabled' => false,
    ]);

    $result = $this->crmTokenService->validateToken('invalid-token');

    $this->assertNull($result);
  }

  #[Test]
  public function caches_valid_token()
  {
    Http::fake([
      'crm.example.com/api/auth/verify' => Http::response([
        'valid' => true,
        'expires_at' => now()->addHours(1)->toISOString(),
      ], 200),
      'crm.example.com/api/auth/user' => Http::response([
        'data' => [
          'id' => 'CRM-001',
          'name' => 'Test User',
          'email' => 'test@crm.com',
          'roles' => [],
          'permissions' => [],
        ],
      ], 200),
    ]);

    config([
      'crm-auth.crm_url' => 'http://crm.example.com',
      'crm-auth.token_endpoint' => '/api/auth/verify',
      'crm-auth.user_endpoint' => '/api/auth/user',
      'crm-auth.cache.enabled' => true,
      'crm-auth.cache.ttl' => 300,
    ]);

    // First call - should hit CRM
    $result1 = $this->crmTokenService->validateToken('token-123');

    // Second call - should hit cache
    $result2 = $this->crmTokenService->validateToken('token-123');

    $this->assertNotNull($result1);
    $this->assertNotNull($result2);
    $this->assertEquals($result1, $result2);
  }
}
