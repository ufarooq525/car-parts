<?php

namespace App\Modules\Supplier\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // User account fields
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],

            // Supplier company fields
            'company_name' => ['required', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],
            'business_license' => ['nullable', 'string', 'max:100'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:2000'],

            // Feed type info (optional — suppliers can set this up later)
            'feed_type' => ['nullable', 'in:api,xml,csv'],
            'api_url' => ['nullable', 'url'],
            'feed_url' => ['nullable', 'url'],
            'csv_file' => ['nullable', 'file', 'mimes:csv,txt', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Company name is required.',
            'contact_person.required' => 'Contact person name is required.',
            'feed_type.in' => 'Invalid feed type selected.',
            'csv_file.mimes' => 'Only CSV files are allowed.',
            'csv_file.max' => 'CSV file must be under 10MB.',
        ];
    }
}
