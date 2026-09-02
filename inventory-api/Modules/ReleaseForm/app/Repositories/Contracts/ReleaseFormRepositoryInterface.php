<?php
// Modules/ReleaseForm/app/Repositories/Contracts/ReleaseFormRepositoryInterface.php

namespace Modules\ReleaseForm\app\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\ReleaseForm\app\Models\ReleaseForm;

interface ReleaseFormRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
  public function find(int $id): ?ReleaseForm;
  public function findWithRelations(int $id): ?ReleaseForm;
  public function create(array $data): ReleaseForm;
  public function update(int $id, array $data): ReleaseForm;
  public function delete(int $id): void;
  public function findByFormNo(string $formNo): ?ReleaseForm;
  public function getPendingApprovals(): LengthAwarePaginator;
  public function getPendingReconciliation(): LengthAwarePaginator;
  public function getReleaseSummary(array $filters = []): array;
}
