<?php
// Modules/Procurement/app/Enums/RequisitionPriority.php

namespace Modules\Procurement\app\Enums;

enum RequisitionPriority: string
{
  case LOW = 'low';
  case MEDIUM = 'medium';
  case HIGH = 'high';
  case URGENT = 'urgent';

  public function label(): string
  {
    return match ($this) {
      self::LOW => 'Low',
      self::MEDIUM => 'Medium',
      self::HIGH => 'High',
      self::URGENT => 'Urgent',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::LOW => 'neutral',
      self::MEDIUM => 'blue',
      self::HIGH => 'amber',
      self::URGENT => 'red',
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
