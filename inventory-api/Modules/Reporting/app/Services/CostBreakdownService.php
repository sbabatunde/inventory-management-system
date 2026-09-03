<?php
// Modules/Reporting/app/Services/CostBreakdownService.php

namespace Modules\Reporting\app\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class CostBreakdownService
{
  /**
   * Get monthly cost breakdown
   */
  public function getMonthlyCostBreakdown(string $month): array
  {
    $cacheKey = "cost_breakdown:{$month}";

    return Cache::remember($cacheKey, 3600, function () use ($month) {
      return [
        'installation' => $this->getInstallationCost($month),
        'maintenance' => $this->getMaintenanceCost($month),
        'logistics' => $this->getLogisticsCost($month),
        'collection' => $this->getCollectionCost($month),
        'total' => $this->getTotalCost($month),
      ];
    });
  }

  /**
   * Get yearly cost summary
   */
  public function getYearlyCostSummary(string $year): array
  {
    $cacheKey = "cost_summary:{$year}";

    return Cache::remember($cacheKey, 3600, function () use ($year) {
      $months = [];
      for ($i = 1; $i <= 12; $i++) {
        $month = sprintf('%s-%02d', $year, $i);
        $months[$month] = $this->getMonthlyCostBreakdown($month);
      }
      return $months;
    });
  }

  /**
   * Get installation cost
   */
  protected function getInstallationCost(string $month): array
  {
    $releases = DB::table('release_forms')
      ->where('category', 'installation')
      ->whereYear('created_at', substr($month, 0, 4))
      ->whereMonth('created_at', substr($month, 5, 2))
      ->where('status', '!=', 'cancelled')
      ->get();

    $totalCost = $releases->sum(function ($release) {
      return $this->calculateReleaseCost($release->id);
    });

    return [
      'total_cost' => $totalCost,
      'count' => $releases->count(),
    ];
  }

  /**
   * Get maintenance cost
   */
  protected function getMaintenanceCost(string $month): array
  {
    $releases = DB::table('release_forms')
      ->where('category', 'maintenance')
      ->whereYear('created_at', substr($month, 0, 4))
      ->whereMonth('created_at', substr($month, 5, 2))
      ->where('status', '!=', 'cancelled')
      ->get();

    $totalCost = $releases->sum(function ($release) {
      return $this->calculateReleaseCost($release->id);
    });

    return [
      'total_cost' => $totalCost,
      'count' => $releases->count(),
    ];
  }

  /**
   * Get logistics cost
   */
  protected function getLogisticsCost(string $month): array
  {
    // This would come from a logistics table or manual entries
    // For now, return placeholder
    return [
      'total_cost' => 0,
      'count' => 0,
    ];
  }

  /**
   * Get collection cost
   */
  protected function getCollectionCost(string $month): array
  {
    // This would come from a collection table or manual entries
    // For now, return placeholder
    return [
      'total_cost' => 0,
      'count' => 0,
    ];
  }

  /**
   * Get total cost
   */
  protected function getTotalCost(string $month): float
  {
    $installation = $this->getInstallationCost($month);
    $maintenance = $this->getMaintenanceCost($month);
    $logistics = $this->getLogisticsCost($month);
    $collection = $this->getCollectionCost($month);

    return $installation['total_cost'] +
      $maintenance['total_cost'] +
      $logistics['total_cost'] +
      $collection['total_cost'];
  }

  /**
   * Calculate release cost
   */
  protected function calculateReleaseCost(int $releaseFormId): float
  {
    return DB::table('release_form_items')
      ->join('stock_items', 'release_form_items.stock_item_id', '=', 'stock_items.id')
      ->where('release_form_items.release_form_id', $releaseFormId)
      ->sum(DB::raw('release_form_items.qty_released * stock_items.unit_cost'));
  }
}
