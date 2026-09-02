<?php
// Modules/Inventory/app/Http/Requests/UpdateStockSerialStatusRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Inventory\app\Enums\SerialStatus;

class UpdateStockSerialStatusRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-stock-items');
  }

  public function rules(): array
  {
    return [
      'status' => 'required|string|in:' . implode(',', SerialStatus::values()),
      'store_id' => 'nullable|integer|exists:stores,id',
    ];
  }

  public function messages(): array
  {
    return [
      'status.required' => 'Status is required',
      'status.in' => 'Invalid status',
    ];
  }
}
