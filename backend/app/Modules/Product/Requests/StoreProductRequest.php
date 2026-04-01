<?php

namespace App\Modules\Product\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'sku'            => ['required', 'string', 'unique:products,sku'],
            'category_id'    => ['required', 'exists:categories,id'],
            'description'    => ['nullable', 'string'],
            'cost_price'     => ['required', 'numeric', 'min:0'],
            'sell_price'     => ['nullable', 'numeric', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'is_active'      => ['nullable', 'boolean'],
            'is_visible'     => ['nullable', 'boolean'],
            'vehicles'       => ['nullable', 'array'],
            'vehicles.*'     => ['exists:vehicles,id'],
            'suppliers'      => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'       => __('product::validation.name_required'),
            'name.max'            => __('product::validation.name_max'),
            'sku.required'        => __('product::validation.sku_required'),
            'sku.unique'          => __('product::validation.sku_unique'),
            'category_id.required' => __('product::validation.category_id_required'),
            'category_id.exists'  => __('product::validation.category_id_exists'),
            'cost_price.required' => __('product::validation.cost_price_required'),
            'cost_price.min'      => __('product::validation.cost_price_min'),
            'sell_price.min'      => __('product::validation.sell_price_min'),
            'stock_quantity.min'  => __('product::validation.stock_quantity_min'),
            'vehicles.*.exists'   => __('product::validation.vehicle_exists'),
        ];
    }
}
