<?php
// tests/Feature/Auth/CrmAuthenticationTest.php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Services\Auth\CrmTokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Mockery;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CrmAuthenticationTest extends TestCase
{
  use RefreshDatabase;

  protected function setUp(): void
  {
    parent::setUp();

    // Enable CRM auth for testing
    config(['auth-methods.methods.crm.enabled' => true]);
    config(['auth-methods.methods.local.enabled' => true]);

    // Create required roles
    Role::create(['name' => 'manager']);
    Role::create(['name' => 'engineer']);
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'storekeeper']);
    Role::create(['name' => 'staff']);

    // Create required permissions
    $permissions = [
      'view-users',
      'view-release-forms',
      'create-release-forms',
      'view-assets',
      'view-dashboard',
    ];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
    }
  }

  #[Test]
  public function user_can_login_with_valid_crm_token()
  {
    // Mock the CRM token service
    $crmTokenService = Mockery::mock(CrmTokenService::class);
    $crmTokenService->shouldReceive('validateToken')
      ->once()
      ->with('valid-crm-token')
      ->andReturn([
        'crm_user_id' => 'CRM-001',
        'name' => 'CRM User',
        'email' => 'crmuser@example.com',
        'roles' => ['engineer'],
        'permissions' => ['view-release-forms'],
        'is_active' => true,
      ]);

    $this->app->instance(CrmTokenService::class, $crmTokenService);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'valid-crm-token',
    ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
      ]);

    // Verify user was created
    $this->assertDatabaseHas('users', [
      'crm_user_id' => 'CRM-001',
      'email' => 'crmuser@example.com',
      'name' => 'CRM User',
    ]);
  }

  #[Test]
  public function user_can_login_with_invalid_crm_token()
  {
    // Mock the CRM token service to return null (invalid token)
    $crmTokenService = Mockery::mock(CrmTokenService::class);
    $crmTokenService->shouldReceive('validateToken')
      ->once()
      ->with('invalid-token')
      ->andReturn(null);

    $this->app->instance(CrmTokenService::class, $crmTokenService);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'invalid-token',
    ]);

    $response->assertStatus(422);
  }

  #[Test]
  public function existing_user_is_updated_on_crm_login()
  {
    // Create existing user
    $existingUser = User::create([
      'name' => 'Old Name',
      'email' => 'existing@example.com',
      'password' => Hash::make('password'),
      'is_active' => true,
    ]);

    // Mock CRM response with updated data
    $crmTokenService = Mockery::mock(CrmTokenService::class);
    $crmTokenService->shouldReceive('validateToken')
      ->once()
      ->with('valid-token')
      ->andReturn([
        'crm_user_id' => 'CRM-002',
        'name' => 'Updated Name',
        'email' => 'existing@example.com',
        'roles' => ['manager'],
        'permissions' => ['view-users'],
        'is_active' => true,
      ]);

    $this->app->instance(CrmTokenService::class, $crmTokenService);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'valid-token',
    ]);

    $response->assertStatus(200);

    // Verify user was updated
    $this->assertDatabaseHas('users', [
      'id' => $existingUser->id,
      'crm_user_id' => 'CRM-002',
      'name' => 'Updated Name',
    ]);

    // Verify role assigned
    $existingUser->refresh();
    $this->assertTrue($existingUser->hasRole('manager'));
  }

  #[Test]
  public function crm_login_fails_when_disabled()
  {
    // Disable CRM auth
    config(['auth-methods.methods.crm.enabled' => false]);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'any-token',
    ]);

    $response->assertStatus(422);
  }

  #[Test]
  public function crm_login_requires_token()
  {
    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
    ]);

    $response->assertStatus(422);
  }

  protected function tearDown(): void
  {
    Mockery::close();
    parent::tearDown();
  }
}
