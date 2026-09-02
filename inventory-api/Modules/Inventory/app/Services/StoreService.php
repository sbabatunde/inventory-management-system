<?php
// Modules/Inventory/app/Services/StoreService.php

namespace Modules\Inventory\app\Services;

use Modules\Inventory\App\Models\Store;
use Modules\Inventory\App\Repositories\Contracts\StoreRepositoryInterface;
use Modules\Inventory\App\Repositories\Contracts\StockItemRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class StoreService
{
  protected StoreRepositoryInterface $storeRepository;
  protected StockItemRepositoryInterface $stockItemRepository;

  public function __construct(
    StoreRepositoryInterface $storeRepository,
    StockItemRepositoryInterface $stockItemRepository
  ) {
    $this->storeRepository = $storeRepository;
    $this->stockItemRepository = $stockItemRepository;
  }

  /**
   * Get paginated stores with filters
   */
  public function getPaginatedStores(array $filters = []): LengthAwarePaginator
  {
    return $this->storeRepository->paginate($filters);
  }

  /**
   * Get store with details
   */
  public function getStoreWithDetails(int $id): ?Store
  {
    return $this->storeRepository->find($id);
  }

  /**
   * Create new store
   */
  public function createStore(array $data): Store
  {
    return DB::transaction(function () use ($data) {
      // Generate unique code if not provided
      if (empty($data['code'])) {
        $data['code'] = $this->generateStoreCode($data['type']);
      }

      $store = $this->storeRepository->create($data);

      // Log activity
      activity()
        ->performedOn($store)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created store');

      return $store;
    });
  }

  /**
   * Update store
   */
  public function updateStore(int $id, array $data): Store
  {
    return DB::transaction(function () use ($id, $data) {
      $store = $this->storeRepository->update($id, $data);

      // Log activity
      activity()
        ->performedOn($store)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('updated store');

      return $store;
    });
  }

  /**
   * Delete store
   */
  public function deleteStore(int $id): void
  {
    DB::transaction(function () use ($id) {
      $store = $this->storeRepository->find($id);

      if (!$store) {
        throw new \Exception('Store not found');
      }

      // Check if store has stock
      $hasStock = $store->stockBalances()
        ->where('quantity_on_hand', '>', 0)
        ->exists();

      if ($hasStock) {
        throw new \Exception('Cannot delete store with existing stock');
      }

      // Log before deleting
      activity()
        ->performedOn($store)
        ->causedBy(auth()->user())
        ->log('deleted store');

      $this->storeRepository->delete($id);
    });
  }

  /**
   * Toggle store active status
   */
  public function toggleStoreActive(int $id): Store
  {
    return DB::transaction(function () use ($id) {
      $store = $this->storeRepository->find($id);

      if (!$store) {
        throw new \Exception('Store not found');
      }

      $data = ['is_active' => !$store->is_active];
      $store = $this->storeRepository->update($id, $data);

      // Log activity
      activity()
        ->performedOn($store)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log($store->is_active ? 'activated store' : 'deactivated store');

      return $store;
    });
  }

  /**
   * Get store stock
   */
  public function getStoreStock(int $id): array
  {
    $store = $this->storeRepository->find($id);

    if (!$store) {
      throw new \Exception('Store not found');
    }

    $stockBalances = $store->stockBalances()
      ->with('stockItem')
      ->where('quantity_on_hand', '>', 0)
      ->get()
      ->map(function ($balance) {
        return [
          'stock_item_id' => $balance->stock_item_id,
          'item_code' => $balance->stockItem->code,
          'item_name' => $balance->stockItem->name,
          'quantity_on_hand' => $balance->quantity_on_hand,
          'quantity_reserved' => $balance->quantity_reserved,
          'quantity_available' => $balance->quantity_available,
          'unit_of_measure' => $balance->stockItem->unit_of_measure,
          'is_serialized' => $balance->stockItem->is_serialized,
        ];
      });

    return [
      'store' => $store,
      'stock' => $stockBalances,
      'total_items' => $stockBalances->count(),
      'total_quantity' => $stockBalances->sum('quantity_on_hand'),
    ];
  }

  /**
   * Generate unique store code
   */
  protected function generateStoreCode(string $type): string
  {
    $prefix = strtoupper(substr($type, 0, 3));
    $count = $this->storeRepository->findByCode($prefix) ? 1 : 0;

    do {
      $count++;
      $code = $prefix . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    } while ($this->storeRepository->findByCode($code));

    return $code;
  }
}
