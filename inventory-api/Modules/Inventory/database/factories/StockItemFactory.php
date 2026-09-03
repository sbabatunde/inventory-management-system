<?php
// Modules/Inventory/database/factories/StockItemFactory.php

namespace Modules\Inventory\database\factories;

use Modules\Inventory\app\Models\StockItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockItemFactory extends Factory
{
  protected $model = StockItem::class;

  public function definition(): array
  {
    return [
      'code' => 'ITM-' . fake()->unique()->numberBetween(10000, 99999),
      'name' => fake()->words(3, true),
      'description' => fake()->sentence(),
      'nature' => fake()->randomElement(['asset', 'solid', 'liquid']),
      'is_serialized' => fake()->boolean(30),
      'unit_of_measure' => fake()->randomElement(['pcs', 'm', 'kg', 'l', 'roll', 'box']),
      'reorder_level' => fake()->numberBetween(5, 50),
      'unit_cost' => fake()->randomFloat(2, 100, 10000),
      'is_active' => true,
    ];
  }
}
