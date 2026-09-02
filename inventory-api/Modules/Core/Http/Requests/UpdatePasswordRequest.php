<?php
// Modules/Core/Http/Requests/UpdatePasswordRequest.php

namespace Modules\Core\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'current_password' => 'required|string',
      'new_password' => 'required|string|min:8|confirmed|different:current_password',
    ];
  }
}
