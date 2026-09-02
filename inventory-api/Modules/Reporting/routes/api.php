<?php

use Illuminate\Support\Facades\Route;
use Modules\Reporting\app\Http\Controllers\ReportingController as ReportController;

Route::middleware('auth:sanctum')->prefix('reports')->group(function () {
    Route::get('/cost-breakdown', [ReportController::class, 'costBreakdown']);
    Route::get('/inventory', [ReportController::class, 'inventoryReport']);
    Route::get('/stock-movement', [ReportController::class, 'stockMovement']);
    Route::get('/low-stock', [ReportController::class, 'lowStock']);
    Route::get('/supplier-performance', [ReportController::class, 'supplierPerformance']);
    Route::post('/export', [ReportController::class, 'export']);
});
