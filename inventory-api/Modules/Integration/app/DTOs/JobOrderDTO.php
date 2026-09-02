<?php
// Modules/Integration/app/DTOs/JobOrderDTO.php

namespace Modules\Integration\app\DTOs;

readonly class JobOrderDTO
{
  public function __construct(
    public ?int $id,
    public string $jobOrderNo,
    public string $title,
    public ?string $description,
    public string $status,
    public ?string $priority,
    public ?int $clientId,
    public ?string $clientName,
    public ?string $siteLocation,
    public ?array $requiredEquipment,
    public ?array $assignedEngineers,
    public ?string $scheduledDate,
    public ?string $completedDate,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $rawData,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      jobOrderNo: $data['job_order_no'] ?? $data['id'] ?? '',
      title: $data['title'] ?? '',
      description: $data['description'] ?? null,
      status: $data['status'] ?? 'pending',
      priority: $data['priority'] ?? null,
      clientId: $data['client_id'] ?? null,
      clientName: $data['client_name'] ?? null,
      siteLocation: $data['site_location'] ?? null,
      requiredEquipment: $data['required_equipment'] ?? null,
      assignedEngineers: $data['assigned_engineers'] ?? null,
      scheduledDate: $data['scheduled_date'] ?? null,
      completedDate: $data['completed_date'] ?? null,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      rawData: $data,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'job_order_no' => $this->jobOrderNo,
      'title' => $this->title,
      'description' => $this->description,
      'status' => $this->status,
      'priority' => $this->priority,
      'client_id' => $this->clientId,
      'client_name' => $this->clientName,
      'site_location' => $this->siteLocation,
      'required_equipment' => $this->requiredEquipment,
      'assigned_engineers' => $this->assignedEngineers,
      'scheduled_date' => $this->scheduledDate,
      'completed_date' => $this->completedDate,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
    ];
  }
}
