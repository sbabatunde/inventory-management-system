<?php
// Modules/Inventory/app/Http/Controllers/StockTransferController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\Services\StockTransferService;
use Modules\Inventory\app\Http\Requests\StoreStockTransferRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StockTransferController extends ModuleBaseController
{
  protected string $moduleName = 'Inventory';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-right-left';

  protected StockTransferService $stockTransferService;

  public function __construct(StockTransferService $stockTransferService)
  {
    $this->stockTransferService = $stockTransferService;
  }

  /**
   * Display a listing of transfers
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'status' => $request->status,
      'from_store_id' => $request->from_store_id,
      'to_store_id' => $request->to_store_id,
      'sort' => $request->sort,
      'per_page' => $request->per_page,
    ];

    $transfers = $this->stockTransferService->getPaginatedTransfers($filters);

    return $this->success([
      'transfers' => $transfers->items(),
      'pagination' => [
        'current_page' => $transfers->currentPage(),
        'last_page' => $transfers->lastPage(),
        'per_page' => $transfers->perPage(),
        'total' => $transfers->total(),
        'from' => $transfers->firstItem(),
        'to' => $transfers->lastItem(),
      ],
    ], 'Stock transfers retrieved successfully');
  }

  /** 
   * Store a newly created transfer
   */
  public function store(StoreStockTransferRequest $request)
  {
    try {
      $transfer = $this->stockTransferService->createTransfer($request->validated());

      return $this->success($transfer, 'Stock transfer created successfully', 201);
    } catch (\Exception $e) {
      return $this->error('Failed to create stock transfer', 500, $e->getMessage());
    }
  }

  /**
   * Display the specified transfer
   */
  public function show(int $id)
  {
    $transfer = $this->stockTransferService->getTransfer($id);

    if (!$transfer) {
      return $this->error('Stock transfer not found', 404);
    }

    return $this->success($transfer, 'Stock transfer retrieved successfully');
  }

  /**
   * Approve transfer
   */
  public function approve(int $id)
  {
    try {
      $transfer = $this->stockTransferService->approveTransfer($id);
      return $this->success($transfer, 'Stock transfer approved successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Receive transfer
   */
  public function receive(int $id)
  {
    try {
      $transfer = $this->stockTransferService->receiveTransfer($id);
      return $this->success($transfer, 'Stock transfer received successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Cancel transfer
   */
  public function cancel(int $id)
  {
    try {
      $transfer = $this->stockTransferService->cancelTransfer($id);
      return $this->success($transfer, 'Stock transfer cancelled successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }
}
