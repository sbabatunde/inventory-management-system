<?php

use Illuminate\Support\Facades\Route;
use Modules\Assets\app\Http\Controllers\AssetsController as AssetController;

Route::middleware('auth:sanctum')->prefix('assets')->group(function () {
  Route::get('/', [AssetController::class, 'index'])->middleware('permission:view-assets');
  Route::post('/', [AssetController::class, 'store'])->middleware('permission:create-assets');
  Route::get('/summary', [AssetController::class, 'summary'])->middleware('permission:view-assets');
  Route::get('/types', [AssetController::class, 'types']);
  Route::get('/statuses', [AssetController::class, 'statuses']);
  Route::get('/depreciation-methods', [AssetController::class, 'depreciationMethods']);
  Route::get('/{id}', [AssetController::class, 'show'])->middleware('permission:view-assets');
  Route::put('/{id}', [AssetController::class, 'update'])->middleware('permission:edit-assets');
  Route::delete('/{id}', [AssetController::class, 'destroy'])->middleware('permission:delete-assets');
  Route::post('/{id}/assign', [AssetController::class, 'assign'])->middleware('permission:assign-assets');
  Route::post('/{id}/unassign', [AssetController::class, 'unassign'])->middleware('permission:assign-assets');
  Route::post('/{id}/status', [AssetController::class, 'updateStatus'])->middleware('permission:edit-assets');
  Route::post('/{id}/depreciation', [AssetController::class, 'calculateDepreciation'])->middleware('permission:view-assets');
});