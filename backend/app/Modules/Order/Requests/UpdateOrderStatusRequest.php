<?php

namespace App\Modules\Order\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status'           => ['required', 'in:pending,confirmed,processing,shipped,delivered,cancelled,refunded'],
            'tracking_number'  => ['nullable', 'string', 'max:255'],
            'tracking_company' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => __('order::messages.status_required'),
            'status.in'       => __('order::messages.status_invalid'),
        ];
    }
}
