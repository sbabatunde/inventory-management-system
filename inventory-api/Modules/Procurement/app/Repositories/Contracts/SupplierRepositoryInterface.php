<?php
// Modules/Procurement/app/Repositories/Contracts/SupplierRepositoryInterface.php

namespace Modules\Procurement\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\App\Models\Supplier;

interface SupplierRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?Supplier;
  public function create(array $data): Supplier;
  public function update(int $id, array $data): Supplier;
  public function delete(int $id): void;
  public function findByCode(string $code): ?Supplier;
}
