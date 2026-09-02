<?php
// Modules/Assets/app/Services/AssetService.php

namespace Modules\Assets\app\Services;

use Modules\Assets\app\Models\Assets as Asset;
use Modules\Assets\app\Enums\AssetStatus;
use Modules\Assets\app\Enums\AssetType;
use Modules\Assets\app\Repositories\Contracts\AssetRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AssetService
{
  protected AssetRepositoryInterface $assetRepository;

  public function __construct(AssetRepositoryInterface $assetRepository)
  {
    $this->assetRepository = $assetRepository;
  }

  /**
   * Get paginated assets
   */
  public function getPaginatedAssets(array $filters = []): LengthAwarePaginator
  {
    return $this->assetRepository->paginate($filters);
  }

  /**
   * Get asset by ID with relations
   */
  public function getAsset(int $id): ?Asset
  {
    return $this->assetRepository->findWithRelations($id);
  }

  /**
   * Create new asset
   */
  public function createAsset(array $data): Asset
  {
    return DB::transaction(function () use ($data) {
      // Generate asset code if not provided
      if (empty($data['asset_code'])) {
        $data['asset_code'] = $this->generateAssetCode($data['type']);
      }

      // Calculate current value
      $data['current_value'] = $data['purchase_cost'] ?? 0;
      $data['status'] = $data['status'] ?? AssetStatus::IN_STOCK->value;

      $asset = $this->assetRepository->create($data);

      // Log activity
      activity()
        ->performedOn($asset)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created asset');

      return $this->assetRepository->findWithRelations($asset->id);
    });
  }

  /**
   * Update asset
   */
  public function updateAsset(int $id, array $data): Asset
  {
    return DB::transaction(function () use ($id, $data) {
      $asset = $this->assetRepository->find($id);

      if (!$asset) {
        throw new \Exception('Asset not found');
      }

      $asset = $this->assetRepository->update($id, $data);

      // Log activity
      activity()
        ->performedOn($asset)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('updated asset');

      return $this->assetRepository->findWithRelations($id);
    });
  }

  /**
   * Delete asset
   */
  public function deleteAsset(int $id): void
  {
    DB::transaction(function () use ($id) {
      $asset = $this->assetRepository->find($id);

      if (!$asset) {
        throw new \Exception('Asset not found');
      }

      // Don't allow deleting installed or assigned assets
      if (in_array($asset->status, [AssetStatus::INSTALLED->value, AssetStatus::ASSIGNED->value])) {
        throw new \Exception('Cannot delete asset that is currently assigned or installed');
      }

      // Log before deleting
      activity()
        ->performedOn($asset)
        ->causedBy(auth()->user())
        ->log('deleted asset');

      $this->assetRepository->delete($id);
    });
  }

  /**
   * Assign asset to user
   */
  public function assignAsset(int $id, int $userId): Asset
  {
    return DB::transaction(function () use ($id, $userId) {
      $asset = $this->assetRepository->find($id);

      if (!$asset) {
        throw new \Exception('Asset not found');
      }

      if (!$asset->status->isAvailable()) {
        throw new \Exception('Asset is not available for assignment');
      }

      $asset = $this->assetRepository->update($id, [
        'status' => AssetStatus::ASSIGNED->value,
        'assigned_to' => $userId,
        'assigned_at' => now(),
      ]);

      // Log activity
      activity()
        ->performedOn($asset)
        ->causedBy(auth()->user())
        ->withProperties(['assigned_to' => $userId])
        ->log('assigned asset');

      return $this->assetRepository->findWithRelations($id);
    });
  }

  /**
   * Unassign asset
   */
  public function unassignAsset(int $id): Asset
  {
    return DB::transaction(function () use ($id) {
      $asset = $this->assetRepository->find($id);

      if (!$asset) {
        throw new \Exception('Asset not found');
      }

      $asset = $this->assetRepository->update($id, [
        'status' => AssetStatus::IN_STOCK->value,
        'assigned_to' => null,
        'assigned_at' => null,
      ]);

      // Log activity
      activity()
        ->performedOn($asset)
        ->causedBy(auth()->user())
        ->log('unassigned asset');

      return $this->assetRepository->findWithRelations($id);
    });
  }

  /**
   * Update asset status
   */
  public function updateAssetStatus(int $id, string $status): Asset
  {
    return DB::transaction(function () use ($id, $status) {
      $asset = $this->assetRepository->find($id);

      if (!$asset) {
        throw new \Exception('Asset not found');
      }

      $updateData = ['status' => $status];

      // Set additional fields based on status
      if ($status === AssetStatus::INSTALLED->value) {
        $updateData['installed_at'] = now();
      } elseif ($status === AssetStatus::MAINTENANCE->value) {
        $updateData['last_maintenance_at'] = now();
      } elseif ($status === AssetStatus::RETIRED->value) {
        $updateData['is_active'] = false;
      }

      $asset = $this->assetRepository->update($id, $updateData);

      // Log activity
      activity()
        ->performedOn($asset)
        ->causedBy(auth()->user())
        ->withProperties(['status' => $status])
        ->log('updated asset status');

      return $this->assetRepository->findWithRelations($id);
    });
  }

  /**
   * Calculate depreciation for asset
   */
  public function calculateDepreciation(int $id): array
  {
    $asset = $this->assetRepository->find($id);

    if (!$asset) {
      throw new \Exception('Asset not found');
    }

    $currentValue = $asset->calculateDepreciation();

    // Update current value
    $this->assetRepository->update($id, ['current_value' => $currentValue]);

    return [
      'asset_id' => $asset->id,
      'purchase_cost' => $asset->purchase_cost,
      'current_value' => $currentValue,
      'depreciation_amount' => $asset->purchase_cost - $currentValue,
      'depreciation_percentage' => $asset->purchase_cost > 0
        ? (($asset->purchase_cost - $currentValue) / $asset->purchase_cost) * 100
        : 0,
    ];
  }

  /**
   * Get asset summary
   */
  public function getAssetSummary(): array
  {
    return $this->assetRepository->getAssetSummary();
  }

  /**
   * Generate asset code
   */
  protected function generateAssetCode(string $type): string
  {
    $prefix = strtoupper(substr($type, 0, 3));
    $count = Asset::where('type', $type)->count() + 1;
    return "AST-{$prefix}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
  }
}
