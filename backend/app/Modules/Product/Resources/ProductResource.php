<?php

namespace App\Modules\Product\Resources;

use App\Modules\Category\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'sku'            => $this->sku,
            'description'    => $this->description,
            'category'       => new CategoryResource($this->whenLoaded('category')),
            'cost_price'     => $this->cost_price,
            'sell_price'     => $this->sell_price,
            'stock_quantity' => $this->stock_quantity,
            'is_active'      => $this->is_active,
            'is_visible'     => $this->is_visible,
            'image_url'      => $this->image ? Storage::disk('public')->url($this->image) : null,
            'vehicles'       => $this->whenLoaded('vehicles'),
            'suppliers'      => $this->whenLoaded('suppliers'),
            'created_at'     => $this->created_at,
        ];
    }
}
