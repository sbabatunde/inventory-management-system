<?php
// Modules/Inventory/app/Services/StockSerialService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\app\Models\StockSerial;
use Modules\Inventory\app\Enums\SerialStatus;
use Modules\Inventory\app\Repositories\Contracts\StockSerialRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StockSerialService
{
  protected StockSerialRepositoryInterface $stockSerialRepository;

  public function __construct(StockSerialRepositoryInterface $stockSerialRepository)
  {
    $this->stockSerialRepository = $stockSerialRepository;
  }

  /**
   * Get paginated serials
   */
  public function getPaginatedSerials(array $filters = []): LengthAwarePaginator
  {
    return $this->stockSerialRepository->paginate($filters);
  }

  /**
   * Get serial by ID
   */
  public function getSerial(int $id): ?StockSerial
  {
    return $this->stockSerialRepository->find($id);
  }

  /**
   * Create serials for a stock item
   */
  public function createSerials(int $stockItemId, array $serialNumbers, int $storeId): array
  {
    return DB::transaction(function () use ($stockItemId, $serialNumbers, $storeId) {
      $createdSerials = [];

      foreach ($serialNumbers as $serialNo) {
        // Check if serial already exists
        $existingSerial = $this->stockSerialRepository->findBySerialNo($serialNo, $stockItemId);

        if ($existingSerial) {
          throw new \Exception("Serial number {$serialNo} already exists");
        }

        $serial = $this->stockSerialRepository->create([
          'stock_item_id' => $stockItemId,
          'serial_no' => $serialNo,
          'current_status' => SerialStatus::IN_STOCK->value,
          'current_store_id' => $storeId,
        ]);

        $createdSerials[] = $serial;
      }

      // Log activity
      activity()
        ->causedBy(auth()->user())
        ->withProperties([
          'stock_item_id' => $stockItemId,
          'serial_count' => count($createdSerials),
          'store_id' => $storeId,
        ])
        ->log('created stock serials');

      return $createdSerials;
    });
  }

  /**
   * Update serial status
   */
  public function updateSerialStatus(int $id, string $status, ?int $storeId = null): StockSerial
  {
    return DB::transaction(function () use ($id, $status, $storeId) {
      $serial = $this->stockSerialRepository->find($id);

      if (!$serial) {
        throw new \Exception('Serial number not found');
      }

      $data = [
        'current_status' => $status,
      ];

      if ($storeId) {
        $data['current_store_id'] = $storeId;
      }

      $serial = $this->stockSerialRepository->update($id, $data);

      // Log activity
      activity()
        ->performedOn($serial)
        ->causedBy(auth()->user())
        ->withProperties([
          'status' => $status,
          'store_id' => $storeId,
        ])
        ->log('updated serial status');

      return $serial;
    });
  }

  /**
   * Get serial history
   */
  public function getSerialHistory(int $id): array
  {
    return $this->stockSerialRepository->getSerialHistory($id);
  }

  /**
   * Get serials by store
   */
  public function getSerialsByStore(int $storeId): LengthAwarePaginator
  {
    return $this->stockSerialRepository->getSerialsByStore($storeId);
  }
}
