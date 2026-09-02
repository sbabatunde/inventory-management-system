<?php
// Modules/Inventory/app/Services/StockMovementService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\app\Models\StockMovement;
use Modules\Inventory\app\Enums\StockMovementType;
use Modules\Inventory\app\Repositories\Contracts\StockMovementRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StockMovementService
{
  protected StockMovementRepositoryInterface $stockMovementRepository;

  public function __construct(StockMovementRepositoryInterface $stockMovementRepository)
  {
    $this->stockMovementRepository = $stockMovementRepository;
  }

  /**
   * Get paginated movements
   */
  public function getPaginatedMovements(array $filters = []): LengthAwarePaginator
  {
    return $this->stockMovementRepository->paginate($filters);
  }

  /**
   * Get movement by ID
   */
  public function getMovement(int $id): ?StockMovement
  {
    return $this->stockMovementRepository->find($id);
  }

  /**
   * Record a stock movement
   */
  public function recordMovement(array $data): StockMovement
  {
    return DB::transaction(function () use ($data) {
      $movement = $this->stockMovementRepository->create($data);

      // Log activity
      activity()
        ->performedOn($movement)
        ->causedBy(auth()->user())
        ->withProperties([
          'movement_type' => $data['movement_type'],
          'quantity' => $data['quantity'],
          'quantity_before' => $data['quantity_before'],
          'quantity_after' => $data['quantity_after'],
        ])
        ->log('recorded stock movement');

      return $movement;
    });
  }

  /**
   * Get movements by item
   */
  public function getMovementsByItem(int $stockItemId, array $filters = []): LengthAwarePaginator
  {
    return $this->stockMovementRepository->getMovementsByItem($stockItemId, $filters);
  }

  /**
   * Get movements by serial
   */
  public function getMovementsBySerial(int $stockSerialId, array $filters = []): LengthAwarePaginator
  {
    return $this->stockMovementRepository->getMovementsBySerial($stockSerialId, $filters);
  }

  /**
   * Get movements by store
   */
  public function getMovementsByStore(int $storeId, array $filters = []): LengthAwarePaginator
  {
    return $this->stockMovementRepository->getMovementsByStore($storeId, $filters);
  }

  /**
   * Get movements by reference
   */
  public function getMovementsByReference(string $referenceType, int $referenceId): LengthAwarePaginator
  {
    return $this->stockMovementRepository->getMovementsByReference($referenceType, $referenceId);
  }

  /**
   * Get stock summary
   */
  public function getStockSummary(array $filters = []): array
  {
    return [
      'stock_in' => $this->stockMovementRepository->getStockInSummary($filters),
      'stock_out' => $this->stockMovementRepository->getStockOutSummary($filters),
      'net_movement' => $this->stockMovementRepository->getStockInSummary($filters)['total_quantity']
        - $this->stockMovementRepository->getStockOutSummary($filters)['total_quantity'],
    ];
  }

  /**
   * Get movement types
   */
  public function getMovementTypes(): array
  {
    return StockMovementType::options();
  }
}
