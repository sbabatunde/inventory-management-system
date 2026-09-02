<?php
// Modules/Inventory/routes/api.php (Updated)

use Illuminate\Support\Facades\Route;
use Modules\Inventory\app\Http\Controllers\StockAdjustmentController;
use Modules\Inventory\app\Http\Controllers\StockBalanceController;
use Modules\Inventory\app\Http\Controllers\StockItemController;
use Modules\Inventory\app\Http\Controllers\StockMovementController;
use Modules\Inventory\app\Http\Controllers\StockSerialController;
use Modules\Inventory\app\Http\Controllers\StockTransferController;
use Modules\Inventory\app\Http\Controllers\StoreController;

Route::middleware('auth:sanctum')->prefix('inventory')->group(function () {
    // Store routes
    Route::prefix('stores')->group(function () {
        Route::get('/', [StoreController::class, 'index'])->middleware('permission:view-stores');
        Route::post('/', [StoreController::class, 'store'])->middleware('permission:create-stores');
        Route::get('/types', [StoreController::class, 'types']);
        Route::get('/{id}', [StoreController::class, 'show'])->middleware('permission:view-stores');
        Route::put('/{id}', [StoreController::class, 'update'])->middleware('permission:edit-stores');
        Route::delete('/{id}', [StoreController::class, 'destroy'])->middleware('permission:delete-stores');
        Route::post('/{id}/toggle-active', [StoreController::class, 'toggleActive'])->middleware('permission:edit-stores');
        Route::get('/{id}/stock', [StoreController::class, 'getStock'])->middleware('permission:view-stock');
    });

    // Stock Item routes
    Route::prefix('stock-items')->group(function () {
        Route::get('/', [StockItemController::class, 'index'])->middleware('permission:view-stock-items');
        Route::post('/', [StockItemController::class, 'store'])->middleware('permission:create-stock-items');
        Route::get('/natures', [StockItemController::class, 'natures']);
        Route::get('/{id}', [StockItemController::class, 'show'])->middleware('permission:view-stock-items');
        Route::put('/{id}', [StockItemController::class, 'update'])->middleware('permission:edit-stock-items');
        Route::delete('/{id}', [StockItemController::class, 'destroy'])->middleware('permission:delete-stock-items');
        Route::get('/{id}/balance', [StockItemController::class, 'getBalance'])->middleware('permission:view-stock');
        Route::get('/{id}/serials', [StockItemController::class, 'getSerials'])->middleware('permission:view-stock');
    });

    // Stock Balance routes
    Route::prefix('stock-balances')->group(function () {
        Route::get('/', [StockBalanceController::class, 'index'])->middleware('permission:view-stock');
        Route::get('/low-stock', [StockBalanceController::class, 'lowStock'])->middleware('permission:view-stock');
        Route::get('/summary', [StockBalanceController::class, 'summary'])->middleware('permission:view-stock');
    });

    // Stock Transfer routes
    Route::prefix('stock-transfers')->group(function () {
        Route::get('/', [StockTransferController::class, 'index'])->middleware('permission:view-stock-transfers');
        Route::post('/', [StockTransferController::class, 'store'])->middleware('permission:create-stock-transfers');
        Route::get('/{id}', [StockTransferController::class, 'show'])->middleware('permission:view-stock-transfers');
        Route::post('/{id}/approve', [StockTransferController::class, 'approve'])->middleware('permission:approve-stock-transfers');
        Route::post('/{id}/receive', [StockTransferController::class, 'receive'])->middleware('permission:receive-stock-transfers');
        Route::post('/{id}/cancel', [StockTransferController::class, 'cancel'])->middleware('permission:cancel-stock-transfers');
    });

    // Stock Adjustment routes
    Route::prefix('stock-adjustments')->group(function () {
        Route::get('/', [StockAdjustmentController::class, 'index'])->middleware('permission:view-stock-adjustments');
        Route::post('/', [StockAdjustmentController::class, 'store'])->middleware('permission:create-stock-adjustments');
        Route::get('/{id}', [StockAdjustmentController::class, 'show'])->middleware('permission:view-stock-adjustments');
        Route::post('/{id}/approve', [StockAdjustmentController::class, 'approve'])->middleware('permission:approve-stock-adjustments');
        Route::post('/{id}/reject', [StockAdjustmentController::class, 'reject'])->middleware('permission:approve-stock-adjustments');
    });

    // Stock Serial routes
    Route::prefix('stock-serials')->group(function () {
        Route::get('/', [StockSerialController::class, 'index'])->middleware('permission:view-stock');
        Route::post('/', [StockSerialController::class, 'store'])->middleware('permission:create-stock-items');
        Route::get('/{id}', [StockSerialController::class, 'show'])->middleware('permission:view-stock');
        Route::post('/{id}/status', [StockSerialController::class, 'updateStatus'])->middleware('permission:edit-stock-items');
        Route::get('/{id}/history', [StockSerialController::class, 'history'])->middleware('permission:view-stock');
        Route::get('/store/{storeId}', [StockSerialController::class, 'byStore'])->middleware('permission:view-stock');
    });

    // Stock Movement routes
    Route::prefix('stock-movements')->group(function () {
        Route::get('/', [StockMovementController::class, 'index'])->middleware('permission:view-stock');
        Route::get('/types', [StockMovementController::class, 'types']);
        Route::get('/summary', [StockMovementController::class, 'summary'])->middleware('permission:view-stock');
        Route::get('/{id}', [StockMovementController::class, 'show'])->middleware('permission:view-stock');
        Route::get('/item/{stockItemId}', [StockMovementController::class, 'byItem'])->middleware('permission:view-stock');
        Route::get('/serial/{stockSerialId}', [StockMovementController::class, 'bySerial'])->middleware('permission:view-stock');
        Route::get('/store/{storeId}', [StockMovementController::class, 'byStore'])->middleware('permission:view-stock');
    });
});
