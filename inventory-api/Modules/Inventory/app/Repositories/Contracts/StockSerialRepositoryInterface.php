<?php
// Modules/Inventory/app/Repositories/Contracts/StockSerialRepositoryInterface.php

namespace Modules\Inventory\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockSerial;

interface StockSerialRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?StockSerial;
  public function findBySerialNo(string $serialNo, int $stockItemId): ?StockSerial;
  public function create(array $data): StockSerial;
  public function update(int $id, array $data): StockSerial;
  public function delete(int $id): void;
  public function getSerialsByItem(int $stockItemId): LengthAwarePaginator;
  public function getSerialsByStore(int $storeId): LengthAwarePaginator;
  public function getSerialHistory(int $id): array;
}
