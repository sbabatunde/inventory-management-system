<?php
// Modules/Inventory/app/Http/Controllers/StockItemController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\DTOs\StockItemDTO;
use Modules\Inventory\app\Enums\StockNature;
use Modules\Inventory\app\Http\Requests\StoreStockItemRequest;
use Modules\Inventory\app\Http\Requests\UpdateStockItemRequest;
use Modules\Inventory\app\Services\StockItemService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StockItemController extends ModuleBaseController
{
  protected string $moduleName = 'Inventory';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-boxes-stacked';

  protected StockItemService $stockItemService;

  public function __construct(StockItemService $stockItemService)
  {
    $this->stockItemService = $stockItemService;
  }

  /**
   * Display a listing of stock items
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'nature' => $request->nature,
      'is_serialized' => $request->is_serialized,
      'category_id' => $request->category_id,
      'status' => $request->status,
      'sort' => $request->sort,
    ];

    $stockItems = $this->stockItemService->getPaginatedStockItems($filters);

    return $this->success([
      'stock_items' => $stockItems->through(fn($item) => StockItemDTO::fromArray($item->toArray())->toArray()),
      'pagination' => [
        'current_page' => $stockItems->currentPage(),
        'last_page' => $stockItems->lastPage(),
        'per_page' => $stockItems->perPage(),
        'total' => $stockItems->total(),
        'from' => $stockItems->firstItem(),
        'to' => $stockItems->lastItem(),
      ],
    ], 'Stock items retrieved successfully');
  }

  /**
   * Store a newly created stock item
   */
  public function store(StoreStockItemRequest $request)
  {
    try {
      $stockItem = $this->stockItemService->createStockItem($request->validated());
      $stockItemDTO = StockItemDTO::fromArray($stockItem->toArray());

      return $this->success($stockItemDTO->toArray(), 'Stock item created successfully', 201);
    } catch (\Exception $e) {
      return $this->error('Failed to create stock item', 500, $e->getMessage());
    }
  }

  /**
   * Display the specified stock item
   */
  public function show(int $id)
  {
    $stockItem = $this->stockItemService->getStockItemWithDetails($id);

    if (!$stockItem) {
      return $this->error('Stock item not found', 404);
    }

    $stockItemDTO = StockItemDTO::fromArray($stockItem->toArray());

    return $this->success($stockItemDTO->toArray(), 'Stock item retrieved successfully');
  }

  /**
   * Update the specified stock item
   */
  public function update(UpdateStockItemRequest $request, int $id)
  {
    try {
      $stockItem = $this->stockItemService->updateStockItem($id, $request->validated());
      $stockItemDTO = StockItemDTO::fromArray($stockItem->toArray());

      return $this->success($stockItemDTO->toArray(), 'Stock item updated successfully');
    } catch (\Exception $e) {
      return $this->error('Failed to update stock item', 500, $e->getMessage());
    }
  }

  /**
   * Remove the specified stock item
   */
  public function destroy(int $id)
  {
    try {
      $this->stockItemService->deleteStockItem($id);
      return $this->success(null, 'Stock item deleted successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Get stock item balance
   */
  public function getBalance(int $id)
  {
    try {
      $balance = $this->stockItemService->getStockItemBalance($id);
      return $this->success($balance, 'Stock balance retrieved successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 404);
    }
  }

  /**
   * Get stock item serials
   */
  public function getSerials(int $id)
  {
    try {
      $serials = $this->stockItemService->getStockItemSerials($id);
      return $this->success($serials, 'Stock serials retrieved successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 404);
    }
  }

  /**
   * Get stock natures
   */
  public function natures()
  {
    return $this->success(StockNature::options(), 'Stock natures retrieved successfully');
  }
}
