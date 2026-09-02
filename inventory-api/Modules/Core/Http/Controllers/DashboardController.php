<?php
// Modules/Core/Http/Controllers/DashboardController.php

namespace Modules\Core\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class DashboardController extends ModuleBaseController
{
  protected string $moduleName = 'Core';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-gauge';

  /**
   * Get dashboard statistics
   */
  public function stats(Request $request)
  {
    $stats = [
      [
        'label' => 'Total Users',
        'value' => User::count(),
        'icon' => 'fa-users',
        'color' => 'blue',
      ],
      [
        'label' => 'Active Users',
        'value' => User::where('is_active', true)->count(),
        'icon' => 'fa-user-check',
        'color' => 'green',
      ],
      [
        'label' => 'New Users (30d)',
        'value' => User::where('created_at', '>=', now()->subDays(30))->count(),
        'icon' => 'fa-user-plus',
        'color' => 'purple',
      ],
      [
        'label' => 'Notifications',
        'value' => Notification::count(),
        'icon' => 'fa-bell',
        'color' => 'amber',
      ],
    ];

    return $this->moduleSuccess($stats, 'Dashboard statistics retrieved');
  }

  /**
   * Get recent activities
   */
  public function recentActivities(Request $request)
  {
    $activities = DB::table('activity_log')
      ->join('users', 'activity_log.causer_id', '=', 'users.id')
      ->select(
        'activity_log.id',
        'activity_log.description',
        'activity_log.created_at',
        'users.name as user_name'
      )
      ->latest('activity_log.created_at')
      ->limit(10)
      ->get();

    return $this->moduleSuccess($activities, 'Recent activities retrieved');
  }
}
