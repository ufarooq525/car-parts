<?php

namespace App\Modules\Order\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'order_number'         => $this->order_number,
            'status'               => $this->status,
            'subtotal'             => $this->subtotal,
            'tax_amount'           => $this->tax_amount,
            'shipping_amount'      => $this->shipping_amount,
            'total'                => $this->total,
            'shipping_name'        => $this->shipping_name,
            'shipping_address'     => $this->shipping_address,
            'shipping_city'        => $this->shipping_city,
            'shipping_postal_code' => $this->shipping_postal_code,
            'shipping_country'     => $this->shipping_country,
            'shipping_phone'       => $this->shipping_phone,
            'billing_address'      => $this->billing_address,
            'billing_city'         => $this->billing_city,
            'billing_postal_code'  => $this->billing_postal_code,
            'billing_country'      => $this->billing_country,
            'payment_method'       => $this->payment_method,
            'payment_id'           => $this->payment_id,
            'tracking_number'      => $this->tracking_number,
            'tracking_company'     => $this->tracking_company,
            'notes'                => $this->notes,
            'shipped_at'           => $this->shipped_at?->toISOString(),
            'delivered_at'         => $this->delivered_at?->toISOString(),
            'cancelled_at'         => $this->cancelled_at?->toISOString(),
            'items'                => OrderItemResource::collection($this->whenLoaded('items')),
            'user'                 => $this->whenLoaded('user', fn () => [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ]),
            'created_at'           => $this->created_at?->toISOString(),
            'updated_at'           => $this->updated_at?->toISOString(),
        ];
    }
}
