<?php
// Modules/Procurement/app/Services/PurchaseOrderService.php

namespace Modules\Procurement\app\Services;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Modules\Procurement\app\DTOs\PurchaseOrderDTO;
use Modules\Procurement\app\Enums\PurchaseOrderStatus;
use Modules\Procurement\app\Models\PurchaseOrder;
use Modules\Procurement\app\Models\PurchaseOrderItem;
use Modules\Procurement\app\Repositories\Contracts\PurchaseOrderRepositoryInterface;
use Modules\Procurement\app\Repositories\Contracts\PurchaseRequisitionRepositoryInterface;
use Modules\Procurement\App\Repositories\PurchaseOrderRepository;
use Modules\Procurement\App\Repositories\PurchaseRequisitionRepository;

class PurchaseOrderService
{
  protected PurchaseOrderRepositoryInterface $purchaseOrderRepository;
  protected \Modules\Inventory\app\Services\StockBalanceService $stockBalanceService;

  public function __construct(
    PurchaseOrderRepositoryInterface $purchaseOrderRepository,
    \Modules\Inventory\app\Services\StockBalanceService $stockBalanceService
  ) {
    $this->purchaseOrderRepository = $purchaseOrderRepository;
    $this->stockBalanceService = $stockBalanceService;
  }

  /**
   * Get paginated purchase orders with DTO transformation
   */
  public function getPaginatedOrders(array $filters = []): array
  {
    $orders = $this->purchaseOrderRepository->paginate($filters);

    return [
      'orders' => $orders->through(function ($order) {
        return PurchaseOrderDTO::fromArray($order->toArray())->toArray();
      })->items(),
      'pagination' => [
        'current_page' => $orders->currentPage(),
        'last_page' => $orders->lastPage(),
        'per_page' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem(),
        'to' => $orders->lastItem(),
      ],
    ];
  }

  /**
   * Get purchase order by ID with DTO
   */
  public function getOrder(int $id): ?array
  {
    $order = $this->purchaseOrderRepository->findWithRelations($id);

    if (!$order) {
      return null;
    }

    // Load computed attributes
    $order->total_items = $order->items()->count();
    $order->total_quantity_ordered = $order->items()->sum('quantity_ordered');
    $order->total_quantity_received = $order->items()->sum('quantity_received');
    $order->receipt_percentage = $order->total_quantity_ordered > 0
      ? round(($order->total_quantity_received / $order->total_quantity_ordered) * 100, 2)
      : 0;

    return PurchaseOrderDTO::fromArray($order->toArray())->toArray();
  }

  /**
   * Create purchase order with DTO return
   */
  public function createOrder(array $data): array
  {
    return DB::transaction(function () use ($data) {
      // Generate PO number
      $data['po_no'] = $this->generatePoNo();
      $data['status'] = PurchaseOrderStatus::DRAFT->value;
      $data['created_by'] = auth()->id();

      // Calculate totals
      $subtotal = 0;
      foreach ($data['items'] as $item) {
        $itemTotal = $item['quantity_ordered'] * $item['unit_price'];
        $subtotal += $itemTotal;
      }

      $data['subtotal'] = $subtotal;
      $data['tax_amount'] = $data['tax_amount'] ?? 0;
      $data['discount_amount'] = $data['discount_amount'] ?? 0;
      $data['shipping_cost'] = $data['shipping_cost'] ?? 0;
      $data['total_amount'] = $subtotal + $data['tax_amount'] + $data['shipping_cost'] - $data['discount_amount'];

      $order = $this->purchaseOrderRepository->create($data);

      // Create items
      foreach ($data['items'] as $item) {
        PurchaseOrderItem::create([
          'purchase_order_id' => $order->id,
          'stock_item_id' => $item['stock_item_id'],
          'quantity_ordered' => $item['quantity_ordered'],
          'unit_of_measure' => $item['unit_of_measure'],
          'unit_price' => $item['unit_price'],
          'total_price' => $item['quantity_ordered'] * $item['unit_price'],
          'notes' => $item['notes'] ?? null,
        ]);
      }

      // Log activity
      activity()
        ->performedOn($order)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created purchase order');

      // Return with DTO
      $orderWithRelations = $this->purchaseOrderRepository->findWithRelations($order->id);
      return PurchaseOrderDTO::fromArray($orderWithRelations->toArray())->toArray();
    });
  }

