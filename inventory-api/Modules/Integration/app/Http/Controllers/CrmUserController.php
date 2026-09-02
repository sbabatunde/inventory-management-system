<?php
// Modules/Integration/app/Http/Controllers/CrmUserController.php

namespace Modules\Integration\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Integration\app\Services\CrmUserService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class CrmUserController extends ModuleBaseController
{
  protected string $moduleName = 'Integration';
  protected string $moduleColor = 'indigo';
  protected string $moduleIcon = 'fa-plug';

  protected CrmUserService $crmUserService;

  public function __construct(CrmUserService $crmUserService)
  {
    $this->crmUserService = $crmUserService;
  }

  /**
   * Get all CRM users
   */
  public function index()
  {
    $users = $this->crmUserService->getUsers();

    if ($users === null) {
      return $this->error('Failed to fetch users from CRM', 503);
    }

    return $this->success($users, 'CRM users retrieved successfully');
  }

  /**
   * Get CRM user by ID
   */
  public function show(int $id)
  {
    $user = $this->crmUserService->getUser($id);

    if (!$user) {
      return $this->error('User not found or CRM unavailable', 404);
    }

    return $this->success($user, 'CRM user retrieved successfully');
  }

  /**
   * Search CRM users
   */
  public function search(Request $request)
  {
    $request->validate([
      'search' => 'required|string|min:2',
    ]);

    $users = $this->crmUserService->searchUsers($request->search);

    if ($users === null) {
      return $this->error('Failed to search users from CRM', 503);
    }

    return $this->success($users, 'CRM users retrieved successfully');
  }
}
