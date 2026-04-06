<?php

use App\Modules\Supplier\Controllers\MarginRuleController;
use App\Modules\Supplier\Controllers\SupplierApprovalController;
use App\Modules\Supplier\Controllers\SupplierAuthController;
use App\Modules\Supplier\Controllers\SupplierController;
use App\Modules\Supplier\Controllers\SupplierDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Supplier API Routes
|--------------------------------------------------------------------------
*/

// Public: Supplier registration & sample CSV download
Route::post('/supplier/register', [SupplierAuthController::class, 'register']);
Route::get('/supplier/sample-csv', function () {
    $path = storage_path('app/samples/car-parts-sample.csv');
    if (!file_exists($path)) {
        return response()->json(['message' => 'Sample file not found.'], 404);
    }
    return response()->download($path, 'car-parts-sample.csv', [
        'Content-Type' => 'text/csv',
    ]);
});

// Supplier portal routes (authenticated supplier users)
Route::prefix('supplier')->middleware(['auth:sanctum', 'role:supplier'])->group(function () {
    Route::get('/dashboard', [SupplierDashboardController::class, 'dashboard']);
    Route::get('/products', [SupplierDashboardController::class, 'products']);
    Route::get('/sync-logs', [SupplierDashboardController::class, 'syncLogs']);
    Route::post('/feed', [SupplierDashboardController::class, 'updateFeed']);
    Route::put('/profile', [SupplierDashboardController::class, 'updateProfile']);
});

// Admin supplier management routes
Route::prefix('admin/suppliers')->middleware(['auth:sanctum', 'role:admin|staff'])->group(function () {
    Route::get('/', [SupplierController::class, 'index']);
    Route::get('/{supplier}', [SupplierController::class, 'show']);
    Route::post('/', [SupplierController::class, 'store']);
    Route::put('/{supplier}', [SupplierController::class, 'update']);
    Route::delete('/{supplier}', [SupplierController::class, 'destroy']);
    Route::post('/{supplier}/sync', [SupplierController::class, 'triggerSync']);
});

// Admin supplier approval routes
Route::prefix('admin/supplier-approvals')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/', [SupplierApprovalController::class, 'pendingList']);
    Route::post('/{id}/review', [SupplierApprovalController::class, 'markUnderReview']);
    Route::post('/{id}/approve', [SupplierApprovalController::class, 'approve']);
    Route::post('/{id}/reject', [SupplierApprovalController::class, 'reject']);
});

// Admin margin rule routes
Route::prefix('admin/margin-rules')->middleware(['auth:sanctum', 'role:admin|staff'])->group(function () {
    Route::get('/', [MarginRuleController::class, 'index']);
    Route::post('/', [MarginRuleController::class, 'store']);
    Route::put('/{marginRule}', [MarginRuleController::class, 'update']);
    Route::delete('/{marginRule}', [MarginRuleController::class, 'destroy']);
});
