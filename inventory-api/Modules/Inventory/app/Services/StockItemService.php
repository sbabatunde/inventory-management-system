<?php
// Modules/Inventory/app/Services/StockItemService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\app\Models\StockItem;
use Modules\Inventory\app\Repositories\Contracts\StockItemRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class StockItemService
{
  protected StockItemRepositoryInterface $stockItemRepository;

  public function __construct(StockItemRepositoryInterface $stockItemRepository)
  {
    $this->stockItemRepository = $stockItemRepository;
  }

  /**
   * Get paginated stock items
   */
  public function getPaginatedStockItems(array $filters = []): LengthAwarePaginator
  {
    return $this->stockItemRepository->paginate($filters);
  }

  /**
   * Get stock item with details
   */
  public function getStockItemWithDetails(int $id): ?StockItem
  {
    return $this->stockItemRepository->find($id);
  }

  /**
   * Create stock item
   */
  public function createStockItem(array $data): StockItem
  {
    return DB::transaction(function () use ($data) {
      // Generate code if not provided
      if (empty($data['code'])) {
        $data['code'] = $this->generateStockItemCode($data['nature']);
      }

      $stockItem = $this->stockItemRepository->create($data);

      // Log activity
      activity()
        ->performedOn($stockItem)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created stock item');

      return $stockItem;
    });
  }

  /**
   * Update stock item
   */
  public function updateStockItem(int $id, array $data): StockItem
  {
    return DB::transaction(function () use ($id, $data) {
      $stockItem = $this->stockItemRepository->update($id, $data);

      // Log activity
      activity()
        ->performedOn($stockItem)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('updated stock item');

      return $stockItem;
    });
  }

  /**
   * Delete stock item
   */
  public function deleteStockItem(int $id): void
  {
    DB::transaction(function () use ($id) {
      $stockItem = $this->stockItemRepository->find($id);

      if (!$stockItem) {
        throw new \Exception('Stock item not found');
      }

      // Check if item has stock
      $hasStock = $stockItem->stockBalances()
        ->where('quantity_on_hand', '>', 0)
        ->exists();

      if ($hasStock) {
        throw new \Exception('Cannot delete stock item with existing stock');
      }

      // Log before deleting
      activity()
        ->performedOn($stockItem)
        ->causedBy(auth()->user())
        ->log('deleted stock item');

      $this->stockItemRepository->delete($id);
    });
  }

  /**
   * Get stock item balance
   */
  public function getStockItemBalance(int $id): array
  {
    $stockItem = $this->stockItemRepository->find($id);

    if (!$stockItem) {
      throw new \Exception('Stock item not found');
    }

    return $stockItem->stockBalances()
      ->with('store')
      ->get()
      ->map(function ($balance) {
        return [
          'store_id' => $balance->store_id,
          'store_name' => $balance->store->name,
          'store_code' => $balance->store->code,
          'quantity_on_hand' => $balance->quantity_on_hand,
          'quantity_reserved' => $balance->quantity_reserved,
          'quantity_available' => $balance->quantity_available,
        ];
      })
      ->toArray();
  }

  /**
   * Get stock item serials
   */
  public function getStockItemSerials(int $id): array
  {
    $stockItem = $this->stockItemRepository->find($id);

    if (!$stockItem) {
      throw new \Exception('Stock item not found');
    }

    if (!$stockItem->is_serialized) {
      throw new \Exception('This stock item is not serialized');
    }

    return $stockItem->stockSerials()
      ->with('currentStore')
      ->get()
      ->map(function ($serial) {
        return [
          'id' => $serial->id,
          'serial_no' => $serial->serial_no,
          'current_status' => $serial->current_status,
          'current_store' => $serial->currentStore?->name,
          'updated_at' => $serial->updated_at,
        ];
      })
      ->toArray();
  }

  /**
   * Generate stock item code
   */
  protected function generateStockItemCode(string $nature): string
  {
    $prefix = strtoupper(substr($nature, 0, 3));
    $count = StockItem::where('nature', $nature)->count() + 1;
    return $prefix . '-' . str_pad($count, 6, '0', STR_PAD_LEFT);
  }
}
