<?php
// Modules/Procurement/app/Repositories/Contracts/GoodsReceiptRepositoryInterface.php

namespace Modules\Procurement\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\app\Models\GoodsReceipt;

interface GoodsReceiptRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?GoodsReceipt;
  public function findWithRelations(int $id): ?GoodsReceipt;
  public function create(array $data): GoodsReceipt;
  public function update(int $id, array $data): GoodsReceipt;
  public function findByGrNo(string $grNo): ?GoodsReceipt;
}
