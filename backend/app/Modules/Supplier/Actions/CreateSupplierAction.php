<?php

namespace App\Modules\Supplier\Actions;

use App\Modules\Supplier\Models\Supplier;

class CreateSupplierAction
{
    /**
     * Create a new supplier.
     */
    public function execute(array $data): Supplier
    {
        return Supplier::create($data);
    }
}
