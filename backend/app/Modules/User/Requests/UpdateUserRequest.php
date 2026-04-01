<?php

namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name'      => ['nullable', 'string', 'max:255'],
            'email'     => ['nullable', 'email', 'max:255', 'unique:users,email,' . $userId],
            'role'      => ['nullable', 'in:admin,staff,customer'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email'  => __('user::messages.email_invalid'),
            'email.unique' => __('user::messages.email_unique'),
            'role.in'      => __('user::messages.role_invalid'),
        ];
    }
}
