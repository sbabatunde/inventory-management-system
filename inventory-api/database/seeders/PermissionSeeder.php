<?php

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

      // Assets module
      'assets' => [
        'view-assets',
        'create-assets',
        'edit-assets',
        'delete-assets',
        'assign-assets',
        'track-assets',
        'audit-assets',
      ],

      // Inventory module
      'inventory' => [
        'view-inventory',
        'create-inventory',
        'edit-inventory',
        'delete-inventory',
        'adjust-stock',
        'transfer-stock',
        'view-stock-levels',
      ],

      // Core module
      'core' => [
        'view-dashboard',
        'view-reports',
        'export-reports',
        'view-audit-logs',
        'manage-settings',
      ],
    ];

    // Create permissions
    foreach ($permissions as $module => $modulePermissions) {
      foreach ($modulePermissions as $permission) {
        Permission::firstOrCreate(
          ['name' => $permission],
          ['module' => $module, 'display_name' => ucwords(str_replace('-', ' ', $permission))]
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
    $admin->givePermissionTo(Permission::where('module', '!=', 'auth')->get());
    $admin->givePermissionTo('view-auth-methods');

    // Manager gets module management permissions
    $manager = Role::findByName('manager');
    $managerPermissions = [
      'view-users',
      'view-assets',
      'create-assets',
      'edit-assets',
      'view-inventory',
      'create-inventory',
      'edit-inventory',
      'adjust-stock',
      'view-stock-levels',
      'view-dashboard',
      'view-reports',
      'view-audit-logs',
    ];
    $manager->givePermissionTo($managerPermissions);

    // Staff gets basic permissions
    $staff = Role::findByName('staff');
    $staffPermissions = [
      'view-assets',
      'view-inventory',
      'view-dashboard',
    ];
    $staff->givePermissionTo($staffPermissions);

    // Regular user gets minimal permissions
    $user = Role::findByName('user');
    $user->givePermissionTo('view-dashboard');
  }
}
