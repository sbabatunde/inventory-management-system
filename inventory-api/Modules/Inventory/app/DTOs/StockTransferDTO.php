<?php
// Modules/Inventory/app/DTOs/StockTransferDTO.php

namespace Modules\Inventory\app\DTOs;

use Modules\Inventory\App\Enums\TransferStatus;

readonly class StockTransferDTO
{
  public function __construct(
    public ?int $id,
    public string $transferNo,
    public int $fromStoreId,
    public int $toStoreId,
    public TransferStatus $status,
    public ?string $notes,
    public int $requestedBy,
    public ?int $approvedBy,
    public ?int $receivedBy,
    public ?string $approvedAt,
    public ?string $receivedAt,
    public array $items,
    public ?string $createdAt,
    public ?string $updatedAt,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      transferNo: $data['transfer_no'],
      fromStoreId: $data['from_store_id'],
      toStoreId: $data['to_store_id'],
      status: TransferStatus::from($data['status']),
      notes: $data['notes'] ?? null,
      requestedBy: $data['requested_by'],
      approvedBy: $data['approved_by'] ?? null,
      receivedBy: $data['received_by'] ?? null,
      approvedAt: $data['approved_at'] ?? null,
      receivedAt: $data['received_at'] ?? null,
      items: $data['items'] ?? [],
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'transfer_no' => $this->transferNo,
      'from_store_id' => $this->fromStoreId,
      'to_store_id' => $this->toStoreId,
      'status' => $this->status->value,
      'status_label' => $this->status->label(),
      'status_color' => $this->status->color(),
      'notes' => $this->notes,
      'requested_by' => $this->requestedBy,
      'approved_by' => $this->approvedBy,
      'received_by' => $this->receivedBy,
      'approved_at' => $this->approvedAt,
      'received_at' => $this->receivedAt,
      'items' => $this->items,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
    ];
  }
}
