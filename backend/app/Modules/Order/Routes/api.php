<?php

use App\Modules\Order\Controllers\CartController;
use App\Modules\Order\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Order & Cart API Routes
|--------------------------------------------------------------------------
*/

// Customer routes (authenticated)
Route::middleware(['auth:sanctum'])->group(function () {

    // Orders
    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/my-orders', [OrderController::class, 'myOrders']);
        Route::get('/{order_number}', [OrderController::class, 'show']);
    });

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'show']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('/items/{item}', [CartController::class, 'removeItem']);
        Route::delete('/', [CartController::class, 'clear']);
    });
});

// Admin routes
Route::prefix('admin/orders')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::put('/{order}/status', [OrderController::class, 'updateStatus']);
});
