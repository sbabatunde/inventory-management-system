<?php
// Modules/Inventory/app/Enums/SerialStatus.php

namespace Modules\Inventory\app\Enums;

enum SerialStatus: string
{
  case IN_STOCK = 'in_stock';
  case ISSUED = 'issued';
  case IN_TRANSIT = 'in_transit';
  case MAINTENANCE = 'maintenance';
  case RETIRED = 'retired';

  public function label(): string
  {
    return match ($this) {
      self::IN_STOCK => 'In Stock',
      self::ISSUED => 'Issued',
      self::IN_TRANSIT => 'In Transit',
      self::MAINTENANCE => 'Maintenance',
      self::RETIRED => 'Retired',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::IN_STOCK => 'green',
      self::ISSUED => 'blue',
      self::IN_TRANSIT => 'amber',
      self::MAINTENANCE => 'purple',
      self::RETIRED => 'red',
    };
  }

  public function isAvailable(): bool
  {
    return $this === self::IN_STOCK;
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
