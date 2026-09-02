<?php
// Modules/Reporting/app/Enums/ReportType.php

namespace Modules\Reporting\app\Enums;

enum ReportType: string
{
  case COST = 'cost';
  case INVENTORY = 'inventory';
  case PROCUREMENT = 'procurement';
  case ASSET = 'asset';
  case RELEASE = 'release';

  public function label(): string
  {
    return match ($this) {
      self::COST => 'Cost Report',
      self::INVENTORY => 'Inventory Report',
      self::PROCUREMENT => 'Procurement Report',
      self::ASSET => 'Asset Report',
      self::RELEASE => 'Release Form Report',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
