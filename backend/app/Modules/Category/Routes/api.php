<?php

use App\Modules\Category\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Category API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/tree', [CategoryController::class, 'tree']);
    Route::get('/{slug}', [CategoryController::class, 'show']);
});

// Admin routes
Route::prefix('admin/categories')->middleware(['auth:sanctum', 'role:admin|staff'])->group(function () {
    Route::post('/', [CategoryController::class, 'store']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
});
