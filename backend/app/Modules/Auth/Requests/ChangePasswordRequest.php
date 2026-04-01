<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => __('messages.current_password_required'),
            'password.required'         => __('messages.password_required'),
            'password.min'              => __('messages.password_min'),
            'password.confirmed'        => __('messages.password_confirmed'),
        ];
    }
}
