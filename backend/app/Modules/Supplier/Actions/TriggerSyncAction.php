<?php

namespace App\Modules\Supplier\Actions;

use App\Modules\Supplier\Models\Supplier;
use App\Modules\Supplier\Models\SyncLog;

class TriggerSyncAction
{
    /**
     * Trigger a sync for the given supplier.
     */
    public function execute(Supplier $supplier): SyncLog
    {
        $syncLog = SyncLog::create([
            'supplier_id' => $supplier->id,
            'type'        => $supplier->type,
            'status'      => 'pending',
            'started_at'  => now(),
        ]);

        // TODO: Dispatch sync job to queue
        // dispatch(new SyncSupplierJob($supplier, $syncLog));

        return $syncLog;
    }
}
