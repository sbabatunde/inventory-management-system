<?php
// Modules/Procurement/app/Repositories/PurchaseRequisitionRepository.php

namespace Modules\Procurement\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\App\Models\PurchaseRequisition;
use Modules\Procurement\App\Repositories\Contracts\PurchaseRequisitionRepositoryInterface;
use Modules\Procurement\App\Enums\RequisitionStatus;
use Illuminate\Support\Facades\Cache;

class PurchaseRequisitionRepository implements PurchaseRequisitionRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = PurchaseRequisition::with(['items.stockItem', 'requestedBy', 'approvedBy'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('pr_no', 'like', "%{$search}%")
            ->orWhere('title', 'like', "%{$search}%");
        });
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['priority'] ?? null, function ($q, $priority) {
        return $q->where('priority', $priority);
      })
      ->when($filters['requested_by'] ?? null, function ($q, $userId) {
        return $q->where('requested_by', $userId);
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?PurchaseRequisition
  {
    return Cache::remember("purchase_requisition:{$id}", 300, function () use ($id) {
      return PurchaseRequisition::find($id);
    });
  }

  public function findWithRelations(int $id): ?PurchaseRequisition
  {
    return Cache::remember("purchase_requisition_details:{$id}", 300, function () use ($id) {
      return PurchaseRequisition::with(['items.stockItem', 'requestedBy', 'approvedBy', 'purchaseOrder'])
        ->find($id);
    });
  }

  public function create(array $data): PurchaseRequisition
  {
    $requisition = PurchaseRequisition::create($data);
    Cache::forget("purchase_requisition:{$requisition->id}");
    return $requisition;
  }

  public function update(int $id, array $data): PurchaseRequisition
  {
    $requisition = PurchaseRequisition::findOrFail($id);
    $requisition->update($data);
    Cache::forget("purchase_requisition:{$id}");
    Cache::forget("purchase_requisition_details:{$id}");
    return $requisition->fresh();
  }

  public function delete(int $id): void
  {
    $requisition = PurchaseRequisition::findOrFail($id);
    $requisition->delete();
    Cache::forget("purchase_requisition:{$id}");
    Cache::forget("purchase_requisition_details:{$id}");
  }

  public function findByPrNo(string $prNo): ?PurchaseRequisition
  {
    return PurchaseRequisition::where('pr_no', $prNo)->first();
  }

  public function getPendingApprovals(): LengthAwarePaginator
  {
    return PurchaseRequisition::with(['items.stockItem', 'requestedBy'])
      ->where('status', RequisitionStatus::PENDING_APPROVAL->value)
      ->latest()
      ->paginate(15);
  }
}
