<?php
// Modules/Procurement/app/Http/Requests/ReceiveGoodsRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiveGoodsRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('receive-goods');
  }

  public function rules(): array
  {
    return [
      'received_items' => 'required|array|min:1',
      'received_items.*.item_id' => 'required|integer|exists:purchase_order_items,id',
      'received_items.*.quantity_received' => 'required|integer|min:1',
    ];
  }

  public function messages(): array
  {
    return [
      'received_items.required' => 'At least one received item is required',
      'received_items.*.item_id.required' => 'Purchase order item is required',
      'received_items.*.quantity_received.required' => 'Received quantity is required',
      'received_items.*.quantity_received.min' => 'Received quantity must be at least 1',
    ];
  }

  /**
   * Configure the validator instance
   */
  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      $purchaseOrderId = $this->route('id');

      if ($purchaseOrderId && $this->received_items) {
        foreach ($this->received_items as $index => $receivedItem) {
          $orderItem = \Modules\Procurement\App\Models\PurchaseOrderItem::find($receivedItem['item_id']);

          if ($orderItem && $orderItem->purchase_order_id != $purchaseOrderId) {
            $validator->errors()->add(
              "received_items.{$index}.item_id",
              'Item does not belong to this purchase order'
            );
          }

          if ($orderItem) {
            $newTotal = $orderItem->quantity_received + $receivedItem['quantity_received'];

            if ($newTotal > $orderItem->quantity_ordered) {
              $validator->errors()->add(
                "received_items.{$index}.quantity_received",
                "Total received quantity exceeds ordered quantity for this item"
              );
            }
          }
        }
      }
    });
  }
}
