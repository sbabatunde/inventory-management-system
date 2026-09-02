<?php

use Illuminate\Support\Facades\Route;
use Modules\ReleaseForm\app\Http\Controllers\ReleaseFormController;
use Modules\ReleaseForm\app\Http\Controllers\SignatoryController;

Route::middleware('auth:sanctum')->prefix('release-forms')->group(function () {
    Route::get('/', [ReleaseFormController::class, 'index'])->middleware('permission:view-release-forms');
    Route::post('/', [ReleaseFormController::class, 'store'])->middleware('permission:create-release-forms');
    Route::get('/summary', [ReleaseFormController::class, 'summary'])->middleware('permission:view-release-forms');
    Route::get('/pending-approvals', [ReleaseFormController::class, 'pendingApprovals'])->middleware('permission:approve-release-forms');
    Route::get('/pending-reconciliations', [ReleaseFormController::class, 'pendingReconciliations'])->middleware('permission:view-release-forms');
    Route::get('/categories', [ReleaseFormController::class, 'categories']);
    Route::get('/statuses', [ReleaseFormController::class, 'statuses']);
    Route::get('/destination-types', [ReleaseFormController::class, 'destinationTypes']);

    Route::get('/{id}', [ReleaseFormController::class, 'show'])->middleware('permission:view-release-forms');
    Route::put('/{id}', [ReleaseFormController::class, 'update'])->middleware('permission:edit-release-forms');
    Route::post('/{id}/submit', [ReleaseFormController::class, 'submitForApproval'])->middleware('permission:edit-release-forms');
    Route::post('/{id}/approve', [ReleaseFormController::class, 'approve'])->middleware('permission:approve-release-forms');
    Route::post('/{id}/dispatch', [ReleaseFormController::class, 'dispatch'])->middleware('permission:dispatch-release-forms');
    Route::post('/{id}/complete', [ReleaseFormController::class, 'complete'])->middleware('permission:edit-release-forms');
    Route::post('/{id}/reject', [ReleaseFormController::class, 'reject'])->middleware('permission:approve-release-forms');
    Route::post('/{id}/cancel', [ReleaseFormController::class, 'cancel'])->middleware('permission:edit-release-forms');
    Route::post('/{id}/reconcile', [ReleaseFormController::class, 'reconcile'])->middleware('permission:edit-release-forms');


    Route::prefix('signatories')->group(function () {
        Route::get('/form/{releaseFormId}', [SignatoryController::class, 'index']);
        Route::post('/form/{releaseFormId}', [SignatoryController::class, 'store']);
        Route::delete('/{signatoryId}', [SignatoryController::class, 'destroy']);
        Route::post('/{signatoryId}/sign', [SignatoryController::class, 'sign']);
        Route::get('/search-crm-users', [SignatoryController::class, 'searchCrmUsers']);
    });

    Route::post('/manual/create', [ReleaseFormController::class, 'createManual'])->middleware('permission:create-release-forms');
});
