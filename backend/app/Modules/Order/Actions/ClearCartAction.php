<?php

namespace App\Modules\Order\Actions;

use App\Models\User;
use App\Modules\Order\Models\Cart;

class ClearCartAction
{
    /**
     * Remove all items from the user's cart.
     */
    public function execute(User $user): void
    {
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            $cart->items()->delete();
        }
    }
}
