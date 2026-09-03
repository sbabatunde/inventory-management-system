<?php
// Modules/Inventory/app/Http/Controllers/StockBalanceController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\Services\StockBalanceService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StockBalanceController extends ModuleBaseController
{
  protected string $moduleName = 'Inventory';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-scale-balanced';

  protected StockBalanceService $stockBalanceService;

  public function __construct(StockBalanceService $stockBalanceService)
  {
    $this->stockBalanceService = $stockBalanceService;
  }

  /**
   * Display a listing of stock balances
   */
  public function index(Request $request)
  {
    $filters = [
      'store_id' => $request->store_id,
      'stock_item_id' => $request->stock_item_id,
      'low_stock' => $request->boolean('low_stock'),
      'search' => $request->search,
      'per_page' => $request->per_page,
    ];

    $balances = $this->stockBalanceService->getPaginatedBalances($filters);

    return $this->success([
      'balances' => $balances,
      'pagination' => [
        'current_page' => $balances->currentPage(),
        'last_page' => $balances->lastPage(),
        'per_page' => $balances->perPage(),
        'total' => $balances->total(),
        'from' => $balances->firstItem(),
        'to' => $balances->lastItem(),
      ],
    ], 'Stock balances retrieved successfully');
  }

  /**
   * Get low stock items
   */
  public function lowStock()
  {
    $lowStockItems = $this->stockBalanceService->getLowStockItems();

    return $this->success($lowStockItems, 'Low stock items retrieved successfully');
  }

  /**
   * Get stock summary
   */
  public function summary()
  {
    $summary = $this->stockBalanceService->getStockSummary();

    return $this->success($summary, 'Stock summary retrieved successfully');
  }
}
