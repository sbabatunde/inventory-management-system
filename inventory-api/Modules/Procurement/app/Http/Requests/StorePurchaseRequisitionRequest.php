<?php
// Modules/Procurement/app/Http/Requests/StorePurchaseRequisitionRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Procurement\app\Enums\RequisitionPriority;

class StorePurchaseRequisitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-purchase-requisitions');
  }

  public function rules(): array
  {
    return [
      'title' => 'required|string|max:255',
      'description' => 'nullable|string|max:1000',
      'priority' => 'required|string|in:' . implode(',', RequisitionPriority::values()),
      'notes' => 'nullable|string|max:2000',
      'items' => 'required|array|min:1',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.quantity' => 'required|integer|min:1',
      'items.*.unit_of_measure' => 'required|string|max:50',
      'items.*.estimated_unit_cost' => 'nullable|numeric|min:0',
      'items.*.notes' => 'nullable|string|max:500',
    ];
  }

  public function messages(): array
  {
    return [
      'title.required' => 'Requisition title is required',
      'priority.required' => 'Priority is required',
      'priority.in' => 'Invalid priority level',
      'items.required' => 'At least one item is required',
      'items.*.stock_item_id.required' => 'Stock item is required',
      'items.*.quantity.required' => 'Quantity is required',
      'items.*.quantity.min' => 'Quantity must be at least 1',
      'items.*.unit_of_measure.required' => 'Unit of measure is required',
    ];
  }
}
