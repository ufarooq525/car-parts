<?php

namespace App\Modules\Order\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'order_number' => $this->order_number,
            'status'       => $this->status,
            'total'        => $this->total,
            'items_count'  => $this->items_count ?? $this->items->count(),
            'user_name'    => $this->user?->name,
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}
