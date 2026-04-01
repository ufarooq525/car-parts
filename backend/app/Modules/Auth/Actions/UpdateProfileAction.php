<?php

namespace App\Modules\Auth\Actions;

use App\Models\User;

class UpdateProfileAction
{
    /**
     * Update user name, email, and phone.
     */
    public function execute(User $user, array $data): User
    {
        $user->update(array_filter($data, fn ($value) => $value !== null));

        return $user->refresh();
    }
}
