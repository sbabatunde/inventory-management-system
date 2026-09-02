<?php
// Modules/Procurement/app/DTOs/PurchaseRequisitionDTO.php

namespace Modules\Procurement\app\DTOs;

use Modules\Procurement\app\Enums\RequisitionStatus;
use Modules\Procurement\app\Enums\RequisitionPriority;

readonly class PurchaseRequisitionDTO
{
  public function __construct(
    public ?int $id,
    public string $prNo,
    public string $title,
    public ?string $description,
    public RequisitionPriority $priority,
    public RequisitionStatus $status,
    public int $requestedBy,
    public ?int $approvedBy,
    public ?string $approvedAt,
    public ?string $rejectionReason,
    public ?string $notes,
    public ?float $totalEstimatedCost,
    public ?int $itemCount,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $items,
    public ?array $requestedByUser,
    public ?array $approvedByUser,
    public ?array $purchaseOrder,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      prNo: $data['pr_no'],
      title: $data['title'],
      description: $data['description'] ?? null,
      priority: RequisitionPriority::from($data['priority'] ?? 'medium'),
      status: RequisitionStatus::from($data['status'] ?? 'draft'),
      requestedBy: $data['requested_by'],
      approvedBy: $data['approved_by'] ?? null,
      approvedAt: $data['approved_at'] ?? null,
      rejectionReason: $data['rejection_reason'] ?? null,
      notes: $data['notes'] ?? null,
      totalEstimatedCost: $data['total_estimated_cost'] ?? null,
      itemCount: $data['item_count'] ?? null,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      items: $data['items'] ?? null,
      requestedByUser: $data['requested_by_user'] ?? null,
      approvedByUser: $data['approved_by_user'] ?? null,
      purchaseOrder: $data['purchase_order'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'pr_no' => $this->prNo,
      'title' => $this->title,
      'description' => $this->description,
      'priority' => $this->priority->value,
      'priority_label' => $this->priority->label(),
      'priority_color' => $this->priority->color(),
      'status' => $this->status->value,
      'status_label' => $this->status->label(),
      'status_color' => $this->status->color(),
      'requested_by' => $this->requestedBy,
      'approved_by' => $this->approvedBy,
      'approved_at' => $this->approvedAt,
      'rejection_reason' => $this->rejectionReason,
      'notes' => $this->notes,
      'total_estimated_cost' => $this->totalEstimatedCost,
      'item_count' => $this->itemCount,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
      'items' => $this->items,
      'requested_by_user' => $this->requestedByUser,
      'approved_by_user' => $this->approvedByUser,
      'purchase_order' => $this->purchaseOrder,
    ];
  }
}
