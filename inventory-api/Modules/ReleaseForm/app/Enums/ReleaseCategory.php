<?php
// Modules/ReleaseForm/app/Enums/ReleaseCategory.php

namespace Modules\ReleaseForm\app\Enums;

enum ReleaseCategory: string
{
  case INSTALLATION = 'installation';
  case MAINTENANCE = 'maintenance';
  case OTHERS = 'others';

  public function label(): string
  {
    return match ($this) {
      self::INSTALLATION => 'Installation',
      self::MAINTENANCE => 'Maintenance',
      self::OTHERS => 'Others',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::INSTALLATION => 'blue',
      self::MAINTENANCE => 'amber',
      self::OTHERS => 'purple',
    };
  }

  public function requiresReference(): bool
  {
    return $this !== self::OTHERS;
  }

  public function referenceType(): ?string
  {
    return match ($this) {
      self::INSTALLATION => 'job_order',
      self::MAINTENANCE => 'ticket',
      self::OTHERS => null,
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