  /**
   * Send purchase order with DTO return
   */
  public function sendOrder(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $order = $this->purchaseOrderRepository->find($id);

      if (!$order) {
        throw new \Exception('Purchase order not found');
      }

      if ($order->status !== PurchaseOrderStatus::DRAFT->value) {
        throw new \Exception('Only draft orders can be sent');
      }

      $order = $this->purchaseOrderRepository->update($id, [
        'status' => PurchaseOrderStatus::SENT->value,
        'sent_at' => now(),
      ]);

      // Log activity
      activity()
        ->performedOn($order)
        ->causedBy(auth()->user())
        ->log('sent purchase order');

      return PurchaseOrderDTO::fromArray($order->toArray())->toArray();
    });
  }

  /**
   * Receive goods with DTO return
   */
  public function receiveGoods(int $id, array $receivedItems): array
  {
    return DB::transaction(function () use ($id, $receivedItems) {
      $order = $this->purchaseOrderRepository->findWithRelations($id);

      if (!$order) {
        throw new \Exception('Purchase order not found');
      }

      if (!in_array($order->status, [PurchaseOrderStatus::SENT->value, PurchaseOrderStatus::PARTIALLY_RECEIVED->value])) {
        throw new \Exception('Order cannot receive goods in current status');
      }

      $allReceived = true;

      foreach ($receivedItems as $receivedItem) {
        $orderItem = $order->items()->where('id', $receivedItem['item_id'])->first();

        if (!$orderItem) {
          continue;
        }

        $newReceivedQty = $orderItem->quantity_received + $receivedItem['quantity_received'];

        if ($newReceivedQty > $orderItem->quantity_ordered) {
          throw new \Exception("Received quantity exceeds ordered quantity for item: {$orderItem->stockItem->name}");
        }

        $orderItem->quantity_received = $newReceivedQty;
        $orderItem->save();

        // Update stock balance
        $balance = $this->stockBalanceService->getBalance(
          $order->store_id,
          $orderItem->stock_item_id
        );

        $newQuantity = ($balance->quantity_on_hand ?? 0) + $receivedItem['quantity_received'];
        $this->stockBalanceService->updateBalance(
          $order->store_id,
          $orderItem->stock_item_id,
          $newQuantity
        );

        if ($newReceivedQty < $orderItem->quantity_ordered) {
          $allReceived = false;
        }
      }

      // Update order status
      $newStatus = $allReceived ? PurchaseOrderStatus::COMPLETED->value : PurchaseOrderStatus::PARTIALLY_RECEIVED->value;
      $order = $this->purchaseOrderRepository->update($id, [
        'status' => $newStatus,
      ]);

      // Log activity
      activity()
        ->performedOn($order)
        ->causedBy(auth()->user())
        ->withProperties(['received_items' => $receivedItems])
        ->log('received goods for purchase order');

      $orderWithRelations = $this->purchaseOrderRepository->findWithRelations($id);
      return PurchaseOrderDTO::fromArray($orderWithRelations->toArray())->toArray();
    });
  }

  /**
   * Cancel purchase order with DTO return
   */
  public function cancelOrder(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $order = $this->purchaseOrderRepository->find($id);

      if (!$order) {
        throw new \Exception('Purchase order not found');
      }

      if (in_array($order->status, [PurchaseOrderStatus::COMPLETED->value, PurchaseOrderStatus::CANCELLED->value])) {
        throw new \Exception('Order cannot be cancelled from current status');
      }

      $order = $this->purchaseOrderRepository->update($id, [
        'status' => PurchaseOrderStatus::CANCELLED->value,
      ]);

      // Log activity
      activity()
        ->performedOn($order)
        ->causedBy(auth()->user())
        ->log('cancelled purchase order');

      return PurchaseOrderDTO::fromArray($order->toArray())->toArray();
    });
  }

  /**
   * Generate PO number
   */
  protected function generatePoNo(): string
  {
    $prefix = 'PO';
    $year = date('Y');
    $count = PurchaseOrder::whereYear('created_at', $year)->count() + 1;
    return "{$prefix}-{$year}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
  }
}
