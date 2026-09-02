<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

abstract class BaseController extends Controller
{
    /**
     * Get authenticated user from CRM token
     */
    protected function getCrmUser(Request $request)
    {
        return $request->input('auth_user');
    }

    /**
     * Get CRM user data
     */
    protected function getCrmUserData(Request $request): ?array
    {
        return $request->input('crm_user_data');
    }

    /**
     * Check if user has permission
     */
    protected function hasPermission(Request $request, string $permission): bool
    {
        $user = $this->getCrmUser($request);
        return $user && $user->hasPermissionTo($permission);
    }

    /**
     * Check if user has role
     */
    protected function hasRole(Request $request, string $role): bool
    {
        $user = $this->getCrmUser($request);
        return $user && $user->hasRole($role);
    }

    /**
     * Success response helper
     */
    protected function successResponse($data = null, string $message = 'Success', int $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Error response helper
     */
    protected function errorResponse(string $message = 'Error', int $code = 400, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
