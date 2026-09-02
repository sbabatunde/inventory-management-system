<?php
// Modules/Integration/app/Http/Controllers/JobOrderController.php

namespace Modules\Integration\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Integration\app\Services\JobOrderService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class JobOrderController extends ModuleBaseController
{
  protected string $moduleName = 'Integration';
  protected string $moduleColor = 'indigo';
  protected string $moduleIcon = 'fa-plug';

  protected JobOrderService $jobOrderService;

  public function __construct(JobOrderService $jobOrderService)
  {
    $this->jobOrderService = $jobOrderService;
  }

  /**
   * Get job order by ID
   */
  public function show(int $id)
  {
    $jobOrder = $this->jobOrderService->getJobOrder($id);

    if (!$jobOrder) {
      return $this->error('Job order not found or CRM unavailable', 404);
    }

    return $this->success($jobOrder, 'Job order retrieved successfully');
  }

  /**
   * Get job orders by client
   */
  public function byClient(Request $request)
  {
    $request->validate([
      'client_id' => 'required|integer',
    ]);

    $jobOrders = $this->jobOrderService->getJobOrdersByClient($request->client_id);

    if ($jobOrders === null) {
      return $this->error('Failed to fetch job orders from CRM', 503);
    }

    return $this->success($jobOrders, 'Job orders retrieved successfully');
  }
}
