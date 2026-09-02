<?php
// Modules/ReleaseForm/app/Enums/DestinationType.php

namespace Modules\ReleaseForm\app\Enums;

enum DestinationType: string
{
  case CPE = 'CPE';
  case NOC = 'NOC';
  case POP = 'POP';
  case OTHER = 'Other';

  public function label(): string
  {
    return match ($this) {
      self::CPE => 'Customer Premises Equipment',
      self::NOC => 'Network Operations Center',
      self::POP => 'Point of Presence',
      self::OTHER => 'Other',
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
