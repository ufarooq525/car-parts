<?php

namespace App\Modules\Supplier\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SyncLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'supplier_id'       => $this->supplier_id,
            'type'              => $this->type,
            'status'            => $this->status,
            'records_processed' => $this->records_processed,
            'errors'            => $this->error_message,
            'started_at'        => $this->started_at,
            'completed_at'      => $this->completed_at,
        ];
    }
}
