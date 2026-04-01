<?php

namespace App\Modules\Supplier\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMarginRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'type'        => ['required', 'in:percentage,fixed'],
            'value'       => ['required', 'numeric', 'min:0'],
            'min_price'   => ['nullable', 'numeric', 'min:0'],
            'max_price'   => ['nullable', 'numeric', 'min:0'],
            'priority'    => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.exists' => __('supplier::messages.validation_supplier_id_exists'),
            'category_id.exists' => __('supplier::messages.validation_category_id_exists'),
            'type.required'      => __('supplier::messages.validation_margin_type_required'),
            'type.in'            => __('supplier::messages.validation_margin_type_in'),
            'value.required'     => __('supplier::messages.validation_margin_value_required'),
            'value.min'          => __('supplier::messages.validation_margin_value_min'),
        ];
    }
}
