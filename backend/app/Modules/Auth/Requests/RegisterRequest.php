<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone'    => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => __('messages.name_required'),
            'email.required'    => __('messages.email_required'),
            'email.email'       => __('messages.email_invalid'),
            'email.unique'      => __('messages.email_unique'),
            'password.required' => __('messages.password_required'),
            'password.min'      => __('messages.password_min'),
            'password.confirmed' => __('messages.password_confirmed'),
        ];
    }
}
