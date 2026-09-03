<?php
// Modules/Inventory/app/Models/StockBalance.php

namespace Modules\Inventory\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockBalance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'stock_item_id',
        'quantity_on_hand',
        'quantity_reserved',
        'quantity_available',
        'last_counted_at',
    ];

    protected $casts = [
        'quantity_on_hand' => 'integer',
        'quantity_reserved' => 'integer',
        'quantity_available' => 'integer',
        'last_counted_at' => 'datetime',
    ];

    /**
     * Get store
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get stock item
     */
    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(StockItem::class);
    }

    /**
     * Scope for available stock
     */
    public function scopeAvailable($query)
    {
        return $query->where('quantity_available', '>', 0);
    }

    /**
     * Scope for low stock
     */
    public function scopeLowStock($query)
    {
        return $query->whereHas('stockItem', function ($q) {
            $q->whereRaw('stock_balances.quantity_available <= stock_items.reorder_level');
        });
    }
}
