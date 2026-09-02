<?php
// Modules/Procurement/app/Enums/RequisitionStatus.php

namespace Modules\Procurement\App\Enums;

enum RequisitionStatus: string
{
  case DRAFT = 'draft';
  case PENDING_APPROVAL = 'pending_approval';
  case APPROVED = 'approved';
  case REJECTED = 'rejected';
  case CANCELLED = 'cancelled';
  case CONVERTED = 'converted';

  public function label(): string
  {
    return match ($this) {
      self::DRAFT => 'Draft',
      self::PENDING_APPROVAL => 'Pending Approval',
      self::APPROVED => 'Approved',
      self::REJECTED => 'Rejected',
      self::CANCELLED => 'Cancelled',
      self::CONVERTED => 'Converted to PO',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::DRAFT => 'neutral',
      self::PENDING_APPROVAL => 'amber',
      self::APPROVED => 'green',
      self::REJECTED => 'red',
      self::CANCELLED => 'red',
      self::CONVERTED => 'purple',
    };
  }

  public function canTransitionTo(self $newStatus): bool
  {
    return match ($this) {
      self::DRAFT => in_array($newStatus, [self::PENDING_APPROVAL, self::CANCELLED]),
      self::PENDING_APPROVAL => in_array($newStatus, [self::APPROVED, self::REJECTED, self::CANCELLED]),
      self::APPROVED => in_array($newStatus, [self::CONVERTED, self::CANCELLED]),
      self::REJECTED => false,
      self::CANCELLED => false,
      self::CONVERTED => false,
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }

  public static function options(): array
  {
    return array_map(fn($case) => [
      'value' => $case->value,
      'label' => $case->label(),
    ], self::cases());
  }
}
