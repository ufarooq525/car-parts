<?php

namespace App\Modules\Order\Actions;

use App\Core\Exceptions\BusinessException;
use App\Models\User;
use App\Modules\Order\Models\Cart;
use App\Modules\Order\Models\CartItem;

class UpdateCartItemAction
{
    /**
     * Update the quantity of a cart item with stock validation.
     */
    public function execute(User $user, CartItem $cartItem, array $data): Cart
    {
        $quantity = $data['quantity'];
        $product = $cartItem->product;

        if ($quantity > $product->stock_quantity) {
            throw new BusinessException('order::messages.insufficient_stock');
        }

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem->cart;
    }
}
