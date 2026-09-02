<?php
// Modules/Procurement/app/Http/Requests/CancelPurchaseOrderRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelPurchaseOrderRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-purchase-orders');
  }

  public function rules(): array
  {
    return [
      'reason' => 'nullable|string|max:1000',
    ];
  }
}
