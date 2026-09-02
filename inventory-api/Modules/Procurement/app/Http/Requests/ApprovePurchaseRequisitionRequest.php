<?php
// Modules/Procurement/app/Http/Requests/ApprovePurchaseRequisitionRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApprovePurchaseRequisitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('approve-purchase-requisitions');
  }

  public function rules(): array
  {
    return [
      'notes' => 'nullable|string|max:1000',
    ];
  }
}
