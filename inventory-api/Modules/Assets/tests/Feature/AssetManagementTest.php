<?php
// Modules/Assets/Tests/Feature/AssetManagementTest.php

namespace Modules\Assets\Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Modules\Assets\app\Models\Assets as Asset;
use Modules\Inventory\app\Models\Store;
use Modules\Inventory\app\Models\StockItem;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AssetManagementTest extends TestCase
{
  use RefreshDatabase;

  protected $user;
  protected $token;

  protected function setUp(): void
  {
    parent::setUp();

    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);
    $permissions = ['view-assets', 'create-assets', 'edit-assets', 'assign-assets'];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);
    $this->token = $this->user->createToken('test-token')->plainTextToken;
  }

  /** @test */
  public function user_can_create_asset()
  {
    $assetData = [
      'name' => 'Cisco Router',
      'type' => 'pop',
      'serial_no' => 'SN123456',
      'purchase_cost' => 50000,
      'useful_life_months' => 36,
    ];

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/assets', $assetData);

    $response->assertStatus(201)
      ->assertJson([
        'success' => true,
      ]);

    $this->assertDatabaseHas('assets', [
      'name' => 'Cisco Router',
      'serial_no' => 'SN123456',
    ]);
  }

  /** @test */
  public function user_can_assign_asset()
  {
    $asset = Asset::factory()->create([
      'status' => 'in_stock',
    ]);

    $assignee = User::factory()->create();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/assets/{$asset->id}/assign", [
      'user_id' => $assignee->id,
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('assets', [
      'id' => $asset->id,
      'status' => 'assigned',
      'assigned_to' => $assignee->id,
    ]);
  }

  /** @test */
  public function asset_depreciation_is_calculated()
  {
    $asset = Asset::factory()->create([
      'purchase_cost' => 120000,
      'salvage_value' => 10000,
      'useful_life_months' => 36,
      'depreciation_method' => 'straight_line',
      'purchase_date' => now()->subMonths(12),
    ]);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/assets/{$asset->id}/depreciation");

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'data' => [
          'purchase_cost',
          'current_value',
          'depreciation_amount',
          'depreciation_percentage',
        ],
      ]);
  }
}
