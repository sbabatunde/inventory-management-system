<?php
// Modules/Integration/app/Enums/CrmEntityType.php

namespace Modules\Integration\app\Enums;

enum CrmEntityType: string
{
  case JOB_ORDER = 'job_order';
  case TICKET = 'ticket';
  case USER = 'user';

  public function label(): string
  {
    return match ($this) {
      self::JOB_ORDER => 'Job Order',
      self::TICKET => 'Ticket',
      self::USER => 'User',
    };
  }

  public function endpoint(): string
  {
    return match ($this) {
      self::JOB_ORDER => 'job_orders',
      self::TICKET => 'tickets',
      self::USER => 'users',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
