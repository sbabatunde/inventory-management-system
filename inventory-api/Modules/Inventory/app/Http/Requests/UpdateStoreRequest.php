<?php
// Modules/Inventory/app/Http/Requests/UpdateStoreRequest.php

namespace Modules\Inventory\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Inventory\app\Enums\StoreType;

class UpdateStoreRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-stores');
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'code' => 'nullable|string|max:50|unique:stores,code,' . $this->route('id'),
      'type' => 'required|string|in:' . implode(',', StoreType::values()),
      'address' => 'nullable|string|max:500',
      'city' => 'nullable|string|max:100',
      'state' => 'nullable|string|max:100',
      'contact_person' => 'nullable|string|max:255',
      'contact_phone' => 'nullable|string|max:50',
      'contact_email' => 'nullable|email|max:255',
      'is_active' => 'boolean',
    ];
  }
}
