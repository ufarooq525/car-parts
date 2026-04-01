<?php

namespace App\Modules\Order\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'product_id'    => $this->product_id,
            'product_name'  => $this->product?->name,
            'product_image' => $this->product?->image,
            'sell_price'    => $this->product?->sell_price,
            'quantity'      => $this->quantity,
            'subtotal'      => $this->product ? $this->product->sell_price * $this->quantity : 0,
        ];
    }
}
