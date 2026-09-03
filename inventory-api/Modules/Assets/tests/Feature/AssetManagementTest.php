<?php
// Modules/Assets/tests/Feature/AssetManagementTest.php

namespace Modules\Assets\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Assets\app\Models\Assets;
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

    // Create user
    $this->user = User::factory()->create();

    // Create role and permissions
    $role = Role::create(['name' => 'admin']);
    $permissions = ['view-assets', 'create-assets', 'edit-assets', 'assign-assets'];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);

    // Create token AFTER assigning role
    $this->token = $this->user->createToken('test-token')->plainTextToken;
  }

  #[Test]
  public function can_create_asset()
  {
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
      'Accept' => 'application/json',
    ])->postJson('/api/v1/assets', [
      'name' => 'Test Router',
      'type' => 'pop',
      'serial_no' => 'SN-' . uniqid(),
      'purchase_cost' => 50000,
    ]);

    $response->assertStatus(201);
  }

  #[Test]
  public function can_assign_asset()
  {
    $asset = Assets::create([
      'asset_code' => 'AST-' . uniqid(),
      'name' => 'Test Asset',
      'type' => 'other',
      'serial_no' => 'SN-' . uniqid(),
      'status' => 'in_stock',
      'purchase_cost' => 50000,
      'current_value' => 50000,
      'salvage_value' => 5000,
      'useful_life_months' => 36,
      'depreciation_method' => 'straight_line',
      'is_active' => true,
    ]);

    $assignee = User::factory()->create();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/assets/{$asset->id}/assign", [
      'user_id' => $assignee->id,
    ]);

    $response->assertStatus(200);
  }

  #[Test]
  public function can_calculate_depreciation()
  {
    $asset = Assets::create([
      'asset_code' => 'AST-' . uniqid(),
      'name' => 'Test Asset',
      'type' => 'other',
      'serial_no' => 'SN-' . uniqid(),
      'status' => 'in_stock',
      'purchase_cost' => 120000,
      'current_value' => 120000,
      'salvage_value' => 10000,
      'useful_life_months' => 36,
      'depreciation_method' => 'straight_line',
      'is_active' => true,
    ]);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/assets/{$asset->id}/depreciation");

    $response->assertStatus(200);
  }
}
