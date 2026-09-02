<?php
// Modules/Procurement/app/DTOs/GoodsReceiptDTO.php

namespace Modules\Procurement\app\DTOs;

readonly class GoodsReceiptDTO
{
  public function __construct(
    public ?int $id,
    public string $grNo,
    public int $purchaseOrderId,
    public int $storeId,
    public string $receivedAt,
    public string $status,
    public ?string $notes,
    public int $receivedBy,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $purchaseOrder,
    public ?array $store,
    public ?array $items,
    public ?array $receivedByUser,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      grNo: $data['gr_no'],
      purchaseOrderId: $data['purchase_order_id'],
      storeId: $data['store_id'],
      receivedAt: $data['received_at'],
      status: $data['status'] ?? 'pending',
      notes: $data['notes'] ?? null,
      receivedBy: $data['received_by'],
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      purchaseOrder: $data['purchase_order'] ?? null,
      store: $data['store'] ?? null,
      items: $data['items'] ?? null,
      receivedByUser: $data['received_by_user'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'gr_no' => $this->grNo,
      'purchase_order_id' => $this->purchaseOrderId,
      'store_id' => $this->storeId,
      'received_at' => $this->receivedAt,
      'status' => $this->status,
      'notes' => $this->notes,
      'received_by' => $this->receivedBy,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
      'purchase_order' => $this->purchaseOrder,
      'store' => $this->store,
      'items' => $this->items,
      'received_by_user' => $this->receivedByUser,
    ];
  }
}
