<?php

namespace App\Modules\Vehicle\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Vehicle\Models\Vehicle;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleRepository extends BaseRepository
{
    public function __construct(Vehicle $model)
    {
        parent::__construct($model);
    }

    public function getFilteredVehicles(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->query();

        if (!empty($filters['search'])) {
            $this->applySearch($query, $filters['search'], ['make', 'model', 'engine']);
        }

        if (!empty($filters['make'])) {
            $query->byMake($filters['make']);
        }

        if (!empty($filters['model'])) {
            $query->byModel($filters['model']);
        }

        if (!empty($filters['year'])) {
            $query->fitsYear((int) $filters['year']);
        }

        return $this->applySorting($query, 'make', 'asc')->paginate($perPage);
    }

    public function getMakes(): Collection
    {
        return $this->query()
            ->select('make')
            ->distinct()
            ->orderBy('make')
            ->get();
    }

    public function getModelsByMake(string $make): Collection
    {
        return $this->query()
            ->where('make', $make)
            ->select('model')
            ->distinct()
            ->orderBy('model')
            ->get();
    }

    public function getYearsByMakeAndModel(string $make, string $model): Collection
    {
        return $this->query()
            ->where('make', $make)
            ->where('model', $model)
            ->select('year_from', 'year_to')
            ->orderBy('year_from')
            ->get();
    }

    public function findBySlug(string $slug): ?Vehicle
    {
        return $this->query()
            ->where('slug', $slug)
            ->with('products')
            ->first();
    }
}
