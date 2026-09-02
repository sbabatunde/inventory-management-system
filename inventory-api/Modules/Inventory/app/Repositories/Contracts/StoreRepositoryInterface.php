<?php
// Modules/Inventory/app/Repositories/Contracts/StoreRepositoryInterface.php

namespace Modules\Inventory\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Inventory\app\DTOs\StoreDTO;
use Modules\Inventory\app\Models\Store;

interface StoreRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?Store;
  public function create(array $data): Store;
  public function update(int $id, array $data): Store;
  public function delete(int $id): void;
  public function getStoresWithStock(): LengthAwarePaginator;
  public function findByCode(string $code): ?Store;
}
