<?php
// Modules/Inventory/app/DTOs/StockItemDTO.php

namespace Modules\Inventory\app\DTOs;

use Modules\Inventory\App\Enums\StockNature;

readonly class StockItemDTO
{
  public function __construct(
    public ?int $id,
    public string $code,
    public string $name,
    public ?string $description,
    public ?int $categoryId,
    public StockNature $nature,
    public bool $isSerialized,
    public string $unitOfMeasure,
    public int $reorderLevel,
    public float $unitCost,
    public bool $isActive,
    public ?int $totalStock,
    public ?string $createdAt,
    public ?string $updatedAt,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      code: $data['code'],
      name: $data['name'],
      description: $data['description'] ?? null,
      categoryId: $data['category_id'] ?? null,
      nature: StockNature::from($data['nature']),
      isSerialized: $data['is_serialized'] ?? false,
      unitOfMeasure: $data['unit_of_measure'],
      reorderLevel: $data['reorder_level'] ?? 0,
      unitCost: (float) ($data['unit_cost'] ?? 0),
      isActive: $data['is_active'] ?? true,
      totalStock: $data['total_stock'] ?? null,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'code' => $this->code,
      'name' => $this->name,
      'description' => $this->description,
      'category_id' => $this->categoryId,
      'nature' => $this->nature->value,
      'nature_label' => $this->nature->label(),
      'is_serialized' => $this->isSerialized,
      'unit_of_measure' => $this->unitOfMeasure,
      'reorder_level' => $this->reorderLevel,
      'unit_cost' => $this->unitCost,
      'is_active' => $this->isActive,
      'total_stock' => $this->totalStock,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
    ];
  }
}
