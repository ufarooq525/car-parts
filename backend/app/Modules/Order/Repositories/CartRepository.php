<?php

namespace App\Modules\Order\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Order\Models\Cart;

class CartRepository extends BaseRepository
{
    public function __construct(Cart $model)
    {
        parent::__construct($model);
    }

    public function getByUser(int $userId): ?Cart
    {
        return $this->query()
            ->where('user_id', $userId)
            ->with(['items.product'])
            ->first();
    }

    public function getOrCreateForUser(int $userId): Cart
    {
        return $this->query()->firstOrCreate(
            ['user_id' => $userId],
        );
    }
}
