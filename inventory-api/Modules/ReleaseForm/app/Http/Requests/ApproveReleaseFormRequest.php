<?php
// Modules/ReleaseForm/app/Http/Requests/ApproveReleaseFormRequest.php

namespace Modules\ReleaseForm\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApproveReleaseFormRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('approve-release-forms');
  }

  public function rules(): array
  {
    return [
      'notes' => 'nullable|string|max:1000',
    ];
  }
}
