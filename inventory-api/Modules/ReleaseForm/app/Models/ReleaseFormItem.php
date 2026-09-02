<?php
// Modules/ReleaseForm/app/Models/ReleaseFormItem.php

namespace Modules\ReleaseForm\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReleaseFormItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'release_form_id',
        'stock_item_id',
        'serial_no',
        'qty_requested',
        'qty_released',
        'qty_before',
        'qty_after',
        'unit_of_measure',
        'notes',
    ];

    protected $casts = [
        'qty_requested' => 'integer',
        'qty_released' => 'integer',
        'qty_before' => 'integer',
        'qty_after' => 'integer',
    ];

    public function releaseForm(): BelongsTo
    {
        return $this->belongsTo(ReleaseForm::class);
    }

    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\App\Models\StockItem::class);
    }

    public function getQtyPendingAttribute(): int
    {
        return $this->qty_requested - $this->qty_released;
    }
}
