<?php

namespace App\Modules\Supplier\Actions;

use App\Core\Exceptions\BusinessException;
use App\Models\User;
use App\Modules\Supplier\Models\Supplier;

class ApproveSupplierAction
{
    public function execute(Supplier $supplier, User $approvedBy): Supplier
    {
        if ($supplier->isApproved()) {
            throw new BusinessException('This supplier is already approved.');
        }

        $supplier->update([
            'approval_status' => 'approved',
            'is_active' => true,
            'approved_at' => now(),
            'approved_by' => $approvedBy->id,
            'rejection_reason' => null,
        ]);

        return $supplier->fresh();
    }
}
