<?php
// Modules/Inventory/Tests/Feature/StoreManagementTest.php

namespace Modules\Inventory\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Inventory\app\Models\Store;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class StoreManagementTest extends TestCase
{
  use RefreshDatabase;

  protected $user;
  protected $token;

  protected function setUp(): void
  {
    parent::setUp();

    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);

    $permissions = ['view-stores', 'create-stores', 'edit-stores', 'delete-stores'];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);
    $this->token = $this->user->createToken('test-token')->plainTextToken;
  }

  protected function createTestStore(): Store
  {
    return Store::create([
      'name' => 'Test Store ' . uniqid(),
      'code' => 'STR-' . uniqid(),
      'type' => 'HQ',
      'city' => 'Lagos',
      'state' => 'Lagos State',
      'contact_person' => 'Test Person',
      'contact_phone' => '1234567890',
      'contact_email' => 'test@example.com',
      'is_active' => true,
    ]);
  }

  #[Test]
  public function can_create_store()
  {
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
      'Accept' => 'application/json',
    ])->postJson('/api/v1/inventory/stores', [
      'name' => 'New Test Store',
      'code' => 'HQ-' . uniqid(),
      'type' => 'HQ',
      'city' => 'Lagos',
      'state' => 'Lagos State',
    ]);

    // Check if route exists
    if ($response->status() === 404) {
      fwrite(STDERR, "\nStore route not found. Checking routes...\n");
      $routes = collect(\Illuminate\Support\Facades\Route::getRoutes())
        ->map(fn($route) => $route->uri())
        ->filter(fn($uri) => str_contains($uri, 'store'));

      foreach ($routes as $route) {
        fwrite(STDERR, "  Route: {$route}\n");
      }
    }

    $response->assertStatus(201);
  }

  #[Test]
  public function can_list_stores()
  {
    for ($i = 1; $i <= 3; $i++) {
      $this->createTestStore();
    }

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/v1/inventory/stores');

    $response->assertStatus(200);
  }

  #[Test]
  public function can_update_store()
  {
    $store = $this->createTestStore();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->putJson("/api/v1/inventory/stores/{$store->id}", [
      'name' => 'Updated Store',
      'type' => 'Branch',
      'city' => 'Abuja',
      'state' => 'FCT',
    ]);

    $response->assertStatus(200);
  }

  #[Test]
  public function can_delete_store()
  {
    $store = $this->createTestStore();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->deleteJson("/api/v1/inventory/stores/{$store->id}");

    $response->assertStatus(200);
  }
}
