<?php

namespace App\Modules\Supplier\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Supplier\Models\SyncLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SyncLogRepository extends BaseRepository
{
    public function __construct(SyncLog $model)
    {
        parent::__construct($model);
    }

    public function getLogsBySupplier(int $supplierId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->where('supplier_id', $supplierId)
            ->latest()
            ->paginate($perPage);
    }

    public function getLatestLog(int $supplierId): ?SyncLog
    {
        return $this->query()
            ->where('supplier_id', $supplierId)
            ->latest()
            ->first();
    }

    public function createLog(int $supplierId, string $type): SyncLog
    {
        return $this->create([
            'supplier_id' => $supplierId,
            'type' => $type,
            'status' => 'pending',
        ]);
    }

    public function updateLog(int $logId, array $data): SyncLog
    {
        $log = $this->findByIdOrFail($logId);

        $this->update($log, $data);

        return $log->fresh();
    }
}
