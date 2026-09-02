<?php
// Modules/Inventory/app/Http/Requests/UpdateStockAdjustmentRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockAdjustmentRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('approve-stock-adjustments');
  }

  public function rules(): array
  {
    return [
      'status' => 'required|string|in:approved,rejected',
      'notes' => 'nullable|string|max:1000',
    ];
  }

  public function messages(): array
  {
    return [
      'status.required' => 'Status is required',
      'status.in' => 'Status must be either approved or rejected',
    ];
  }
}
