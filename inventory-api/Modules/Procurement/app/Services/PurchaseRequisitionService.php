<?php
// Modules/Procurement/app/Services/PurchaseRequisitionService.php

namespace Modules\Procurement\app\Services;

use Modules\Procurement\App\Models\PurchaseRequisition;
use Modules\Procurement\App\Models\PurchaseRequisitionItem;
use Modules\Procurement\App\DTOs\PurchaseRequisitionDTO;
use Modules\Procurement\App\Enums\RequisitionStatus;
use Modules\Procurement\App\Enums\RequisitionPriority;
use Modules\Procurement\App\Repositories\Contracts\PurchaseRequisitionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PurchaseRequisitionService
{
  protected PurchaseRequisitionRepositoryInterface $requisitionRepository;

  public function __construct(PurchaseRequisitionRepositoryInterface $requisitionRepository)
  {
    $this->requisitionRepository = $requisitionRepository;
  }

  /**
   * Get paginated requisitions with DTO transformation
   */
  public function getPaginatedRequisitions(array $filters = []): array
  {
    $requisitions = $this->requisitionRepository->paginate($filters);

    return [
      'requisitions' => $requisitions->through(function ($requisition) {
        // Load computed attributes
        $requisition->total_estimated_cost = $requisition->items()->sum('estimated_total_cost');
        $requisition->item_count = $requisition->items()->count();

        return PurchaseRequisitionDTO::fromArray($requisition->toArray())->toArray();
      })->items(),
      'pagination' => [
        'current_page' => $requisitions->currentPage(),
        'last_page' => $requisitions->lastPage(),
        'per_page' => $requisitions->perPage(),
        'total' => $requisitions->total(),
        'from' => $requisitions->firstItem(),
        'to' => $requisitions->lastItem(),
      ],
    ];
  }

  /**
   * Get requisition by ID with DTO
   */
  public function getRequisition(int $id): ?array
  {
    $requisition = $this->requisitionRepository->findWithRelations($id);

    if (!$requisition) {
      return null;
    }

    // Load computed attributes
    $requisition->total_estimated_cost = $requisition->items()->sum('estimated_total_cost');
    $requisition->item_count = $requisition->items()->count();

    return PurchaseRequisitionDTO::fromArray($requisition->toArray())->toArray();
  }

  /**
   * Create requisition with DTO return
   */
  public function createRequisition(array $data): array
  {
    return DB::transaction(function () use ($data) {
      // Generate PR number
      $data['pr_no'] = $this->generatePrNo();
      $data['status'] = RequisitionStatus::DRAFT->value;
      $data['requested_by'] = auth()->id();

      $requisition = $this->requisitionRepository->create($data);

      // Create items
      foreach ($data['items'] as $item) {
        $estimatedTotal = $item['quantity'] * ($item['estimated_unit_cost'] ?? 0);

        PurchaseRequisitionItem::create([
          'purchase_requisition_id' => $requisition->id,
          'stock_item_id' => $item['stock_item_id'],
          'quantity' => $item['quantity'],
          'unit_of_measure' => $item['unit_of_measure'],
          'estimated_unit_cost' => $item['estimated_unit_cost'] ?? 0,
          'estimated_total_cost' => $estimatedTotal,
          'notes' => $item['notes'] ?? null,
        ]);
      }

      // Log activity
      activity()
        ->performedOn($requisition)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created purchase requisition');

      // Return with DTO
      $requisitionWithRelations = $this->requisitionRepository->findWithRelations($requisition->id);
      $requisitionWithRelations->total_estimated_cost = $requisitionWithRelations->items()->sum('estimated_total_cost');
      $requisitionWithRelations->item_count = $requisitionWithRelations->items()->count();

      return PurchaseRequisitionDTO::fromArray($requisitionWithRelations->toArray())->toArray();
    });
  }

  /**
   * Update requisition with DTO return
   */
  public function updateRequisition(int $id, array $data): array
  {
    return DB::transaction(function () use ($id, $data) {
      $requisition = $this->requisitionRepository->find($id);

      if (!$requisition) {
        throw new \Exception('Purchase requisition not found');
      }

      // Only allow updates if requisition is in draft status
      if ($requisition->status !== RequisitionStatus::DRAFT) {
        throw new \Exception('Requisition cannot be updated from current status');
      }

      // Update requisition details
      $this->requisitionRepository->update($id, [
        'title' => $data['title'],
        'description' => $data['description'] ?? null,
        'priority' => $data['priority'] ?? RequisitionPriority::MEDIUM->value,
        'notes' => $data['notes'] ?? null,
      ]);

      // Update items
      if (isset($data['items'])) {
        $this->updateRequisitionItems($id, $data['items']);
      }

      // Log activity
      activity()
        ->performedOn($requisition)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('updated purchase requisition');

      // Return with DTO
      $updatedRequisition = $this->requisitionRepository->findWithRelations($id);
      $updatedRequisition->total_estimated_cost = $updatedRequisition->items()->sum('estimated_total_cost');
      $updatedRequisition->item_count = $updatedRequisition->items()->count();

      return PurchaseRequisitionDTO::fromArray($updatedRequisition->toArray())->toArray();
    });
  }

  /**
   * Submit requisition for approval with DTO return
   */
  public function submitForApproval(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $requisition = $this->requisitionRepository->find($id);

      if (!$requisition) {
        throw new \Exception('Purchase requisition not found');
      }

      if (!$requisition->status->canTransitionTo(RequisitionStatus::PENDING_APPROVAL)) {
        throw new \Exception('Requisition cannot be submitted from current status');
      }

      // Validate that requisition has items
      if ($requisition->items()->count() === 0) {
        throw new \Exception('Cannot submit requisition without items');
      }

      $updated = $this->requisitionRepository->update($id, [
        'status' => RequisitionStatus::PENDING_APPROVAL->value,
      ]);

      // Log activity
      activity()
        ->performedOn($requisition)
        ->causedBy(auth()->user())
        ->log('submitted purchase requisition for approval');

      return PurchaseRequisitionDTO::fromArray($updated->toArray())->toArray();
    });
  }

  /**
   * Approve requisition with DTO return
   */
  public function approveRequisition(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $requisition = $this->requisitionRepository->find($id);

      if (!$requisition) {
        throw new \Exception('Purchase requisition not found');
      }

      if (!$requisition->status->canTransitionTo(RequisitionStatus::APPROVED)) {
        throw new \Exception('Requisition cannot be approved from current status');
      }

      $updated = $this->requisitionRepository->update($id, [
        'status' => RequisitionStatus::APPROVED->value,
        'approved_by' => auth()->id(),
        'approved_at' => now(),
      ]);

      // Log activity
      activity()
        ->performedOn($requisition)
        ->causedBy(auth()->user())
        ->log('approved purchase requisition');

      return PurchaseRequisitionDTO::fromArray($updated->toArray())->toArray();
    });
  }

  /**
   * Reject requisition with DTO return
   */
  public function rejectRequisition(int $id, string $reason): array
  {
    return DB::transaction(function () use ($id, $reason) {
      $requisition = $this->requisitionRepository->find($id);

      if (!$requisition) {
        throw new \Exception('Purchase requisition not found');
      }

      if (!$requisition->status->canTransitionTo(RequisitionStatus::REJECTED)) {
        throw new \Exception('Requisition cannot be rejected from current status');
      }

      $updated = $this->requisitionRepository->update($id, [
        'status' => RequisitionStatus::REJECTED->value,
        'rejection_reason' => $reason,
      ]);

      // Log activity
      activity()
        ->performedOn($requisition)
        ->causedBy(auth()->user())
        ->withProperties(['reason' => $reason])
        ->log('rejected purchase requisition');

      return PurchaseRequisitionDTO::fromArray($updated->toArray())->toArray();
    });
  }

  /**
   * Cancel requisition with DTO return
   */
  public function cancelRequisition(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $requisition = $this->requisitionRepository->find($id);

      if (!$requisition) {
        throw new \Exception('Purchase requisition not found');
      }

      if (!$requisition->status->canTransitionTo(RequisitionStatus::CANCELLED)) {
        throw new \Exception('Requisition cannot be cancelled from current status');
      }

      $updated = $this->requisitionRepository->update($id, [
        'status' => RequisitionStatus::CANCELLED->value,
      ]);

      // Log activity
      activity()
        ->performedOn($requisition)
        ->causedBy(auth()->user())
        ->log('cancelled purchase requisition');

      return PurchaseRequisitionDTO::fromArray($updated->toArray())->toArray();
    });
  }

  /**
   * Get pending approvals with DTO transformation
   */
  public function getPendingApprovals(): array
  {
    $requisitions = $this->requisitionRepository->getPendingApprovals();

    return [
      'requisitions' => $requisitions->through(function ($requisition) {
        return PurchaseRequisitionDTO::fromArray($requisition->toArray())->toArray();
      })->items(),
      'pagination' => [
        'current_page' => $requisitions->currentPage(),
        'last_page' => $requisitions->lastPage(),
        'per_page' => $requisitions->perPage(),
        'total' => $requisitions->total(),
        'from' => $requisitions->firstItem(),
        'to' => $requisitions->lastItem(),
      ],
    ];
  }

  /**
   * Update requisition items
   */
  protected function updateRequisitionItems(int $requisitionId, array $items): void
  {
    $existingItemIds = PurchaseRequisitionItem::where('purchase_requisition_id', $requisitionId)
      ->pluck('id')
      ->toArray();
    $updatedItemIds = [];

    foreach ($items as $itemData) {
      if (isset($itemData['id'])) {
        // Update existing item
        $item = PurchaseRequisitionItem::find($itemData['id']);

        if ($item && $item->purchase_requisition_id === $requisitionId) {
          $estimatedTotal = $itemData['quantity'] * ($itemData['estimated_unit_cost'] ?? 0);

          $item->update([
            'stock_item_id' => $itemData['stock_item_id'],
            'quantity' => $itemData['quantity'],
            'unit_of_measure' => $itemData['unit_of_measure'],
            'estimated_unit_cost' => $itemData['estimated_unit_cost'] ?? 0,
            'estimated_total_cost' => $estimatedTotal,
            'notes' => $itemData['notes'] ?? null,
          ]);

          $updatedItemIds[] = $item->id;
        }
      } else {
        // Create new item
        $estimatedTotal = $itemData['quantity'] * ($itemData['estimated_unit_cost'] ?? 0);

        $newItem = PurchaseRequisitionItem::create([
          'purchase_requisition_id' => $requisitionId,
          'stock_item_id' => $itemData['stock_item_id'],
          'quantity' => $itemData['quantity'],
          'unit_of_measure' => $itemData['unit_of_measure'],
          'estimated_unit_cost' => $itemData['estimated_unit_cost'] ?? 0,
          'estimated_total_cost' => $estimatedTotal,
          'notes' => $itemData['notes'] ?? null,
        ]);

        $updatedItemIds[] = $newItem->id;
      }
    }

    // Delete items not in update
    $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);

    if (!empty($itemsToDelete)) {
      PurchaseRequisitionItem::whereIn('id', $itemsToDelete)
        ->where('purchase_requisition_id', $requisitionId)
        ->delete();
    }
  }

  /**
   * Generate PR number
   */
  protected function generatePrNo(): string
  {
    $prefix = 'PR';
    $year = date('Y');
    $count = PurchaseRequisition::whereYear('created_at', $year)->count() + 1;
    return "{$prefix}-{$year}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
  }
}
