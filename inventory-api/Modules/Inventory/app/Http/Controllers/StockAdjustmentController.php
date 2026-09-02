<?php
// Modules/Inventory/app/Http/Controllers/StockAdjustmentController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\Services\StockAdjustmentService;
use Modules\Inventory\app\Http\Requests\StoreStockAdjustmentRequest;
use Modules\Inventory\app\Http\Requests\UpdateStockAdjustmentRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StockAdjustmentController extends ModuleBaseController
{
  protected string $moduleName = 'Inventory';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-sliders';

  protected StockAdjustmentService $stockAdjustmentService;

  public function __construct(StockAdjustmentService $stockAdjustmentService)
  {
    $this->stockAdjustmentService = $stockAdjustmentService;
  }

  /**
   * Display a listing of adjustments
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'status' => $request->status,
      'store_id' => $request->store_id,
      'stock_item_id' => $request->stock_item_id,
      'per_page' => $request->per_page,
    ];

    $adjustments = $this->stockAdjustmentService->getPaginatedAdjustments($filters);

    return $this->success([
      'adjustments' => $adjustments->items(),
      'pagination' => [
        'current_page' => $adjustments->currentPage(),
        'last_page' => $adjustments->lastPage(),
        'per_page' => $adjustments->perPage(),
        'total' => $adjustments->total(),
        'from' => $adjustments->firstItem(),
        'to' => $adjustments->lastItem(),
      ],
    ], 'Stock adjustments retrieved successfully');
  }

  /**
   * Store a newly created adjustment
   */
  public function store(StoreStockAdjustmentRequest $request)
  {
    try {
      $adjustment = $this->stockAdjustmentService->createAdjustment($request->validated());

      return $this->success($adjustment, 'Stock adjustment created successfully', 201);
    } catch (\Exception $e) {
      return $this->error('Failed to create stock adjustment', 500, $e->getMessage());
    }
  }

  /**
   * Display the specified adjustment
   */
  public function show(int $id)
  {
    $adjustment = $this->stockAdjustmentService->getAdjustment($id);

    if (!$adjustment) {
      return $this->error('Stock adjustment not found', 404);
    }

    return $this->success($adjustment, 'Stock adjustment retrieved successfully');
  }

  /**
   * Approve adjustment
   */
  public function approve(int $id)
  {
    try {
      $adjustment = $this->stockAdjustmentService->approveAdjustment($id);
      return $this->success($adjustment, 'Stock adjustment approved successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Reject adjustment
   */
  public function reject(int $id, UpdateStockAdjustmentRequest $request)
  {
    try {
      $adjustment = $this->stockAdjustmentService->rejectAdjustment(
        $id,
        $request->notes
      );
      return $this->success($adjustment, 'Stock adjustment rejected successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }
}
