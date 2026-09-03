<?php

use Illuminate\Support\Facades\Route;
use Modules\Integration\app\Http\Controllers\IntegrationController;
use Modules\Integration\app\Http\Controllers\TicketController;
use Modules\Integration\app\Http\Controllers\CrmUserController;
use Modules\Integration\app\Http\Controllers\JobOrderController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('integrations', IntegrationController::class)->names('integration');
});


Route::middleware('auth:sanctum')->prefix('v1/integration')->group(function () {
    // Job Orders
    Route::prefix('job-orders')->group(function () {
        Route::get('/by-client', [JobOrderController::class, 'byClient']);
        Route::get('/{id}', [JobOrderController::class, 'show']);
    });

    // Tickets
    Route::prefix('tickets')->group(function () {
        Route::get('/by-client', [TicketController::class, 'byClient']);
        Route::get('/{id}', [TicketController::class, 'show']);
    });

    // CRM Users
    Route::prefix('users')->group(function () {
        Route::get('/', [CrmUserController::class, 'index']);
        Route::get('/search', [CrmUserController::class, 'search']);
        Route::get('/{id}', [CrmUserController::class, 'show']);
    });
});
