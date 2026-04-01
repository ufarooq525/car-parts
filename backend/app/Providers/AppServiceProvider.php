<?php

namespace App\Providers;

use App\Modules\Auth\Providers\AuthServiceProvider;
use App\Modules\Category\Providers\CategoryServiceProvider;
use App\Modules\Product\Providers\ProductServiceProvider;
use App\Modules\Supplier\Providers\SupplierServiceProvider;
use App\Modules\Order\Providers\OrderServiceProvider;
use App\Modules\User\Providers\UserServiceProvider;
use App\Modules\Vehicle\Providers\VehicleServiceProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Module service providers.
     */
    protected array $moduleProviders = [
        AuthServiceProvider::class,
        CategoryServiceProvider::class,
        ProductServiceProvider::class,
        SupplierServiceProvider::class,
        OrderServiceProvider::class,
        VehicleServiceProvider::class,
        UserServiceProvider::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        foreach ($this->moduleProviders as $provider) {
            $this->app->register($provider);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
