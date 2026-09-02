<?php
// Modules/Procurement/app/Repositories/PurchaseOrderRepository.php

namespace Modules\Procurement\App\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\App\Models\PurchaseOrder;
use Modules\Procurement\App\Repositories\Contracts\PurchaseOrderRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class PurchaseOrderRepository implements PurchaseOrderRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = PurchaseOrder::with(['supplier', 'store', 'items.stockItem', 'createdBy', 'approvedBy'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where('po_no', 'like', "%{$search}%");
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['supplier_id'] ?? null, function ($q, $supplierId) {
        return $q->where('supplier_id', $supplierId);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('store_id', $storeId);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('order_date', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('order_date', '<=', $dateTo);
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?PurchaseOrder
  {
    return Cache::remember("purchase_order:{$id}", 300, function () use ($id) {
      return PurchaseOrder::find($id);
    });
  }

  public function findWithRelations(int $id): ?PurchaseOrder
  {
    return Cache::remember("purchase_order_details:{$id}", 300, function () use ($id) {
      return PurchaseOrder::with([
        'supplier',
        'store',
        'items.stockItem',
        'goodsReceipts.items',
        'createdBy',
        'approvedBy',
        'purchaseRequisition',
      ])->find($id);
    });
  }

  public function create(array $data): PurchaseOrder
  {
    $order = PurchaseOrder::create($data);
    Cache::forget("purchase_order:{$order->id}");
    return $order;
  }

  public function update(int $id, array $data): PurchaseOrder
  {
    $order = PurchaseOrder::findOrFail($id);
    $order->update($data);
    Cache::forget("purchase_order:{$id}");
    Cache::forget("purchase_order_details:{$id}");
    return $order->fresh();
  }

  public function delete(int $id): void
  {
    $order = PurchaseOrder::findOrFail($id);
    $order->delete();
    Cache::forget("purchase_order:{$id}");
    Cache::forget("purchase_order_details:{$id}");
  }

  public function findByPoNo(string $poNo): ?PurchaseOrder
  {
    return PurchaseOrder::where('po_no', $poNo)->first();
  }

  public function getOrdersBySupplier(int $supplierId): LengthAwarePaginator
  {
    return PurchaseOrder::with(['store', 'items.stockItem'])
      ->where('supplier_id', $supplierId)
      ->latest()
      ->paginate(15);
  }

  public function getOrdersByStore(int $storeId): LengthAwarePaginator
  {
    return PurchaseOrder::with(['supplier', 'items.stockItem'])
      ->where('store_id', $storeId)
      ->latest()
      ->paginate(15);
  }
}
