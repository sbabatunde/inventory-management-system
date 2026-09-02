<?php
// Modules/Core/Http/Requests/CreateUserRequest.php

namespace Modules\Core\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-users');
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'password' => 'required|string|min:8|confirmed',
      'is_active' => 'boolean',
      'roles' => 'array',
      'roles.*' => 'string|exists:roles,name',
      'permissions' => 'array',
      'permissions.*' => 'string|exists:permissions,name',
    ];
  }
}
