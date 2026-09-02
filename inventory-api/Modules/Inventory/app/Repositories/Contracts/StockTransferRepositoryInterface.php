<?php
// Modules/Inventory/app/Repositories/Contracts/StockTransferRepositoryInterface.php

namespace Modules\Inventory\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\App\Models\StockTransfer;

interface StockTransferRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?StockTransfer;
  public function findWithRelations(int $id): ?StockTransfer;
  public function create(array $data): StockTransfer;
  public function update(int $id, array $data): StockTransfer;
  public function delete(int $id): void;
  public function findByTransferNo(string $transferNo): ?StockTransfer;
}
