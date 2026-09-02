<?php
// Modules/Core/Http/Requests/UpdateProfileRequest.php

namespace Modules\Core\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email,' . $this->user()->id,
      'employee_id' => 'nullable|string|max:50',
      'department' => 'nullable|string|max:100',
    ];
  }
}
