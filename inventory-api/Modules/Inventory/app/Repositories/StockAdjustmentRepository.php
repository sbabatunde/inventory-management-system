<?php
// Modules/Inventory/app/Repositories/StockAdjustmentRepository.php

namespace Modules\Inventory\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockAdjustment;
use Modules\Inventory\app\Repositories\Contracts\StockAdjustmentRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class StockAdjustmentRepository implements StockAdjustmentRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = StockAdjustment::with(['store', 'stockItem'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where('adjustment_no', 'like', "%{$search}%");
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('store_id', $storeId);
      })
      ->when($filters['stock_item_id'] ?? null, function ($q, $stockItemId) {
        return $q->where('stock_item_id', $stockItemId);
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?StockAdjustment
  {
    return Cache::remember("stock_adjustment:{$id}", 300, function () use ($id) {
      return StockAdjustment::find($id);
    });
  }

  public function findWithRelations(int $id): ?StockAdjustment
  {
    return Cache::remember("stock_adjustment_details:{$id}", 300, function () use ($id) {
      return StockAdjustment::with(['store', 'stockItem'])
        ->find($id);
    });
  }

  public function create(array $data): StockAdjustment
  {
    $adjustment = StockAdjustment::create($data);
    Cache::forget("stock_adjustment:{$adjustment->id}");
    return $adjustment;
  }

  public function update(int $id, array $data): StockAdjustment
  {
    $adjustment = StockAdjustment::findOrFail($id);
    $adjustment->update($data);
    Cache::forget("stock_adjustment:{$id}");
    Cache::forget("stock_adjustment_details:{$id}");
    return $adjustment->fresh();
  }

  public function findByAdjustmentNo(string $adjustmentNo): ?StockAdjustment
  {
    return StockAdjustment::where('adjustment_no', $adjustmentNo)->first();
  }
}
