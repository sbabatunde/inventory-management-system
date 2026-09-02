<?php
// Modules/Integration/app/DTOs/CrmUserDTO.php

namespace Modules\Integration\app\DTOs;

readonly class CrmUserDTO
{
  public function __construct(
    public ?int $id,
    public string $name,
    public ?string $email,
    public ?string $employeeId,
    public ?string $department,
    public ?string $role,
    public ?string $phone,
    public bool $isActive,
    public ?array $rawData,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      name: $data['name'] ?? '',
      email: $data['email'] ?? null,
      employeeId: $data['employee_id'] ?? null,
      department: $data['department'] ?? null,
      role: $data['role'] ?? null,
      phone: $data['phone'] ?? null,
      isActive: $data['is_active'] ?? true,
      rawData: $data,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'email' => $this->email,
      'employee_id' => $this->employeeId,
      'department' => $this->department,
      'role' => $this->role,
      'phone' => $this->phone,
      'is_active' => $this->isActive,
    ];
  }
}
