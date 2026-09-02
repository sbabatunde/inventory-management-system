<?php
// Modules/Inventory/app/Repositories/StockItemRepository.php

namespace Modules\Inventory\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockItem;
use Modules\Inventory\app\Repositories\Contracts\StockItemRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StockItemRepository implements StockItemRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = StockItem::query()
      ->with('category')
      ->withSum('stockBalances', 'quantity_on_hand')
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('code', 'like', "%{$search}%")
            ->orWhere('description', 'like', "%{$search}%");
        });
      })
      ->when($filters['nature'] ?? null, function ($q, $nature) {
        return $q->where('nature', $nature);
      })
      ->when($filters['is_serialized'] ?? null, function ($q, $isSerialized) {
        return $q->where('is_serialized', $isSerialized);
      })
      ->when($filters['category_id'] ?? null, function ($q, $categoryId) {
        return $q->where('category_id', $categoryId);
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('is_active', $status === 'active');
      })
      ->when($filters['sort'] ?? null, function ($q, $sort) {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');
        return $q->orderBy($column, $direction);
      }, function ($q) {
        return $q->latest();
      });

    return $query->paginate($perPage);
  }

  public function find(int $id): ?StockItem
  {
    return Cache::remember("stock_item:{$id}", 3600, function () use ($id) {
      return StockItem::with('category')
        ->withSum('stockBalances', 'quantity_on_hand')
        ->find($id);
    });
  }

  public function create(array $data): StockItem
  {
    return DB::transaction(function () use ($data) {
      $stockItem = StockItem::create($data);
      Cache::forget("stock_item:{$stockItem->id}");
      return $stockItem;
    });
  }

  public function update(int $id, array $data): StockItem
  {
    return DB::transaction(function () use ($id, $data) {
      $stockItem = StockItem::findOrFail($id);
      $stockItem->update($data);
      Cache::forget("stock_item:{$id}");
      return $stockItem->fresh();
    });
  }

  public function delete(int $id): void
  {
    DB::transaction(function () use ($id) {
      $stockItem = StockItem::findOrFail($id);

      // Check if item has stock
      $hasStock = $stockItem->stockBalances()
        ->where('quantity_on_hand', '>', 0)
        ->exists();

      if ($hasStock) {
        throw new \Exception('Cannot delete stock item with existing stock');
      }

      $stockItem->delete();
      Cache::forget("stock_item:{$id}");
    });
  }

  public function getLowStockItems(): LengthAwarePaginator
  {
    return StockItem::query()
      ->withSum('stockBalances', 'quantity_on_hand')
      ->havingRaw('stock_balances_sum_quantity_on_hand <= reorder_level')
      ->paginate(15);
  }

  public function findByCode(string $code): ?StockItem
  {
    return StockItem::where('code', $code)->first();
  }

  public function getSerializedItems(): LengthAwarePaginator
  {
    return StockItem::where('is_serialized', true)
      ->with('stockSerials')
      ->paginate(15);
  }
}
