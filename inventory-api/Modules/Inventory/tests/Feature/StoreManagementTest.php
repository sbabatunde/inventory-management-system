<?php
// Modules/Inventory/Tests/Feature/StoreManagementTest.php

namespace Modules\Inventory\Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Modules\Inventory\App\Models\Store;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class StoreManagementTest extends TestCase
{
  use RefreshDatabase, WithFaker;

  protected $user;
  protected $token;

  protected function setUp(): void
  {
    parent::setUp();

    // Create user with permissions
    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);
    $permissions = [
      'view-stores',
      'create-stores',
      'edit-stores',
      'delete-stores',
      'view-stock',
      'view-stock-items',
      'create-stock-items',
    ];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);
    $this->token = $this->user->createToken('test-token')->plainTextToken;
  }

  /** @test */
  public function user_can_create_store()
  {
    $storeData = [
      'name' => 'Main Store',
      'code' => 'HQ-0001',
      'type' => 'HQ',
      'city' => 'Lagos',
      'state' => 'Lagos State',
    ];

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/inventory/stores', $storeData);

    $response->assertStatus(201)
      ->assertJson([
        'success' => true,
        'data' => [
          'name' => 'Main Store',
          'code' => 'HQ-0001',
          'type' => 'HQ',
        ],
      ]);

    $this->assertDatabaseHas('stores', [
      'name' => 'Main Store',
      'code' => 'HQ-0001',
    ]);
  }

  /** @test */
  public function user_can_get_all_stores()
  {
    Store::factory()->count(5)->create();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/v1/inventory/stores');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'data' => [
          'stores',
          'pagination',
        ],
      ]);
  }

  /** @test */
  public function user_can_update_store()
  {
    $store = Store::factory()->create();

    $updateData = [
      'name' => 'Updated Store Name',
      'type' => 'Branch',
      'city' => 'Abuja',
    ];

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->putJson("/api/v1/inventory/stores/{$store->id}", $updateData);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
      ]);

    $this->assertDatabaseHas('stores', [
      'id' => $store->id,
      'name' => 'Updated Store Name',
      'type' => 'Branch',
    ]);
  }

  /** @test */
  public function user_can_delete_store()
  {
    $store = Store::factory()->create();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->deleteJson("/api/v1/inventory/stores/{$store->id}");

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
      ]);

    $this->assertSoftDeleted('stores', [
      'id' => $store->id,
    ]);
  }
}
