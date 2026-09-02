<?php
// Modules/Assets/app/Enums/AssetStatus.php

namespace Modules\Assets\app\Enums;

enum AssetStatus: string
{
  case IN_STOCK = 'in_stock';
  case ASSIGNED = 'assigned';
  case INSTALLED = 'installed';
  case MAINTENANCE = 'maintenance';
  case RETIRED = 'retired';

  public function label(): string
  {
    return match ($this) {
      self::IN_STOCK => 'In Stock',
      self::ASSIGNED => 'Assigned',
      self::INSTALLED => 'Installed',
      self::MAINTENANCE => 'Maintenance',
      self::RETIRED => 'Retired',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::IN_STOCK => 'green',
      self::ASSIGNED => 'blue',
      self::INSTALLED => 'purple',
      self::MAINTENANCE => 'amber',
      self::RETIRED => 'red',
    };
  }

  public function isAvailable(): bool
  {
    return $this === self::IN_STOCK;
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
