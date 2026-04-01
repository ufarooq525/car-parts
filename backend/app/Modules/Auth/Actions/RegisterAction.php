<?php

namespace App\Modules\Auth\Actions;

use App\Models\User;
use App\Modules\Auth\Resources\AuthResource;

class RegisterAction
{
    /**
     * Create a new user with 'customer' role and generate a Sanctum token.
     */
    public function execute(array $data): array
    {
        $data['role'] = 'customer';

        $user = User::create($data);

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user'  => new AuthResource($user),
            'token' => $token,
        ];
    }
}
