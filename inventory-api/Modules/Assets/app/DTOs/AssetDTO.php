<?php
// Modules/Assets/app/DTOs/AssetDTO.php

namespace Modules\Assets\app\DTOs;

use Modules\Assets\app\Enums\AssetType;
use Modules\Assets\app\Enums\AssetStatus;
use Modules\Assets\app\Enums\DepreciationMethod;

readonly class AssetDTO
{
  public function __construct(
    public ?int $id,
    public string $assetCode,
    public string $name,
    public ?string $description,
    public AssetType $type,
    public ?int $stockItemId,
    public ?string $serialNo,
    public AssetStatus $status,
    public ?int $currentStoreId,
    public ?string $currentLocationType,
    public ?int $currentLocationId,
    public ?int $assignedTo,
    public ?string $assignedAt,
    public ?string $installedAt,
    public ?string $lastMaintenanceAt,
    public ?string $nextMaintenanceDue,
    public float $purchaseCost,
    public ?string $purchaseDate,
    public float $currentValue,
    public float $salvageValue,
    public int $usefulLifeMonths,
    public DepreciationMethod $depreciationMethod,
    public bool $isActive,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $stockItem,
    public ?array $currentStore,
    public ?array $assignedToUser,
    public ?array $popEquipment,
    public ?array $clientEquipment,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      assetCode: $data['asset_code'],
      name: $data['name'],
      description: $data['description'] ?? null,
      type: AssetType::from($data['type']),
      stockItemId: $data['stock_item_id'] ?? null,
      serialNo: $data['serial_no'] ?? null,
      status: AssetStatus::from($data['status'] ?? 'in_stock'),
      currentStoreId: $data['current_store_id'] ?? null,
      currentLocationType: $data['current_location_type'] ?? null,
      currentLocationId: $data['current_location_id'] ?? null,
      assignedTo: $data['assigned_to'] ?? null,
      assignedAt: $data['assigned_at'] ?? null,
      installedAt: $data['installed_at'] ?? null,
      lastMaintenanceAt: $data['last_maintenance_at'] ?? null,
      nextMaintenanceDue: $data['next_maintenance_due'] ?? null,
      purchaseCost: (float) ($data['purchase_cost'] ?? 0),
      purchaseDate: $data['purchase_date'] ?? null,
      currentValue: (float) ($data['current_value'] ?? 0),
      salvageValue: (float) ($data['salvage_value'] ?? 0),
      usefulLifeMonths: $data['useful_life_months'] ?? 36,
      depreciationMethod: DepreciationMethod::from($data['depreciation_method'] ?? 'straight_line'),
      isActive: $data['is_active'] ?? true,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      stockItem: $data['stock_item'] ?? null,
      currentStore: $data['current_store'] ?? null,
      assignedToUser: $data['assigned_to_user'] ?? null,
      popEquipment: $data['pop_equipment'] ?? null,
      clientEquipment: $data['client_equipment'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'asset_code' => $this->assetCode,
      'name' => $this->name,
      'description' => $this->description,
      'type' => $this->type->value,
      'type_label' => $this->type->label(),
      'type_color' => $this->type->color(),
      'stock_item_id' => $this->stockItemId,
      'serial_no' => $this->serialNo,
      'status' => $this->status->value,
      'status_label' => $this->status->label(),
      'status_color' => $this->status->color(),
      'current_store_id' => $this->currentStoreId,
      'current_location_type' => $this->currentLocationType,
      'current_location_id' => $this->currentLocationId,
      'assigned_to' => $this->assignedTo,
      'assigned_at' => $this->assignedAt,
      'installed_at' => $this->installedAt,
      'last_maintenance_at' => $this->lastMaintenanceAt,
      'next_maintenance_due' => $this->nextMaintenanceDue,
      'purchase_cost' => $this->purchaseCost,
      'purchase_date' => $this->purchaseDate,
      'current_value' => $this->currentValue,
      'salvage_value' => $this->salvageValue,
      'useful_life_months' => $this->usefulLifeMonths,
      'depreciation_method' => $this->depreciationMethod->value,
      'depreciation_method_label' => $this->depreciationMethod->label(),
      'is_active' => $this->isActive,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
      'stock_item' => $this->stockItem,
      'current_store' => $this->currentStore,
      'assigned_to_user' => $this->assignedToUser,
      'pop_equipment' => $this->popEquipment,
      'client_equipment' => $this->clientEquipment,
    ];
  }
}
