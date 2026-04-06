<?php

namespace App\Modules\Supplier\Actions;

use App\Models\User;
use App\Modules\Supplier\Models\Supplier;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegisterSupplierAction
{
    public function execute(array $data, ?UploadedFile $csvFile = null): array
    {
        return DB::transaction(function () use ($data, $csvFile) {
            // Handle CSV file upload
            $csvFilePath = null;
            $csvOriginalName = null;
            if ($csvFile) {
                $csvFilePath = $csvFile->store('supplier-feeds', 'public');
                $csvOriginalName = $csvFile->getClientOriginalName();
            }

            // Create the supplier record (pending approval)
            $supplier = Supplier::create([
                'name' => $data['company_name'],
                'code' => $this->generateCode($data['company_name']),
                'contact_person' => $data['contact_person'],
                'email' => $data['email'],
                'phone' => $data['company_phone'] ?? $data['phone'] ?? null,
                'website' => $data['website'] ?? null,
                'business_license' => $data['business_license'] ?? null,
                'tax_id' => $data['tax_id'] ?? null,
                'address' => $data['address'] ?? null,
                'description' => $data['description'] ?? null,
                'type' => $data['feed_type'] ?? 'none',
                'api_url' => $data['api_url'] ?? null,
                'feed_url' => $data['feed_url'] ?? null,
                'csv_file_path' => $csvFilePath,
                'csv_original_name' => $csvOriginalName,
                'is_active' => false,
                'approval_status' => 'pending',
            ]);

            // Create the user account with supplier role
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
                'role' => 'supplier',
                'is_active' => true,
                'supplier_id' => $supplier->id,
            ]);

            // Assign the supplier Spatie role
            $user->assignRole('supplier');

            // Create Sanctum token
            $token = $user->createToken('auth-token')->plainTextToken;

            return [
                'user' => $user,
                'supplier' => $supplier,
                'token' => $token,
            ];
        });
    }

    private function generateCode(string $companyName): string
    {
        $base = Str::upper(Str::slug(Str::limit($companyName, 10, ''), ''));
        $code = 'SUP-' . $base;

        // Ensure uniqueness
        $count = Supplier::withTrashed()->where('code', 'like', $code . '%')->count();
        if ($count > 0) {
            $code .= '-' . ($count + 1);
        }

        return $code;
    }
}
