<?php
// Modules/Inventory/app/Services/StockTransferService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\app\Models\StockTransfer;
use Modules\Inventory\app\Models\StockTransferItem;
use Modules\Inventory\app\Enums\TransferStatus;
use Modules\Inventory\app\Repositories\Contracts\StockTransferRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StockTransferService
{
  protected StockTransferRepositoryInterface $stockTransferRepository;
  protected StockBalanceService $stockBalanceService;

  public function __construct(
    StockTransferRepositoryInterface $stockTransferRepository,
    StockBalanceService $stockBalanceService
  ) {
    $this->stockTransferRepository = $stockTransferRepository;
    $this->stockBalanceService = $stockBalanceService;
  }

  /**
   * Get paginated transfers
   */
  public function getPaginatedTransfers(array $filters = []): LengthAwarePaginator
  {
    return $this->stockTransferRepository->paginate($filters);
  }

  /**
   * Get transfer by ID with relations
   */
  public function getTransfer(int $id): ?StockTransfer
  {
    return $this->stockTransferRepository->findWithRelations($id);
  }

  /**
   * Create stock transfer
   */
  public function createTransfer(array $data): StockTransfer
  {
    return DB::transaction(function () use ($data) {
      // Generate transfer number
      $data['transfer_no'] = $this->generateTransferNo();
      $data['status'] = TransferStatus::REQUESTED->value;
      $data['requested_by'] = auth()->id();

      $transfer = $this->stockTransferRepository->create($data);

      // Create transfer items
      foreach ($data['items'] as $item) {
        StockTransferItem::create([
          'stock_transfer_id' => $transfer->id,
          'stock_item_id' => $item['stock_item_id'],
          'quantity' => $item['quantity'],
          'serial_numbers' => $item['serial_numbers'] ?? null,
        ]);
      }

      // Log activity
      activity()
        ->performedOn($transfer)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created stock transfer');

      return $this->stockTransferRepository->findWithRelations($transfer->id);
    });
  }

  /**
   * Approve stock transfer
   */
  public function approveTransfer(int $id): StockTransfer
  {
    return DB::transaction(function () use ($id) {
      $transfer = $this->stockTransferRepository->findWithRelations($id);

      if (!$transfer) {
        throw new \Exception('Stock transfer not found');
      }

      // Validate status transition
      if (!$transfer->status->canTransitionTo(TransferStatus::APPROVED)) {
        throw new \Exception('Transfer cannot be approved from current status');
      }

      // Validate stock availability
      $this->validateStockAvailability($transfer);

      // Update status
      $this->stockTransferRepository->update($id, [
        'status' => TransferStatus::APPROVED->value,
        'approved_by' => auth()->id(),
        'approved_at' => now(),
      ]);

      // Log activity
      activity()
        ->performedOn($transfer)
        ->causedBy(auth()->user())
        ->log('approved stock transfer');

      return $this->stockTransferRepository->findWithRelations($id);
    });
  }

  /**
   * Receive stock transfer
   */
  public function receiveTransfer(int $id): StockTransfer
  {
    return DB::transaction(function () use ($id) {
      $transfer = $this->stockTransferRepository->findWithRelations($id);

      if (!$transfer) {
        throw new \Exception('Stock transfer not found');
      }

      // Validate status transition
      if (!$transfer->status->canTransitionTo(TransferStatus::RECEIVED)) {
        throw new \Exception('Transfer cannot be received from current status');
      }

      // Update stock balances
      foreach ($transfer->items as $item) {
        // Deduct from source store
        $sourceBalance = $this->stockBalanceService->getBalance(
          $transfer->from_store_id,
          $item->stock_item_id
        );

        if (!$sourceBalance || $sourceBalance->quantity_on_hand < $item->quantity) {
          throw new \Exception('Insufficient stock in source store');
        }

        $this->stockBalanceService->updateBalance(
          $transfer->from_store_id,
          $item->stock_item_id,
          $sourceBalance->quantity_on_hand - $item->quantity
        );

        // Add to destination store
        $destBalance = $this->stockBalanceService->getBalance(
          $transfer->to_store_id,
          $item->stock_item_id
        );

        $this->stockBalanceService->updateBalance(
          $transfer->to_store_id,
          $item->stock_item_id,
          ($destBalance->quantity_on_hand ?? 0) + $item->quantity
        );
      }

      // Update status
      $this->stockTransferRepository->update($id, [
        'status' => TransferStatus::RECEIVED->value,
        'received_by' => auth()->id(),
        'received_at' => now(),
      ]);

      // Log activity
      activity()
        ->performedOn($transfer)
        ->causedBy(auth()->user())
        ->log('received stock transfer');

      return $this->stockTransferRepository->findWithRelations($id);
    });
  }

  /**
   * Cancel stock transfer
   */
  public function cancelTransfer(int $id): StockTransfer
  {
    return DB::transaction(function () use ($id) {
      $transfer = $this->stockTransferRepository->find($id);

      if (!$transfer) {
        throw new \Exception('Stock transfer not found');
      }

      // Validate status transition
      if (!in_array($transfer->status, [TransferStatus::REQUESTED->value, TransferStatus::APPROVED->value])) {
        throw new \Exception('Transfer cannot be cancelled from current status');
      }

      $this->stockTransferRepository->update($id, [
        'status' => TransferStatus::CANCELLED->value,
      ]);

      // Log activity
      activity()
        ->performedOn($transfer)
        ->causedBy(auth()->user())
        ->log('cancelled stock transfer');

      return $this->stockTransferRepository->findWithRelations($id);
    });
  }

  /**
   * Validate stock availability
   */
  protected function validateStockAvailability(StockTransfer $transfer): void
  {
    foreach ($transfer->items as $item) {
      $balance = $this->stockBalanceService->getBalance(
        $transfer->from_store_id,
        $item->stock_item_id
      );

      if (!$balance || $balance->quantity_available < $item->quantity) {
        throw new \Exception("Insufficient stock for item ID: {$item->stock_item_id}");
      }
    }
  }

  /**
   * Generate transfer number
   */
  protected function generateTransferNo(): string
  {
    $prefix = 'TRF';
    $year = date('Y');
    $count = StockTransfer::whereYear('created_at', $year)->count() + 1;
    return "{$prefix}-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
  }
}
