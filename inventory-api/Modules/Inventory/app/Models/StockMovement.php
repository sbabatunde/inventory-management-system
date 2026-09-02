<?php
// Modules/Inventory/app/Models/StockMovement.php

namespace Modules\Inventory\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Modules\Inventory\app\Enums\StockMovementType;

class StockMovement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'stock_item_id',
        'stock_serial_id',
        'from_store_id',
        'to_store_id',
        'movement_type',
        'quantity',
        'quantity_before',
        'quantity_after',
        'reference_type',
        'reference_id',
        'created_by',
    ];

    protected $casts = [
        'movement_type' => StockMovementType::class,
        'quantity' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
    ];

    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(StockItem::class);
    }

    public function stockSerial(): BelongsTo
    {
        return $this->belongsTo(StockSerial::class);
    }

    public function fromStore(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'from_store_id');
    }

    public function toStore(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'to_store_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeByType($query, StockMovementType $type)
    {
        return $query->where('movement_type', $type->value);
    }

    public function scopeByItem($query, int $stockItemId)
    {
        return $query->where('stock_item_id', $stockItemId);
    }

    public function scopeByStore($query, int $storeId)
    {
        return $query->where(function ($q) use ($storeId) {
            $q->where('from_store_id', $storeId)
                ->orWhere('to_store_id', $storeId);
        });
    }

    public function scopeByDateRange($query, ?string $from, ?string $to)
    {
        return $query->when($from, function ($q, $from) {
            return $q->whereDate('created_at', '>=', $from);
        })
            ->when($to, function ($q, $to) {
                return $q->whereDate('created_at', '<=', $to);
            });
    }
}
