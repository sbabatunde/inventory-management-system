<?php
// app/Http/Controllers/Api/BaseApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

abstract class BaseApiController extends Controller
{
  /**
   * Success response
   */
  protected function success($data = null, string $message = 'Success', int $code = 200): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data' => $data,
    ], $code);
  }

  /**
   * Error response
   */
  protected function error(string $message = 'Error', int $code = 400, $errors = null): JsonResponse
  {
    return response()->json([
      'success' => false,
      'message' => $message,
      'errors' => $errors,
    ], $code);
  }

  /**
   * Paginated response
   */
  protected function paginated($data, string $message = 'Success'): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data' => $data->items(),
      'pagination' => [
        'current_page' => $data->currentPage(),
        'last_page' => $data->lastPage(),
        'per_page' => $data->perPage(),
        'total' => $data->total(),
        'from' => $data->firstItem(),
        'to' => $data->lastItem(),
      ],
    ]);
  }

  /**
   * Get authenticated user
   */
  protected function getAuthUser()
  {
    return auth()->user();
  }

  /**
   * Check if user has permission
   */
  protected function hasPermission(string $permission): bool
  {
    $user = $this->getAuthUser();
    return $user && $user->can($permission);
  }

  /**
   * Check if user has role
   */
  protected function hasRole(string $role): bool
  {
    $user = $this->getAuthUser();
    return $user && $user->hasRole($role);
  }
}
