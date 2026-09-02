<?php
// Modules/Assets/app/Enums/DepreciationMethod.php

namespace Modules\Assets\app\Enums;

enum DepreciationMethod: string
{
  case STRAIGHT_LINE = 'straight_line';
  case DECLINING_BALANCE = 'declining_balance';
  case SUM_OF_YEARS = 'sum_of_years';

  public function label(): string
  {
    return match ($this) {
      self::STRAIGHT_LINE => 'Straight Line',
      self::DECLINING_BALANCE => 'Declining Balance',
      self::SUM_OF_YEARS => 'Sum of Years',
    };
  }

  public static function options(): array
  {
    return array_map(fn($case) => [
      'value' => $case->value,
      'label' => $case->label(),
    ], self::cases());
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
