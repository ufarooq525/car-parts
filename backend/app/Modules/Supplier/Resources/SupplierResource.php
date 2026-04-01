<?php

namespace App\Modules\Supplier\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'code'                  => $this->code,
            'type'                  => $this->type,
            'api_url'               => $this->api_url,
            'api_key'               => $this->api_key,
            'feed_url'              => $this->feed_url,
            'config'                => $this->config,
            'default_margin_type'   => $this->default_margin_type,
            'default_margin_value'  => $this->default_margin_value,
            'sync_interval_minutes' => $this->sync_interval_minutes,
            'is_active'             => $this->is_active,
            'last_synced_at'        => $this->last_synced_at,
            'products_count'        => $this->whenCounted('products'),
            'latest_sync'           => new SyncLogResource($this->whenLoaded('syncLogs', fn () => $this->syncLogs->first())),
            'created_at'            => $this->created_at,
            'updated_at'            => $this->updated_at,
        ];
    }
}
