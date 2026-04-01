<?php

namespace App\Modules\Vehicle\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'make'           => $this->make,
            'model'          => $this->model,
            'year_from'      => $this->year_from,
            'year_to'        => $this->year_to,
            'engine'         => $this->engine,
            'slug'           => $this->slug,
            'products_count' => $this->whenCounted('products'),
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}
