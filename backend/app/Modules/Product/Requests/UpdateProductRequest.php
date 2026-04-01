<?php

namespace App\Modules\Product\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product');

        return [
            'name'           => ['nullable', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'unique:products,sku,' . $productId],
            'category_id'    => ['nullable', 'exists:categories,id'],
            'description'    => ['nullable', 'string'],
            'cost_price'     => ['nullable', 'numeric', 'min:0'],
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
            'name.max'            => __('product::validation.name_max'),
            'sku.unique'          => __('product::validation.sku_unique'),
            'category_id.exists'  => __('product::validation.category_id_exists'),
            'cost_price.min'      => __('product::validation.cost_price_min'),
            'sell_price.min'      => __('product::validation.sell_price_min'),
            'stock_quantity.min'  => __('product::validation.stock_quantity_min'),
            'vehicles.*.exists'   => __('product::validation.vehicle_exists'),
        ];
    }
}
