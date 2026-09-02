<?php
// Modules/Inventory/app/Repositories/StockMovementRepository.php

namespace Modules\Inventory\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockMovement;
use Modules\Inventory\app\Repositories\Contracts\StockMovementRepositoryInterface;
use Modules\Inventory\app\Enums\StockMovementType;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StockMovementRepository implements StockMovementRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = StockMovement::with(['stockItem', 'stockSerial', 'fromStore', 'toStore', 'createdBy'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->whereHas('stockItem', function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('code', 'like', "%{$search}%");
        });
      })
      ->when($filters['movement_type'] ?? null, function ($q, $type) {
        return $q->where('movement_type', $type);
      })
      ->when($filters['stock_item_id'] ?? null, function ($q, $stockItemId) {
        return $q->where('stock_item_id', $stockItemId);
      })
      ->when($filters['stock_serial_id'] ?? null, function ($q, $stockSerialId) {
        return $q->where('stock_serial_id', $stockSerialId);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where(function ($query) use ($storeId) {
          $query->where('from_store_id', $storeId)
            ->orWhere('to_store_id', $storeId);
        });
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?StockMovement
  {
    return Cache::remember("stock_movement:{$id}", 300, function () use ($id) {
      return StockMovement::with(['stockItem', 'stockSerial', 'fromStore', 'toStore', 'createdBy'])
        ->find($id);
    });
  }

  public function create(array $data): StockMovement
  {
    $movement = StockMovement::create($data);
    Cache::forget("stock_movement:{$movement->id}");
    return $movement;
  }

  public function getMovementsByItem(int $stockItemId, array $filters = []): LengthAwarePaginator
  {
    return StockMovement::with(['fromStore', 'toStore', 'createdBy'])
      ->where('stock_item_id', $stockItemId)
      ->when($filters['movement_type'] ?? null, function ($q, $type) {
        return $q->where('movement_type', $type);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      })
      ->latest()
      ->paginate($filters['per_page'] ?? 15);
  }

  public function getMovementsBySerial(int $stockSerialId, array $filters = []): LengthAwarePaginator
  {
    return StockMovement::with(['fromStore', 'toStore', 'createdBy'])
      ->where('stock_serial_id', $stockSerialId)
      ->when($filters['movement_type'] ?? null, function ($q, $type) {
        return $q->where('movement_type', $type);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      })
      ->latest()
      ->paginate($filters['per_page'] ?? 15);
  }

  public function getMovementsByStore(int $storeId, array $filters = []): LengthAwarePaginator
  {
    return StockMovement::with(['stockItem', 'fromStore', 'toStore', 'createdBy'])
      ->where(function ($query) use ($storeId) {
        $query->where('from_store_id', $storeId)
          ->orWhere('to_store_id', $storeId);
      })
      ->when($filters['movement_type'] ?? null, function ($q, $type) {
        return $q->where('movement_type', $type);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      })
      ->latest()
      ->paginate($filters['per_page'] ?? 15);
  }

  public function getMovementsByReference(string $referenceType, int $referenceId): LengthAwarePaginator
  {
    return StockMovement::with(['stockItem', 'fromStore', 'toStore', 'createdBy'])
      ->where('reference_type', $referenceType)
      ->where('reference_id', $referenceId)
      ->latest()
      ->paginate(15);
  }

  public function getStockInSummary(array $filters = []): array
  {
    $query = StockMovement::whereIn('movement_type', [
      StockMovementType::RECEIPT->value,
      StockMovementType::RETURN->value,
    ])
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('to_store_id', $storeId);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      });

    return [
      'total_quantity' => $query->sum('quantity'),
      'total_movements' => $query->count(),
    ];
  }

  public function getStockOutSummary(array $filters = []): array
  {
    $query = StockMovement::whereIn('movement_type', [
      StockMovementType::ISSUE->value,
      StockMovementType::TRANSFER->value,
    ])
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('from_store_id', $storeId);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      });

    return [
      'total_quantity' => $query->sum('quantity'),
      'total_movements' => $query->count(),
    ];
  }
}
