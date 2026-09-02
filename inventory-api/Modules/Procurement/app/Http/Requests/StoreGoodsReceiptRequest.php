<?php
// Modules/Procurement/app/Http/Requests/StoreGoodsReceiptRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGoodsReceiptRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('receive-goods');
  }

  public function rules(): array
  {
    return [
      'purchase_order_id' => 'required|integer|exists:purchase_orders,id',
      'store_id' => 'required|integer|exists:stores,id',
      'received_at' => 'required|date',
      'notes' => 'nullable|string|max:2000',
      'items' => 'required|array|min:1',
      'items.*.purchase_order_item_id' => 'required|integer|exists:purchase_order_items,id',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.quantity_received' => 'required|integer|min:1',
      'items.*.unit_of_measure' => 'required|string|max:50',
      'items.*.notes' => 'nullable|string|max:500',
    ];
  }

  public function messages(): array
  {
    return [
      'purchase_order_id.required' => 'Purchase order is required',
      'store_id.required' => 'Store is required',
      'received_at.required' => 'Received date is required',
      'items.required' => 'At least one item is required',
      'items.*.purchase_order_item_id.required' => 'Purchase order item is required',
      'items.*.stock_item_id.required' => 'Stock item is required',
      'items.*.quantity_received.required' => 'Received quantity is required',
      'items.*.quantity_received.min' => 'Received quantity must be at least 1',
    ];
  }

  /**
   * Configure the validator instance
   */
  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      $purchaseOrderId = $this->purchase_order_id;

      if ($purchaseOrderId && $this->items) {
        foreach ($this->items as $index => $item) {
          // Validate that purchase order item belongs to the purchase order
          $orderItem = \Modules\Procurement\App\Models\PurchaseOrderItem::find($item['purchase_order_item_id']);

          if ($orderItem && $orderItem->purchase_order_id != $purchaseOrderId) {
            $validator->errors()->add(
              "items.{$index}.purchase_order_item_id",
              'Item does not belong to this purchase order'
            );
          }

          // Validate stock item matches
          if ($orderItem && $orderItem->stock_item_id != $item['stock_item_id']) {
            $validator->errors()->add(
              "items.{$index}.stock_item_id",
              'Stock item does not match purchase order item'
            );
          }
        }
      }
    });
  }
}
