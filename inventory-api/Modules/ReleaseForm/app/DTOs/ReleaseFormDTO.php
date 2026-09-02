<?php
// Modules/ReleaseForm/app/DTOs/ReleaseFormDTO.php

namespace Modules\ReleaseForm\app\DTOs;

use Modules\ReleaseForm\app\Enums\ReleaseCategory;
use Modules\ReleaseForm\app\Enums\ReleaseStatus;
use Modules\ReleaseForm\app\Enums\DestinationType;

readonly class ReleaseFormDTO
{
  public function __construct(
    public ?int $id,
    public string $formNo,
    public ReleaseCategory $category,
    public ?string $referenceType,
    public ?string $referenceId,
    public ?string $referenceDescription,
    public int $storeId,
    public DestinationType $destinationType,
    public ?string $destinationName,
    public ?string $destinationAddress,
    public ReleaseStatus $status,
    public bool $isManualEntry,
    public ?string $occurredAt,
    public ?string $recordedAt,
    public ?string $notes,
    public ?string $rejectionReason,
    public int $createdBy,
    public ?int $approvedBy,
    public ?int $dispatchedBy,
    public ?int $completedBy,
    public ?string $approvedAt,
    public ?string $dispatchedAt,
    public ?string $completedAt,
    public ?string $attachmentPath,
    public ?string $pdfPath,
    public ?string $createdAt,
    public ?string $updatedAt,
    public ?array $store,
    public ?array $items,
    public ?array $signatories,
    public ?array $createdByUser,
    public ?array $approvedByUser,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      id: $data['id'] ?? null,
      formNo: $data['form_no'],
      category: ReleaseCategory::from($data['category']),
      referenceType: $data['reference_type'] ?? null,
      referenceId: $data['reference_id'] ?? null,
      referenceDescription: $data['reference_description'] ?? null,
      storeId: $data['store_id'],
      destinationType: DestinationType::from($data['destination_type']),
      destinationName: $data['destination_name'] ?? null,
      destinationAddress: $data['destination_address'] ?? null,
      status: ReleaseStatus::from($data['status'] ?? 'draft'),
      isManualEntry: $data['is_manual_entry'] ?? false,
      occurredAt: $data['occurred_at'] ?? null,
      recordedAt: $data['recorded_at'] ?? null,
      notes: $data['notes'] ?? null,
      rejectionReason: $data['rejection_reason'] ?? null,
      createdBy: $data['created_by'],
      approvedBy: $data['approved_by'] ?? null,
      dispatchedBy: $data['dispatched_by'] ?? null,
      completedBy: $data['completed_by'] ?? null,
      approvedAt: $data['approved_at'] ?? null,
      dispatchedAt: $data['dispatched_at'] ?? null,
      completedAt: $data['completed_at'] ?? null,
      attachmentPath: $data['attachment_path'] ?? null,
      pdfPath: $data['pdf_path'] ?? null,
      createdAt: $data['created_at'] ?? null,
      updatedAt: $data['updated_at'] ?? null,
      store: $data['store'] ?? null,
      items: $data['items'] ?? null,
      signatories: $data['signatories'] ?? null,
      createdByUser: $data['created_by_user'] ?? null,
      approvedByUser: $data['approved_by_user'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'form_no' => $this->formNo,
      'category' => $this->category->value,
      'category_label' => $this->category->label(),
      'category_color' => $this->category->color(),
      'reference_type' => $this->referenceType,
      'reference_id' => $this->referenceId,
      'reference_description' => $this->referenceDescription,
      'store_id' => $this->storeId,
      'destination_type' => $this->destinationType->value,
      'destination_type_label' => $this->destinationType->label(),
      'destination_name' => $this->destinationName,
      'destination_address' => $this->destinationAddress,
      'status' => $this->status->value,
      'status_label' => $this->status->label(),
      'status_color' => $this->status->color(),
      'is_manual_entry' => $this->isManualEntry,
      'occurred_at' => $this->occurredAt,
      'recorded_at' => $this->recordedAt,
      'notes' => $this->notes,
      'rejection_reason' => $this->rejectionReason,
      'created_by' => $this->createdBy,
      'approved_by' => $this->approvedBy,
      'dispatched_by' => $this->dispatchedBy,
      'completed_by' => $this->completedBy,
      'approved_at' => $this->approvedAt,
      'dispatched_at' => $this->dispatchedAt,
      'completed_at' => $this->completedAt,
      'attachment_path' => $this->attachmentPath,
      'pdf_path' => $this->pdfPath,
      'created_at' => $this->createdAt,
      'updated_at' => $this->updatedAt,
      'store' => $this->store,
      'items' => $this->items,
      'signatories' => $this->signatories,
      'created_by_user' => $this->createdByUser,
      'approved_by_user' => $this->approvedByUser,
    ];
  }
}
