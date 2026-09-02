<?php
// Modules/Inventory/app/Services/StockBalanceService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\app\Models\StockBalance;
use Modules\Inventory\app\Models\Store;
use Modules\Inventory\app\Models\StockItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StockBalanceService
{
  /**
   * Get paginated stock balances
   */
  public function getPaginatedBalances(array $filters = []): LengthAwarePaginator
  {
    $query = StockBalance::with(['store', 'stockItem'])
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('store_id', $storeId);
      })
      ->when($filters['stock_item_id'] ?? null, function ($q, $stockItemId) {
        return $q->where('stock_item_id', $stockItemId);
      })
      ->when($filters['low_stock'] ?? false, function ($q) {
        return $q->whereHas('stockItem', function ($query) {
          $query->whereRaw('stock_balances.quantity_available <= stock_items.reorder_level');
        });
      })
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->whereHas('stockItem', function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('code', 'like', "%{$search}%");
        });
      });

    return $query->paginate($filters['per_page'] ?? 15);
  }

  /**
   * Get low stock items
   */
  public function getLowStockItems(): LengthAwarePaginator
  {
    return StockBalance::with(['store', 'stockItem'])
      ->whereHas('stockItem', function ($query) {
        $query->whereRaw('stock_balances.quantity_available <= stock_items.reorder_level');
      })
      ->paginate(15);
  }

  /**
   * Get stock balance for specific store and item
   */
  public function getBalance(int $storeId, int $stockItemId): ?StockBalance
  {
    $cacheKey = "stock_balance:{$storeId}:{$stockItemId}";

    return Cache::remember($cacheKey, 300, function () use ($storeId, $stockItemId) {
      return StockBalance::where('store_id', $storeId)
        ->where('stock_item_id', $stockItemId)
        ->first();
    });
  }

  /**
   * Update stock balance with locking
   */
  public function updateBalance(int $storeId, int $stockItemId, int $quantityOnHand, ?int $quantityReserved = null): StockBalance
  {
    return DB::transaction(function () use ($storeId, $stockItemId, $quantityOnHand, $quantityReserved) {
      $balance = StockBalance::where('store_id', $storeId)
        ->where('stock_item_id', $stockItemId)
        ->lockForUpdate()
        ->first();

      if (!$balance) {
        $balance = StockBalance::create([
          'store_id' => $storeId,
          'stock_item_id' => $stockItemId,
          'quantity_on_hand' => 0,
          'quantity_reserved' => 0,
          'quantity_available' => 0,
        ]);
      }

      $balance->quantity_on_hand = $quantityOnHand;
      $balance->quantity_reserved = $quantityReserved ?? $balance->quantity_reserved;
      $balance->quantity_available = $quantityOnHand - $balance->quantity_reserved;
      $balance->last_counted_at = now();
      $balance->save();

      // Clear cache
      Cache::forget("stock_balance:{$storeId}:{$stockItemId}");

      return $balance;
    });
  }

  /**
   * Get total stock summary
   */
  public function getStockSummary(): array
  {
    return Cache::remember('stock_summary', 300, function () {
      return [
        'total_items' => StockItem::count(),
        'total_stores' => Store::count(),
        'total_stock_quantity' => StockBalance::sum('quantity_on_hand'),
        'total_stock_value' => DB::table('stock_balances')
          ->join('stock_items', 'stock_balances.stock_item_id', '=', 'stock_items.id')
          ->selectRaw('SUM(stock_balances.quantity_on_hand * stock_items.unit_cost) as total_value')
          ->value('total_value') ?? 0,
        'low_stock_count' => StockBalance::whereHas('stockItem', function ($query) {
          $query->whereRaw('stock_balances.quantity_available <= stock_items.reorder_level');
        })->count(),
      ];
    });
  }
}
