<?php
// Modules/Integration/app/DTOs/TicketDTO.php

namespace Modules\Integration\app\DTOs;

readonly class TicketDTO
{
  public function __construct(
    public ?int $id,
    public string $ticketNo,
    public string $title,
    public ?string $description,
    public string $status,
    public ?string $priority,
    public ?int $clientId,
    public ?string $clientName,
    public ?string $siteLocation,
    public ?array $requiredEquipment,
    public ?array $assignedEngineers,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $rawData,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      ticketNo: $data['ticket_no'] ?? $data['id'] ?? '',
      title: $data['title'] ?? '',
      description: $data['description'] ?? null,
      status: $data['status'] ?? 'open',
      priority: $data['priority'] ?? null,
      clientId: $data['client_id'] ?? null,
      clientName: $data['client_name'] ?? null,
      siteLocation: $data['site_location'] ?? null,
      requiredEquipment: $data['required_equipment'] ?? null,
      assignedEngineers: $data['assigned_engineers'] ?? null,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      rawData: $data,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'ticket_no' => $this->ticketNo,
      'title' => $this->title,
      'description' => $this->description,
      'status' => $this->status,
      'priority' => $this->priority,
      'client_id' => $this->clientId,
      'client_name' => $this->clientName,
      'site_location' => $this->siteLocation,
      'required_equipment' => $this->requiredEquipment,
      'assigned_engineers' => $this->assignedEngineers,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
    ];
  }
}
