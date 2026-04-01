<?php

namespace App\Modules\Supplier\Providers;

use App\Core\Providers\ModuleServiceProvider;
use App\Modules\Supplier\Models\MarginRule;
use App\Modules\Supplier\Models\Supplier;
use App\Modules\Supplier\Models\SyncLog;
use App\Modules\Supplier\Repositories\MarginRuleRepository;
use App\Modules\Supplier\Repositories\SupplierRepository;
use App\Modules\Supplier\Repositories\SyncLogRepository;

class SupplierServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'Supplier';
    }

    protected function registerRepositories(): void
    {
        $this->app->bind(SupplierRepository::class, fn () => new SupplierRepository(new Supplier()));
        $this->app->bind(MarginRuleRepository::class, fn () => new MarginRuleRepository(new MarginRule()));
        $this->app->bind(SyncLogRepository::class, fn () => new SyncLogRepository(new SyncLog()));
    }
}
