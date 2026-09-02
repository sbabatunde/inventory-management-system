<?php
// Modules/Assets/app/Repositories/AssetRepository.php

namespace Modules\Assets\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Assets\app\Models\Assets as Asset;
use Modules\Assets\app\Repositories\Contracts\AssetRepositoryInterface;
use Modules\Assets\app\Enums\AssetStatus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AssetRepository implements AssetRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = Asset::with(['stockItem', 'currentStore', 'assignedTo', 'popEquipment', 'clientEquipment'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('asset_code', 'like', "%{$search}%")
            ->orWhere('serial_no', 'like', "%{$search}%");
        });
      })
      ->when($filters['type'] ?? null, function ($q, $type) {
        return $q->where('type', $type);
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('current_store_id', $storeId);
      })
      ->when($filters['assigned_to'] ?? null, function ($q, $userId) {
        return $q->where('assigned_to', $userId);
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

  public function find(int $id): ?Asset
  {
    return Cache::remember("asset:{$id}", 300, function () use ($id) {
      return Asset::find($id);
    });
  }

  public function findWithRelations(int $id): ?Asset
  {
    return Cache::remember("asset_details:{$id}", 300, function () use ($id) {
      return Asset::with(['stockItem', 'currentStore', 'assignedTo', 'popEquipment', 'clientEquipment'])
        ->find($id);
    });
  }

  public function create(array $data): Asset
  {
    $asset = Asset::create($data);
    Cache::forget("asset:{$asset->id}");
    return $asset;
  }

  public function update(int $id, array $data): Asset
  {
    $asset = Asset::findOrFail($id);
    $asset->update($data);
    Cache::forget("asset:{$id}");
    Cache::forget("asset_details:{$id}");
    return $asset->fresh();
  }

  public function delete(int $id): void
  {
    $asset = Asset::findOrFail($id);
    $asset->delete();
    Cache::forget("asset:{$id}");
    Cache::forget("asset_details:{$id}");
  }

  public function findByAssetCode(string $assetCode): ?Asset
  {
    return Asset::where('asset_code', $assetCode)->first();
  }

  public function findBySerialNo(string $serialNo): ?Asset
  {
    return Asset::where('serial_no', $serialNo)->first();
  }

  public function getAssetsByStore(int $storeId): LengthAwarePaginator
  {
    return Asset::with(['stockItem', 'assignedTo'])
      ->where('current_store_id', $storeId)
      ->where('status', AssetStatus::IN_STOCK->value)
      ->latest()
      ->paginate(15);
  }

  public function getAssetsByUser(int $userId): LengthAwarePaginator
  {
    return Asset::with(['stockItem', 'currentStore'])
      ->where('assigned_to', $userId)
      ->whereNotIn('status', [AssetStatus::RETIRED->value])
      ->latest()
      ->paginate(15);
  }

  public function getAssetsRequiringMaintenance(): LengthAwarePaginator
  {
    return Asset::with(['stockItem', 'currentStore'])
      ->where('next_maintenance_due', '<=', now())
      ->where('status', '!=', AssetStatus::RETIRED->value)
      ->latest()
      ->paginate(15);
  }

  public function getAssetSummary(): array
  {
    return Cache::remember('asset_summary', 300, function () {
      $totalAssets = Asset::count();
      $totalValue = Asset::sum('current_value');
      $inStock = Asset::where('status', AssetStatus::IN_STOCK->value)->count();
      $assigned = Asset::where('status', AssetStatus::ASSIGNED->value)->count();
      $installed = Asset::where('status', AssetStatus::INSTALLED->value)->count();
      $maintenance = Asset::where('status', AssetStatus::MAINTENANCE->value)->count();
      $retired = Asset::where('status', AssetStatus::RETIRED->value)->count();

      return [
        'total_assets' => $totalAssets,
        'total_value' => $totalValue,
        'in_stock' => $inStock,
        'assigned' => $assigned,
        'installed' => $installed,
        'maintenance' => $maintenance,
        'retired' => $retired,
      ];
    });
  }
}
