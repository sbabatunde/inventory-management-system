<?php
// Modules/Core/app/Http/Controllers/ActivityLogController.php

namespace Modules\Core\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use App\Models\User;

class ActivityLogController extends ModuleBaseController
{
  protected string $moduleName = 'Core';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-clock-rotate';

  /**
   * Get all activity logs
   */
  public function index(Request $request)
  {
    $activities = Activity::with('causer')
      ->when($request->search, function ($query, $search) {
        return $query->where('description', 'like', "%{$search}%");
      })
      ->when($request->user_id, function ($query, $userId) {
        return $query->where('causer_id', $userId);
      })
      ->when($request->action, function ($query, $action) {
        return $query->where('description', 'like', "%{$action}%");
      })
      ->when($request->date_from, function ($query, $dateFrom) {
        return $query->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($request->date_to, function ($query, $dateTo) {
        return $query->whereDate('created_at', '<=', $dateTo);
      })
      ->latest()
      ->paginate($request->per_page ?? 20);

    return $this->success($activities, 'Activity logs retrieved successfully');
  }

  /**
   * Get activity log details
   */
  public function show(int $id)
  {
    $activity = Activity::with('causer', 'subject')->findOrFail($id);

    return $this->success($activity, 'Activity log retrieved successfully');
  }

  /**
   * Get activity logs for a specific user
   */
  public function userActivity(int $userId)
  {
    $user = User::findOrFail($userId);

    $activities = Activity::where('causer_id', $userId)
      ->with('subject')
      ->latest()
      ->paginate(20);

    return $this->success([
      'user' => $user,
      'activities' => $activities,
    ], 'User activity retrieved successfully');
  }

  /**
   * Export activity logs
   */
  public function export(Request $request)
  {
    $activities = Activity::with('causer')
      ->when($request->date_from, function ($query, $dateFrom) {
        return $query->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($request->date_to, function ($query, $dateTo) {
        return $query->whereDate('created_at', '<=', $dateTo);
      })
      ->latest()
      ->get();

    // Return as JSON for now - can be extended for Excel/PDF export
    return $this->success($activities, 'Activity logs exported successfully');
  }
}
