<?php
// Modules/ReleaseForm/app/Http/Requests/UploadManualReleaseFormRequest.php

namespace Modules\ReleaseForm\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\ReleaseForm\app\Enums\DestinationType;

class UploadManualReleaseFormRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-release-forms');
  }

  public function rules(): array
  {
    return [
      'category' => 'required|string|in:installation,maintenance,others',
      'store_id' => 'required|integer|exists:stores,id',
      'destination_type' => 'required|string|in:' . implode(',', DestinationType::values()),
      'destination_name' => 'nullable|string|max:255',
      'occurred_at' => 'required|date',
      'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
      'reference_description' => 'nullable|string|max:500',
      'notes' => 'nullable|string|max:2000',
      'items' => 'required|array|min:1',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.serial_no' => 'nullable|string|max:255',
      'items.*.qty_requested' => 'required|integer|min:1',
      'items.*.qty_released' => 'nullable|integer|min:0',
      'items.*.unit_of_measure' => 'required|string|max:50',
    ];
  }
}
