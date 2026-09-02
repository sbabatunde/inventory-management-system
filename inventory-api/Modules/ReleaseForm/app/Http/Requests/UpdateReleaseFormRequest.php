<?php
// Modules/ReleaseForm/app/Http/Requests/UpdateReleaseFormRequest.php

namespace Modules\ReleaseForm\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\ReleaseForm\app\Enums\DestinationType;

class UpdateReleaseFormRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-release-forms');
  }

  public function rules(): array
  {
    return [
      'store_id' => 'required|integer|exists:stores,id',
      'destination_type' => 'required|string|in:' . implode(',', DestinationType::values()),
      'destination_name' => 'nullable|string|max:255',
      'destination_address' => 'nullable|string|max:500',
      'reference_description' => 'nullable|string|max:500',
      'notes' => 'nullable|string|max:2000',
      'items' => 'required|array|min:1',
      'items.*.id' => 'nullable|integer|exists:release_form_items,id',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.serial_no' => 'nullable|string|max:255',
      'items.*.qty_requested' => 'required|integer|min:1',
      'items.*.unit_of_measure' => 'required|string|max:50',
      'items.*.notes' => 'nullable|string|max:500',
    ];
  }
}
