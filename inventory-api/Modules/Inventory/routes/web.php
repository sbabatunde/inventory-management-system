<?php

use Illuminate\Support\Facades\Route;
use Modules\Inventory\app\Http\Controllers\InventoryController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('inventories', InventoryController::class)->names('inventory');
});
