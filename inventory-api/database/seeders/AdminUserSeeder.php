<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
  public function run(): void
  {
    $admin = User::firstOrCreate(
      ['email' => 'admin@inventory.com'],
      [
        'name' => 'System Administrator',
        'password' => Hash::make('password'),
        'is_active' => true,
        'email_verified_at' => now(),
      ]
    );

    // Assign super-admin role
    $admin->assignRole('super-admin');

    // Create sample users for testing
    $users = [
      [
        'name' => 'Manager User',
        'email' => 'manager@inventory.com',
        'role' => 'manager',
      ],
      [
        'name' => 'Staff User',
        'email' => 'staff@inventory.com',
        'role' => 'staff',
      ],
      [
        'name' => 'Regular User',
        'email' => 'user@inventory.com',
        'role' => 'user',
      ],
    ];

    foreach ($users as $userData) {
      $user = User::firstOrCreate(
        ['email' => $userData['email']],
        [
          'name' => $userData['name'],
          'password' => Hash::make('password'),
          'is_active' => true,
          'email_verified_at' => now(),
        ]
      );

      $user->assignRole($userData['role']);
    }
  }
}
