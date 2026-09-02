<?php
// Modules/Inventory/app/Http/Requests/UpdateStockItemRequest.php

namespace Modules\Inventory\App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Inventory\app\Enums\StockNature;

class UpdateStockItemRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-stock-items');
  }

  public function rules(): array
  {
    return [
      'code' => 'nullable|string|max:50|unique:stock_items,code,' . $this->route('id'),
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
}
