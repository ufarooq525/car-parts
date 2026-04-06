<?php

use App\Modules\Vehicle\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Vehicle API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('vehicles')->group(function () {
    Route::get('/', [VehicleController::class, 'index']);
    Route::get('/makes', [VehicleController::class, 'makes']);
    Route::get('/makes/{make}/models', [VehicleController::class, 'models']);
    Route::get('/makes/{make}/models/{model}/years', [VehicleController::class, 'years']);
    Route::get('/{slug}', [VehicleController::class, 'show']);
});

// Admin routes
Route::prefix('admin/vehicles')->middleware(['auth:sanctum', 'role:admin|staff'])->group(function () {
    Route::post('/', [VehicleController::class, 'store']);
    Route::put('/{vehicle}', [VehicleController::class, 'update']);
    Route::delete('/{vehicle}', [VehicleController::class, 'destroy']);
});
