<?php
// Modules/Inventory/database/factories/StoreFactory.php

namespace Modules\Inventory\database\factories;

use Modules\Inventory\app\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreFactory extends Factory
{
  protected $model = Store::class;

  public function definition(): array
  {
    return [
      'name' => fake()->company() . ' Store',
      'code' => 'STR-' . fake()->unique()->numberBetween(1000, 9999),
      'type' => fake()->randomElement(['HQ', 'Branch', 'POP']),
      'address' => fake()->address(),
      'city' => fake()->city(),
      'state' => fake()->state(),
      'contact_person' => fake()->name(),
      'contact_phone' => fake()->phoneNumber(),
      'contact_email' => fake()->email(),
      'is_active' => true,
    ];
  }
}
