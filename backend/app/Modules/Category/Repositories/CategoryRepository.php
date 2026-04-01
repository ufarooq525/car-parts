<?php

namespace App\Modules\Category\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Category\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryRepository extends BaseRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    /**
     * Get full category tree (roots with recursive children), ordered.
     */
    public function getTree(): Collection
    {
        return $this->query()
            ->roots()
            ->ordered()
            ->with(['children' => function ($query) {
                $query->ordered()->with('children');
            }])
            ->get();
    }

    /**
     * Get filtered & paginated categories.
     */
    public function getFilteredCategories(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->query()->with(['parent']);

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        if (array_key_exists('parent_id', $filters)) {
            if (is_null($filters['parent_id'])) {
                $query->roots();
            } else {
                $query->where('parent_id', $filters['parent_id']);
            }
        }

        return $query->ordered()->paginate($perPage);
    }

    /**
     * Find a category by slug with children and parent loaded.
     */
    public function findBySlug(string $slug): ?Category
    {
        return $this->query()
            ->where('slug', $slug)
            ->with(['children' => function ($query) {
                $query->ordered();
            }, 'parent'])
            ->withCount('products')
            ->first();
    }

    /**
     * Get root categories ordered.
     */
    public function getRoots(): Collection
    {
        return $this->query()
            ->roots()
            ->ordered()
            ->get();
    }

    /**
     * Get children of a given category.
     */
    public function getChildren(int $parentId): Collection
    {
        return $this->query()
            ->where('parent_id', $parentId)
            ->ordered()
            ->get();
    }
}
