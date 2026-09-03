<?php
// Modules/Inventory/app/Models/StockTransferItem.php

namespace Modules\Inventory\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockTransferItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'stock_transfer_id',
        'stock_item_id',
        'quantity',
        'serial_numbers',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'serial_numbers' => 'array',
    ];

    /**
     * Get stock transfer
     */
    public function stockTransfer(): BelongsTo
    {
        return $this->belongsTo(StockTransfer::class);
    }

    /**
     * Get stock item
     */
    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(StockItem::class);
    }
}
