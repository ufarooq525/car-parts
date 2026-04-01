<?php

namespace App\Modules\Supplier\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Supplier\Models\MarginRule;
use Illuminate\Database\Eloquent\Collection;

class MarginRuleRepository extends BaseRepository
{
    public function __construct(MarginRule $model)
    {
        parent::__construct($model);
    }

    public function getApplicableRules(?int $supplierId, ?int $categoryId, ?float $price): Collection
    {
        $query = $this->query()->where('is_active', true);

        if ($supplierId !== null) {
            $query->where(function ($q) use ($supplierId) {
                $q->where('supplier_id', $supplierId)
                    ->orWhereNull('supplier_id');
            });
        }

        if ($categoryId !== null) {
            $query->where(function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId)
                    ->orWhereNull('category_id');
            });
        }

        if ($price !== null) {
            $query->where(function ($q) use ($price) {
                $q->where(function ($sub) use ($price) {
                    $sub->whereNull('min_price')
                        ->orWhere('min_price', '<=', $price);
                })->where(function ($sub) use ($price) {
                    $sub->whereNull('max_price')
                        ->orWhere('max_price', '>=', $price);
                });
            });
        }

        return $query->orderByDesc('priority')->get();
    }

    public function getRulesBySupplier(int $supplierId): Collection
    {
        return $this->query()
            ->where('supplier_id', $supplierId)
            ->orderByDesc('priority')
            ->get();
    }

    public function getRulesByCategory(int $categoryId): Collection
    {
        return $this->query()
            ->where('category_id', $categoryId)
            ->orderByDesc('priority')
            ->get();
    }
}
