<?php
// Modules/Core/app/Http/Controllers/ProfileController.php

namespace Modules\Core\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Modules\Core\Http\Requests\UpdateProfileRequest;
use Modules\Core\Http\Requests\UpdatePasswordRequest;
use Modules\Core\Services\ProfileService;

class ProfileController extends ModuleBaseController
{
  protected string $moduleName = 'Core';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-user';

  protected ProfileService $profileService;

  public function __construct(ProfileService $profileService)
  {
    $this->profileService = $profileService;
  }

  /**
   * Get current user profile
   */
  public function show(Request $request)
  {
    $user = $request->user()->load(['roles', 'permissions']);

    return $this->success([
      'user' => $user,
    ], 'Profile retrieved successfully');
  }

  /**
   * Update profile
   */
  public function update(UpdateProfileRequest $request)
  {
    try {
      $user = $this->profileService->updateProfile($request->user(), $request->validated());

      return $this->success([
        'user' => $user,
      ], 'Profile updated successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to update profile', 500, $e->getMessage());
    }
  }

  /**
   * Update password
   */
  public function updatePassword(UpdatePasswordRequest $request)
  {
    try {
      $this->profileService->updatePassword(
        $request->user(),
        $request->current_password,
        $request->new_password
      );

      return $this->success(null, 'Password updated successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Get user activity logs
   */
  public function activity(Request $request)
  {
    $activities = $this->profileService->getUserActivity($request->user());

    return $this->success($activities, 'Activity logs retrieved successfully');
  }
}
