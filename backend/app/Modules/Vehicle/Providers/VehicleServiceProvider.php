<?php

namespace App\Modules\Vehicle\Providers;

use App\Core\Providers\ModuleServiceProvider;
use App\Modules\Vehicle\Models\Vehicle;
use App\Modules\Vehicle\Repositories\VehicleRepository;

class VehicleServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'Vehicle';
    }

    protected function registerRepositories(): void
    {
        $this->app->bind(VehicleRepository::class, fn () => new VehicleRepository(new Vehicle()));
    }
}
