<?php

use Illuminate\Support\Facades\Route;
use Modules\ReleaseForm\app\Http\Controllers\ReleaseFormController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('releaseforms', ReleaseFormController::class)->names('releaseform');
});
