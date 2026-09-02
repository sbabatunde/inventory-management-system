<?php
// Modules/Procurement/app/DTOs/SupplierDTO.php

namespace Modules\Procurement\app\DTOs;

readonly class SupplierDTO
{
  public function __construct(
    public ?int $id,
    public string $name,
    public string $code,
    public ?string $email,
    public ?string $phone,
    public ?string $address,
    public ?string $city,
    public ?string $state,
    public ?string $country,
    public ?string $contactPerson,
    public ?string $contactPhone,
    public ?string $contactEmail,
    public ?string $taxId,
    public ?string $bankName,
    public ?string $bankAccountNo,
    public ?string $bankAccountName,
    public bool $isActive,
    public ?string $notes,
    public ?int $totalOrders,
    public ?float $totalSpent,
    public ?string $createdAt,
    public ?string $updatedAt,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      name: $data['name'],
      code: $data['code'],
      email: $data['email'] ?? null,
      phone: $data['phone'] ?? null,
      address: $data['address'] ?? null,
      city: $data['city'] ?? null,
      state: $data['state'] ?? null,
      country: $data['country'] ?? 'Nigeria',
      contactPerson: $data['contact_person'] ?? null,
      contactPhone: $data['contact_phone'] ?? null,
      contactEmail: $data['contact_email'] ?? null,
      taxId: $data['tax_id'] ?? null,
      bankName: $data['bank_name'] ?? null,
      bankAccountNo: $data['bank_account_no'] ?? null,
      bankAccountName: $data['bank_account_name'] ?? null,
      isActive: $data['is_active'] ?? true,
      notes: $data['notes'] ?? null,
      totalOrders: $data['total_orders'] ?? null,
      totalSpent: $data['total_spent'] ?? null,
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
      'email' => $this->email,
      'phone' => $this->phone,
      'address' => $this->address,
      'city' => $this->city,
      'state' => $this->state,
      'country' => $this->country,
      'contact_person' => $this->contactPerson,
      'contact_phone' => $this->contactPhone,
      'contact_email' => $this->contactEmail,
      'tax_id' => $this->taxId,
      'bank_name' => $this->bankName,
      'bank_account_no' => $this->bankAccountNo,
      'bank_account_name' => $this->bankAccountName,
      'is_active' => $this->isActive,
      'notes' => $this->notes,
      'total_orders' => $this->totalOrders,
      'total_spent' => $this->totalSpent,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
    ];
  }
}
