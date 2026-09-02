<?php
// Modules/Inventory/app/Services/StockAdjustmentService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\app\Models\StockAdjustment;
use Modules\Inventory\app\Enums\AdjustmentStatus;
use Modules\Inventory\app\Repositories\Contracts\StockAdjustmentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StockAdjustmentService
{
  protected StockAdjustmentRepositoryInterface $stockAdjustmentRepository;
  protected StockBalanceService $stockBalanceService;

  public function __construct(
    StockAdjustmentRepositoryInterface $stockAdjustmentRepository,
    StockBalanceService $stockBalanceService
  ) {
    $this->stockAdjustmentRepository = $stockAdjustmentRepository;
    $this->stockBalanceService = $stockBalanceService;
  }

  /**
   * Get paginated adjustments
   */
  public function getPaginatedAdjustments(array $filters = []): LengthAwarePaginator
  {
    return $this->stockAdjustmentRepository->paginate($filters);
  }

  /**
   * Get adjustment by ID
   */
  public function getAdjustment(int $id): ?StockAdjustment
  {
    return $this->stockAdjustmentRepository->findWithRelations($id);
  }

  /**
   * Create stock adjustment
   */
  public function createAdjustment(array $data): StockAdjustment
  {
    return DB::transaction(function () use ($data) {
      // Get current balance
      $balance = $this->stockBalanceService->getBalance(
        $data['store_id'],
        $data['stock_item_id']
      );

      $previousQuantity = $balance->quantity_on_hand ?? 0;
      $newQuantity = $data['new_quantity'];
      $difference = $newQuantity - $previousQuantity;

      // Generate adjustment number
      $data['adjustment_no'] = $this->generateAdjustmentNo();
      $data['previous_quantity'] = $previousQuantity;
      $data['quantity_difference'] = $difference;
      $data['status'] = AdjustmentStatus::PENDING->value;
      $data['requested_by'] = auth()->id();

      $adjustment = $this->stockAdjustmentRepository->create($data);

      // Log activity with before/after
      activity()
        ->performedOn($adjustment)
        ->causedBy(auth()->user())
        ->withProperties([
          'previous_quantity' => $previousQuantity,
          'new_quantity' => $newQuantity,
          'difference' => $difference,
          'reason' => $data['reason'],
        ])
        ->log('created stock adjustment');

      return $this->stockAdjustmentRepository->findWithRelations($adjustment->id);
    });
  }

  /**
   * Approve stock adjustment
   */
  public function approveAdjustment(int $id): StockAdjustment
  {
    return DB::transaction(function () use ($id) {
      $adjustment = $this->stockAdjustmentRepository->find($id);

      if (!$adjustment) {
        throw new \Exception('Stock adjustment not found');
      }

      // Validate status
      if ($adjustment->status !== AdjustmentStatus::PENDING->value) {
        throw new \Exception('Adjustment cannot be approved from current status');
      }

      // Update stock balance
      $this->stockBalanceService->updateBalance(
        $adjustment->store_id,
        $adjustment->stock_item_id,
        $adjustment->new_quantity
      );

      // Update adjustment
      $this->stockAdjustmentRepository->update($id, [
        'status' => AdjustmentStatus::APPROVED->value,
        'approved_by' => auth()->id(),
        'approved_at' => now(),
      ]);

      // Log activity
      activity()
        ->performedOn($adjustment)
        ->causedBy(auth()->user())
        ->withProperties([
          'previous_quantity' => $adjustment->previous_quantity,
          'new_quantity' => $adjustment->new_quantity,
        ])
        ->log('approved stock adjustment');

      return $this->stockAdjustmentRepository->findWithRelations($id);
    });
  }

  /**
   * Reject stock adjustment
   */
  public function rejectAdjustment(int $id, ?string $notes = null): StockAdjustment
  {
    return DB::transaction(function () use ($id, $notes) {
      $adjustment = $this->stockAdjustmentRepository->find($id);

      if (!$adjustment) {
        throw new \Exception('Stock adjustment not found');
      }

      // Validate status
      if ($adjustment->status !== AdjustmentStatus::PENDING->value) {
        throw new \Exception('Adjustment cannot be rejected from current status');
      }

      // Update adjustment
      $updateData = [
        'status' => AdjustmentStatus::REJECTED->value,
        'approved_by' => auth()->id(),
        'approved_at' => now(),
      ];

      if ($notes) {
        $updateData['notes'] = $notes;
      }

      $this->stockAdjustmentRepository->update($id, $updateData);

      // Log activity
      activity()
        ->performedOn($adjustment)
        ->causedBy(auth()->user())
        ->withProperties(['notes' => $notes])
        ->log('rejected stock adjustment');

      return $this->stockAdjustmentRepository->findWithRelations($id);
    });
  }

  /**
   * Generate adjustment number
   */
  protected function generateAdjustmentNo(): string
  {
    $prefix = 'ADJ';
    $year = date('Y');
    $count = StockAdjustment::whereYear('created_at', $year)->count() + 1;
    return "{$prefix}-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
  }
}
