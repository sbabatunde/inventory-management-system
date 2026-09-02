<?php
// Modules/Inventory/app/Repositories/Contracts/StockItemRepositoryInterface.php

namespace Modules\Inventory\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\Models\StockItem;

interface StockItemRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?StockItem;
  public function create(array $data): StockItem;
  public function update(int $id, array $data): StockItem;
  public function delete(int $id): void;
  public function getLowStockItems(): LengthAwarePaginator;
  public function findByCode(string $code): ?StockItem;
  public function getSerializedItems(): LengthAwarePaginator;
}
