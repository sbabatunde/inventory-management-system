<?php
// Modules/Inventory/app/Repositories/StockTransferRepository.php

namespace Modules\Inventory\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockTransfer;
use Modules\Inventory\app\Repositories\Contracts\StockTransferRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class StockTransferRepository implements StockTransferRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = StockTransfer::with(['fromStore', 'toStore', 'items.stockItem'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where('transfer_no', 'like', "%{$search}%");
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['from_store_id'] ?? null, function ($q, $storeId) {
        return $q->where('from_store_id', $storeId);
      })
      ->when($filters['to_store_id'] ?? null, function ($q, $storeId) {
        return $q->where('to_store_id', $storeId);
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

  public function find(int $id): ?StockTransfer
  {
    return Cache::remember("stock_transfer:{$id}", 300, function () use ($id) {
      return StockTransfer::find($id);
    });
  }

  public function findWithRelations(int $id): ?StockTransfer
  {
    return Cache::remember("stock_transfer_details:{$id}", 300, function () use ($id) {
      return StockTransfer::with(['fromStore', 'toStore', 'items.stockItem'])
        ->find($id);
    });
  }

  public function create(array $data): StockTransfer
  {
    $transfer = StockTransfer::create($data);
    Cache::forget("stock_transfer:{$transfer->id}");
    return $transfer;
  }

  public function update(int $id, array $data): StockTransfer
  {
    $transfer = StockTransfer::findOrFail($id);
    $transfer->update($data);
    Cache::forget("stock_transfer:{$id}");
    Cache::forget("stock_transfer_details:{$id}");
    return $transfer->fresh();
  }

  public function delete(int $id): void
  {
    $transfer = StockTransfer::findOrFail($id);
    $transfer->delete();
    Cache::forget("stock_transfer:{$id}");
    Cache::forget("stock_transfer_details:{$id}");
  }

  public function findByTransferNo(string $transferNo): ?StockTransfer
  {
    return StockTransfer::where('transfer_no', $transferNo)->first();
  }
}
