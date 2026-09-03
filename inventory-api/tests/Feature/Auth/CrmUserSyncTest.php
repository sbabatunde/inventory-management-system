<?php
// tests/Feature/Auth/CrmUserSyncTest.php

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

class CrmUserSyncTest extends TestCase
{
  use RefreshDatabase;

  protected function setUp(): void
  {
    parent::setUp();

    config(['auth-methods.methods.crm.enabled' => true]);

    // Create ALL roles that might be used
    $roles = ['super-admin', 'admin', 'manager', 'storekeeper', 'engineer', 'staff', 'user'];
    foreach ($roles as $role) {
      Role::create(['name' => $role]);
    }

    // Create ALL permissions that might be used
    $permissions = [
      'view-users',
      'create-users',
      'edit-users',
      'delete-users',
      'view-release-forms',
      'create-release-forms',
      'edit-release-forms',
      'approve-release-forms',
      'dispatch-release-forms',
      'view-assets',
      'create-assets',
      'assign-assets',
      'view-stores',
      'create-stores',
      'view-dashboard',
    ];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
    }
  }

  #[Test]
  public function new_crm_user_is_created_on_first_login()
  {
    $crmTokenService = Mockery::mock(CrmTokenService::class);
    $crmTokenService->shouldReceive('validateToken')
      ->andReturn([
        'crm_user_id' => 'CRM-NEW-001',
        'name' => 'New CRM User',
        'email' => 'newuser@crm.com',
        'roles' => ['engineer'],
        'permissions' => ['view-release-forms'],
        'is_active' => true,
      ]);

    $this->app->instance(CrmTokenService::class, $crmTokenService);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'valid-token',
    ]);

    $response->assertStatus(200);

    // Verify user created with correct data
    $user = User::where('crm_user_id', 'CRM-NEW-001')->first();

    $this->assertNotNull($user);
    $this->assertEquals('New CRM User', $user->name);
    $this->assertEquals('newuser@crm.com', $user->email);
    $this->assertTrue($user->hasRole('engineer'));
    $this->assertTrue($user->hasPermissionTo('view-release-forms'));
  }

  #[Test]
  public function existing_user_roles_are_synced()
  {
    // Create existing user with no roles
    $user = User::create([
      'crm_user_id' => 'CRM-EXIST-001',
      'name' => 'Existing User',
      'email' => 'existing@crm.com',
      'password' => Hash::make('password'),
      'is_active' => true,
    ]);

    $crmTokenService = Mockery::mock(CrmTokenService::class);
    $crmTokenService->shouldReceive('validateToken')
      ->andReturn([
        'crm_user_id' => 'CRM-EXIST-001',
        'name' => 'Existing User',
        'email' => 'existing@crm.com',
        'roles' => ['manager', 'engineer'],
        'permissions' => ['view-release-forms', 'create-release-forms'],
        'is_active' => true,
      ]);

    $this->app->instance(CrmTokenService::class, $crmTokenService);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'valid-token',
    ]);

    $response->assertStatus(200);

    // Verify roles synced
    $user->refresh();
    $this->assertTrue($user->hasRole('manager'));
    $this->assertTrue($user->hasRole('engineer'));
    $this->assertTrue($user->hasPermissionTo('create-release-forms'));
  }

  #[Test]
  public function inactive_crm_user_is_reactivated()
  {
    // Create inactive user
    $user = User::create([
      'crm_user_id' => 'CRM-INACTIVE-001',
      'name' => 'Inactive User',
      'email' => 'inactive@crm.com',
      'password' => Hash::make('password'),
      'is_active' => false,
    ]);

    $crmTokenService = Mockery::mock(CrmTokenService::class);
    $crmTokenService->shouldReceive('validateToken')
      ->andReturn([
        'crm_user_id' => 'CRM-INACTIVE-001',
        'name' => 'Inactive User',
        'email' => 'inactive@crm.com',
        'roles' => [],
        'permissions' => [],
        'is_active' => true,
      ]);

    $this->app->instance(CrmTokenService::class, $crmTokenService);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'crm',
      'crm_token' => 'valid-token',
    ]);

    $response->assertStatus(200);

    // Verify user reactivated
    $user->refresh();
    $this->assertTrue($user->is_active);
  }

  protected function tearDown(): void
  {
    Mockery::close();
    parent::tearDown();
  }
}
