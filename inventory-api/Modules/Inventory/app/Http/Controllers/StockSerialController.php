<?php
// Modules/Inventory/app/Http/Controllers/StockSerialController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\Services\StockSerialService;
use Modules\Inventory\app\Http\Requests\StoreStockSerialRequest;
use Modules\Inventory\app\Http\Requests\UpdateStockSerialStatusRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StockSerialController extends ModuleBaseController
{
  protected string $moduleName = 'Inventory';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-barcode';

  protected StockSerialService $stockSerialService;

  public function __construct(StockSerialService $stockSerialService)
  {
    $this->stockSerialService = $stockSerialService;
  }

  /**
   * Display a listing of serials
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'status' => $request->status,
      'stock_item_id' => $request->stock_item_id,
      'store_id' => $request->store_id,
      'per_page' => $request->per_page,
    ];

    $serials = $this->stockSerialService->getPaginatedSerials($filters);

    return $this->success([
      'serials' => $serials->items(),
      'pagination' => [
        'current_page' => $serials->currentPage(),
        'last_page' => $serials->lastPage(),
        'per_page' => $serials->perPage(),
        'total' => $serials->total(),
        'from' => $serials->firstItem(),
        'to' => $serials->lastItem(),
      ],
    ], 'Stock serials retrieved successfully');
  }

  /**
   * Store newly created serials
   */
  public function store(StoreStockSerialRequest $request)
  {
    try {
      $serials = $this->stockSerialService->createSerials(
        $request->stock_item_id,
        $request->serial_numbers,
        $request->store_id
      );

      return $this->success($serials, 'Stock serials created successfully', 201);
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Display the specified serial
   */
  public function show(int $id)
  {
    $serial = $this->stockSerialService->getSerial($id);

    if (!$serial) {
      return $this->error('Stock serial not found', 404);
    }

    return $this->success($serial, 'Stock serial retrieved successfully');
  }

  /**
   * Update serial status
   */
  public function updateStatus(int $id, UpdateStockSerialStatusRequest $request)
  {
    try {
      $serial = $this->stockSerialService->updateSerialStatus(
        $id,
        $request->status,
        $request->store_id
      );

      return $this->success($serial, 'Serial status updated successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Get serial history
   */
  public function history(int $id)
  {
    try {
      $history = $this->stockSerialService->getSerialHistory($id);
      return $this->success($history, 'Serial history retrieved successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 404);
    }
  }

  /**
   * Get serials by store
   */
  public function byStore(int $storeId)
  {
    $serials = $this->stockSerialService->getSerialsByStore($storeId);

    return $this->success($serials, 'Store serials retrieved successfully');
  }
}
