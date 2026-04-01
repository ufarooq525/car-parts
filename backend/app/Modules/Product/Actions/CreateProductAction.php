<?php

namespace App\Modules\Product\Actions;

use App\Modules\Product\Models\Product;

class CreateProductAction
{
    /**
     * Create a new product with optional relations
     */
    public function __invoke(array $data): Product
    {
        $vehicleIds = $data['vehicle_ids'] ?? null;
        $supplierData = $data['supplier_data'] ?? null;

        unset($data['vehicle_ids'], $data['supplier_data']);

        $product = Product::create($data);

        if ($vehicleIds) {
            $product->vehicles()->sync($vehicleIds);
        }

        if ($supplierData) {
            $syncData = [];
            foreach ($supplierData as $supplier) {
                $syncData[$supplier['supplier_id']] = [
                    'supplier_sku' => $supplier['supplier_sku'] ?? null,
                    'cost_price' => $supplier['cost_price'] ?? null,
                    'stock_quantity' => $supplier['stock_quantity'] ?? null,
                ];
            }
            $product->suppliers()->attach($syncData);
        }

        return $product->load(['category', 'suppliers', 'vehicles']);
    }
}
