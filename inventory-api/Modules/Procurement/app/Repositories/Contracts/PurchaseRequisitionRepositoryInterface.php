<?php
// Modules/Procurement/app/Repositories/Contracts/PurchaseRequisitionRepositoryInterface.php

namespace Modules\Procurement\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\app\Models\PurchaseRequisition;

interface PurchaseRequisitionRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?PurchaseRequisition;
  public function findWithRelations(int $id): ?PurchaseRequisition;
  public function create(array $data): PurchaseRequisition;
  public function update(int $id, array $data): PurchaseRequisition;
  public function delete(int $id): void;
  public function findByPrNo(string $prNo): ?PurchaseRequisition;
  public function getPendingApprovals(): LengthAwarePaginator;
}
