<?php
// Modules/Inventory/app/Http/Requests/StoreStockItemRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Inventory\app\Enums\StockNature;

class StoreStockItemRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-stock-items');
  }

  public function rules(): array
  {
    return [
      'code' => 'nullable|string|max:50|unique:stock_items,code',
      'name' => 'required|string|max:255',
      'description' => 'nullable|string|max:1000',
      'category_id' => 'nullable|integer|exists:stock_categories,id',
      'nature' => 'required|string|in:' . implode(',', StockNature::values()),
      'is_serialized' => 'boolean',
      'unit_of_measure' => 'required|string|max:50',
      'reorder_level' => 'integer|min:0',
      'unit_cost' => 'numeric|min:0',
      'is_active' => 'boolean',
    ];
  }

  public function messages(): array
  {
    return [
      'name.required' => 'Item name is required',
      'nature.required' => 'Stock nature is required',
      'nature.in' => 'Invalid stock nature',
      'unit_of_measure.required' => 'Unit of measure is required',
      'unit_cost.min' => 'Unit cost cannot be negative',
      'reorder_level.min' => 'Reorder level cannot be negative',
    ];
  }
}
