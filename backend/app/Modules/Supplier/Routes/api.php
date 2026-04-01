<?php

use App\Modules\Supplier\Controllers\MarginRuleController;
use App\Modules\Supplier\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Supplier API Routes
|--------------------------------------------------------------------------
*/

// Admin supplier routes
Route::prefix('admin/suppliers')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', [SupplierController::class, 'index']);
    Route::get('/{supplier}', [SupplierController::class, 'show']);
    Route::post('/', [SupplierController::class, 'store']);
    Route::put('/{supplier}', [SupplierController::class, 'update']);
    Route::delete('/{supplier}', [SupplierController::class, 'destroy']);
    Route::post('/{supplier}/sync', [SupplierController::class, 'triggerSync']);
});

// Admin margin rule routes
Route::prefix('admin/margin-rules')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', [MarginRuleController::class, 'index']);
    Route::post('/', [MarginRuleController::class, 'store']);
    Route::put('/{marginRule}', [MarginRuleController::class, 'update']);
    Route::delete('/{marginRule}', [MarginRuleController::class, 'destroy']);
});
