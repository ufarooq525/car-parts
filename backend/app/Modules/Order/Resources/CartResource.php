<?php

namespace App\Modules\Order\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items', $this->items, collect());

        return [
            'id'    => $this->id,
            'items' => CartItemResource::collection($items),
            'total' => $items->sum(fn ($item) => $item->product->sell_price * $item->quantity),
        ];
    }
}
