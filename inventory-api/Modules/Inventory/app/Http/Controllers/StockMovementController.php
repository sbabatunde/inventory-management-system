<?php
// Modules/Inventory/app/Http/Controllers/StockMovementController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\Services\StockMovementService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StockMovementController extends ModuleBaseController
{
  protected string $moduleName = 'Inventory';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-arrows-left-right';

  protected StockMovementService $stockMovementService;

  public function __construct(StockMovementService $stockMovementService)
  {
    $this->stockMovementService = $stockMovementService;
  }

  /**
   * Display a listing of movements
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'movement_type' => $request->movement_type,
      'stock_item_id' => $request->stock_item_id,
      'stock_serial_id' => $request->stock_serial_id,
      'store_id' => $request->store_id,
      'date_from' => $request->date_from,
      'date_to' => $request->date_to,
      'per_page' => $request->per_page,
    ];

    $movements = $this->stockMovementService->getPaginatedMovements($filters);

    return $this->success([
      'movements' => $movements->items(),
      'pagination' => [
        'current_page' => $movements->currentPage(),
        'last_page' => $movements->lastPage(),
        'per_page' => $movements->perPage(),
        'total' => $movements->total(),
        'from' => $movements->firstItem(),
        'to' => $movements->lastItem(),
      ],
    ], 'Stock movements retrieved successfully');
  }

  /**
   * Display the specified movement
   */
  public function show(int $id)
  {
    $movement = $this->stockMovementService->getMovement($id);

    if (!$movement) {
      return $this->error('Stock movement not found', 404);
    }

    return $this->success($movement, 'Stock movement retrieved successfully');
  }

  /**
   * Get movements by item
   */
  public function byItem(int $stockItemId, Request $request)
  {
    $filters = [
      'movement_type' => $request->movement_type,
      'date_from' => $request->date_from,
      'date_to' => $request->date_to,
      'per_page' => $request->per_page,
    ];

    $movements = $this->stockMovementService->getMovementsByItem($stockItemId, $filters);

    return $this->success($movements, 'Stock movements retrieved successfully');
  }

  /**
   * Get movements by serial
   */
  public function bySerial(int $stockSerialId, Request $request)
  {
    $filters = [
      'movement_type' => $request->movement_type,
      'date_from' => $request->date_from,
      'date_to' => $request->date_to,
      'per_page' => $request->per_page,
    ];

    $movements = $this->stockMovementService->getMovementsBySerial($stockSerialId, $filters);

    return $this->success($movements, 'Serial movements retrieved successfully');
  }

  /**
   * Get movements by store
   */
  public function byStore(int $storeId, Request $request)
  {
    $filters = [
      'movement_type' => $request->movement_type,
      'date_from' => $request->date_from,
      'date_to' => $request->date_to,
      'per_page' => $request->per_page,
    ];

    $movements = $this->stockMovementService->getMovementsByStore($storeId, $filters);

    return $this->success($movements, 'Store movements retrieved successfully');
  }

  /**
   * Get stock summary
   */
  public function summary(Request $request)
  {
    $filters = [
      'store_id' => $request->store_id,
      'date_from' => $request->date_from,
      'date_to' => $request->date_to,
    ];

    $summary = $this->stockMovementService->getStockSummary($filters);

    return $this->success($summary, 'Stock summary retrieved successfully');
  }

  /**
   * Get movement types
   */
  public function types()
  {
    $types = $this->stockMovementService->getMovementTypes();

    return $this->success($types, 'Movement types retrieved successfully');
  }
}
