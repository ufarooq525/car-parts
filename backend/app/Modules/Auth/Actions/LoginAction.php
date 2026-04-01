<?php

namespace App\Modules\Auth\Actions;

use App\Models\User;
use App\Modules\Auth\Resources\AuthResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginAction
{
    /**
     * Validate credentials and create a Sanctum token.
     */
    public function execute(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('messages.invalid_credentials')],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user'  => new AuthResource($user),
            'token' => $token,
        ];
    }
}
