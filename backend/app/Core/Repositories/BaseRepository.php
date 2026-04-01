<?php

namespace App\Core\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get query builder instance
     */
    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    /**
     * Get all records
     */
    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->query()->with($relations)->get($columns);
    }

    /**
     * Get paginated records
     */
    public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator
    {
        return $this->query()->with($relations)->paginate($perPage, $columns);
    }

    /**
     * Find by ID
     */
    public function findById(int $id, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->query()->select($columns)->with($relations)->find($id);
    }

    /**
     * Find by ID or fail
     */
    public function findByIdOrFail(int $id, array $columns = ['*'], array $relations = []): Model
    {
        return $this->query()->select($columns)->with($relations)->findOrFail($id);
    }

    /**
     * Find by a specific column
     */
    public function findByColumn(string $column, mixed $value, array $relations = []): ?Model
    {
        return $this->query()->with($relations)->where($column, $value)->first();
    }

    /**
     * Find multiple by a specific column
     */
    public function findAllByColumn(string $column, mixed $value, array $relations = []): Collection
    {
        return $this->query()->with($relations)->where($column, $value)->get();
    }

    /**
     * Create a new record
     */
    public function create(array $data): Model
    {
        return $this->query()->create($data);
    }

    /**
     * Update an existing record
     */
    public function update(int $id, array $data): Model
    {
        $record = $this->findByIdOrFail($id);
        $record->update($data);

        return $record->fresh();
    }

    /**
     * Delete a record
     */
    public function delete(int $id): bool
    {
        $record = $this->findByIdOrFail($id);

        return $record->delete();
    }

    /**
     * Bulk insert
     */
    public function bulkInsert(array $data): bool
    {
        return $this->query()->insert($data);
    }

    /**
     * Upsert records
     */
    public function upsert(array $data, array $uniqueBy, array $update): int
    {
        return $this->model::upsert($data, $uniqueBy, $update);
    }

    /**
     * Count records with optional conditions
     */
    public function count(array $conditions = []): int
    {
        $query = $this->query();

        foreach ($conditions as $column => $value) {
            $query->where($column, $value);
        }

        return $query->count();
    }

    /**
     * Check if record exists
     */
    public function exists(array $conditions): bool
    {
        $query = $this->query();

        foreach ($conditions as $column => $value) {
            $query->where($column, $value);
        }

        return $query->exists();
    }

    /**
     * Apply filters from request
     */
    public function applyFilters(Builder $query, array $filters): Builder
    {
        foreach ($filters as $key => $value) {
            if ($value !== null && $value !== '') {
                $query->where($key, $value);
            }
        }

        return $query;
    }

    /**
     * Apply search across multiple columns
     */
    public function applySearch(Builder $query, string $search, array $columns): Builder
    {
        return $query->where(function (Builder $q) use ($search, $columns) {
            foreach ($columns as $column) {
                $q->orWhere($column, 'LIKE', "%{$search}%");
            }
        });
    }

    /**
     * Apply sorting
     */
    public function applySorting(Builder $query, string $sortBy = 'created_at', string $sortOrder = 'desc'): Builder
    {
        return $query->orderBy($sortBy, $sortOrder);
    }
}
