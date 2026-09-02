<?php
// Modules/Core/Http/Controllers/ModuleBaseController.php

namespace Modules\Core\Http\Controllers;

use App\Http\Controllers\Api\BaseApiController;

abstract class ModuleBaseController extends BaseApiController
{
  /**
   * Module name
   */
  protected string $moduleName = 'Core';

  /**
   * Module color
   */
  protected string $moduleColor = 'blue';

  /**
   * Module icon
   */
  protected string $moduleIcon = 'fa-cube';

  /**
   * Get module info
   */
  protected function getModuleInfo(): array
  {
    return [
      'name' => $this->moduleName,
      'color' => $this->moduleColor,
      'icon' => $this->moduleIcon,
    ];
  }

  /**
   * Success response with module info
   */
  protected function moduleSuccess($data = null, string $message = 'Success', int $code = 200)
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data' => $data,
      'module' => $this->getModuleInfo(),
    ], $code);
  }
}
