<?php
// Modules/Procurement/app/Http/Requests/StoreSupplierRequest.php

namespace Modules\Procurement\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-suppliers');
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'code' => 'nullable|string|max:50|unique:suppliers,code',
      'email' => 'nullable|email|max:255',
      'phone' => 'nullable|string|max:50',
      'address' => 'nullable|string|max:500',
      'city' => 'nullable|string|max:100',
      'state' => 'nullable|string|max:100',
      'country' => 'nullable|string|max:100',
      'contact_person' => 'nullable|string|max:255',
      'contact_phone' => 'nullable|string|max:50',
      'contact_email' => 'nullable|email|max:255',
      'tax_id' => 'nullable|string|max:100',
      'bank_name' => 'nullable|string|max:255',
      'bank_account_no' => 'nullable|string|max:50',
      'bank_account_name' => 'nullable|string|max:255',
      'is_active' => 'nullable|boolean',
      'notes' => 'nullable|string|max:2000',
    ];
  }

  public function messages(): array
  {
    return [
      'name.required' => 'Supplier name is required',
      'email.email' => 'Please enter a valid email address',
      'contact_email.email' => 'Please enter a valid contact email address',
      'code.unique' => 'This supplier code already exists',
    ];
  }
}
