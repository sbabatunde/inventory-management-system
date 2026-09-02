<?php
// Modules/Assets/app/Enums/AssetType.php

namespace Modules\Assets\app\Enums;

enum AssetType: string
{
  case POP = 'pop';
  case CLIENT = 'client';
  case FIBRE = 'fibre';
  case RADIO = 'radio';
  case OTHER = 'other';

  public function label(): string
  {
    return match ($this) {
      self::POP => 'POP Equipment',
      self::CLIENT => 'Client Equipment',
      self::FIBRE => 'Fibre Equipment',
      self::RADIO => 'Radio Equipment',
      self::OTHER => 'Other',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::POP => 'blue',
      self::CLIENT => 'green',
      self::FIBRE => 'purple',
      self::RADIO => 'amber',
      self::OTHER => 'neutral',
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
