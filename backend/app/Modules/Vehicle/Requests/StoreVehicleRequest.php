<?php

namespace App\Modules\Vehicle\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'make'      => ['required', 'string', 'max:100'],
            'model'     => ['required', 'string', 'max:100'],
            'year_from' => ['required', 'integer', 'min:1900', 'max:2030'],
            'year_to'   => ['required', 'integer', 'min:1900', 'max:2030', 'gte:year_from'],
            'engine'    => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'make.required'      => __('vehicle::messages.make_required'),
            'model.required'     => __('vehicle::messages.model_required'),
            'year_from.required' => __('vehicle::messages.year_from_required'),
            'year_to.required'   => __('vehicle::messages.year_to_required'),
            'year_to.gte'        => __('vehicle::messages.year_to_gte'),
        ];
    }
}
