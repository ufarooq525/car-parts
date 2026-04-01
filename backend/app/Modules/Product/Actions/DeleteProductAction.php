<?php

namespace App\Modules\Product\Actions;

use App\Core\Exceptions\BusinessException;
use App\Modules\Product\Models\Product;

class DeleteProductAction
{
    /**
     * Soft delete a product after checking for pending orders
     *
     * @throws BusinessException
     */
    public function __invoke(Product $product): bool
    {
        $hasPendingOrders = $product->orderItems()
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['pending', 'confirmed', 'processing']);
            })
            ->exists();

        if ($hasPendingOrders) {
            throw new BusinessException('product::messages.product_has_pending_orders');
        }

        return $product->delete();
    }
}
