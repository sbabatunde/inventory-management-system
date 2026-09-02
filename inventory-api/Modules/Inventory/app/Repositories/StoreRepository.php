<?php
// Modules/Inventory/app/Repositories/StoreRepository.php

namespace Modules\Inventory\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\Store;
use Modules\Inventory\app\Repositories\Contracts\StoreRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class StoreRepository implements StoreRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = Store::query()
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('code', 'like', "%{$search}%")
            ->orWhere('city', 'like', "%{$search}%");
        });
      })
      ->when($filters['type'] ?? null, function ($q, $type) {
        return $q->where('type', $type);
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

  public function find(int $id): ?Store
  {
    return Cache::remember("store:{$id}", 3600, function () use ($id) {
      return Store::find($id);
    });
  }

  public function create(array $data): Store
  {
    $store = Store::create($data);
    Cache::forget("store:{$store->id}");
    return $store;
  }

  public function update(int $id, array $data): Store
  {
    $store = Store::findOrFail($id);
    $store->update($data);
    Cache::forget("store:{$id}");
    return $store->fresh();
  }

  public function delete(int $id): void
  {
    $store = Store::findOrFail($id);
    $store->delete();
    Cache::forget("store:{$id}");
  }

  public function getStoresWithStock(): LengthAwarePaginator
  {
    return Store::withCount(['stockBalances as total_items' => function ($query) {
      $query->where('quantity_on_hand', '>', 0);
    }])
      ->withSum(['stockBalances as total_stock_value' => function ($query) {
        $query->join('stock_items', 'stock_balances.stock_item_id', '=', 'stock_items.id')
          ->selectRaw('SUM(stock_balances.quantity_on_hand * stock_items.unit_cost)');
      }], 'quantity_on_hand')
      ->paginate(15);
  }

  public function findByCode(string $code): ?Store
  {
    return Store::where('code', $code)->first();
  }
}
