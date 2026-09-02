<?php
// Modules/Procurement/app/Http/Requests/RejectPurchaseRequisitionRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectPurchaseRequisitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('approve-purchase-requisitions');
  }

  public function rules(): array
  {
    return [
      'reason' => 'required|string|max:1000',
    ];
  }

  public function messages(): array
  {
    return [
      'reason.required' => 'Rejection reason is required',
    ];
  }
}
