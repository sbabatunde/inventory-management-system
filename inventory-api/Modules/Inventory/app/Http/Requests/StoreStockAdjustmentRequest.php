<?php
// Modules/Inventory/app/Http/Requests/StoreStockAdjustmentRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockAdjustmentRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-stock-adjustments');
  }

  public function rules(): array
  {
    return [
      'store_id' => 'required|integer|exists:stores,id',
      'stock_item_id' => 'required|integer|exists:stock_items,id',
      'new_quantity' => 'required|integer|min:0',
      'reason' => 'required|string|max:500',
      'notes' => 'nullable|string|max:1000',
    ];
  }

  public function messages(): array
  {
    return [
      'store_id.required' => 'Store is required',
      'stock_item_id.required' => 'Stock item is required',
      'new_quantity.required' => 'New quantity is required',
      'new_quantity.min' => 'New quantity cannot be negative',
      'reason.required' => 'Reason for adjustment is required',
    ];
  }

  /**
   * Configure the validator instance
   */
  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      // Check if new quantity is different from current
      if ($this->store_id && $this->stock_item_id && $this->new_quantity !== null) {
        $balance = \Modules\Inventory\App\Models\StockBalance::where('store_id', $this->store_id)
          ->where('stock_item_id', $this->stock_item_id)
          ->first();

        if ($balance && $balance->quantity_on_hand === $this->new_quantity) {
          $validator->errors()->add(
            'new_quantity',
            'New quantity must be different from current quantity'
          );
        }
      }
    });
  }
}
