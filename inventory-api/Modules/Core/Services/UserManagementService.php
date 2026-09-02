<?php
// Modules/Core/app/Services/UserManagementService.php

namespace Modules\Core\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Modules\Integration\app\Services\CrmUserService;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

class UserManagementService
{
  protected CrmUserService $crmUserService;

  public function __construct(CrmUserService $crmUserService)
  {
    $this->crmUserService = $crmUserService;
  }

  /**
   * Get paginated users with filters
   */
  public function getPaginatedUsers(Request $request)
  {
    $query = User::with('roles')
      ->withCount('notifications as unread_notifications')
      ->when($request->search, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->orWhere('crm_user_id', 'like', "%{$search}%");
        });
      })
      ->when($request->status, function ($q, $status) {
        return $q->where('is_active', $status === 'active');
      })
      ->when($request->role, function ($q, $role) {
        return $q->whereHas('roles', function ($query) use ($role) {
          $query->where('name', $role);
        });
      })
      ->when($request->sort, function ($q, $sort) {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');
        return $q->orderBy($column, $direction);
      }, function ($q) {
        return $q->latest();
      });

    return $query->paginate($request->per_page ?? 15);
  }

  /**
   * Create new user
   */
  public function createUser(array $data): User
  {
    return DB::transaction(function () use ($data) {
      $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
        'is_active' => $data['is_active'] ?? true,
        'email_verified_at' => now(),
      ]);

      if (isset($data['roles'])) {
        $user->assignRole($data['roles']);
      }

      if (isset($data['permissions'])) {
        $user->givePermissionTo($data['permissions']);
      }

      // Log activity
      activity()
        ->performedOn($user)
        ->causedBy(auth()->user())
        ->withProperties(['roles' => $data['roles'] ?? []])
        ->log('created');

      return $user;
    });
  }

  /**
   * Sync users from CRM
   */
  public function syncFromCrm(): array
  {
    $crmUsers = $this->crmUserService->getUsers();

    if (!$crmUsers) {
      throw new \Exception('Failed to fetch users from CRM');
    }

    $synced = 0;
    $created = 0;
    $updated = 0;

    foreach ($crmUsers as $crmUser) {
      $user = User::where('crm_user_id', $crmUser['id'])->first();

      if (!$user) {
        // Check by email
        $user = User::where('email', $crmUser['email'])->first();
      }

      if ($user) {
        // Update existing user
        $user->update([
          'crm_user_id' => $crmUser['id'],
          'name' => $crmUser['name'],
          'email' => $crmUser['email'] ?? $user->email,
          'is_active' => $crmUser['is_active'] ?? true,
          'last_synced_at' => now(),
        ]);
        $updated++;
      } else {
        // Create new user
        User::create([
          'crm_user_id' => $crmUser['id'],
          'name' => $crmUser['name'],
          'email' => $crmUser['email'],
          'password' => Hash::make(uniqid('crm_', true)),
          'is_active' => $crmUser['is_active'] ?? true,
          'email_verified_at' => now(),
          'last_synced_at' => now(),
        ]);
        $created++;
      }
      $synced++;
    }

    // Log activity
    activity()
      ->causedBy(auth()->user())
      ->withProperties([
        'synced' => $synced,
        'created' => $created,
        'updated' => $updated,
      ])
      ->log('synced users from CRM');

    return [
      'total_synced' => $synced,
      'created' => $created,
      'updated' => $updated,
    ];
  }

  /**
   * Search CRM users
   */
  public function searchCrmUsers(string $search): array
  {
    return $this->crmUserService->searchUsers($search) ?? [];
  }

  /**
   * Get user with details
   */
  public function getUserWithDetails(int $id): ?User
  {
    return User::with(['roles', 'permissions', 'crmTokens'])
      ->withCount('notifications as unread_notifications')
      ->find($id);
  }

  /**
   * Update user
   */
  public function updateUser(int $id, array $data): User
  {
    return DB::transaction(function () use ($id, $data) {
      $user = User::findOrFail($id);

      $user->update([
        'name' => $data['name'] ?? $user->name,
        'email' => $data['email'] ?? $user->email,
        'is_active' => $data['is_active'] ?? $user->is_active,
      ]);

      if (isset($data['password'])) {
        $user->password = Hash::make($data['password']);
        $user->save();
      }

      if (isset($data['roles'])) {
        $user->syncRoles($data['roles']);
      }

      if (isset($data['permissions'])) {
        $user->syncPermissions($data['permissions']);
      }

      // Log activity
      activity()
        ->performedOn($user)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('updated');

      return $user->fresh(['roles', 'permissions']);
    });
  }

  /**
   * Delete user
   */
  public function deleteUser(int $id): void
  {
    DB::transaction(function () use ($id) {
      $user = User::findOrFail($id);

      // Don't allow deleting yourself
      if ($user->id === auth()->id()) {
        throw new \Exception('You cannot delete your own account');
      }

      // Log before deleting
      activity()
        ->performedOn($user)
        ->causedBy(auth()->user())
        ->log('deleted');

      $user->delete();
    });
  }

  /**
   * Toggle user active status
   */
  public function toggleUserActive(int $id): User
  {
    $user = User::findOrFail($id);

    // Don't allow deactivating yourself
    if ($user->id === auth()->id()) {
      throw new \Exception('You cannot deactivate your own account');
    }

    $user->is_active = !$user->is_active;
    $user->save();

    // Log activity
    activity()
      ->performedOn($user)
      ->causedBy(auth()->user())
      ->withProperties(['is_active' => $user->is_active])
      ->log($user->is_active ? 'activated' : 'deactivated');

    return $user;
  }

  /**
   * Assign roles to user
   */
  public function assignRoles(int $id, array $roles): User
  {
    $user = User::findOrFail($id);
    $user->syncRoles($roles);

    // Log activity
    activity()
      ->performedOn($user)
      ->causedBy(auth()->user())
      ->withProperties(['roles' => $roles])
      ->log('roles assigned');

    return $user->fresh('roles');
  }

  /**
   * Assign permissions to user
   */
  public function assignPermissions(int $id, array $permissions): User
  {
    $user = User::findOrFail($id);
    $user->syncPermissions($permissions);

    // Log activity
    activity()
      ->performedOn($user)
      ->causedBy(auth()->user())
      ->withProperties(['permissions' => $permissions])
      ->log('permissions assigned');

    return $user->fresh('permissions');
  }

  /**
   * Get user activity
   */
  public function getUserActivity(int $id)
  {
    return Activity::where('causer_id', $id)
      ->with('subject')
      ->latest()
      ->paginate(20);
  }
}
