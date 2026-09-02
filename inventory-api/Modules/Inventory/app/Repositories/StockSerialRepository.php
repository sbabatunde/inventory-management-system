<?php
// Modules/Inventory/app/Repositories/StockSerialRepository.php

namespace Modules\Inventory\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockSerial;
use Modules\Inventory\app\Repositories\Contracts\StockSerialRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StockSerialRepository implements StockSerialRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = StockSerial::with(['stockItem', 'currentStore'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where('serial_no', 'like', "%{$search}%");
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('current_status', $status);
      })
      ->when($filters['stock_item_id'] ?? null, function ($q, $stockItemId) {
        return $q->where('stock_item_id', $stockItemId);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('current_store_id', $storeId);
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?StockSerial
  {
    return Cache::remember("stock_serial:{$id}", 300, function () use ($id) {
      return StockSerial::with(['stockItem', 'currentStore'])->find($id);
    });
  }

  public function findBySerialNo(string $serialNo, int $stockItemId): ?StockSerial
  {
    return StockSerial::where('serial_no', $serialNo)
      ->where('stock_item_id', $stockItemId)
      ->first();
  }

  public function create(array $data): StockSerial
  {
    $serial = StockSerial::create($data);
    Cache::forget("stock_serial:{$serial->id}");
    return $serial;
  }

  public function update(int $id, array $data): StockSerial
  {
    $serial = StockSerial::findOrFail($id);
    $serial->update($data);
    Cache::forget("stock_serial:{$id}");
    return $serial->fresh();
  }

  public function delete(int $id): void
  {
    $serial = StockSerial::findOrFail($id);
    $serial->delete();
    Cache::forget("stock_serial:{$id}");
  }

  public function getSerialsByItem(int $stockItemId): LengthAwarePaginator
  {
    return StockSerial::with(['currentStore'])
      ->where('stock_item_id', $stockItemId)
      ->latest()
      ->paginate(15);
  }

  public function getSerialsByStore(int $storeId): LengthAwarePaginator
  {
    return StockSerial::with(['stockItem'])
      ->where('current_store_id', $storeId)
      ->where('current_status', 'in_stock')
      ->latest()
      ->paginate(15);
  }

  public function getSerialHistory(int $id): array
  {
    $serial = StockSerial::findOrFail($id);

    // Get all movements for this serial
    $history = DB::table('stock_movements')
      ->where('stock_serial_id', $id)
      ->orderBy('created_at', 'desc')
      ->get()
      ->map(function ($movement) {
        return [
          'id' => $movement->id,
          'type' => $movement->movement_type,
          'from_store_id' => $movement->from_store_id,
          'to_store_id' => $movement->to_store_id,
          'status' => $movement->status,
          'created_at' => $movement->created_at,
        ];
      })
      ->toArray();

    return [
      'serial' => $serial,
      'history' => $history,
    ];
  }
}
