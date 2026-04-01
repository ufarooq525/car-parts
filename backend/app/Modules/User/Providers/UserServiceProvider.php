<?php

namespace App\Modules\User\Providers;

use App\Core\Providers\ModuleServiceProvider;
use App\Models\User;
use App\Modules\User\Repositories\UserRepository;

class UserServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'User';
    }

    protected function registerRepositories(): void
    {
        $this->app->bind(UserRepository::class, fn () => new UserRepository(new User()));
    }
}
