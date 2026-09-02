<?php
// Modules/Inventory/app/Http/Requests/StoreStockCategoryRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockCategoryRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-stock-items');
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'code' => 'nullable|string|max:50|unique:stock_categories,code',
      'description' => 'nullable|string|max:1000',
      'parent_id' => 'nullable|integer|exists:stock_categories,id',
      'is_active' => 'boolean',
    ];
  }
}
