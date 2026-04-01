<?php

namespace App\Modules\Product\Actions;

use App\Modules\Product\Models\Product;

class UpdateProductAction
{
    /**
     * Update an existing product with optional relations
     */
    public function __invoke(Product $product, array $data): Product
    {
        $vehicleIds = $data['vehicle_ids'] ?? null;
        $supplierData = $data['supplier_data'] ?? null;

        unset($data['vehicle_ids'], $data['supplier_data']);

        $product->update($data);

        if ($vehicleIds !== null) {
            $product->vehicles()->sync($vehicleIds);
        }

        if ($supplierData !== null) {
            $syncData = [];
            foreach ($supplierData as $supplier) {
                $syncData[$supplier['supplier_id']] = [
                    'supplier_sku' => $supplier['supplier_sku'] ?? null,
                    'cost_price' => $supplier['cost_price'] ?? null,
                    'stock_quantity' => $supplier['stock_quantity'] ?? null,
                ];
            }
            $product->suppliers()->sync($syncData);
        }

        return $product->fresh(['category', 'suppliers', 'vehicles']);
    }
}
