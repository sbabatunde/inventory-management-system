<?php
// Modules/Procurement/app/DTOs/PurchaseOrderDTO.php

namespace Modules\Procurement\app\DTOs;

use Modules\Procurement\app\Enums\PurchaseOrderStatus;

readonly class PurchaseOrderDTO
{
  public function __construct(
    public ?int $id,
    public string $poNo,
    public int $supplierId,
    public ?int $purchaseRequisitionId,
    public int $storeId,
    public PurchaseOrderStatus $status,
    public string $orderDate,
    public ?string $expectedDeliveryDate,
    public float $subtotal,
    public float $taxAmount,
    public float $discountAmount,
    public float $shippingCost,
    public float $totalAmount,
    public ?string $notes,
    public ?string $termsAndConditions,
    public int $createdBy,
    public ?int $approvedBy,
    public ?string $approvedAt,
    public ?string $sentAt,
    public ?int $totalItems,
    public ?int $totalQuantityOrdered,
    public ?int $totalQuantityReceived,
    public ?float $receiptPercentage,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $supplier,
    public ?array $store,
    public ?array $items,
    public ?array $goodsReceipts,
    public ?array $createdByUser,
    public ?array $approvedByUser,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      poNo: $data['po_no'],
      supplierId: $data['supplier_id'],
      purchaseRequisitionId: $data['purchase_requisition_id'] ?? null,
      storeId: $data['store_id'],
      status: PurchaseOrderStatus::from($data['status'] ?? 'draft'),
      orderDate: $data['order_date'],
      expectedDeliveryDate: $data['expected_delivery_date'] ?? null,
      subtotal: (float) ($data['subtotal'] ?? 0),
      taxAmount: (float) ($data['tax_amount'] ?? 0),
      discountAmount: (float) ($data['discount_amount'] ?? 0),
      shippingCost: (float) ($data['shipping_cost'] ?? 0),
      totalAmount: (float) ($data['total_amount'] ?? 0),
      notes: $data['notes'] ?? null,
      termsAndConditions: $data['terms_and_conditions'] ?? null,
      createdBy: $data['created_by'],
      approvedBy: $data['approved_by'] ?? null,
      approvedAt: $data['approved_at'] ?? null,
      sentAt: $data['sent_at'] ?? null,
      totalItems: $data['total_items'] ?? null,
      totalQuantityOrdered: $data['total_quantity_ordered'] ?? null,
      totalQuantityReceived: $data['total_quantity_received'] ?? null,
      receiptPercentage: $data['receipt_percentage'] ?? null,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      supplier: $data['supplier'] ?? null,
      store: $data['store'] ?? null,
      items: $data['items'] ?? null,
      goodsReceipts: $data['goods_receipts'] ?? null,
      createdByUser: $data['created_by_user'] ?? null,
      approvedByUser: $data['approved_by_user'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'po_no' => $this->poNo,
      'supplier_id' => $this->supplierId,
      'purchase_requisition_id' => $this->purchaseRequisitionId,
      'store_id' => $this->storeId,
      'status' => $this->status->value,
      'status_label' => $this->status->label(),
      'status_color' => $this->status->color(),
      'order_date' => $this->orderDate,
      'expected_delivery_date' => $this->expectedDeliveryDate,
      'subtotal' => $this->subtotal,
      'tax_amount' => $this->taxAmount,
      'discount_amount' => $this->discountAmount,
      'shipping_cost' => $this->shippingCost,
      'total_amount' => $this->totalAmount,
      'notes' => $this->notes,
      'terms_and_conditions' => $this->termsAndConditions,
      'created_by' => $this->createdBy,
      'approved_by' => $this->approvedBy,
      'approved_at' => $this->approvedAt,
      'sent_at' => $this->sentAt,
      'total_items' => $this->totalItems,
      'total_quantity_ordered' => $this->totalQuantityOrdered,
      'total_quantity_received' => $this->totalQuantityReceived,
      'receipt_percentage' => $this->receiptPercentage,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
      'supplier' => $this->supplier,
      'store' => $this->store,
      'items' => $this->items,
      'goods_receipts' => $this->goodsReceipts,
      'created_by_user' => $this->createdByUser,
      'approved_by_user' => $this->approvedByUser,
    ];
  }
}
