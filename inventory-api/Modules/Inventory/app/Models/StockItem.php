<?php
// Modules/Inventory/app/Models/StockItem.php

namespace Modules\Inventory\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'category_id',
        'nature',
        'is_serialized',
        'unit_of_measure',
        'reorder_level',
        'unit_cost',
        'is_active',
    ];

    protected $casts = [
        'is_serialized' => 'boolean',
        'is_active' => 'boolean',
        'unit_cost' => 'decimal:2',
        'reorder_level' => 'integer',
    ];

    /**
     * Get category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(StockCategory::class);
    }

    /**
     * Get stock balances for this item
     */
    public function stockBalances(): HasMany
    {
        return $this->hasMany(StockBalance::class);
    }

    /**
     * Get stock serials for this item
     */
    public function stockSerials(): HasMany
    {
        return $this->hasMany(StockSerial::class);
    }

    /**
     * Get stock movements for this item
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Get stock transfer items
     */
    public function stockTransferItems(): HasMany
    {
        return $this->hasMany(StockTransferItem::class);
    }

    /**
     * Get stock adjustment items
     */
    public function stockAdjustments(): HasMany
    {
        return $this->hasMany(StockAdjustment::class);
    }

    /**
     * Get release form items
     */
    public function releaseFormItems(): HasMany
    {
        return $this->hasMany(\Modules\ReleaseForm\app\Models\ReleaseFormItem::class);
    }

    /**
     * Get assets linked to this item
     */
    public function assets(): HasMany
    {
        return $this->hasMany(\Modules\Assets\app\Models\Assets::class);
    }

    /**
     * Get total stock across all stores
     */
    public function getTotalStockAttribute(): int
    {
        return $this->stockBalances()->sum('quantity_on_hand');
    }

    /**
     * Check if item is low on stock
     */
    public function getIsLowStockAttribute(): bool
    {
        return $this->total_stock <= $this->reorder_level;
    }

    /**
     * Scope for active items
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for serialized items
     */
    public function scopeSerialized($query)
    {
        return $query->where('is_serialized', true);
    }

    /**
     * Scope by nature
     */
    public function scopeByNature($query, string $nature)
    {
        return $query->where('nature', $nature);
    }
}
