<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('auth')->group(function () {
  // Public routes
  Route::post('/login', [AuthController::class, 'login']);
  Route::get('/methods', [AuthController::class, 'availableMethods']);

  // Protected routes
  Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Admin routes
    Route::middleware('permission:manage-auth-methods')->group(function () {
      Route::post('/toggle-method', [AuthController::class, 'toggleMethod']);
    });
  });
});
