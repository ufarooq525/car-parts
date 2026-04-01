<?php

namespace App\Modules\Vehicle\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'make'      => ['nullable', 'string', 'max:100'],
            'model'     => ['nullable', 'string', 'max:100'],
            'year_from' => ['nullable', 'integer', 'min:1900', 'max:2030'],
            'year_to'   => ['nullable', 'integer', 'min:1900', 'max:2030', 'gte:year_from'],
            'engine'    => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'year_to.gte' => __('vehicle::messages.year_to_gte'),
        ];
    }
}
