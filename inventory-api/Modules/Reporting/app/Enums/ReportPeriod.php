<?php
// Modules/Reporting/app/Enums/ReportPeriod.php

namespace Modules\Reporting\app\Enums;

enum ReportPeriod: string
{
  case DAILY = 'daily';
  case MONTHLY = 'monthly';
  case YEARLY = 'yearly';

  public function label(): string
  {
    return match ($this) {
      self::DAILY => 'Daily',
      self::MONTHLY => 'Monthly',
      self::YEARLY => 'Yearly',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
