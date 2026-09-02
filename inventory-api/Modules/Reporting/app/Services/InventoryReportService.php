<?php
// Modules/Reporting/app/Services/InventoryReportService.php

namespace Modules\Reporting\app\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class InventoryReportService
{
  /**
   * Get inventory valuation
   */
  public function getInventoryValuation(?int $storeId = null): array
  {
    $cacheKey = "inventory_valuation:{$storeId}";

    return Cache::remember($cacheKey, 3600, function () use ($storeId) {
      $query = DB::table('stock_balances')
        ->join('stock_items', 'stock_balances.stock_item_id', '=', 'stock_items.id')
        ->join('stores', 'stock_balances.store_id', '=', 'stores.id')
        ->select(
          'stores.name as store_name',
          'stores.code as store_code',
          DB::raw('SUM(stock_balances.quantity_on_hand) as total_quantity'),
          DB::raw('SUM(stock_balances.quantity_on_hand * stock_items.unit_cost) as total_value')
        )
        ->groupBy('stores.id', 'stores.name', 'stores.code');

      if ($storeId) {
        $query->where('stock_balances.store_id', $storeId);
      }

      return $query->get()->toArray();
    });
  }

  /**
   * Get stock movement summary
   */
  public function getStockMovementSummary(string $month): array
  {
    $cacheKey = "stock_movement_summary:{$month}";

    return Cache::remember($cacheKey, 3600, function () use ($month) {
      return [
        'receipts' => $this->getMovementCount('receipt', $month),
        'issues' => $this->getMovementCount('issue', $month),
        'transfers' => $this->getMovementCount('transfer', $month),
        'adjustments' => $this->getMovementCount('adjustment', $month),
        'returns' => $this->getMovementCount('return', $month),
      ];
    });
  }

  /**
   * Get low stock items
   */
  public function getLowStockItems(): array
  {
    return Cache::remember('low_stock_items', 300, function () {
      return DB::table('stock_balances')
        ->join('stock_items', 'stock_balances.stock_item_id', '=', 'stock_items.id')
        ->join('stores', 'stock_balances.store_id', '=', 'stores.id')
        ->whereRaw('stock_balances.quantity_available <= stock_items.reorder_level')
        ->select(
          'stock_items.name as item_name',
          'stock_items.code as item_code',
          'stores.name as store_name',
          'stock_balances.quantity_available',
          'stock_items.reorder_level'
        )
        ->get()
        ->toArray();
    });
  }

  /**
   * Get movement count
   */
  protected function getMovementCount(string $type, string $month): int
  {
    return DB::table('stock_movements')
      ->where('movement_type', $type)
      ->whereYear('created_at', substr($month, 0, 4))
      ->whereMonth('created_at', substr($month, 5, 2))
      ->count();
  }
}
