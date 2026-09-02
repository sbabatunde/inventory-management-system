<?php
// Modules/Reporting/app/Services/SupplierPerformanceService.php

namespace Modules\Reporting\app\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class SupplierPerformanceService
{
  /**
   * Get supplier performance
   */
  public function getSupplierPerformance(string $month): array
  {
    $cacheKey = "supplier_performance:{$month}";

    return Cache::remember($cacheKey, 3600, function () use ($month) {
      return DB::table('suppliers')
        ->leftJoin('purchase_orders', 'suppliers.id', '=', 'purchase_orders.supplier_id')
        ->whereYear('purchase_orders.created_at', substr($month, 0, 4))
        ->whereMonth('purchase_orders.created_at', substr($month, 5, 2))
        ->select(
          'suppliers.name',
          'suppliers.code',
          DB::raw('COUNT(purchase_orders.id) as total_orders'),
          DB::raw('SUM(purchase_orders.total_amount) as total_value'),
          DB::raw('AVG(purchase_orders.total_amount) as average_order_value'),
          DB::raw('SUM(CASE WHEN purchase_orders.status = "completed" THEN 1 ELSE 0 END) as completed_orders'),
          DB::raw('SUM(CASE WHEN purchase_orders.status = "cancelled" THEN 1 ELSE 0 END) as cancelled_orders')
        )
        ->groupBy('suppliers.id', 'suppliers.name', 'suppliers.code')
        ->orderByDesc('total_value')
        ->get()
        ->toArray();
    });
  }

  /**
   * Get purchases by supplier
   */
  public function getPurchasesBySupplier(string $month): array
  {
    $cacheKey = "purchases_by_supplier:{$month}";

    return Cache::remember($cacheKey, 3600, function () use ($month) {
      return DB::table('suppliers')
        ->join('purchase_orders', 'suppliers.id', '=', 'purchase_orders.supplier_id')
        ->whereYear('purchase_orders.order_date', substr($month, 0, 4))
        ->whereMonth('purchase_orders.order_date', substr($month, 5, 2))
        ->select(
          'suppliers.name',
          DB::raw('SUM(purchase_orders.total_amount) as total_purchases')
        )
        ->groupBy('suppliers.id', 'suppliers.name')
        ->orderByDesc('total_purchases')
        ->get()
        ->toArray();
    });
  }
}
