<?php
// Modules/Core/Http/Controllers/UserManagementController.php

namespace Modules\Core\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Modules\Core\Http\Requests\CreateUserRequest;
use Modules\Core\Http\Requests\UpdateUserRequest;
use Modules\Core\Services\UserManagementService;
use Modules\Core\Http\Controllers\ModuleBaseController;
use Spatie\Permission\Models\Role;

class UserManagementController extends ModuleBaseController
{
  protected string $moduleName = 'Core';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-users';

  protected UserManagementService $userService;

  public function __construct(UserManagementService $userService)
  {
    $this->userService = $userService;
  }

  /**
   * Display a listing of users
   */
  public function index(Request $request)
  {
    $users = $this->userService->getPaginatedUsers($request);

    return $this->paginated($users, 'Users retrieved successfully');
  }

  /**
   * Store a newly created user
   */
  public function store(CreateUserRequest $request)
  {
    try {
      $user = $this->userService->createUser($request->validated());

      return $this->success($user, 'User created successfully', 201);
    } catch (\Exception $e) {
      return $this->error('Failed to create user', 500, $e->getMessage());
    }
  }

  /**
   * Sync users from CRM
   */
  public function syncFromCrm()
  {
    try {
      $result = $this->userService->syncFromCrm();
      return $this->success($result, 'Users synced from CRM successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Search CRM users
   */
  public function searchCrmUsers(Request $request)
  {
    $request->validate([
      'search' => 'required|string|min:2',
    ]);

    $users = $this->userService->searchCrmUsers($request->search);
    return $this->success($users, 'CRM users retrieved successfully');
  }

  /**
   * Display the specified user
   */
  public function show(int $id)
  {
    $user = $this->userService->getUserWithDetails($id);

    if (!$user) {
      return $this->error('User not found', 404);
    }

    return $this->success($user, 'User retrieved successfully');
  }

  /**
   * Update the specified user
   */
  public function update(UpdateUserRequest $request, int $id)
  {
    try {
      $user = $this->userService->updateUser($id, $request->validated());

      return $this->success($user, 'User updated successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to update user', 500, $e->getMessage());
    }
  }

  /**
   * Remove the specified user
   */
  public function destroy(int $id)
  {
    try {
      $this->userService->deleteUser($id);

      return $this->success(null, 'User deleted successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to delete user', 500, $e->getMessage());
    }
  }

  /**
   * Toggle user active status
   */
  public function toggleActive(int $id)
  {
    try {
      $user = $this->userService->toggleUserActive($id);

      return $this->success($user, 'User status updated successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to update user status', 500, $e->getMessage());
    }
  }

  /**
   * Assign roles to user
   */
  public function assignRoles(Request $request, int $id)
  {
    $request->validate([
      'roles' => 'required|array',
      'roles.*' => 'string|exists:roles,name',
    ]);

    try {
      $user = $this->userService->assignRoles($id, $request->roles);

      return $this->success($user, 'Roles assigned successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to assign roles', 500, $e->getMessage());
    }
  }

  /**
   * Assign permissions to user
   */
  public function assignPermissions(Request $request, int $id)
  {
    $request->validate([
      'permissions' => 'required|array',
      'permissions.*' => 'string|exists:permissions,name',
    ]);

    try {
      $user = $this->userService->assignPermissions($id, $request->permissions);

      return $this->success($user, 'Permissions assigned successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to assign permissions', 500, $e->getMessage());
    }
  }

  /**
   * Get user activity
   */
  public function activity(int $id)
  {
    $activities = $this->userService->getUserActivity($id);

    return $this->success($activities, 'User activity retrieved successfully');
  }
}
