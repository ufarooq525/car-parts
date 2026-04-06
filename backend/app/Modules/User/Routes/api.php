<?php

use App\Modules\User\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Admin API Routes
|--------------------------------------------------------------------------
*/

// Admin routes
Route::prefix('admin/users')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});
