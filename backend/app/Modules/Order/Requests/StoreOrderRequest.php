<?php

namespace App\Modules\Order\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_name'        => ['required', 'string', 'max:255'],
            'shipping_email'       => ['required', 'email', 'max:255'],
            'shipping_phone'       => ['required', 'string', 'max:50'],
            'shipping_address'     => ['required', 'string', 'max:500'],
            'shipping_city'        => ['required', 'string', 'max:255'],
            'shipping_postal_code' => ['required', 'string', 'max:20'],
            'shipping_country'     => ['required', 'string', 'max:100'],
            'billing_address'      => ['nullable', 'string', 'max:500'],
            'billing_city'         => ['nullable', 'string', 'max:255'],
            'billing_postal_code'  => ['nullable', 'string', 'max:20'],
            'billing_country'      => ['nullable', 'string', 'max:100'],
            'payment_method'       => ['required', 'in:card,paypal,mbway'],
            'notes'                => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_name.required'        => __('order::messages.shipping_name_required'),
            'shipping_email.required'       => __('order::messages.shipping_email_required'),
            'shipping_email.email'          => __('order::messages.shipping_email_invalid'),
            'shipping_phone.required'       => __('order::messages.shipping_phone_required'),
            'shipping_address.required'     => __('order::messages.shipping_address_required'),
            'shipping_city.required'        => __('order::messages.shipping_city_required'),
            'shipping_postal_code.required' => __('order::messages.shipping_postal_code_required'),
            'shipping_country.required'     => __('order::messages.shipping_country_required'),
            'payment_method.required'       => __('order::messages.payment_method_required'),
            'payment_method.in'             => __('order::messages.payment_method_invalid'),
        ];
    }
}
