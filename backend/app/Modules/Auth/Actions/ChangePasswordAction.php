<?php

namespace App\Modules\Auth\Actions;

use App\Core\Exceptions\BusinessException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ChangePasswordAction
{
    /**
     * Validate current password and update to new one.
     *
     * @throws BusinessException
     */
    public function execute(User $user, array $data): void
    {
        if (! Hash::check($data['current_password'], $user->password)) {
            throw new BusinessException('messages.current_password_incorrect');
        }

        $user->update([
            'password' => $data['password'],
        ]);
    }
}
