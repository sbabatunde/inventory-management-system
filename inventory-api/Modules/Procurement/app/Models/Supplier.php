<?php
// Modules/Procurement/app/Models/Supplier.php

namespace Modules\Procurement\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Supplier extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'contact_person',
        'contact_phone',
        'contact_email',
        'tax_id',
        'bank_name',
        'bank_account_no',
        'bank_account_name',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function goodsReceipts(): HasManyThrough  // Changed from HasMany to HasManyThrough
    {
        return $this->hasManyThrough(
            GoodsReceipt::class,
            PurchaseOrder::class,
            'supplier_id', // Foreign key on purchase_orders table
            'purchase_order_id', // Foreign key on goods_receipts table
            'id', // Local key on suppliers table
            'id' // Local key on purchase_orders table
        );
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getTotalOrdersAttribute(): int
    {
        return $this->purchaseOrders()->count();
    }

    public function getTotalSpentAttribute(): float
    {
        return $this->purchaseOrders()
            ->whereIn('status', ['sent', 'partially_received', 'completed'])
            ->sum('total_amount');
    }
}
