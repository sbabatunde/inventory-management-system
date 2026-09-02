<?php
// Modules/Inventory/app/Http/Requests/StoreStockTransferRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStockTransferRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-stock-transfers');
  }

  public function rules(): array
  {
    return [
      'from_store_id' => [
        'required',
        'integer',
        'exists:stores,id',
        'different:to_store_id',
      ],
      'to_store_id' => [
        'required',
        'integer',
        'exists:stores,id',
      ],
      'notes' => 'nullable|string|max:1000',
      'items' => 'required|array|min:1',
      'items.*.stock_item_id' => [
        'required',
        'integer',
        'exists:stock_items,id',
      ],
      'items.*.quantity' => 'required|integer|min:1',
      'items.*.serial_numbers' => 'nullable|array',
      'items.*.serial_numbers.*' => 'string|max:255',
    ];
  }

  public function messages(): array
  {
    return [
      'from_store_id.required' => 'Source store is required',
      'to_store_id.required' => 'Destination store is required',
      'from_store_id.different' => 'Source and destination stores must be different',
      'items.required' => 'At least one item is required',
      'items.*.stock_item_id.required' => 'Stock item is required',
      'items.*.quantity.required' => 'Quantity is required',
      'items.*.quantity.min' => 'Quantity must be at least 1',
    ];
  }

  /**
   * Configure the validator instance
   */
  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      // Validate stock availability
      if ($this->from_store_id && $this->items) {
        foreach ($this->items as $index => $item) {
          $balance = \Modules\Inventory\App\Models\StockBalance::where('store_id', $this->from_store_id)
            ->where('stock_item_id', $item['stock_item_id'])
            ->first();

          if (!$balance || $balance->quantity_available < $item['quantity']) {
            $validator->errors()->add(
              "items.{$index}.quantity",
              'Insufficient stock available in source store'
            );
          }
        }
      }
    });
  }
}
