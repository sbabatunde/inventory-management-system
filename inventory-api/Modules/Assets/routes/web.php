<?php

use Illuminate\Support\Facades\Route;
use Modules\Assets\app\Http\Controllers\AssetsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('assets', AssetsController::class)->names('assets');
});
