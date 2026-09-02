<?php
// Modules/Procurement/app/Models/GoodsReceiptItem.php

namespace Modules\Procurement\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoodsReceiptItem extends Model
{
    protected $fillable = [
        'goods_receipt_id',
        'purchase_order_item_id',
        'stock_item_id',
        'quantity_received',
        'unit_of_measure',
        'notes',
    ];

    protected $casts = [
        'quantity_received' => 'integer',
    ];

    public function goodsReceipt(): BelongsTo
    {
        return $this->belongsTo(GoodsReceipt::class);
    }

    public function purchaseOrderItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrderItem::class);
    }

    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\app\Models\StockItem::class);
    }
}
