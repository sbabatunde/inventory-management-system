<?php
// Modules/Inventory/app/Repositories/Contracts/StockAdjustmentRepositoryInterface.php

namespace Modules\Inventory\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockAdjustment;

interface StockAdjustmentRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?StockAdjustment;
  public function findWithRelations(int $id): ?StockAdjustment;
  public function create(array $data): StockAdjustment;
  public function update(int $id, array $data): StockAdjustment;
  public function findByAdjustmentNo(string $adjustmentNo): ?StockAdjustment;
}
