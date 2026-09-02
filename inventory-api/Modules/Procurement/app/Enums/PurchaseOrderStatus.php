<?php
// Modules/Procurement/app/Enums/PurchaseOrderStatus.php

namespace Modules\Procurement\App\Enums;

enum PurchaseOrderStatus: string
{
  case DRAFT = 'draft';
  case SENT = 'sent';
  case PARTIALLY_RECEIVED = 'partially_received';
  case COMPLETED = 'completed';
  case CANCELLED = 'cancelled';

  public function label(): string
  {
    return match ($this) {
      self::DRAFT => 'Draft',
      self::SENT => 'Sent',
      self::PARTIALLY_RECEIVED => 'Partially Received',
      self::COMPLETED => 'Completed',
      self::CANCELLED => 'Cancelled',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::DRAFT => 'neutral',
      self::SENT => 'blue',
      self::PARTIALLY_RECEIVED => 'amber',
      self::COMPLETED => 'green',
      self::CANCELLED => 'red',
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
