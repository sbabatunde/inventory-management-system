<?php
// Modules/Core/app/Http/Controllers/SettingsController.php

namespace Modules\Core\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends ModuleBaseController
{
  protected string $moduleName = 'Core';
  protected string $moduleColor = 'blue';
  protected string $moduleIcon = 'fa-gear';

  /**
   * Get all settings
   */
  public function index(Request $request)
  {
    $group = $request->input('group', 'general');
    $settings = Setting::where('group', $group)->get();

    return $this->moduleSuccess($settings, 'Settings retrieved');
  }

  /**
   * Update settings
   */
  public function update(Request $request)
  {
    $request->validate([
      'settings' => 'required|array',
      'settings.*.key' => 'required|string',
      'settings.*.value' => 'required',
    ]);

    foreach ($request->settings as $setting) {
      Setting::set(
        $setting['key'],
        $setting['value'],
        $setting['group'] ?? 'general',
        $setting['type'] ?? 'string',
        $setting['is_public'] ?? false
      );
    }

    return $this->moduleSuccess(null, 'Settings updated successfully');
  }

  /**
   * Get specific setting
   */
  public function show(string $key)
  {
    $setting = Setting::where('key', $key)->firstOrFail();
    return $this->moduleSuccess($setting, 'Setting retrieved');
  }
}
