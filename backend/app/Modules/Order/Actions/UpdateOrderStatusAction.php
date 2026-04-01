<?php

namespace App\Modules\Order\Actions;

use App\Core\Exceptions\BusinessException;
use App\Modules\Order\Models\Order;

class UpdateOrderStatusAction
{
    /**
     * Valid status transitions.
     */
    protected array $transitions = [
        'pending'    => ['confirmed', 'cancelled'],
        'confirmed'  => ['processing'],
        'processing' => ['shipped'],
        'shipped'    => ['delivered'],
        'delivered'  => [],
        'cancelled'  => [],
        'refunded'   => [],
    ];

    /**
     * Update the order status with transition validation.
     */
    public function execute(Order $order, array $data): Order
    {
        $newStatus = $data['status'];
        $currentStatus = $order->status;

        $allowedTransitions = $this->transitions[$currentStatus] ?? [];

        if (!in_array($newStatus, $allowedTransitions)) {
            throw new BusinessException('order::messages.invalid_status_transition');
        }

        $updateData = ['status' => $newStatus];

        // Set timestamps for specific transitions
        if ($newStatus === 'shipped') {
            $updateData['shipped_at'] = now();
            $updateData['tracking_number'] = $data['tracking_number'] ?? null;
            $updateData['tracking_company'] = $data['tracking_company'] ?? null;
        }

        if ($newStatus === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        if ($newStatus === 'cancelled') {
            $updateData['cancelled_at'] = now();

            // Restore stock for cancelled orders
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock_quantity', $item->quantity);
                }
            }
        }

        $order->update($updateData);

        return $order->fresh(['items.product', 'user']);
    }
}
