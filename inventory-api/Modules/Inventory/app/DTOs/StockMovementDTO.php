<?php
// Modules/Inventory/app/DTOs/StockMovementDTO.php

namespace Modules\Inventory\app\DTOs;

use Modules\Inventory\app\Enums\StockMovementType;

readonly class StockMovementDTO
{
  public function __construct(
    public ?int $id,
    public int $stockItemId,
    public ?int $stockSerialId,
    public ?int $fromStoreId,
    public ?int $toStoreId,
    public StockMovementType $movementType,
    public int $quantity,
    public int $quantityBefore,
    public int $quantityAfter,
    public ?string $referenceType,
    public ?int $referenceId,
    public int $createdBy,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $stockItem,
    public ?array $stockSerial,
    public ?array $fromStore,
    public ?array $toStore,
    public ?array $createdByUser,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      stockItemId: $data['stock_item_id'],
      stockSerialId: $data['stock_serial_id'] ?? null,
      fromStoreId: $data['from_store_id'] ?? null,
      toStoreId: $data['to_store_id'] ?? null,
      movementType: StockMovementType::from($data['movement_type']),
      quantity: $data['quantity'],
      quantityBefore: $data['quantity_before'],
      quantityAfter: $data['quantity_after'],
      referenceType: $data['reference_type'] ?? null,
      referenceId: $data['reference_id'] ?? null,
      createdBy: $data['created_by'],
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      stockItem: $data['stock_item'] ?? null,
      stockSerial: $data['stock_serial'] ?? null,
      fromStore: $data['from_store'] ?? null,
      toStore: $data['to_store'] ?? null,
      createdByUser: $data['created_by_user'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'stock_item_id' => $this->stockItemId,
      'stock_serial_id' => $this->stockSerialId,
      'from_store_id' => $this->fromStoreId,
      'to_store_id' => $this->toStoreId,
      'movement_type' => $this->movementType->value,
      'movement_type_label' => $this->movementType->label(),
      'movement_type_color' => $this->movementType->color(),
      'quantity' => $this->quantity,
      'quantity_before' => $this->quantityBefore,
      'quantity_after' => $this->quantityAfter,
      'reference_type' => $this->referenceType,
      'reference_id' => $this->referenceId,
      'created_by' => $this->createdBy,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
      'stock_item' => $this->stockItem,
      'stock_serial' => $this->stockSerial,
      'from_store' => $this->fromStore,
      'to_store' => $this->toStore,
      'created_by_user' => $this->createdByUser,
    ];
  }
}
