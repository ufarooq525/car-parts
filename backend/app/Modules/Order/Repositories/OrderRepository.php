<?php

namespace App\Modules\Order\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Order\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository extends BaseRepository
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function getFilteredOrders(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->query()->with(['user', 'items.product']);

        if (!empty($filters['search'])) {
            $this->applySearch($query, $filters['search'], ['order_number', 'shipping_name', 'shipping_email']);
        }

        if (!empty($filters['status'])) {
            $query->byStatus($filters['status']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['date_from']) || !empty($filters['date_to'])) {
            $query->dateBetween('created_at', $filters['date_from'] ?? null, $filters['date_to'] ?? null);
        }

        return $this->applySorting($query, $filters['sort_by'] ?? 'created_at', $filters['sort_order'] ?? 'desc')
            ->paginate($perPage);
    }

    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return $this->query()
            ->where('order_number', $orderNumber)
            ->with(['user', 'items.product'])
            ->first();
    }

    public function getUserOrders(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->where('user_id', $userId)
            ->with(['items.product'])
            ->sortBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
