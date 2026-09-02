<?php
// Modules/Procurement/app/Http/Controllers/PurchaseRequisitionController.php

namespace Modules\Procurement\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Procurement\app\Services\PurchaseRequisitionService;
use Modules\Procurement\app\Http\Requests\StorePurchaseRequisitionRequest;
use Modules\Procurement\app\Http\Requests\UpdatePurchaseRequisitionRequest;
use Modules\Procurement\app\Http\Requests\approvePurchaseRequisitionRequest;
use Modules\Procurement\app\Http\Requests\RejectPurchaseRequisitionRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class PurchaseRequisitionController extends ModuleBaseController
{
  protected string $moduleName = 'Procurement';
  protected string $moduleColor = 'amber';
  protected string $moduleIcon = 'fa-clipboard-list';

  protected PurchaseRequisitionService $requisitionService;

  public function __construct(PurchaseRequisitionService $requisitionService)
  {
    $this->requisitionService = $requisitionService;
  }

  /**
   * Display a listing of purchase requisitions
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'status' => $request->status,
      'priority' => $request->priority,
      'requested_by' => $request->requested_by,
      'per_page' => $request->per_page,
    ];

    $result = $this->requisitionService->getPaginatedRequisitions($filters);

    return $this->success($result, 'Purchase requisitions retrieved successfully');
  }

  /**
   * Store a newly created purchase requisition
   */
  public function store(StorePurchaseRequisitionRequest $request)
  {
    try {
      $requisition = $this->requisitionService->createRequisition($request->validated());
      return $this->success($requisition, 'Purchase requisition created successfully', 201);
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Display the specified purchase requisition
   */
  public function show(int $id)
  {
    $requisition = $this->requisitionService->getRequisition($id);

    if (!$requisition) {
      return $this->error('Purchase requisition not found', 404);
    }

    return $this->success($requisition, 'Purchase requisition retrieved successfully');
  }

  /**
   * Update the specified purchase requisition
   */
  public function update(UpdatePurchaseRequisitionRequest $request, int $id)
  {
    try {
      $requisition = $this->requisitionService->updateRequisition($id, $request->validated());
      return $this->success($requisition, 'Purchase requisition updated successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Submit requisition for approval
   */
  public function submitForApproval(int $id)
  {
    try {
      $requisition = $this->requisitionService->submitForApproval($id);
      return $this->success($requisition, 'Purchase requisition submitted for approval');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Approve requisition
   */
  public function approve(int $id, ApprovePurchaseRequisitionRequest $request)
  {
    try {
      $requisition = $this->requisitionService->approveRequisition($id);
      return $this->success($requisition, 'Purchase requisition approved successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Reject requisition
   */
  public function reject(int $id, RejectPurchaseRequisitionRequest $request)
  {
    try {
      $requisition = $this->requisitionService->rejectRequisition($id, $request->reason);
      return $this->success($requisition, 'Purchase requisition rejected successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Cancel requisition
   */
  public function cancel(int $id)
  {
    try {
      $requisition = $this->requisitionService->cancelRequisition($id);
      return $this->success($requisition, 'Purchase requisition cancelled successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Get pending approvals
   */
  public function pendingApprovals()
  {
    $result = $this->requisitionService->getPendingApprovals();
    return $this->success($result, 'Pending approvals retrieved successfully');
  }
}
