<?php
// Modules/Core/routes/api.php

use Illuminate\Support\Facades\Route;
use Modules\Core\Http\Controllers\DashboardController;
use Modules\Core\Http\Controllers\SettingsController;
use Modules\Core\Http\Controllers\NotificationController;
use Modules\Core\Http\Controllers\ProfileController;
use Modules\Core\Http\Controllers\UserManagementController;
use Modules\Core\Http\Controllers\ActivityLogController;

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activities', [DashboardController::class, 'recentActivities']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::get('/profile/activity', [ProfileController::class, 'activity']);

    // User Management
    Route::middleware('permission:view-users')->group(function () {
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::get('/users/{id}', [UserManagementController::class, 'show']);
        Route::get('/users/{id}/activity', [UserManagementController::class, 'activity']);
    });

    Route::middleware('permission:create-users')->group(function () {
        Route::post('/users', [UserManagementController::class, 'store']);
    });

    Route::middleware('permission:edit-users')->group(function () {
        Route::put('/users/{id}', [UserManagementController::class, 'update']);
        Route::post('/users/{id}/toggle-active', [UserManagementController::class, 'toggleActive']);
        Route::post('/users/{id}/roles', [UserManagementController::class, 'assignRoles']);
        Route::post('/users/{id}/permissions', [UserManagementController::class, 'assignPermissions']);
    });

    Route::middleware('permission:delete-users')->group(function () {
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
    });

    // Activity Logs
    Route::middleware('permission:view-audit-logs')->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/{id}', [ActivityLogController::class, 'show']);
        Route::get('/activity-logs/user/{userId}', [ActivityLogController::class, 'userActivity']);
        Route::get('/activity-logs/export', [ActivityLogController::class, 'export']);
    });

    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'update']);
    Route::get('/settings/{key}', [SettingsController::class, 'show']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});

Route::middleware('permission:create-users')->group(function () {
    Route::post('/users/sync-from-crm', [UserManagementController::class, 'syncFromCrm']);
});

Route::middleware('permission:view-users')->group(function () {
    Route::get('/users/search-crm-users', [UserManagementController::class, 'searchCrmUsers']);
});
