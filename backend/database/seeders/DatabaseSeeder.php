<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Category\Models\Category;
use App\Modules\Product\Models\Product;
use App\Modules\Product\Models\ProductSupplier;
use App\Modules\Supplier\Models\MarginRule;
use App\Modules\Supplier\Models\Supplier;
use App\Modules\Supplier\Models\SyncLog;
use App\Modules\Vehicle\Models\Vehicle;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed roles & permissions first (Spatie)
        $this->call(RolesAndPermissionsSeeder::class);

        $this->seedUsers();
        $categories = $this->seedCategories();
        $suppliers = $this->seedSuppliers();
        $vehicles = $this->seedVehicles();
        $products = $this->seedProducts($categories, $suppliers, $vehicles);
        $this->seedMarginRules($suppliers, $categories);
        $this->seedOrders($products);
        $this->seedSupplierUsers($suppliers);

        $this->command->info('Database seeded successfully!');
    }

    private function seedUsers(): void
    {
        // Admin user
        $admin = User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@carparts.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'phone'    => '+351 912 345 678',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        // Staff user
        $staff = User::create([
            'name'     => 'Staff Member',
            'email'    => 'staff@carparts.com',
            'password' => Hash::make('password'),
            'role'     => 'staff',
            'phone'    => '+351 913 456 789',
            'is_active' => true,
        ]);
        $staff->assignRole('staff');

        // Customer users
        $customers = [
            ['name' => 'Joao Silva',      'email' => 'joao@example.com',   'phone' => '+351 914 111 222'],
            ['name' => 'Maria Santos',    'email' => 'maria@example.com',  'phone' => '+351 915 222 333'],
            ['name' => 'Pedro Costa',     'email' => 'pedro@example.com',  'phone' => '+351 916 333 444'],
            ['name' => 'Ana Ferreira',    'email' => 'ana@example.com',    'phone' => '+351 917 444 555'],
            ['name' => 'Carlos Oliveira', 'email' => 'carlos@example.com', 'phone' => '+351 918 555 666'],
        ];

        foreach ($customers as $c) {
            $user = User::create([
                'name'     => $c['name'],
                'email'    => $c['email'],
                'password' => Hash::make('password'),
                'role'     => 'customer',
                'phone'    => $c['phone'],
                'is_active' => true,
            ]);
            $user->assignRole('customer');
        }

        $this->command->info('  Users seeded (7 users, login: admin@carparts.com / password)');
    }

    private function seedCategories(): array
    {
        // Root categories
        $engine = Category::create(['name' => 'Engine Parts', 'slug' => 'engine-parts', 'description' => 'Engine components and accessories', 'sort_order' => 1]);
        $brakes = Category::create(['name' => 'Brakes', 'slug' => 'brakes', 'description' => 'Brake system components', 'sort_order' => 2]);
        $suspension = Category::create(['name' => 'Suspension & Steering', 'slug' => 'suspension-steering', 'description' => 'Suspension and steering components', 'sort_order' => 3]);
        $filters = Category::create(['name' => 'Filters', 'slug' => 'filters', 'description' => 'Oil, air, fuel and cabin filters', 'sort_order' => 4]);
        $electrical = Category::create(['name' => 'Electrical', 'slug' => 'electrical', 'description' => 'Electrical components and lighting', 'sort_order' => 5]);
        $body = Category::create(['name' => 'Body Parts', 'slug' => 'body-parts', 'description' => 'Exterior and interior body components', 'sort_order' => 6]);
        $exhaust = Category::create(['name' => 'Exhaust System', 'slug' => 'exhaust-system', 'description' => 'Exhaust pipes, catalysts and mufflers', 'sort_order' => 7]);
        $cooling = Category::create(['name' => 'Cooling System', 'slug' => 'cooling-system', 'description' => 'Radiators, water pumps and thermostats', 'sort_order' => 8]);

        // Subcategories
        $brakePads = Category::create(['name' => 'Brake Pads', 'slug' => 'brake-pads', 'parent_id' => $brakes->id, 'sort_order' => 1]);
        $brakeDiscs = Category::create(['name' => 'Brake Discs', 'slug' => 'brake-discs', 'parent_id' => $brakes->id, 'sort_order' => 2]);
        $brakeCalipers = Category::create(['name' => 'Brake Calipers', 'slug' => 'brake-calipers', 'parent_id' => $brakes->id, 'sort_order' => 3]);

        $oilFilters = Category::create(['name' => 'Oil Filters', 'slug' => 'oil-filters', 'parent_id' => $filters->id, 'sort_order' => 1]);
        $airFilters = Category::create(['name' => 'Air Filters', 'slug' => 'air-filters', 'parent_id' => $filters->id, 'sort_order' => 2]);
        $fuelFilters = Category::create(['name' => 'Fuel Filters', 'slug' => 'fuel-filters', 'parent_id' => $filters->id, 'sort_order' => 3]);
        $cabinFilters = Category::create(['name' => 'Cabin Filters', 'slug' => 'cabin-filters', 'parent_id' => $filters->id, 'sort_order' => 4]);

        $sparkPlugs = Category::create(['name' => 'Spark Plugs', 'slug' => 'spark-plugs', 'parent_id' => $engine->id, 'sort_order' => 1]);
        $timingBelts = Category::create(['name' => 'Timing Belts & Kits', 'slug' => 'timing-belts', 'parent_id' => $engine->id, 'sort_order' => 2]);
        $engineMounts = Category::create(['name' => 'Engine Mounts', 'slug' => 'engine-mounts', 'parent_id' => $engine->id, 'sort_order' => 3]);

        $shockAbsorbers = Category::create(['name' => 'Shock Absorbers', 'slug' => 'shock-absorbers', 'parent_id' => $suspension->id, 'sort_order' => 1]);
        $controlArms = Category::create(['name' => 'Control Arms', 'slug' => 'control-arms', 'parent_id' => $suspension->id, 'sort_order' => 2]);

        $headlights = Category::create(['name' => 'Headlights', 'slug' => 'headlights', 'parent_id' => $electrical->id, 'sort_order' => 1]);
        $batteries = Category::create(['name' => 'Batteries', 'slug' => 'batteries', 'parent_id' => $electrical->id, 'sort_order' => 2]);
        $alternators = Category::create(['name' => 'Alternators', 'slug' => 'alternators', 'parent_id' => $electrical->id, 'sort_order' => 3]);

        $this->command->info('  Categories seeded (24 categories)');

        return compact(
            'engine', 'brakes', 'suspension', 'filters', 'electrical', 'body', 'exhaust', 'cooling',
            'brakePads', 'brakeDiscs', 'brakeCalipers',
            'oilFilters', 'airFilters', 'fuelFilters', 'cabinFilters',
            'sparkPlugs', 'timingBelts', 'engineMounts',
            'shockAbsorbers', 'controlArms',
            'headlights', 'batteries', 'alternators'
        );
    }

    private function seedSuppliers(): array
    {
        $supplierA = Supplier::create([
            'name' => 'DeepCar Parts',
            'code' => 'DEEPCAR',
            'contact_person' => 'Hans Mueller',
            'email' => 'supplier1@deepcar.eu',
            'phone' => '+49 30 123 456',
            'website' => 'https://deepcar-parts.eu',
            'business_license' => 'DE-BL-2024-1234',
            'tax_id' => 'DE123456789',
            'address' => 'Berliner Str. 42, 10115 Berlin, Germany',
            'description' => 'Leading European automotive parts distributor with over 500,000 SKUs.',
            'type' => 'api',
            'api_url' => 'https://api.deepcar-parts.eu/v1',
            'sync_interval_minutes' => 60,
            'default_margin_type' => 'percentage',
            'default_margin_value' => 25,
            'is_active' => true,
            'approval_status' => 'approved',
            'approved_at' => now()->subMonths(3),
        ]);

        $supplierB = Supplier::create([
            'name' => 'NL Parts Europe',
            'code' => 'NLPARTS',
            'contact_person' => 'Jan de Vries',
            'email' => 'supplier2@nlparts.eu',
            'phone' => '+31 20 789 012',
            'website' => 'https://nlparts.eu',
            'business_license' => 'NL-BL-2023-5678',
            'tax_id' => 'NL987654321',
            'address' => 'Keizersgracht 100, 1015 Amsterdam, Netherlands',
            'description' => 'Dutch OEM and aftermarket parts supplier specializing in German and French vehicles.',
            'type' => 'xml',
            'feed_url' => 'https://feeds.nlparts.eu/products.xml',
            'sync_interval_minutes' => 120,
            'default_margin_type' => 'percentage',
            'default_margin_value' => 30,
            'is_active' => true,
            'approval_status' => 'approved',
            'approved_at' => now()->subMonths(2),
        ]);

        $supplierC = Supplier::create([
            'name' => 'Auto Pecas Global',
            'code' => 'APGLOBAL',
            'contact_person' => 'Ricardo Santos',
            'email' => 'supplier3@autopecas.pt',
            'phone' => '+351 21 456 789',
            'website' => 'https://autopecas.global',
            'business_license' => 'PT-BL-2024-9012',
            'tax_id' => 'PT501234567',
            'address' => 'Av. da Liberdade 200, 1250-147 Lisboa, Portugal',
            'description' => 'Portuguese auto parts wholesaler with direct factory relationships.',
            'type' => 'csv',
            'feed_url' => 'https://autopecas.global/export/products.csv',
            'sync_interval_minutes' => 360,
            'default_margin_type' => 'percentage',
            'default_margin_value' => 20,
            'is_active' => true,
            'approval_status' => 'approved',
            'approved_at' => now()->subMonths(1),
        ]);

        // Create sync logs for suppliers
        foreach ([$supplierA, $supplierB, $supplierC] as $supplier) {
            SyncLog::create([
                'supplier_id' => $supplier->id,
                'type' => 'full',
                'status' => 'completed',
                'records_processed' => rand(50, 500),
                'error_message' => null,
                'started_at' => now()->subHours(2),
                'completed_at' => now()->subHours(2)->addMinutes(3),
            ]);
        }

        $this->command->info('  Suppliers seeded (3 suppliers with sync logs)');
        return compact('supplierA', 'supplierB', 'supplierC');
    }

    private function seedVehicles(): array
    {
        $vehicleData = [
            ['make' => 'Fiat',       'model' => 'Ducato',    'year_from' => 2006, 'year_to' => 2014, 'engine' => '2.3 JTD', 'fuel_type' => 'diesel'],
            ['make' => 'Fiat',       'model' => 'Ducato',    'year_from' => 2014, 'year_to' => 2024, 'engine' => '2.3 MultiJet', 'fuel_type' => 'diesel'],
            ['make' => 'Fiat',       'model' => 'Punto',     'year_from' => 2005, 'year_to' => 2018, 'engine' => '1.3 JTD', 'fuel_type' => 'diesel'],
            ['make' => 'Fiat',       'model' => '500',       'year_from' => 2007, 'year_to' => 2024, 'engine' => '1.2 Fire', 'fuel_type' => 'petrol'],
            ['make' => 'Volkswagen', 'model' => 'Golf',      'year_from' => 2012, 'year_to' => 2020, 'engine' => '1.6 TDI', 'fuel_type' => 'diesel'],
            ['make' => 'Volkswagen', 'model' => 'Golf',      'year_from' => 2020, 'year_to' => 2024, 'engine' => '2.0 TDI', 'fuel_type' => 'diesel'],
            ['make' => 'Volkswagen', 'model' => 'Polo',      'year_from' => 2009, 'year_to' => 2017, 'engine' => '1.4 TDI', 'fuel_type' => 'diesel'],
            ['make' => 'Volkswagen', 'model' => 'Transporter','year_from' => 2015, 'year_to' => 2024, 'engine' => '2.0 TDI', 'fuel_type' => 'diesel'],
            ['make' => 'Renault',    'model' => 'Clio',      'year_from' => 2012, 'year_to' => 2019, 'engine' => '1.5 dCi', 'fuel_type' => 'diesel'],
            ['make' => 'Renault',    'model' => 'Megane',    'year_from' => 2016, 'year_to' => 2024, 'engine' => '1.5 Blue dCi', 'fuel_type' => 'diesel'],
            ['make' => 'Peugeot',    'model' => '208',       'year_from' => 2012, 'year_to' => 2019, 'engine' => '1.6 BlueHDi', 'fuel_type' => 'diesel'],
            ['make' => 'Peugeot',    'model' => '308',       'year_from' => 2013, 'year_to' => 2021, 'engine' => '1.6 BlueHDi', 'fuel_type' => 'diesel'],
            ['make' => 'BMW',        'model' => '320d',      'year_from' => 2012, 'year_to' => 2019, 'engine' => '2.0 N47D20', 'fuel_type' => 'diesel'],
            ['make' => 'Mercedes',   'model' => 'C220',      'year_from' => 2014, 'year_to' => 2021, 'engine' => '2.1 CDI', 'fuel_type' => 'diesel'],
            ['make' => 'Toyota',     'model' => 'Yaris',     'year_from' => 2011, 'year_to' => 2020, 'engine' => '1.4 D-4D', 'fuel_type' => 'diesel'],
        ];

        $vehicles = [];
        foreach ($vehicleData as $v) {
            $slug = Str::slug("{$v['make']}-{$v['model']}-{$v['year_from']}-{$v['year_to']}");
            $vehicles[] = Vehicle::create(array_merge($v, ['slug' => $slug, 'is_active' => true]));
        }

        $this->command->info('  Vehicles seeded (15 vehicles)');
        return $vehicles;
    }

    private function seedProducts(array $categories, array $suppliers, array $vehicles): array
    {
        $products = [];
        $productData = [
            // Brake Pads
            ['name' => 'Front Brake Pads - Bosch', 'sku' => 'BP-BOSCH-001', 'cat' => 'brakePads', 'cost' => 18.50, 'sell' => 24.99, 'stock' => 45, 'brand' => 'Bosch', 'oem' => '0986494111'],
            ['name' => 'Front Brake Pads - TRW', 'sku' => 'BP-TRW-002', 'cat' => 'brakePads', 'cost' => 22.00, 'sell' => 29.99, 'stock' => 32, 'brand' => 'TRW', 'oem' => 'GDB1550'],
            ['name' => 'Rear Brake Pads - Brembo', 'sku' => 'BP-BREMBO-003', 'cat' => 'brakePads', 'cost' => 25.00, 'sell' => 34.99, 'stock' => 28, 'brand' => 'Brembo', 'oem' => 'P23082'],
            ['name' => 'Front Brake Pads - Ferodo', 'sku' => 'BP-FERODO-004', 'cat' => 'brakePads', 'cost' => 20.00, 'sell' => 27.50, 'stock' => 0, 'brand' => 'Ferodo', 'oem' => 'FDB1641'],
            // Brake Discs
            ['name' => 'Front Brake Disc - Brembo 280mm', 'sku' => 'BD-BREMBO-001', 'cat' => 'brakeDiscs', 'cost' => 35.00, 'sell' => 48.99, 'stock' => 20, 'brand' => 'Brembo', 'oem' => '09.8894.10'],
            ['name' => 'Rear Brake Disc - TRW 260mm', 'sku' => 'BD-TRW-002', 'cat' => 'brakeDiscs', 'cost' => 28.00, 'sell' => 38.99, 'stock' => 15, 'brand' => 'TRW', 'oem' => 'DF4381'],
            // Oil Filters
            ['name' => 'Oil Filter - Mann HU716/2x', 'sku' => 'OF-MANN-001', 'cat' => 'oilFilters', 'cost' => 5.50, 'sell' => 8.99, 'stock' => 120, 'brand' => 'Mann-Filter', 'oem' => 'HU716/2x'],
            ['name' => 'Oil Filter - Bosch F026407067', 'sku' => 'OF-BOSCH-002', 'cat' => 'oilFilters', 'cost' => 6.00, 'sell' => 9.50, 'stock' => 85, 'brand' => 'Bosch', 'oem' => 'F026407067'],
            // Air Filters
            ['name' => 'Air Filter - Mann C27192/1', 'sku' => 'AF-MANN-001', 'cat' => 'airFilters', 'cost' => 8.00, 'sell' => 12.99, 'stock' => 60, 'brand' => 'Mann-Filter', 'oem' => 'C27192/1'],
            ['name' => 'Air Filter - Bosch F026400035', 'sku' => 'AF-BOSCH-002', 'cat' => 'airFilters', 'cost' => 7.50, 'sell' => 11.99, 'stock' => 55, 'brand' => 'Bosch', 'oem' => 'F026400035'],
            // Fuel Filters
            ['name' => 'Fuel Filter - Bosch F026402007', 'sku' => 'FF-BOSCH-001', 'cat' => 'fuelFilters', 'cost' => 12.00, 'sell' => 18.99, 'stock' => 40, 'brand' => 'Bosch', 'oem' => 'F026402007'],
            // Cabin Filters
            ['name' => 'Cabin Filter - Mann CUK2939', 'sku' => 'CF-MANN-001', 'cat' => 'cabinFilters', 'cost' => 9.00, 'sell' => 14.99, 'stock' => 70, 'brand' => 'Mann-Filter', 'oem' => 'CUK2939'],
            // Spark Plugs
            ['name' => 'Spark Plug - NGK BKR6E', 'sku' => 'SP-NGK-001', 'cat' => 'sparkPlugs', 'cost' => 3.50, 'sell' => 5.99, 'stock' => 200, 'brand' => 'NGK', 'oem' => 'BKR6E'],
            ['name' => 'Spark Plug - Bosch FR7DC+', 'sku' => 'SP-BOSCH-002', 'cat' => 'sparkPlugs', 'cost' => 4.00, 'sell' => 6.50, 'stock' => 150, 'brand' => 'Bosch', 'oem' => 'FR7DC+'],
            // Timing Belts
            ['name' => 'Timing Belt Kit - Gates K015578XS', 'sku' => 'TB-GATES-001', 'cat' => 'timingBelts', 'cost' => 45.00, 'sell' => 65.99, 'stock' => 12, 'brand' => 'Gates', 'oem' => 'K015578XS'],
            ['name' => 'Timing Belt Kit + Water Pump - INA', 'sku' => 'TB-INA-002', 'cat' => 'timingBelts', 'cost' => 85.00, 'sell' => 119.99, 'stock' => 8, 'brand' => 'INA', 'oem' => '530055032'],
            // Shock Absorbers
            ['name' => 'Front Shock Absorber - Monroe', 'sku' => 'SA-MONROE-001', 'cat' => 'shockAbsorbers', 'cost' => 42.00, 'sell' => 59.99, 'stock' => 18, 'brand' => 'Monroe', 'oem' => 'G8802'],
            ['name' => 'Rear Shock Absorber - Sachs', 'sku' => 'SA-SACHS-002', 'cat' => 'shockAbsorbers', 'cost' => 38.00, 'sell' => 52.99, 'stock' => 22, 'brand' => 'Sachs', 'oem' => '315127'],
            // Control Arms
            ['name' => 'Front Control Arm - Lemforder', 'sku' => 'CA-LEMF-001', 'cat' => 'controlArms', 'cost' => 55.00, 'sell' => 79.99, 'stock' => 10, 'brand' => 'Lemforder', 'oem' => '33946'],
            // Batteries
            ['name' => 'Car Battery 60Ah - Varta Blue', 'sku' => 'BAT-VARTA-001', 'cat' => 'batteries', 'cost' => 55.00, 'sell' => 79.99, 'stock' => 25, 'brand' => 'Varta', 'oem' => 'D24'],
            ['name' => 'Car Battery 74Ah - Bosch S4', 'sku' => 'BAT-BOSCH-002', 'cat' => 'batteries', 'cost' => 68.00, 'sell' => 95.00, 'stock' => 18, 'brand' => 'Bosch', 'oem' => 'S4008'],
            // Alternators
            ['name' => 'Alternator 120A - Valeo', 'sku' => 'ALT-VALEO-001', 'cat' => 'alternators', 'cost' => 120.00, 'sell' => 169.99, 'stock' => 5, 'brand' => 'Valeo', 'oem' => '440183'],
            // Headlights
            ['name' => 'Headlight Assembly Left - Hella', 'sku' => 'HL-HELLA-001', 'cat' => 'headlights', 'cost' => 85.00, 'sell' => 119.99, 'stock' => 6, 'brand' => 'Hella', 'oem' => '1EL354647011'],
            ['name' => 'Headlight Assembly Right - Hella', 'sku' => 'HL-HELLA-002', 'cat' => 'headlights', 'cost' => 85.00, 'sell' => 119.99, 'stock' => 6, 'brand' => 'Hella', 'oem' => '1EL354647021'],
            // Engine Mounts
            ['name' => 'Engine Mount Right - Hutchinson', 'sku' => 'EM-HUTCH-001', 'cat' => 'engineMounts', 'cost' => 28.00, 'sell' => 39.99, 'stock' => 14, 'brand' => 'Hutchinson', 'oem' => '594390'],
            // Cooling
            ['name' => 'Radiator - Nissens', 'sku' => 'RAD-NISS-001', 'cat' => 'cooling', 'cost' => 95.00, 'sell' => 139.99, 'stock' => 4, 'brand' => 'Nissens', 'oem' => '61916'],
            ['name' => 'Water Pump - SKF VKPC85314', 'sku' => 'WP-SKF-001', 'cat' => 'cooling', 'cost' => 32.00, 'sell' => 45.99, 'stock' => 20, 'brand' => 'SKF', 'oem' => 'VKPC85314'],
            ['name' => 'Thermostat - Behr TI5087', 'sku' => 'TH-BEHR-001', 'cat' => 'cooling', 'cost' => 15.00, 'sell' => 22.99, 'stock' => 30, 'brand' => 'Behr', 'oem' => 'TI5087'],
            // Exhaust
            ['name' => 'Catalytic Converter - BM Catalysts', 'sku' => 'EX-BMC-001', 'cat' => 'exhaust', 'cost' => 180.00, 'sell' => 259.99, 'stock' => 3, 'brand' => 'BM Catalysts', 'oem' => 'BM91496H'],
            ['name' => 'Exhaust Muffler Rear - Walker', 'sku' => 'EX-WALK-002', 'cat' => 'exhaust', 'cost' => 65.00, 'sell' => 89.99, 'stock' => 7, 'brand' => 'Walker', 'oem' => '23050'],
            // Body Parts
            ['name' => 'Side Mirror Right Electric - TYC', 'sku' => 'BDY-TYC-001', 'cat' => 'body', 'cost' => 42.00, 'sell' => 59.99, 'stock' => 10, 'brand' => 'TYC', 'oem' => '325-0068'],
            ['name' => 'Front Bumper - PRASCO', 'sku' => 'BDY-PRASCO-002', 'cat' => 'body', 'cost' => 75.00, 'sell' => 109.99, 'stock' => 0, 'brand' => 'PRASCO', 'oem' => 'FT3201001'],
        ];

        $supplierList = [$suppliers['supplierA'], $suppliers['supplierB'], $suppliers['supplierC']];

        foreach ($productData as $p) {
            $catKey = $p['cat'];
            $categoryId = is_string($catKey) && isset($categories[$catKey])
                ? $categories[$catKey]->id
                : $categories['brakes']->id;

            $product = Product::create([
                'name'           => $p['name'],
                'sku'            => $p['sku'],
                'slug'           => Str::slug($p['name']),
                'description'    => "High quality {$p['name']} from {$p['brand']}. OEM Reference: {$p['oem']}. Suitable for a wide range of vehicles.",
                'brand'          => $p['brand'],
                'oem_reference'  => $p['oem'],
                'category_id'    => $categoryId,
                'cost_price'     => $p['cost'],
                'sell_price'     => $p['sell'],
                'stock_quantity' => $p['stock'],
                'is_visible'     => $p['stock'] > 0,
                'is_active'      => true,
            ]);

            // Assign 1-2 random suppliers
            $numSuppliers = rand(1, 2);
            $assignedSuppliers = array_rand(array_flip([0, 1, 2]), $numSuppliers);
            if (!is_array($assignedSuppliers)) $assignedSuppliers = [$assignedSuppliers];

            foreach ($assignedSuppliers as $sIdx) {
                ProductSupplier::create([
                    'product_id'    => $product->id,
                    'supplier_id'   => $supplierList[$sIdx]->id,
                    'supplier_sku'  => strtoupper($supplierList[$sIdx]->code) . '-' . $p['sku'],
                    'cost_price'    => $p['cost'] + rand(-200, 200) / 100,
                    'stock_quantity' => rand(0, $p['stock'] + 20),
                    'is_preferred'  => $sIdx === 0,
                    'last_synced_at' => now()->subMinutes(rand(10, 120)),
                ]);
            }

            // Assign 2-5 random vehicles
            $vehicleIds = collect($vehicles)->pluck('id')->shuffle()->take(rand(2, 5))->toArray();
            $product->vehicles()->attach($vehicleIds);

            $products[] = $product;
        }

        $this->command->info('  Products seeded (32 products with supplier & vehicle links)');
        return $products;
    }

    private function seedMarginRules(array $suppliers, array $categories): void
    {
        // Global default margin
        MarginRule::create([
            'name'     => 'Global Default +25%',
            'type'     => 'percentage',
            'value'    => 25,
            'priority' => 0,
        ]);

        // Per-supplier margins
        MarginRule::create([
            'name'        => 'DeepCar Parts +30%',
            'supplier_id' => $suppliers['supplierA']->id,
            'type'        => 'percentage',
            'value'       => 30,
            'priority'    => 10,
        ]);

        MarginRule::create([
            'name'        => 'NL Parts +28%',
            'supplier_id' => $suppliers['supplierB']->id,
            'type'        => 'percentage',
            'value'       => 28,
            'priority'    => 10,
        ]);

        // Per-category margins
        MarginRule::create([
            'name'        => 'Brakes +35%',
            'category_id' => $categories['brakes']->id,
            'type'        => 'percentage',
            'value'       => 35,
            'priority'    => 20,
        ]);

        MarginRule::create([
            'name'        => 'Filters +40%',
            'category_id' => $categories['filters']->id,
            'type'        => 'percentage',
            'value'       => 40,
            'priority'    => 20,
        ]);

        // Price range margin
        MarginRule::create([
            'name'      => 'Small parts under 10€ +45%',
            'type'      => 'percentage',
            'value'     => 45,
            'min_price' => 0,
            'max_price' => 10,
            'priority'  => 5,
        ]);

        MarginRule::create([
            'name'      => 'Expensive parts over 100€ +20%',
            'type'      => 'percentage',
            'value'     => 20,
            'min_price' => 100,
            'max_price' => null,
            'priority'  => 5,
        ]);

        $this->command->info('  Margin rules seeded (7 rules)');
    }

    private function seedOrders(array $products): void
    {
        $customers = User::where('role', 'customer')->get();
        $statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

        foreach ($customers as $idx => $customer) {
            $numOrders = rand(1, 3);
            for ($i = 0; $i < $numOrders; $i++) {
                $status = $statuses[array_rand($statuses)];
                $orderProducts = collect($products)->shuffle()->take(rand(1, 4));

                $subtotal = 0;
                $items = [];
                foreach ($orderProducts as $product) {
                    $qty = rand(1, 3);
                    $lineTotal = $product->sell_price * $qty;
                    $subtotal += $lineTotal;
                    $items[] = [
                        'product_id'   => $product->id,
                        'product_name' => $product->name,
                        'product_sku'  => $product->sku,
                        'quantity'     => $qty,
                        'unit_price'   => $product->sell_price,
                        'total_price'  => $lineTotal,
                    ];
                }

                $tax = round($subtotal * 0.23, 2);
                $shipping = $subtotal > 50 ? 0 : 5.99;
                $total = $subtotal + $tax + $shipping;

                $order = Order::create([
                    'order_number'        => 'ORD-' . now()->subDays(rand(0, 30))->format('Ymd') . '-' . strtoupper(Str::random(6)),
                    'user_id'             => $customer->id,
                    'status'              => $status,
                    'subtotal'            => $subtotal,
                    'tax_amount'          => $tax,
                    'shipping_amount'     => $shipping,
                    'total'               => $total,
                    'shipping_name'       => $customer->name,
                    'shipping_address'    => 'Rua da Liberdade ' . rand(1, 200),
                    'shipping_city'       => ['Lisboa', 'Porto', 'Faro', 'Coimbra', 'Braga'][array_rand(['Lisboa', 'Porto', 'Faro', 'Coimbra', 'Braga'])],
                    'shipping_postal_code' => rand(1000, 9999) . '-' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT),
                    'shipping_country'    => 'PT',
                    'shipping_phone'      => $customer->phone,
                    'payment_method'      => ['card', 'paypal', 'mbway'][array_rand(['card', 'paypal', 'mbway'])],
                    'tracking_number'     => $status === 'shipped' || $status === 'delivered' ? 'CTT' . strtoupper(Str::random(12)) : null,
                    'tracking_company'    => $status === 'shipped' || $status === 'delivered' ? 'CTT Expresso' : null,
                    'shipped_at'          => in_array($status, ['shipped', 'delivered']) ? now()->subDays(rand(1, 5)) : null,
                    'delivered_at'        => $status === 'delivered' ? now()->subDays(rand(0, 2)) : null,
                    'created_at'          => now()->subDays(rand(0, 30)),
                ]);

                foreach ($items as $item) {
                    OrderItem::create(array_merge($item, ['order_id' => $order->id]));
                }
            }
        }

        $this->command->info('  Orders seeded (' . Order::count() . ' orders with items)');
    }

    private function seedSupplierUsers(array $suppliers): void
    {
        // Approved supplier user (linked to DeepCar Parts)
        $supplierUser1 = User::create([
            'name'        => 'Hans Mueller',
            'email'       => 'supplier1@deepcar.eu',
            'password'    => Hash::make('password'),
            'role'        => 'supplier',
            'phone'       => '+49 30 123 456',
            'is_active'   => true,
            'supplier_id' => $suppliers['supplierA']->id,
        ]);
        $supplierUser1->assignRole('supplier');

        // Approved supplier user (linked to NL Parts)
        $supplierUser2 = User::create([
            'name'        => 'Jan de Vries',
            'email'       => 'supplier2@nlparts.eu',
            'password'    => Hash::make('password'),
            'role'        => 'supplier',
            'phone'       => '+31 20 789 012',
            'is_active'   => true,
            'supplier_id' => $suppliers['supplierB']->id,
        ]);
        $supplierUser2->assignRole('supplier');

        // Pending supplier (new application - NOT yet approved)
        $pendingSupplier = Supplier::create([
            'name'             => 'TurkParts International',
            'code'             => 'SUP-TURKPARTS',
            'contact_person'   => 'Mehmet Yilmaz',
            'email'            => 'info@turkparts.com',
            'phone'            => '+90 212 555 1234',
            'website'          => 'https://turkparts.com',
            'business_license' => 'TR-BL-2026-4567',
            'tax_id'           => 'TR9876543210',
            'address'          => 'Ataturk Cad. No:15, 34000 Istanbul, Turkey',
            'description'      => 'Large-scale Turkish automotive parts manufacturer exporting to 40+ countries. Specializing in brake components and suspension parts.',
            'type'             => 'api',
            'api_url'          => 'https://api.turkparts.com/v2',
            'is_active'        => false,
            'approval_status'  => 'pending',
        ]);

        $pendingUser = User::create([
            'name'        => 'Mehmet Yilmaz',
            'email'       => 'info@turkparts.com',
            'password'    => Hash::make('password'),
            'role'        => 'supplier',
            'phone'       => '+90 212 555 1234',
            'is_active'   => true,
            'supplier_id' => $pendingSupplier->id,
        ]);
        $pendingUser->assignRole('supplier');

        // Under review supplier
        $reviewSupplier = Supplier::create([
            'name'             => 'EuroParts Express',
            'code'             => 'SUP-EUROEXP',
            'contact_person'   => 'Sophie Dubois',
            'email'            => 'contact@europartsexpress.fr',
            'phone'            => '+33 1 234 5678',
            'website'          => 'https://europartsexpress.fr',
            'business_license' => 'FR-BL-2026-7890',
            'tax_id'           => 'FR12345678901',
            'address'          => '15 Rue de Rivoli, 75001 Paris, France',
            'description'      => 'French automotive parts express delivery service with same-day shipping across Europe.',
            'type'             => 'xml',
            'feed_url'         => 'https://europartsexpress.fr/feed/products.xml',
            'is_active'        => false,
            'approval_status'  => 'under_review',
        ]);

        $reviewUser = User::create([
            'name'        => 'Sophie Dubois',
            'email'       => 'contact@europartsexpress.fr',
            'password'    => Hash::make('password'),
            'role'        => 'supplier',
            'phone'       => '+33 1 234 5678',
            'is_active'   => true,
            'supplier_id' => $reviewSupplier->id,
        ]);
        $reviewUser->assignRole('supplier');

        // Rejected supplier
        $rejectedSupplier = Supplier::create([
            'name'              => 'CheapParts Co.',
            'code'              => 'SUP-CHEAPPARTS',
            'contact_person'    => 'John Doe',
            'email'             => 'info@cheapparts.xyz',
            'phone'             => '+1 555 000 0000',
            'website'           => 'https://cheapparts.xyz',
            'description'       => 'Discount auto parts.',
            'type'              => 'csv',
            'feed_url'          => 'https://cheapparts.xyz/products.csv',
            'is_active'         => false,
            'approval_status'   => 'rejected',
            'rejection_reason'  => 'Insufficient business documentation. No valid business license or tax ID provided. Website appears inactive.',
        ]);

        $rejectedUser = User::create([
            'name'        => 'John Doe',
            'email'       => 'info@cheapparts.xyz',
            'password'    => Hash::make('password'),
            'role'        => 'supplier',
            'phone'       => '+1 555 000 0000',
            'is_active'   => true,
            'supplier_id' => $rejectedSupplier->id,
        ]);
        $rejectedUser->assignRole('supplier');

        $this->command->info('  Supplier users seeded (5 supplier accounts: 2 approved, 1 pending, 1 under review, 1 rejected)');
    }
}
