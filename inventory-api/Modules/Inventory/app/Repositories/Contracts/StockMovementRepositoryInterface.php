<?php
// Modules/Inventory/app/Repositories/Contracts/StockMovementRepositoryInterface.php

namespace Modules\Inventory\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockMovement;

interface StockMovementRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?StockMovement;
  public function create(array $data): StockMovement;
  public function getMovementsByItem(int $stockItemId, array $filters = []): LengthAwarePaginator;
  public function getMovementsBySerial(int $stockSerialId, array $filters = []): LengthAwarePaginator;
  public function getMovementsByStore(int $storeId, array $filters = []): LengthAwarePaginator;
  public function getMovementsByReference(string $referenceType, int $referenceId): LengthAwarePaginator;
  public function getStockInSummary(array $filters = []): array;
  public function getStockOutSummary(array $filters = []): array;
}
