<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Permissions ───────────────────────────────
        $permissions = [
            // Product
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',

            // Category
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',

            // Order
            'view-orders',
            'manage-orders',

            // Supplier
            'view-suppliers',
            'create-suppliers',
            'edit-suppliers',
            'delete-suppliers',
            'approve-suppliers',

            // Vehicle
            'view-vehicles',
            'create-vehicles',
            'edit-vehicles',
            'delete-vehicles',

            // User
            'view-users',
            'manage-users',

            // Margin Rules
            'view-margin-rules',
            'manage-margin-rules',

            // Supplier-own (for supplier portal)
            'view-own-products',
            'manage-own-products',
            'view-own-orders',
            'view-own-sync-logs',
            'manage-own-feed',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ─── Roles ─────────────────────────────────────

        // Admin: full access
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions(Permission::all());

        // Staff: view + manage most things, no user management
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $staff->syncPermissions([
            'view-products', 'create-products', 'edit-products',
            'view-categories', 'create-categories', 'edit-categories',
            'view-orders', 'manage-orders',
            'view-suppliers', 'view-vehicles',
            'view-margin-rules',
        ]);

        // Customer: no admin permissions
        $customer = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // Supplier: own portal access
        $supplier = Role::firstOrCreate(['name' => 'supplier', 'guard_name' => 'web']);
        $supplier->syncPermissions([
            'view-own-products',
            'manage-own-products',
            'view-own-orders',
            'view-own-sync-logs',
            'manage-own-feed',
        ]);
    }
}
