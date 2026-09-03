<?php
// Modules/Assets/app/Http/Requests/UpdateAssetRequest.php

namespace Modules\Assets\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Assets\app\Enums\AssetType;
use Modules\Assets\app\Enums\AssetStatus;
use Modules\Assets\app\Enums\DepreciationMethod;

class UpdateAssetRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('edit-assets');
  }

  public function rules(): array
  {
    return [
      'asset_code' => 'nullable|string|max:50|unique:assets,asset_code,' . $this->route('id'),
      'name' => 'required|string|max:255',
      'description' => 'nullable|string|max:1000',
      'type' => 'required|string|in:' . implode(',', AssetType::values()),
      'stock_item_id' => 'nullable|integer|exists:stock_items,id',
      'serial_no' => 'nullable|string|max:255',
      'status' => 'nullable|string|in:' . implode(',', AssetStatus::values()),
      'current_store_id' => 'nullable|integer|exists:stores,id',
      'purchase_cost' => 'nullable|numeric|min:0',
      'purchase_date' => 'nullable|date',
      'salvage_value' => 'nullable|numeric|min:0',
      'useful_life_months' => 'nullable|integer|min:1',
      'depreciation_method' => 'nullable|string|in:' . implode(',', DepreciationMethod::values()),
      'is_active' => 'nullable|boolean',
    ];
  }
}
