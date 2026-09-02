<?php
// Modules/ReleaseForm/app/Enums/ReleaseStatus.php

namespace Modules\ReleaseForm\app\Enums;

enum ReleaseStatus: string
{
  case DRAFT = 'draft';
  case PENDING_APPROVAL = 'pending_approval';
  case APPROVED = 'approved';
  case DISPATCHED = 'dispatched';
  case COMPLETED = 'completed';
  case REJECTED = 'rejected';
  case CANCELLED = 'cancelled';
  case PENDING_RECONCILIATION = 'pending_reconciliation';

  public function label(): string
  {
    return match ($this) {
      self::DRAFT => 'Draft',
      self::PENDING_APPROVAL => 'Pending Approval',
      self::APPROVED => 'Approved',
      self::DISPATCHED => 'Dispatched',
      self::COMPLETED => 'Completed',
      self::REJECTED => 'Rejected',
      self::CANCELLED => 'Cancelled',
      self::PENDING_RECONCILIATION => 'Pending Reconciliation',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::DRAFT => 'neutral',
      self::PENDING_APPROVAL => 'amber',
      self::APPROVED => 'green',
      self::DISPATCHED => 'blue',
      self::COMPLETED => 'purple',
      self::REJECTED => 'red',
      self::CANCELLED => 'red',
      self::PENDING_RECONCILIATION => 'orange',
    };
  }

  public function canTransitionTo(self $newStatus): bool
  {
    return match ($this) {
      self::DRAFT => in_array($newStatus, [self::PENDING_APPROVAL, self::CANCELLED]),
      self::PENDING_APPROVAL => in_array($newStatus, [self::APPROVED, self::REJECTED, self::CANCELLED]),
      self::APPROVED => in_array($newStatus, [self::DISPATCHED, self::CANCELLED]),
      self::DISPATCHED => in_array($newStatus, [self::COMPLETED]),
      self::PENDING_RECONCILIATION => in_array($newStatus, [self::PENDING_APPROVAL, self::CANCELLED]),
      self::COMPLETED => false,
      self::REJECTED => in_array($newStatus, [self::DRAFT]),
      self::CANCELLED => false,
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
