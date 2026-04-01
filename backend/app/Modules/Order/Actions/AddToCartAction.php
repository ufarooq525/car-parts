<?php

namespace App\Modules\Order\Actions;

use App\Core\Exceptions\BusinessException;
use App\Models\User;
use App\Modules\Order\Models\Cart;
use App\Modules\Order\Repositories\CartRepository;
use App\Modules\Product\Models\Product;

class AddToCartAction
{
    public function __construct(
        protected CartRepository $cartRepository,
    ) {}

    /**
     * Add an item to the user's cart, or increment quantity if it already exists.
     */
    public function execute(User $user, array $data): Cart
    {
        $product = Product::findOrFail($data['product_id']);
        $quantity = $data['quantity'];

        // Check product stock
        if ($product->stock_quantity <= 0) {
            throw new BusinessException('order::messages.product_out_of_stock');
        }

        $cart = $this->cartRepository->getOrCreateForUser($user->id);

        // Check if product already exists in cart
        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;

            if ($newQuantity > $product->stock_quantity) {
                throw new BusinessException('order::messages.insufficient_stock');
            }

            $existingItem->update(['quantity' => $newQuantity]);
        } else {
            if ($quantity > $product->stock_quantity) {
                throw new BusinessException('order::messages.insufficient_stock');
            }

            $cart->items()->create([
                'product_id' => $product->id,
                'quantity'   => $quantity,
            ]);
        }

        return $cart;
    }
}
