<?php

namespace App\Modules\Order\Actions;

use App\Core\Exceptions\BusinessException;
use App\Models\User;
use App\Modules\Order\Models\Cart;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateOrderAction
{
    /**
     * Create an order from the user's cart.
     */
    public function execute(User $user, array $data): Order
    {
        $cart = Cart::where('user_id', $user->id)
            ->with(['items.product'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            throw new BusinessException('order::messages.cart_empty');
        }

        return DB::transaction(function () use ($user, $data, $cart) {
            $subtotal = 0;

            // Calculate subtotal from cart items
            foreach ($cart->items as $item) {
                $subtotal += $item->product->sell_price * $item->quantity;
            }

            $taxAmount = round($subtotal * 0.23, 2); // 23% IVA
            $total = $subtotal + $taxAmount;

            // Generate unique order number
            $orderNumber = 'ORD-' . now()->timestamp . '-' . strtoupper(Str::random(6));

            // Create order
            $order = Order::create([
                'order_number'        => $orderNumber,
                'user_id'             => $user->id,
                'status'              => 'pending',
                'subtotal'            => $subtotal,
                'tax_amount'          => $taxAmount,
                'shipping_amount'     => 0,
                'total'               => $total,
                'shipping_name'       => $data['shipping_name'],
                'shipping_address'    => $data['shipping_address'],
                'shipping_city'       => $data['shipping_city'],
                'shipping_postal_code' => $data['shipping_postal_code'],
                'shipping_country'    => $data['shipping_country'],
                'shipping_phone'      => $data['shipping_phone'],
                'billing_address'     => $data['billing_address'] ?? $data['shipping_address'],
                'billing_city'        => $data['billing_city'] ?? $data['shipping_city'],
                'billing_postal_code' => $data['billing_postal_code'] ?? $data['shipping_postal_code'],
                'billing_country'     => $data['billing_country'] ?? $data['shipping_country'],
                'payment_method'      => $data['payment_method'],
                'notes'               => $data['notes'] ?? null,
            ]);

            // Copy cart items to order items with snapshot prices
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku'  => $item->product->sku,
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->product->sell_price,
                    'total_price'  => $item->product->sell_price * $item->quantity,
                ]);

                // Decrement stock
                $item->product->decrement('stock_quantity', $item->quantity);
            }

            // Clear cart
            $cart->items()->delete();

            return $order->load(['items.product', 'user']);
        });
    }
}
