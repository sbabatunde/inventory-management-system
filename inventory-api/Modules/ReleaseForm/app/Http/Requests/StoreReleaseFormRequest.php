<?php
// Modules/ReleaseForm/app/Http/Requests/StoreReleaseFormRequest.php

namespace Modules\ReleaseForm\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\ReleaseForm\app\Enums\ReleaseCategory;
use Modules\ReleaseForm\app\Enums\DestinationType;

class StoreReleaseFormRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create-release-forms');
  }

  public function rules(): array
  {
    $rules = [
      'category' => 'required|string|in:' . implode(',', ReleaseCategory::values()),
      'store_id' => 'required|integer|exists:stores,id',
      'destination_type' => 'required|string|in:' . implode(',', DestinationType::values()),
      'destination_name' => 'nullable|string|max:255',
      'destination_address' => 'nullable|string|max:500',
      'notes' => 'nullable|string|max:2000',
      'items' => 'required|array|min:1',
      'items.*.stock_item_id' => 'required|integer|exists:stock_items,id',
      'items.*.serial_no' => 'nullable|string|max:255',
      'items.*.qty_requested' => 'required|integer|min:1',
      'items.*.unit_of_measure' => 'required|string|max:50',
      'items.*.notes' => 'nullable|string|max:500',
    ];

    // Add reference validation based on category
    $category = $this->input('category');

    if ($category === ReleaseCategory::INSTALLATION->value) {
      $rules['reference_id'] = 'required|string|max:100';
      $rules['reference_description'] = 'nullable|string|max:500';
    } elseif ($category === ReleaseCategory::MAINTENANCE->value) {
      $rules['reference_id'] = 'required|string|max:100';
      $rules['reference_description'] = 'nullable|string|max:500';
    } else {
      $rules['reference_description'] = 'required|string|max:500';
    }

    return $rules;
  }

  public function messages(): array
  {
    return [
      'category.required' => 'Release category is required',
      'store_id.required' => 'Store is required',
      'destination_type.required' => 'Destination type is required',
      'items.required' => 'At least one item is required',
      'items.*.stock_item_id.required' => 'Stock item is required',
      'items.*.qty_requested.required' => 'Quantity is required',
      'items.*.qty_requested.min' => 'Quantity must be at least 1',
    ];
  }
}
