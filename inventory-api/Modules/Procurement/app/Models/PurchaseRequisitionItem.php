<?php
// Modules/Procurement/app/Models/PurchaseRequisitionItem.php

namespace Modules\Procurement\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseRequisitionItem extends Model
{
    protected $fillable = [
        'purchase_requisition_id',
        'stock_item_id',
        'quantity',
        'unit_of_measure',
        'estimated_unit_cost',
        'estimated_total_cost',
        'notes',
    ];

    protected $casts = [
        'estimated_unit_cost' => 'decimal:2',
        'estimated_total_cost' => 'decimal:2',
    ];

    public function purchaseRequisition(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequisition::class);
    }

    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\app\Models\StockItem::class);
    }
}
