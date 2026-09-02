<?php
// Modules/ReleaseForm/app/Enums/SignatoryRole.php

namespace Modules\ReleaseForm\app\Enums;

enum SignatoryRole: string
{
  case REQUESTER = 'requester';
  case STOREKEEPER = 'storekeeper';
  case ENGINEER = 'engineer';
  case APPROVER = 'approver';
  case RECEIVER = 'receiver';

  public function label(): string
  {
    return match ($this) {
      self::REQUESTER => 'Requester',
      self::STOREKEEPER => 'Storekeeper',
      self::ENGINEER => 'Engineer',
      self::APPROVER => 'Approver',
      self::RECEIVER => 'Receiver',
    };
  }

  public function isRequired(): bool
  {
    return in_array($this, [self::REQUESTER, self::STOREKEEPER, self::RECEIVER]);
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
