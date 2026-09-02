<?php
// Modules/Inventory/app/Enums/StoreType.php

namespace Modules\Inventory\app\Enums;

enum StoreType: string
{
  case HQ = 'HQ';
  case BRANCH = 'Branch';
  case POP = 'POP';

  public function label(): string
  {
    return match ($this) {
      self::HQ => 'Headquarters',
      self::BRANCH => 'Branch',
      self::POP => 'Point of Presence',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::HQ => 'blue',
      self::BRANCH => 'purple',
      self::POP => 'green',
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
