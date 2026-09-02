<?php
// Modules/Procurement/app/Repositories/Contracts/PurchaseOrderRepositoryInterface.php

namespace Modules\Procurement\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\app\Models\PurchaseOrder;

interface PurchaseOrderRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?PurchaseOrder;
  public function findWithRelations(int $id): ?PurchaseOrder;
  public function create(array $data): PurchaseOrder;
  public function update(int $id, array $data): PurchaseOrder;
  public function delete(int $id): void;
  public function findByPoNo(string $poNo): ?PurchaseOrder;
  public function getOrdersBySupplier(int $supplierId): LengthAwarePaginator;
  public function getOrdersByStore(int $storeId): LengthAwarePaginator;
}
