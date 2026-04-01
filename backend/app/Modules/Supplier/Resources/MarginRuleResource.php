<?php

namespace App\Modules\Supplier\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarginRuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'supplier_id'   => $this->supplier_id,
            'category_id'   => $this->category_id,
            'type'          => $this->type,
            'value'         => $this->value,
            'min_price'     => $this->min_price,
            'max_price'     => $this->max_price,
            'priority'      => $this->priority,
            'is_active'     => $this->is_active,
            'supplier_name' => $this->whenLoaded('supplier', fn () => $this->supplier->name),
            'category_name' => $this->whenLoaded('category', fn () => $this->category->name),
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}
