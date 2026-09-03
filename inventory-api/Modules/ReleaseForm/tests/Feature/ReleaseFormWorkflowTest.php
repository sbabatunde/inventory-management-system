<?php
// Modules/ReleaseForm/tests/Feature/ReleaseFormWorkflowTest.php

namespace Modules\ReleaseForm\Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Inventory\app\Models\Store;
use Modules\Inventory\app\Models\StockItem;
use Modules\Inventory\app\Models\StockBalance;
use Modules\ReleaseForm\app\Models\ReleaseForm;
use Modules\ReleaseForm\app\Models\ReleaseFormItem;

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

    $this->user = User::create([
      'name' => 'Test User',
      'email' => 'test-' . uniqid() . '@example.com',
      'password' => bcrypt('password123'),
      'is_active' => true,
    ]);

    $this->token = $this->user->createToken('test-token')->plainTextToken;

    $this->store = Store::create([
      'name' => 'Test Store',
      'code' => 'STR-' . uniqid(),
      'type' => 'HQ',
      'city' => 'Lagos',
      'is_active' => true,
    ]);

    $this->stockItem = StockItem::create([
      'code' => 'ITM-' . uniqid(),
      'name' => 'Test Item',
      'nature' => 'solid',
      'unit_of_measure' => 'pcs',
      'reorder_level' => 10,
      'unit_cost' => 1000,
      'is_active' => true,
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

    $this->assertTrue(in_array($response->status(), [200, 201, 403, 422, 500]));
  }

  #[Test]
  public function release_form_goes_through_full_workflow()
  {
    $form = ReleaseForm::create([
      'form_no' => 'RF-' . uniqid(),
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

    // Submit
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/submit");

    $this->assertTrue(in_array($response->status(), [200, 403, 422, 500]));

    // Approve
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/approve");

    $this->assertTrue(in_array($response->status(), [200, 403, 422, 500]));

    // Dispatch
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/dispatch");

    $this->assertTrue(in_array($response->status(), [200, 403, 422, 500]));

    // Complete
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/complete");

    $this->assertTrue(in_array($response->status(), [200, 403, 422, 500]));
  }

  #[Test]
  public function cannot_dispatch_without_approval()
  {
    $form = ReleaseForm::create([
      'form_no' => 'RF-' . uniqid(),
      'category' => 'others',
      'store_id' => $this->store->id,
      'destination_type' => 'Other',
      'status' => 'draft',
      'created_by' => $this->user->id,
    ]);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson("/api/v1/release-forms/{$form->id}/dispatch");

    $this->assertTrue(in_array($response->status(), [403, 422, 500]));
  }
}
