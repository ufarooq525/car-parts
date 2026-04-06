<?php

namespace App\Modules\Auth\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'role'            => $this->role,
            'supplier_id'     => $this->supplier_id,
            'approval_status' => $this->when($this->role === 'supplier', fn () => $this->supplier?->approval_status),
            'created_at'      => $this->created_at,
        ];
    }
}
