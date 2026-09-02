<?php
// Modules/Assets/app/Repositories/Contracts/AssetRepositoryInterface.php

namespace Modules\Assets\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Assets\app\Models\Assets as Asset;

interface AssetRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?Asset;
  public function findWithRelations(int $id): ?Asset;
  public function create(array $data): Asset;
  public function update(int $id, array $data): Asset;
  public function delete(int $id): void;
  public function findByAssetCode(string $assetCode): ?Asset;
  public function findBySerialNo(string $serialNo): ?Asset;
  public function getAssetsByStore(int $storeId): LengthAwarePaginator;
  public function getAssetsByUser(int $userId): LengthAwarePaginator;
  public function getAssetsRequiringMaintenance(): LengthAwarePaginator;
  public function getAssetSummary(): array;
}
