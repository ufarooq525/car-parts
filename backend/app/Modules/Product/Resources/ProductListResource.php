<?php

namespace App\Modules\Product\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'sku'            => $this->sku,
            'sell_price'     => $this->sell_price,
            'stock_quantity' => $this->stock_quantity,
            'is_visible'     => $this->is_visible,
            'image_url'      => $this->image ? Storage::disk('public')->url($this->image) : null,
            'category_name'  => $this->whenLoaded('category', fn () => $this->category->name),
            'created_at'     => $this->created_at,
        ];
    }
}
