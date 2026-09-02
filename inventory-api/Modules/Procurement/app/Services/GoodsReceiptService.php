<?php
// Modules/Procurement/app/Services/GoodsReceiptService.php

namespace Modules\Procurement\app\Services;

use Modules\Procurement\app\Models\GoodsReceipt;
use Modules\Procurement\app\Models\GoodsReceiptItem;
use Modules\Procurement\app\DTOs\GoodsReceiptDTO;
use Modules\Procurement\app\Repositories\Contracts\GoodsReceiptRepositoryInterface;
use Illuminate\Support\Facades\DB;

class GoodsReceiptService
{
  protected GoodsReceiptRepositoryInterface $goodsReceiptRepository;
  protected \Modules\Inventory\app\Services\StockBalanceService $stockBalanceService;

  public function __construct(
    GoodsReceiptRepositoryInterface $goodsReceiptRepository,
    \Modules\Inventory\app\Services\StockBalanceService $stockBalanceService
  ) {
    $this->goodsReceiptRepository = $goodsReceiptRepository;
    $this->stockBalanceService = $stockBalanceService;
  }

  /**
   * Get paginated goods receipts with DTO
   */
  public function getPaginatedReceipts(array $filters = []): array
  {
    $receipts = $this->goodsReceiptRepository->paginate($filters);

    return [
      'receipts' => $receipts->through(function ($receipt) {
        return GoodsReceiptDTO::fromArray($receipt->toArray())->toArray();
      })->items(),
      'pagination' => [
        'current_page' => $receipts->currentPage(),
        'last_page' => $receipts->lastPage(),
        'per_page' => $receipts->perPage(),
        'total' => $receipts->total(),
        'from' => $receipts->firstItem(),
        'to' => $receipts->lastItem(),
      ],
    ];
  }

  /**
   * Create goods receipt with DTO
   */
  public function createReceipt(array $data): array
  {
    return DB::transaction(function () use ($data) {
      // Generate GR number
      $data['gr_no'] = $this->generateGrNo();
      $data['status'] = 'pending';
      $data['received_by'] = auth()->id();

      $receipt = $this->goodsReceiptRepository->create($data);

      // Create receipt items
      foreach ($data['items'] as $item) {
        GoodsReceiptItem::create([
          'goods_receipt_id' => $receipt->id,
          'purchase_order_item_id' => $item['purchase_order_item_id'],
          'stock_item_id' => $item['stock_item_id'],
          'quantity_received' => $item['quantity_received'],
          'unit_of_measure' => $item['unit_of_measure'],
          'notes' => $item['notes'] ?? null,
        ]);
      }

      // Update stock balances
      foreach ($data['items'] as $item) {
        $balance = $this->stockBalanceService->getBalance(
          $data['store_id'],
          $item['stock_item_id']
        );

        $newQuantity = ($balance->quantity_on_hand ?? 0) + $item['quantity_received'];
        $this->stockBalanceService->updateBalance(
          $data['store_id'],
          $item['stock_item_id'],
          $newQuantity
        );
      }

      // Log activity
      activity()
        ->performedOn($receipt)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created goods receipt');

      return GoodsReceiptDTO::fromArray($receipt->toArray())->toArray();
    });
  }

  /**
   * Generate GR number
   */
  protected function generateGrNo(): string
  {
    $prefix = 'GR';
    $year = date('Y');
    $count = GoodsReceipt::whereYear('created_at', $year)->count() + 1;
    return "{$prefix}-{$year}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
  }

  
  /**
   * Get goods receipt by ID with DTO
   */
  public function getReceipt(int $id): ?array
  {
      $receipt = $this->goodsReceiptRepository->findWithRelations($id);
      
      if (!$receipt) {
          return null;
      }

      return GoodsReceiptDTO::fromArray($receipt->toArray())->toArray();
  }
}
