<?php

use Illuminate\Support\Facades\Route;
use Modules\Integration\app\Http\Controllers\IntegrationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('integrations', IntegrationController::class)->names('integration');
});
