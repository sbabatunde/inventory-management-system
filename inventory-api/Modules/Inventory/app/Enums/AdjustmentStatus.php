<?php
// Modules/Inventory/app/Enums/AdjustmentStatus.php

namespace Modules\Inventory\app\Enums;

enum AdjustmentStatus: string
{
  case PENDING = 'pending';
  case APPROVED = 'approved';
  case REJECTED = 'rejected';

  public function label(): string
  {
    return match ($this) {
      self::PENDING => 'Pending',
      self::APPROVED => 'Approved',
      self::REJECTED => 'Rejected',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::PENDING => 'amber',
      self::APPROVED => 'green',
      self::REJECTED => 'red',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
