<?php
// Modules/Procurement/app/Repositories/GoodsReceiptRepository.php

namespace Modules\Procurement\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\app\Models\GoodsReceipt;
use Modules\Procurement\app\Repositories\Contracts\GoodsReceiptRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class GoodsReceiptRepository implements GoodsReceiptRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = GoodsReceipt::with(['purchaseOrder.supplier', 'store', 'items.stockItem', 'receivedBy'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where('gr_no', 'like', "%{$search}%");
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['purchase_order_id'] ?? null, function ($q, $poId) {
        return $q->where('purchase_order_id', $poId);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('store_id', $storeId);
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?GoodsReceipt
  {
    return Cache::remember("goods_receipt:{$id}", 300, function () use ($id) {
      return GoodsReceipt::find($id);
    });
  }

  public function findWithRelations(int $id): ?GoodsReceipt
  {
    return Cache::remember("goods_receipt_details:{$id}", 300, function () use ($id) {
      return GoodsReceipt::with(['purchaseOrder.supplier', 'store', 'items.stockItem', 'receivedBy'])
        ->find($id);
    });
  }

  public function create(array $data): GoodsReceipt
  {
    $receipt = GoodsReceipt::create($data);
    Cache::forget("goods_receipt:{$receipt->id}");
    return $receipt;
  }

  public function update(int $id, array $data): GoodsReceipt
  {
    $receipt = GoodsReceipt::findOrFail($id);
    $receipt->update($data);
    Cache::forget("goods_receipt:{$id}");
    Cache::forget("goods_receipt_details:{$id}");
    return $receipt->fresh();
  }

  public function findByGrNo(string $grNo): ?GoodsReceipt
  {
    return GoodsReceipt::where('gr_no', $grNo)->first();
  }
}
