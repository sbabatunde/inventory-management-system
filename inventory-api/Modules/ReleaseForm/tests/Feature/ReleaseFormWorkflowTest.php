<?php
// Modules/ReleaseForm/Tests/Feature/ReleaseFormWorkflowTest.php

namespace Modules\ReleaseForm\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Inventory\App\Models\Store;
use Modules\Inventory\App\Models\StockItem;
use Modules\Inventory\App\Models\StockBalance;
use Modules\ReleaseForm\App\Models\ReleaseForm;
use Modules\ReleaseForm\App\Models\ReleaseFormItem;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ReleaseFormWorkflowTest extends TestCase
{
  use RefreshDatabase;

  protected $user;
  protected $store;
  protected $stockItem;
  protected $token;

  protected function setUp(): void
  {
    parent::setUp();

    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);

    $permissions = [
      'view-release-forms',
      'create-release-forms',
      'edit-release-forms',
      'approve-release-forms',
      'dispatch-release-forms',
    ];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
      $role->givePermissionTo($permission);
    }

    $this->user->assignRole($role);
    $this->token = $this->user->createToken('test-token')->plainTextToken;

    $this->store = Store::factory()->create();
    $this->stockItem = StockItem::factory()->create([
      'unit_of_measure' => 'pcs',
      'unit_cost' => 1000,
    ]);

    StockBalance::create([
      'store_id' => $this->store->id,
      'stock_item_id' => $this->stockItem->id,
      'quantity_on_hand' => 100,
      'quantity_reserved' => 0,
      'quantity_available' => 100,
    ]);
  }

  #[Test]
  public function can_create_release_form()
  {
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/release-forms', [
      'category' => 'others',
      'store_id' => $this->store->id,
      'destination_type' => 'Other',
      'destination_name' => 'Test Location',
      'reference_description' => 'Testing release',
      'items' => [
        [
          'stock_item_id' => $this->stockItem->id,
          'qty_requested' => 5,
          'unit_of_measure' => 'pcs',
        ],
      ],
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('release_forms', [
      'store_id' => $this->store->id,
      'category' => 'others',
      'status' => 'draft',
    ]);
  }

  #[Test]
  public function release_form_goes_through_full_workflow()
  {
    // Create form
    $form = ReleaseForm::create([
      'form_no' => 'RF-TEST-001',
      'category' => 'others',
      'store_id' => $this->store->id,
      'destination_type' => 'Other',
      'destination_name' => 'Test Location',
      'status' => 'draft',
      'created_by' => $this->user->id,
    ]);

    ReleaseFormItem::create([
      'release_form_id' => $form->id,
      'stock_item_id' => $this->stockItem->id,
      'qty_requested' => 5,
      'qty_released' => 0,
      'qty_before' => 100,
      'unit_of_measure' => 'pcs',
    ]);

    // Submit for approval
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/submit");

    $response->assertStatus(200);

    // Approve
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/approve");

    $response->assertStatus(200);

    // Dispatch (deducts stock)
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/dispatch");

    $response->assertStatus(200);

    // Verify stock deducted
    $this->assertDatabaseHas('stock_balances', [
      'store_id' => $this->store->id,
      'stock_item_id' => $this->stockItem->id,
      'quantity_on_hand' => 95,
    ]);

    // Complete
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/complete");

    $response->assertStatus(200);
    $this->assertDatabaseHas('release_forms', [
      'id' => $form->id,
      'status' => 'completed',
    ]);
  }

  #[Test]
  public function cannot_dispatch_without_approval()
  {
    $form = ReleaseForm::create([
      'form_no' => 'RF-TEST-002',
      'category' => 'others',
      'store_id' => $this->store->id,
      'destination_type' => 'Other',
      'status' => 'draft',
      'created_by' => $this->user->id,
    ]);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/dispatch");

    $response->assertStatus(422);
  }
}
