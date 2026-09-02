<?php
// Modules/Procurement/app/Http/Requests/UpdatePurchaseRequisitionRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Procurement\app\Enums\RequisitionPriority;

class UpdatePurchaseRequisitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-purchase-requisitions');
  }

  public function rules(): array
  {
    return [
      'title' => 'required|string|max:255',
      'description' => 'nullable|string|max:1000',
      'priority' => 'required|string|in:' . implode(',', RequisitionPriority::values()),
      'notes' => 'nullable|string|max:2000',
      'items' => 'required|array|min:1',
      'items.*.id' => 'nullable|integer|exists:purchase_requisition_items,id',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.quantity' => 'required|integer|min:1',
      'items.*.unit_of_measure' => 'required|string|max:50',
      'items.*.estimated_unit_cost' => 'nullable|numeric|min:0',
      'items.*.notes' => 'nullable|string|max:500',
    ];
  }
}
