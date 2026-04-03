<?php

namespace App\Modules\Supplier\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Supplier\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SupplierRepository extends BaseRepository
{
    public function __construct(Supplier $model)
    {
        parent::__construct($model);
    }

    public function getFilteredSuppliers(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->query();

        if (!empty($filters['search'])) {
            $query = $this->applySearch($query, $filters['search'], ['name', 'code']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        $query = $this->applySorting(
            $query,
            $filters['sort_by'] ?? 'created_at',
            $filters['sort_order'] ?? 'desc'
        );

        return $query->paginate($perPage);
    }

    public function findByCode(string $code): ?Supplier
    {
        return $this->query()->where('code', $code)->first();
    }

    public function getActiveSuppliers(): Collection
    {
        return $this->query()->where('is_active', true)->get();
    }

    public function getSuppliersForSync(): Collection
    {
        return $this->query()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('last_synced_at')
                    ->orWhereRaw(
                        'DATE_ADD(last_synced_at, INTERVAL sync_interval_minutes MINUTE) < NOW()'
                    );
            })
            ->get();
    }
}
