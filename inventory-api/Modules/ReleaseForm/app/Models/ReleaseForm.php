<?php
// Modules/ReleaseForm/app/Models/ReleaseForm.php

namespace Modules\ReleaseForm\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\ReleaseForm\App\Enums\ReleaseCategory;
use Modules\ReleaseForm\App\Enums\ReleaseStatus;
use Modules\ReleaseForm\App\Enums\DestinationType;

class ReleaseForm extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'form_no',
        'category',
        'reference_type',
        'reference_id',
        'reference_description',
        'store_id',
        'destination_type',
        'destination_name',
        'destination_address',
        'status',
        'is_manual_entry',
        'occurred_at',
        'recorded_at',
        'notes',
        'rejection_reason',
        'created_by',
        'approved_by',
        'dispatched_by',
        'completed_by',
        'approved_at',
        'dispatched_at',
        'completed_at',
        'attachment_path',
        'pdf_path',
    ];

    protected $casts = [
        'category' => ReleaseCategory::class,
        'status' => ReleaseStatus::class,
        'destination_type' => DestinationType::class,
        'is_manual_entry' => 'boolean',
        'occurred_at' => 'date',
        'recorded_at' => 'datetime',
        'approved_at' => 'datetime',
        'dispatched_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\App\Models\Store::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReleaseFormItem::class);
    }

    public function signatories(): HasMany
    {
        return $this->hasMany(ReleaseFormSignatory::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by');
    }

    public function dispatchedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'dispatched_by');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'completed_by');
    }

    public function scopeByStatus($query, ReleaseStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function scopeByCategory($query, ReleaseCategory $category)
    {
        return $query->where('category', $category->value);
    }

    public function scopePendingApproval($query)
    {
        return $query->where('status', ReleaseStatus::PENDING_APPROVAL->value);
    }

    public function isComplete(): bool
    {
        return $this->status === ReleaseStatus::COMPLETED;
    }

    public function hasAllRequiredSignatures(): bool
    {
        $requiredRoles = ['requester', 'storekeeper', 'receiver'];
        $signedRoles = $this->signatories()
            ->whereNotNull('signed_at')
            ->pluck('role')
            ->toArray();

        return empty(array_diff($requiredRoles, $signedRoles));
    }
}
