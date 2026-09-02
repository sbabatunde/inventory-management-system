<?php
// Modules/Procurement/app/Models/PurchaseOrder.php

namespace Modules\Procurement\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Procurement\app\Enums\PurchaseOrderStatus;

class PurchaseOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'po_no',
        'supplier_id',
        'purchase_requisition_id',
        'store_id',
        'status',
        'order_date',
        'expected_delivery_date',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'shipping_cost',
        'total_amount',
        'notes',
        'terms_and_conditions',
        'created_by',
        'approved_by',
        'approved_at',
        'sent_at',
    ];

    protected $casts = [
        'status' => PurchaseOrderStatus::class,
        'order_date' => 'date',
        'expected_delivery_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseRequisition(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequisition::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\App\Models\Store::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function goodsReceipts(): HasMany
    {
        return $this->hasMany(GoodsReceipt::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by');
    }

    public function scopeByStatus($query, PurchaseOrderStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function getTotalItemsAttribute(): int
    {
        return $this->items()->count();
    }

    public function getTotalQuantityOrderedAttribute(): int
    {
        return $this->items()->sum('quantity_ordered');
    }

    public function getTotalQuantityReceivedAttribute(): int
    {
        return $this->items()->sum('quantity_received');
    }

    public function getReceiptPercentageAttribute(): float
    {
        $ordered = $this->total_quantity_ordered;
        $received = $this->total_quantity_received;

        return $ordered > 0 ? round(($received / $ordered) * 100, 2) : 0;
    }
}
