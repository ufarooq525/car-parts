<?php

namespace App\Modules\Supplier\Actions;

use App\Core\Exceptions\BusinessException;
use App\Modules\Supplier\Models\Supplier;

class DeleteSupplierAction
{
    /**
     * Delete a supplier after checking constraints.
     */
    public function execute(Supplier $supplier): bool
    {
        if ($supplier->products()->exists()) {
            throw new BusinessException('supplier::messages.supplier_has_products');
        }

        return $supplier->delete();
    }
}
