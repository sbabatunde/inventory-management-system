<?php
// database/seeders/TestDataSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Modules\Inventory\App\Models\Store;
use Modules\Inventory\App\Models\StockItem;
use Modules\Inventory\App\Models\StockBalance;
use Modules\Assets\App\Models\Assets;
use Modules\Procurement\App\Models\Supplier;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
  public function run(): void
  {
    $this->createUsers();
    $this->createStores();
    $this->createStockItems();
    $this->createStockBalances();
    $this->createAssets();
    $this->createSuppliers();
  }

  protected function createUsers(): void
  {
    $users = [
      [
        'name' => 'Admin User',
        'email' => 'admin@inventory.com',
        'role' => 'super-admin',
      ],
      [
        'name' => 'Manager User',
        'email' => 'manager@inventory.com',
        'role' => 'manager',
      ],
      [
        'name' => 'Storekeeper User',
        'email' => 'storekeeper@inventory.com',
        'role' => 'storekeeper',
      ],
      [
        'name' => 'Engineer User',
        'email' => 'engineer@inventory.com',
        'role' => 'engineer',
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

  protected function createStores(): void
  {
    $stores = [
      [
        'name' => 'Lagos HQ',
        'code' => 'HQ-0001',
        'type' => 'HQ',
        'city' => 'Lagos',
        'state' => 'Lagos State',
        'contact_person' => 'John Doe',
        'contact_phone' => '+2348012345678',
        'contact_email' => 'hq@inventory.com',
      ],
      [
        'name' => 'Abuja Branch',
        'code' => 'BR-0001',
        'type' => 'Branch',
        'city' => 'Abuja',
        'state' => 'FCT',
        'contact_person' => 'Jane Smith',
        'contact_phone' => '+2348098765432',
        'contact_email' => 'abuja@inventory.com',
      ],
      [
        'name' => 'Ikeja POP',
        'code' => 'POP-0001',
        'type' => 'POP',
        'city' => 'Lagos',
        'state' => 'Lagos State',
        'contact_person' => 'Mike Johnson',
        'contact_phone' => '+2348076543210',
        'contact_email' => 'ikeja@inventory.com',
      ],
    ];

    foreach ($stores as $store) {
      Store::firstOrCreate(['code' => $store['code']], $store);
    }
  }

  protected function createStockItems(): void
  {
    $items = [
      [
        'code' => 'ITM-00001',
        'name' => 'Fiber Cable 24C',
        'nature' => 'solid',
        'is_serialized' => false,
        'unit_of_measure' => 'roll',
        'reorder_level' => 20,
        'unit_cost' => 45000,
      ],
      [
        'code' => 'ITM-00002',
        'name' => 'Cisco Router 2900',
        'nature' => 'asset',
        'is_serialized' => true,
        'unit_of_measure' => 'pcs',
        'reorder_level' => 5,
        'unit_cost' => 120000,
      ],
      [
        'code' => 'ITM-00003',
        'name' => 'Network Switch 24 Port',
        'nature' => 'asset',
        'is_serialized' => true,
        'unit_of_measure' => 'pcs',
        'reorder_level' => 10,
        'unit_cost' => 85000,
      ],
      [
        'code' => 'ITM-00004',
        'name' => 'RJ45 Connectors',
        'nature' => 'solid',
        'is_serialized' => false,
        'unit_of_measure' => 'box',
        'reorder_level' => 50,
        'unit_cost' => 2500,
      ],
      [
        'code' => 'ITM-00005',
        'name' => 'Cable Ties',
        'nature' => 'solid',
        'is_serialized' => false,
        'unit_of_measure' => 'pack',
        'reorder_level' => 100,
        'unit_cost' => 500,
      ],
    ];

    foreach ($items as $item) {
      StockItem::firstOrCreate(['code' => $item['code']], $item);
    }
  }

  protected function createStockBalances(): void
  {
    $stores = Store::all();
    $items = StockItem::all();

    foreach ($stores as $store) {
      foreach ($items as $item) {
        $quantity = rand(50, 500);
        StockBalance::firstOrCreate(
          [
            'store_id' => $store->id,
            'stock_item_id' => $item->id,
          ],
          [
            'quantity_on_hand' => $quantity,
            'quantity_reserved' => 0,
            'quantity_available' => $quantity,
            'last_counted_at' => now(),
          ]
        );
      }
    }
  }

  protected function createAssets(): void
  {
    $stores = Store::all();
    $items = StockItem::where('is_serialized', true)->get();

    foreach ($items as $item) {
      for ($i = 1; $i <= 5; $i++) {
        Assets::firstOrCreate(
          ['serial_no' => 'SN' . $item->id . str_pad($i, 6, '0', STR_PAD_LEFT)],
          [
            'asset_code' => 'AST-' . $item->id . str_pad($i, 6, '0', STR_PAD_LEFT),
            'name' => $item->name . ' #' . $i,
            'type' => 'other',
            'stock_item_id' => $item->id,
            'status' => 'in_stock',
            'current_store_id' => $stores->first()->id,
            'purchase_cost' => $item->unit_cost,
            'purchase_date' => now()->subMonths(rand(1, 24)),
            'current_value' => $item->unit_cost * 0.8,
            'salvage_value' => $item->unit_cost * 0.1,
            'useful_life_months' => 36,
            'depreciation_method' => 'straight_line',
            'is_active' => true,
          ]
        );
      }
    }
  }

  protected function createSuppliers(): void
  {
    $suppliers = [
      [
        'name' => 'ABC Supplies Ltd',
        'code' => 'SUP-0001',
        'email' => 'info@abcsupplies.com',
        'phone' => '+2348011111111',
        'city' => 'Lagos',
        'contact_person' => 'Mr. Ade',
      ],
      [
        'name' => 'XYZ Networks',
        'code' => 'SUP-0002',
        'email' => 'sales@xyznetworks.com',
        'phone' => '+2348022222222',
        'city' => 'Abuja',
        'contact_person' => 'Mrs. Bola',
      ],
      [
        'name' => 'Tech Distributors',
        'code' => 'SUP-0003',
        'email' => 'orders@techdist.com',
        'phone' => '+2348033333333',
        'city' => 'Port Harcourt',
        'contact_person' => 'Engr. Chidi',
      ],
    ];

    foreach ($suppliers as $supplier) {
      Supplier::firstOrCreate(['code' => $supplier['code']], $supplier);
    }
  }
}
