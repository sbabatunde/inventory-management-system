<?php
// Modules/Inventory/app/DTOs/StoreDTO.php

namespace Modules\Inventory\app\DTOs;

use Modules\Inventory\App\Enums\StoreType;

readonly class StoreDTO
{
  public function __construct(
    public ?int $id,
    public string $name,
    public string $code,
    public StoreType $type,
    public ?string $address,
    public ?string $city,
    public ?string $state,
    public ?string $contactPerson,
    public ?string $contactPhone,
    public ?string $contactEmail,
    public bool $isActive,
    public ?string $createdAt,
    public ?string $updatedAt,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      name: $data['name'],
      code: $data['code'],
      type: StoreType::from($data['type']),
      address: $data['address'] ?? null,
      city: $data['city'] ?? null,
      state: $data['state'] ?? null,
      contactPerson: $data['contact_person'] ?? null,
      contactPhone: $data['contact_phone'] ?? null,
      contactEmail: $data['contact_email'] ?? null,
      isActive: $data['is_active'] ?? true,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'code' => $this->code,
      'type' => $this->type->value,
      'type_label' => $this->type->label(),
      'type_color' => $this->type->color(),
      'address' => $this->address,
      'city' => $this->city,
      'state' => $this->state,
      'contact_person' => $this->contactPerson,
      'contact_phone' => $this->contactPhone,
      'contact_email' => $this->contactEmail,
      'is_active' => $this->isActive,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
    ];
  }
}
