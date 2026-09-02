<?php
// Modules/Inventory/app/Enums/TransferStatus.php

namespace Modules\Inventory\app\Enums;

enum TransferStatus: string
{
  case REQUESTED = 'requested';
  case APPROVED = 'approved';
  case IN_TRANSIT = 'in_transit';
  case RECEIVED = 'received';
  case CANCELLED = 'cancelled';

  public function label(): string
  {
    return match ($this) {
      self::REQUESTED => 'Requested',
      self::APPROVED => 'Approved',
      self::IN_TRANSIT => 'In Transit',
      self::RECEIVED => 'Received',
      self::CANCELLED => 'Cancelled',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::REQUESTED => 'blue',
      self::APPROVED => 'purple',
      self::IN_TRANSIT => 'amber',
      self::RECEIVED => 'green',
      self::CANCELLED => 'red',
    };
  }

  public function canTransitionTo(self $newStatus): bool
  {
    return match ($this) {
      self::REQUESTED => in_array($newStatus, [self::APPROVED, self::CANCELLED]),
      self::APPROVED => in_array($newStatus, [self::IN_TRANSIT, self::CANCELLED]),
      self::IN_TRANSIT => in_array($newStatus, [self::RECEIVED]),
      self::RECEIVED => false,
      self::CANCELLED => false,
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
