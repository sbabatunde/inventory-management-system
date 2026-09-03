<?php
// Modules/Assets/Tests/Feature/AssetManagementTest.php

namespace Modules\Assets\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Assets\App\Models\Assets;
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

    $permissions = ['view-assets', 'create-assets', 'assign-assets'];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);
    $this->token = $this->user->createToken('test-token')->plainTextToken;
  }

  #[Test]
  public function can_create_asset()
  {
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/assets', [
      'name' => 'Test Router',
      'type' => 'pop',
      'serial_no' => 'SN-TEST-001',
      'purchase_cost' => 50000,
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('assets', [
      'name' => 'Test Router',
      'serial_no' => 'SN-TEST-001',
    ]);
  }

  #[Test]
  public function can_assign_asset()
  {
    $asset = Assets::factory()->create(['status' => 'in_stock']);
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

  #[Test]
  public function can_calculate_depreciation()
  {
    $asset = Assets::factory()->create([
      'purchase_cost' => 120000,
      'salvage_value' => 10000,
      'useful_life_months' => 36,
      'depreciation_method' => 'straight_line',
      'purchase_date' => now()->subMonths(12),
    ]);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/assets/{$asset->id}/depreciation");

    $response->assertStatus(200);
  }
}
