<?php

namespace App\Modules\Category\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['nullable', 'string', 'max:255'],
            'parent_id'   => ['nullable', 'exists:categories,id', 'not_in:' . $this->route('category')],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'max:2048'],
            'is_active'   => ['nullable', 'boolean'],
            'is_visible'  => ['nullable', 'boolean'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max'         => __('category::validation.name_max'),
            'parent_id.exists' => __('category::validation.parent_id_exists'),
            'parent_id.not_in' => __('category::validation.parent_id_not_self'),
            'image.image'      => __('category::validation.image_invalid'),
            'image.max'        => __('category::validation.image_max'),
            'sort_order.min'   => __('category::validation.sort_order_min'),
        ];
    }
}
