<?php
// Modules/Core/Services/ProfileService.php

namespace Modules\Core\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity;

class ProfileService
{
  /**
   * Update user profile
   */
  public function updateProfile(User $user, array $data): User
  {
    return DB::transaction(function () use ($user, $data) {
      $user->update($data);

      // Log activity
      activity()
        ->performedOn($user)
        ->causedBy($user)
        ->withProperties($data)
        ->log('updated profile');

      return $user->fresh(['roles', 'permissions']);
    });
  }

  /**
   * Update user password
   */
  public function updatePassword(User $user, string $currentPassword, string $newPassword): void
  {
    if (!Hash::check($currentPassword, $user->password)) {
      throw new \Exception('Current password is incorrect');
    }

    DB::transaction(function () use ($user, $newPassword) {
      $user->password = Hash::make($newPassword);
      $user->save();

      // Log activity
      activity()
        ->performedOn($user)
        ->causedBy($user)
        ->log('changed password');
    });
  }

  /**
   * Get user activity
   */
  public function getUserActivity(User $user)
  {
    return Activity::where('causer_id', $user->id)
      ->with('subject')
      ->latest()
      ->paginate(20);
  }
}
