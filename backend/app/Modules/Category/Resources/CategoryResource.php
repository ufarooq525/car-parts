<?php

namespace App\Modules\Category\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'description'    => $this->description,
            'image'          => $this->image ? Storage::disk('public')->url($this->image) : null,
            'parent_id'      => $this->parent_id,
            'parent'         => new CategoryResource($this->whenLoaded('parent')),
            'children'       => CategoryResource::collection($this->whenLoaded('children')),
            'products_count' => $this->whenCounted('products'),
            'is_active'      => $this->is_active,
            'is_visible'     => $this->is_visible,
            'sort_order'     => $this->sort_order,
            'created_at'     => $this->created_at,
        ];
    }
}
