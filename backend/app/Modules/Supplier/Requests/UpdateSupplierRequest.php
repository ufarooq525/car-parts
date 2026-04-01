<?php

namespace App\Modules\Supplier\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                 => ['nullable', 'string', 'max:255'],
            'code'                 => ['nullable', 'string', 'unique:suppliers,code,' . $this->route('supplier')],
            'type'                 => ['nullable', 'in:api,xml,csv'],
            'api_endpoint'         => ['nullable', 'url'],
            'api_key'              => ['nullable', 'string'],
            'feed_url'             => ['nullable', 'url'],
            'sync_interval_minutes' => ['nullable', 'integer', 'min:15'],
            'is_active'            => ['nullable', 'boolean'],
            'config'               => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max'                     => __('supplier::messages.validation_name_max'),
            'code.unique'                  => __('supplier::messages.validation_code_unique'),
            'type.in'                      => __('supplier::messages.validation_type_in'),
            'api_endpoint.url'             => __('supplier::messages.validation_api_endpoint_url'),
            'feed_url.url'                 => __('supplier::messages.validation_feed_url_url'),
            'sync_interval_minutes.min'    => __('supplier::messages.validation_sync_interval_min'),
        ];
    }
}
