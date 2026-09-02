<?php
// Modules/Inventory/app/Enums/StockNature.php

namespace Modules\Inventory\app\Enums;

enum StockNature: string
{
  case ASSET = 'asset';
  case SOLID = 'solid';
  case LIQUID = 'liquid';

  public function label(): string
  {
    return match ($this) {
      self::ASSET => 'Asset',
      self::SOLID => 'Solid',
      self::LIQUID => 'Liquid',
    };
  }

  public function requiresSerialization(): bool
  {
    return $this === self::ASSET;
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
