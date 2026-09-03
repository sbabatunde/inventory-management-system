<?php
// Modules/Inventory/Tests/Feature/StockItemTest.php

namespace Modules\Inventory\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Inventory\App\Models\StockItem;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class StockItemTest extends TestCase
{
  use RefreshDatabase;

  protected $user;
  protected $token;

  protected function setUp(): void
  {
    parent::setUp();

    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);

    $permissions = ['view-stock-items', 'create-stock-items', 'edit-stock-items'];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);
    $this->token = $this->user->createToken('test-token')->plainTextToken;
  }

  #[Test]
  public function can_create_stock_item()
  {
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/inventory/stock-items', [
      'code' => 'ITM-TEST-001',
      'name' => 'Test Item',
      'nature' => 'solid',
      'unit_of_measure' => 'pcs',
      'reorder_level' => 10,
      'unit_cost' => 1000,
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('stock_items', [
      'code' => 'ITM-TEST-001',
      'name' => 'Test Item',
    ]);
  }

  #[Test]
  public function can_list_stock_items()
  {
    StockItem::factory()->count(5)->create();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/v1/inventory/stock-items');

    $response->assertStatus(200);
  }

  #[Test]
  public function cannot_create_duplicate_code()
  {
    StockItem::factory()->create(['code' => 'ITM-DUP']);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/inventory/stock-items', [
      'code' => 'ITM-DUP',
      'name' => 'Duplicate',
      'nature' => 'solid',
      'unit_of_measure' => 'pcs',
    ]);

    $response->assertStatus(422);
  }
}
