<?php
// Modules/Procurement/database/factories/SupplierFactory.php

namespace Modules\Procurement\database\factories;

use Modules\Procurement\App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
  protected $model = Supplier::class;

  public function definition(): array
  {
    return [
      'name' => fake()->company(),
      'code' => 'SUP-' . fake()->unique()->numberBetween(1000, 9999),
      'email' => fake()->companyEmail(),
      'phone' => fake()->phoneNumber(),
      'address' => fake()->address(),
      'city' => fake()->city(),
      'state' => fake()->state(),
      'country' => 'Nigeria',
      'contact_person' => fake()->name(),
      'contact_phone' => fake()->phoneNumber(),
      'contact_email' => fake()->email(),
      'is_active' => true,
    ];
  }
}
