<?php

namespace App\Modules\Order\Providers;

use App\Core\Providers\ModuleServiceProvider;
use App\Modules\Order\Models\Cart;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Repositories\CartRepository;
use App\Modules\Order\Repositories\OrderRepository;

class OrderServiceProvider extends ModuleServiceProvider
{
    protected function getModuleName(): string
    {
        return 'Order';
    }

    protected function registerRepositories(): void
    {
        $this->app->bind(OrderRepository::class, fn () => new OrderRepository(new Order()));
        $this->app->bind(CartRepository::class, fn () => new CartRepository(new Cart()));
    }
}
