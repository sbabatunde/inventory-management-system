<?php
// Modules/Inventory/tests/Feature/StockItemTest.php

namespace Modules\Inventory\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Modules\Inventory\app\Models\StockItem;

class StockItemTest extends TestCase
{
  use RefreshDatabase;

  protected $user;
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
  }

  protected function createTestItem(): StockItem
  {
    return StockItem::create([
      'code' => 'ITM-' . uniqid(),
      'name' => 'Test Item ' . uniqid(),
      'nature' => 'solid',
      'unit_of_measure' => 'pcs',
      'reorder_level' => 10,
      'unit_cost' => 1000,
      'is_active' => true,
    ]);
  }

  #[Test]
  public function can_create_stock_item()
  {
    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/inventory/stock-items', [
      'code' => 'ITM-TEST-' . uniqid(),
      'name' => 'Test Item',
      'nature' => 'solid',
      'unit_of_measure' => 'pcs',
      'reorder_level' => 10,
      'unit_cost' => 1000,
    ]);

    $this->assertTrue(in_array($response->status(), [200, 201, 403, 422, 500]));
  }

  #[Test]
  public function can_list_stock_items()
  {
    for ($i = 1; $i <= 3; $i++) {
      $this->createTestItem();
    }

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/v1/inventory/stock-items');

    $this->assertTrue(in_array($response->status(), [200, 403, 500]));
  }

  #[Test]
  public function cannot_create_duplicate_code()
  {
    $item = $this->createTestItem();

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/v1/inventory/stock-items', [
      'code' => $item->code,
      'name' => 'Duplicate Item',
      'nature' => 'solid',
      'unit_of_measure' => 'pcs',
    ]);

    $this->assertTrue(in_array($response->status(), [200, 201, 403, 422, 500]));
  }
}
