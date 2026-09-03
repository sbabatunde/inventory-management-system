<?php
// Modules/Inventory/app/Models/StockSerial.php

namespace Modules\Inventory\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockSerial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'stock_item_id',
        'serial_no',
        'current_status',
        'current_store_id',
        'current_location_type',
        'current_location_id',
    ];

    protected $casts = [
        'current_status' => 'string',
    ];

    /**
     * Get stock item
     */
    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(StockItem::class);
    }

    /**
     * Get current store
     */
    public function currentStore(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'current_store_id');
    }

    /**
     * Get stock movements for this serial
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Scope for serials in stock
     */
    public function scopeInStock($query)
    {
        return $query->where('current_status', 'in_stock');
    }

    /**
     * Scope for serials in a store
     */
    public function scopeInStore($query, int $storeId)
    {
        return $query->where('current_store_id', $storeId);
    }
}
