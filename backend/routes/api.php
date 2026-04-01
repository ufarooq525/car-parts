<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Module-specific routes are registered via their ModuleServiceProvider.
| Only global/shared API routes should go here.
|
*/

Route::get('/health', fn () => response()->json([
    'success' => true,
    'message' => 'API is running',
    'timestamp' => now()->toIso8601String(),
]));
