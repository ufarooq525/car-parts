<?php

namespace App\Modules\Supplier\Actions;

use App\Core\Exceptions\BusinessException;
use App\Modules\Supplier\Models\Supplier;

class RejectSupplierAction
{
    public function execute(Supplier $supplier, string $reason): Supplier
    {
        if ($supplier->isApproved()) {
            throw new BusinessException('Cannot reject an already approved supplier.');
        }

        $supplier->update([
            'approval_status' => 'rejected',
            'is_active' => false,
            'rejection_reason' => $reason,
        ]);

        return $supplier->fresh();
    }
}
