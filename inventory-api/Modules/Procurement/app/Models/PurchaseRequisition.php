<?php
// Modules/Procurement/app/Models/PurchaseRequisition.php

namespace Modules\Procurement\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Procurement\app\Enums\RequisitionStatus;
use Modules\Procurement\app\Enums\RequisitionPriority;

class PurchaseRequisition extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pr_no',
        'title',
        'description',
        'priority',
        'status',
        'requested_by',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'notes',
    ];

    protected $casts = [
        'priority' => RequisitionPriority::class,
        'status' => RequisitionStatus::class,
        'approved_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseRequisitionItem::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'requested_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by');
    }

    public function purchaseOrder(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function scopePendingApproval($query)
    {
        return $query->where('status', RequisitionStatus::PENDING_APPROVAL->value);
    }

    public function scopeByPriority($query, RequisitionPriority $priority)
    {
        return $query->where('priority', $priority->value);
    }

    public function getTotalEstimatedCostAttribute(): float
    {
        return $this->items()->sum('estimated_total_cost');
    }

    public function getItemCountAttribute(): int
    {
        return $this->items()->count();
    }
}
