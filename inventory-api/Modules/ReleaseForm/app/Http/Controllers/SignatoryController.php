<?php
// Modules/ReleaseForm/app/Http/Controllers/SignatoryController.php

namespace Modules\ReleaseForm\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\ReleaseForm\app\Services\SignatoryService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class SignatoryController extends ModuleBaseController
{
  protected string $moduleName = 'Release Forms';
  protected string $moduleColor = 'purple';
  protected string $moduleIcon = 'fa-signature';

  protected SignatoryService $signatoryService;

  public function __construct(SignatoryService $signatoryService)
  {
    $this->signatoryService = $signatoryService;
  }

  /**
   * Get signatories for a release form
   */
  public function index(int $releaseFormId)
  {
    $signatories = $this->signatoryService->getSignatories($releaseFormId);
    return $this->success($signatories, 'Signatories retrieved successfully');
  }

  /**
   * Add signatory
   */
  public function store(Request $request, int $releaseFormId)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'role' => 'required|string|in:requester,storekeeper,engineer,approver,receiver',
      'user_id' => 'nullable|integer|exists:users,id',
      'crm_user_id' => 'nullable|string',
    ]);

    try {
      $signatory = $this->signatoryService->addSignatory($releaseFormId, $request->validated());
      return $this->success($signatory, 'Signatory added successfully', 201);
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Remove signatory
   */
  public function destroy(int $signatoryId)
  {
    try {
      $this->signatoryService->removeSignatory($signatoryId);
      return $this->success(null, 'Signatory removed successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Sign release form
   */
  public function sign(Request $request, int $signatoryId)
  {
    $request->validate([
      'signature_ref' => 'required|string|max:255',
    ]);

    try {
      $signatory = $this->signatoryService->signForm($signatoryId, $request->signature_ref);
      return $this->success($signatory, 'Form signed successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Search CRM users for signatory selection
   */
  public function searchCrmUsers(Request $request)
  {
    $request->validate([
      'search' => 'required|string|min:2',
    ]);

    $users = $this->signatoryService->searchCrmUsers($request->search);
    return $this->success($users, 'CRM users retrieved successfully');
  }
}
