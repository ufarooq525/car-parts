<?php

namespace App\Modules\User\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Get filtered and paginated users.
     */
    public function getFilteredUsers(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->query()->withCount('orders');

        if (!empty($filters['search'])) {
            $this->applySearch($query, $filters['search'], ['name', 'email', 'phone']);
        }

        if (!empty($filters['role'])) {
            $query->byRole($filters['role']);
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $this->applySorting($query, $filters['sort_by'] ?? 'created_at', $filters['sort_order'] ?? 'desc')
            ->paginate($perPage);
    }
}
