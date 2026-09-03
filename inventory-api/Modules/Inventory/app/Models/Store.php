<?php
// Modules/Inventory/app/Models/Store.php

namespace Modules\Inventory\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'type',
        'address',
        'city',
        'state',
        'contact_person',
        'contact_phone',
        'contact_email',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get stock balances for this store
     */
    public function stockBalances(): HasMany
    {
        return $this->hasMany(StockBalance::class);
    }

    /**
     * Get stock transfers from this store
     */
    public function stockTransfersFrom(): HasMany
    {
        return $this->hasMany(StockTransfer::class, 'from_store_id');
    }

    /**
     * Get stock transfers to this store
     */
    public function stockTransfersTo(): HasMany
    {
        return $this->hasMany(StockTransfer::class, 'to_store_id');
    }

    /**
     * Get stock adjustments for this store
     */
    public function stockAdjustments(): HasMany
    {
        return $this->hasMany(StockAdjustment::class);
    }

    /**
     * Get stock serials in this store
     */
    public function stockSerials(): HasMany
    {
        return $this->hasMany(StockSerial::class, 'current_store_id');
    }

    /**
     * Get release forms from this store
     */
    public function releaseForms(): HasMany
    {
        return $this->hasMany(\Modules\ReleaseForm\app\Models\ReleaseForm::class);
    }

    /**
     * Get assets in this store
     */
    public function assets(): HasMany
    {
        return $this->hasMany(\Modules\Assets\app\Models\Assets::class, 'current_store_id');
    }

    /**
     * Get purchase orders for this store
     */
    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(\Modules\Procurement\app\Models\PurchaseOrder::class);
    }

    /**
     * Scope for active stores
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for stores by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
