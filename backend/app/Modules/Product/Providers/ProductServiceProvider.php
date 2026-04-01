<?php

namespace App\Modules\Product\Providers;

use App\Core\Providers\ModuleServiceProvider;
use App\Modules\Product\Models\Product;
use App\Modules\Product\Repositories\ProductRepository;

class ProductServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'Product';
    }

    protected function registerRepositories(): void
    {
        $this->app->bind(ProductRepository::class, function () {
            return new ProductRepository(new Product());
        });
    }
}
