<?php

use Illuminate\Support\Facades\Route;
use Modules\Procurement\app\Http\Controllers\GoodsReceiptController;
use Modules\Procurement\app\Http\Controllers\ProcurementController;
use Modules\Procurement\app\Http\Controllers\SupplierController;
use Modules\Procurement\app\Http\Controllers\PurchaseOrderController;
use Modules\Procurement\app\Http\Controllers\PurchaseRequisitionController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('procurements', ProcurementController::class)->names('procurement');
});

Route::middleware('auth:sanctum')->prefix('v1/procurement')->group(function () {
    // Supplier routes
    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->middleware('permission:view-suppliers');
        Route::post('/', [SupplierController::class, 'store'])->middleware('permission:create-suppliers');
        Route::get('/{id}', [SupplierController::class, 'show'])->middleware('permission:view-suppliers');
        Route::put('/{id}', [SupplierController::class, 'update'])->middleware('permission:edit-suppliers');
        Route::delete('/{id}', [SupplierController::class, 'destroy'])->middleware('permission:delete-suppliers');
        Route::post('/{id}/toggle-active', [SupplierController::class, 'toggleActive'])->middleware('permission:edit-suppliers');
    });

    // Purchase Requisition routes
    Route::prefix('v1/purchase-requisitions')->group(function () {
        Route::get('/', [PurchaseRequisitionController::class, 'index'])->middleware('permission:view-purchase-requisitions');
        Route::post('/', [PurchaseRequisitionController::class, 'store'])->middleware('permission:create-purchase-requisitions');
        Route::get('/pending-approvals', [PurchaseRequisitionController::class, 'pendingApprovals'])->middleware('permission:approve-purchase-requisitions');
        Route::get('/{id}', [PurchaseRequisitionController::class, 'show'])->middleware('permission:view-purchase-requisitions');
        Route::put('/{id}', [PurchaseRequisitionController::class, 'update'])->middleware('permission:edit-purchase-requisitions');
        Route::post('/{id}/submit', [PurchaseRequisitionController::class, 'submitForApproval'])->middleware('permission:edit-purchase-requisitions');
        Route::post('/{id}/approve', [PurchaseRequisitionController::class, 'approve'])->middleware('permission:approve-purchase-requisitions');
        Route::post('/{id}/reject', [PurchaseRequisitionController::class, 'reject'])->middleware('permission:approve-purchase-requisitions');
        Route::post('/{id}/cancel', [PurchaseRequisitionController::class, 'cancel'])->middleware('permission:edit-purchase-requisitions');
    });

    // Purchase Order routes
    Route::prefix('v1/purchase-orders')->group(function () {
        Route::get('/', [PurchaseOrderController::class, 'index'])->middleware('permission:view-purchase-orders');
        Route::post('/', [PurchaseOrderController::class, 'store'])->middleware('permission:create-purchase-orders');
        Route::get('/{id}', [PurchaseOrderController::class, 'show'])->middleware('permission:view-purchase-orders');
        Route::post('/{id}/send', [PurchaseOrderController::class, 'send'])->middleware('permission:edit-purchase-orders');
        Route::post('/{id}/receive', [PurchaseOrderController::class, 'receive'])->middleware('permission:receive-goods');
        Route::post('/{id}/cancel', [PurchaseOrderController::class, 'cancel'])->middleware('permission:edit-purchase-orders');
    });

    // Goods Receipt routes
    Route::prefix('v1/goods-receipts')->group(function () {
        Route::get('/', [GoodsReceiptController::class, 'index'])->middleware('permission:view-purchase-orders');
        Route::post('/', [GoodsReceiptController::class, 'store'])->middleware('permission:receive-goods');
        Route::get('/{id}', [GoodsReceiptController::class, 'show'])->middleware('permission:view-purchase-orders');
    });
});
