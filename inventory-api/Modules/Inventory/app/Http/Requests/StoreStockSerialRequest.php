<?php
// Modules/Inventory/app/Http/Requests/StoreStockSerialRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockSerialRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-stock-items');
  }

  public function rules(): array
  {
    return [
      'stock_item_id' => 'required|integer|exists:stock_items,id',
      'store_id' => 'required|integer|exists:stores,id',
      'serial_numbers' => 'required|array|min:1',
      'serial_numbers.*' => 'required|string|max:255|distinct',
    ];
  }

  public function messages(): array
  {
    return [
      'stock_item_id.required' => 'Stock item is required',
      'store_id.required' => 'Store is required',
      'serial_numbers.required' => 'At least one serial number is required',
      'serial_numbers.*.distinct' => 'Duplicate serial numbers are not allowed',
    ];
  }
}
