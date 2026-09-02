<?php
// Modules/Core/app/Http/Controllers/NotificationController.php

namespace Modules\Core\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends ModuleBaseController
{
  protected string $moduleName = 'Core';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-bell';

  /**
   * Get user notifications
   */
  public function index(Request $request)
  {
    $user = $this->getAuthUser();

    $notifications = Notification::where('user_id', $user->id)
      ->when($request->input('type'), function ($query, $type) {
        return $query->where('type', $type);
      })
      ->when($request->boolean('unread_only'), function ($query) {
        return $query->unread();
      })
      ->latest()
      ->paginate($request->input('per_page', 15));

    return $this->paginated($notifications, 'Notifications retrieved');
  }

  /**
   * Mark notification as read
   */
  public function markAsRead(int $id)
  {
    $notification = Notification::findOrFail($id);

    if ($notification->user_id !== $this->getAuthUser()->id) {
      return $this->error('Unauthorized', 403);
    }

    $notification->markAsRead();

    return $this->moduleSuccess(null, 'Notification marked as read');
  }

  /**
   * Mark all notifications as read
   */
  public function markAllAsRead()
  {
    $user = $this->getAuthUser();

    Notification::where('user_id', $user->id)
      ->unread()
      ->update([
        'is_read' => true,
        'read_at' => now(),
      ]);

    return $this->moduleSuccess(null, 'All notifications marked as read');
  }
}
