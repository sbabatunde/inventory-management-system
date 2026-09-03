<?php
// database/seeders/PermissionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
  public function run(): void
  {
    // Reset cached roles and permissions
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    // Create roles
    $roles = [
      'super-admin' => 'Super Administrator',
      'admin' => 'Administrator',
      'manager' => 'Manager',
      'storekeeper' => 'Storekeeper',
      'engineer' => 'Engineer',
      'staff' => 'Staff',
      'user' => 'Regular User',
    ];

    foreach ($roles as $key => $name) {
      Role::firstOrCreate(['name' => $key], ['display_name' => $name]);
    }

    // Define permissions by module
    $permissions = [
      // Auth permissions
      'auth' => [
        'view-auth-methods',
        'manage-auth-methods',
      ],

      // User management
      'users' => [
        'view-users',
        'create-users',
        'edit-users',
        'delete-users',
        'assign-roles',
        'assign-permissions',
      ],

      // Roles and permissions
      'roles' => [
        'view-roles',
        'create-roles',
        'edit-roles',
        'delete-roles',
        'view-permissions',
        'manage-permissions',
      ],

      // Dashboard
      'dashboard' => [
        'view-dashboard',
        'view-reports',
        'export-reports',
        'view-audit-logs',
        'manage-settings',
      ],

      // Inventory - Stores
      'stores' => [
        'view-stores',
        'create-stores',
        'edit-stores',
        'delete-stores',
      ],

      // Inventory - Stock Items
      'stock-items' => [
        'view-stock-items',
        'create-stock-items',
        'edit-stock-items',
        'delete-stock-items',
      ],

      // Inventory - Stock
      'stock' => [
        'view-stock',
        'adjust-stock',
        'transfer-stock',
        'view-stock-levels',
      ],

      // Inventory - Transfers
      'stock-transfers' => [
        'view-stock-transfers',
        'create-stock-transfers',
        'approve-stock-transfers',
        'receive-stock-transfers',
        'cancel-stock-transfers',
      ],

      // Inventory - Adjustments
      'stock-adjustments' => [
        'view-stock-adjustments',
        'create-stock-adjustments',
        'approve-stock-adjustments',
      ],

      // Release Forms
      'release-forms' => [
        'view-release-forms',
        'create-release-forms',
        'edit-release-forms',
        'delete-release-forms',
        'approve-release-forms',
        'dispatch-release-forms',
        'sign-release-forms',
        'reconcile-release-forms',
      ],

      // Assets
      'assets' => [
        'view-assets',
        'create-assets',
        'edit-assets',
        'delete-assets',
        'assign-assets',
        'track-assets',
        'audit-assets',
      ],

      // Procurement - Suppliers
      'suppliers' => [
        'view-suppliers',
        'create-suppliers',
        'edit-suppliers',
        'delete-suppliers',
      ],

      // Procurement - Requisitions
      'purchase-requisitions' => [
        'view-purchase-requisitions',
        'create-purchase-requisitions',
        'edit-purchase-requisitions',
        'approve-purchase-requisitions',
      ],

      // Procurement - Purchase Orders
      'purchase-orders' => [
        'view-purchase-orders',
        'create-purchase-orders',
        'edit-purchase-orders',
        'delete-purchase-orders',
        'receive-goods',
      ],

      // Integration
      'integration' => [
        'view-crm-data',
        'sync-crm-users',
        'update-crm-status',
      ],
    ];

    // Create permissions
    foreach ($permissions as $module => $modulePermissions) {
      foreach ($modulePermissions as $permission) {
        Permission::firstOrCreate(
          ['name' => $permission],
          [
            'module' => $module,
            'display_name' => ucwords(str_replace('-', ' ', $permission)),
          ]
        );
      }
    }

    // Assign permissions to roles
    $this->assignPermissions();
  }

  protected function assignPermissions(): void
  {
    // Super Admin gets all permissions
    $superAdmin = Role::findByName('super-admin');
    $superAdmin->givePermissionTo(Permission::all());

    // Admin gets most permissions except super-admin specific
    $admin = Role::findByName('admin');
    $admin->givePermissionTo(Permission::whereNotIn('module', ['auth'])->get());
    $admin->givePermissionTo('view-auth-methods');

    // Manager permissions
    $manager = Role::findByName('manager');
    $managerPermissions = [
      'view-dashboard',
      'view-reports',
      'export-reports',
      'view-audit-logs',
      'view-users',
      'view-stores',
      'create-stores',
      'edit-stores',
      'view-stock-items',
      'create-stock-items',
      'edit-stock-items',
      'view-stock',
      'adjust-stock',
      'view-stock-levels',
      'view-stock-transfers',
      'create-stock-transfers',
      'approve-stock-transfers',
      'receive-stock-transfers',
      'view-stock-adjustments',
      'create-stock-adjustments',
      'approve-stock-adjustments',
      'view-release-forms',
      'create-release-forms',
      'edit-release-forms',
      'approve-release-forms',
      'dispatch-release-forms',
      'view-assets',
      'create-assets',
      'edit-assets',
      'assign-assets',
      'track-assets',
      'view-suppliers',
      'create-suppliers',
      'edit-suppliers',
      'view-purchase-requisitions',
      'create-purchase-requisitions',
      'edit-purchase-requisitions',
      'approve-purchase-requisitions',
      'view-purchase-orders',
      'create-purchase-orders',
      'edit-purchase-orders',
      'receive-goods',
      'view-crm-data',
      'update-crm-status',
    ];
    $manager->givePermissionTo($managerPermissions);

    // Storekeeper permissions
    $storekeeper = Role::findByName('storekeeper');
    $storekeeperPermissions = [
      'view-dashboard',
      'view-stores',
      'view-stock-items',
      'view-stock',
      'adjust-stock',
      'view-stock-levels',
      'view-stock-transfers',
      'create-stock-transfers',
      'receive-stock-transfers',
      'view-stock-adjustments',
      'create-stock-adjustments',
      'view-release-forms',
      'dispatch-release-forms',
      'sign-release-forms',
      'view-assets',
      'view-suppliers',
      'view-purchase-orders',
      'receive-goods',
    ];
    $storekeeper->givePermissionTo($storekeeperPermissions);

    // Engineer permissions
    $engineer = Role::findByName('engineer');
    $engineerPermissions = [
      'view-dashboard',
      'view-stock-items',
      'view-stock',
      'view-release-forms',
      'create-release-forms',
      'sign-release-forms',
      'view-assets',
      'track-assets',
    ];
    $engineer->givePermissionTo($engineerPermissions);

    // Staff permissions
    $staff = Role::findByName('staff');
    $staffPermissions = [
      'view-dashboard',
      'view-stock-items',
      'view-stock',
      'view-release-forms',
      'create-release-forms',
      'view-assets',
    ];
    $staff->givePermissionTo($staffPermissions);

    // Regular user permissions
    $user = Role::findByName('user');
    $userPermissions = [
      'view-dashboard',
      'view-stock-items',
      'view-release-forms',
    ];
    $user->givePermissionTo($userPermissions);
  }
}
