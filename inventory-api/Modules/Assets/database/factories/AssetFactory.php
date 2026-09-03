<?php
// Modules/Assets/database/factories/AssetFactory.php

namespace Modules\Assets\database\factories;

use Modules\Assets\app\Models\Assets;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssetFactory extends Factory
{
  protected $model = Assets::class;

  public function definition(): array
  {
    return [
      'asset_code' => 'AST-' . fake()->unique()->numberBetween(10000, 99999),
      'name' => fake()->words(2, true),
      'type' => fake()->randomElement(['pop', 'client', 'fibre', 'radio', 'other']),
      'serial_no' => 'SN' . fake()->unique()->numberBetween(100000, 999999),
      'status' => 'in_stock',
      'purchase_cost' => fake()->randomFloat(2, 1000, 100000),
      'current_value' => fake()->randomFloat(2, 100, 100000),
      'salvage_value' => fake()->randomFloat(2, 0, 1000),
      'useful_life_months' => 36,
      'depreciation_method' => 'straight_line',
      'is_active' => true,
    ];
  }
}
