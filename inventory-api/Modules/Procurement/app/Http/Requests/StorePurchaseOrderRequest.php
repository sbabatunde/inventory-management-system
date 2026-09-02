<?php
// Modules/Procurement/app/Http/Requests/StorePurchaseOrderRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseOrderRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-purchase-orders');
  }

  public function rules(): array
  {
    return [
      'supplier_id' => 'required|integer|exists:suppliers,id',
      'purchase_requisition_id' => 'nullable|integer|exists:purchase_requisitions,id',
      'store_id' => 'required|integer|exists:stores,id',
      'order_date' => 'required|date',
      'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
      'tax_amount' => 'nullable|numeric|min:0',
      'discount_amount' => 'nullable|numeric|min:0',
      'shipping_cost' => 'nullable|numeric|min:0',
      'notes' => 'nullable|string|max:2000',
      'terms_and_conditions' => 'nullable|string|max:5000',
      'items' => 'required|array|min:1',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.quantity_ordered' => 'required|integer|min:1',
      'items.*.unit_of_measure' => 'required|string|max:50',
      'items.*.unit_price' => 'required|numeric|min:0',
      'items.*.notes' => 'nullable|string|max:500',
    ];
  }

  public function messages(): array
  {
    return [
      'supplier_id.required' => 'Supplier is required',
      'store_id.required' => 'Store is required',
      'order_date.required' => 'Order date is required',
      'items.required' => 'At least one item is required',
      'items.*.stock_item_id.required' => 'Stock item is required',
      'items.*.quantity_ordered.required' => 'Quantity is required',
      'items.*.quantity_ordered.min' => 'Quantity must be at least 1',
      'items.*.unit_price.required' => 'Unit price is required',
      'items.*.unit_price.min' => 'Unit price cannot be negative',
    ];
  }
}
