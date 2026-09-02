<?php
// Modules/Inventory/app/Enums/StockMovementType.php

namespace Modules\Inventory\app\Enums;

enum StockMovementType: string
{
  case RECEIPT = 'receipt';
  case ISSUE = 'issue';
  case TRANSFER = 'transfer';
  case ADJUSTMENT = 'adjustment';
  case RETURN = 'return';

  public function label(): string
  {
    return match ($this) {
      self::RECEIPT => 'Goods Receipt',
      self::ISSUE => 'Stock Issue',
      self::TRANSFER => 'Stock Transfer',
      self::ADJUSTMENT => 'Stock Adjustment',
      self::RETURN => 'Stock Return',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::RECEIPT => 'green',
      self::ISSUE => 'blue',
      self::TRANSFER => 'purple',
      self::ADJUSTMENT => 'amber',
      self::RETURN => 'teal',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }

  public function isStockIn(): bool
  {
    return in_array($this, [self::RECEIPT, self::RETURN]);
  }

  public function isStockOut(): bool
  {
    return in_array($this, [self::ISSUE, self::TRANSFER, self::ADJUSTMENT]);
  }

  public static function options(): array
  {
    return array_map(fn($case) => [
      'value' => $case->value,
      'label' => $case->label(),
    ], self::cases());
  }
}
