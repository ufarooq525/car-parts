<?php

namespace App\Modules\Auth\Providers;

use App\Core\Providers\ModuleServiceProvider;

class AuthServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'Auth';
    }
}
