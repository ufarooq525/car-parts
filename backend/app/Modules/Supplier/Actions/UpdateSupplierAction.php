<?php

namespace App\Modules\Supplier\Actions;

use App\Modules\Supplier\Models\Supplier;

class UpdateSupplierAction
{
    /**
     * Update an existing supplier.
     */
    public function execute(Supplier $supplier, array $data): Supplier
    {
        $supplier->update($data);

        return $supplier->fresh();
    }
}
