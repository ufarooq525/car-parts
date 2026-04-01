<?php

namespace App\Modules\Category\Providers;

use App\Core\Providers\ModuleServiceProvider;
use App\Modules\Category\Models\Category;
use App\Modules\Category\Repositories\CategoryRepository;

class CategoryServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'Category';
    }

    protected function registerRepositories(): void
    {
        $this->app->bind(CategoryRepository::class, function ($app) {
            return new CategoryRepository(new Category());
        });
    }
}
