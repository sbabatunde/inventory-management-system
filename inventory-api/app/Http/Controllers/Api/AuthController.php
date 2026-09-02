<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
  protected AuthenticationService $authService;

  public function __construct(AuthenticationService $authService)
  {
    $this->authService = $authService;
  }

  /**
   * Login with multiple methods
   */
  public function login(Request $request)
  {
    $request->validate([
      'method' => 'nullable|string|in:local,crm',
      'email' => 'required_if:method,local|email',
      'password' => 'required_if:method,local|string',
      'crm_token' => 'required_if:method,crm|string',
    ]);

    try {
      $method = $request->input('method', config('auth-methods.default'));

      switch ($method) {
        case 'local':
          $result = $this->authService->attemptLocalLogin(
            $request->email,
            $request->password,
            $request->boolean('remember', false)
          );
          break;

        case 'crm':
          $result = $this->authService->attemptCrmLogin($request->crm_token);
          break;

        default:
          throw ValidationException::withMessages([
            'method' => ['Invalid authentication method.'],
          ]);
      }

      // Add user data to response for frontend
      $user = $result['user'];
      $result['user'] = [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'roles' => $user->getRoleNames(),
        'permissions' => $user->getAllPermissions()->pluck('name'),
        'is_active' => $user->is_active,
      ];

      return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'data' => $result,
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Authentication failed',
        'errors' => $e->errors(),
      ], 422);
    }
  }

  /**
   * Get current user
   */
  public function user(Request $request)
  {
    $user = $request->user();

    return response()->json([
      'success' => true,
      'data' => [
        'user' => [
          'id' => $user->id,
          'name' => $user->name,
          'email' => $user->email,
          'employee_id' => $user->employee_id ?? null,
          'department' => $user->department ?? null,
          'roles' => $user->getRoleNames(),
          'permissions' => $user->getAllPermissions()->pluck('name'),
          'is_active' => $user->is_active,
          'last_login_at' => $user->last_login_at,
        ],
      ],
    ]);
  }

  /**
   * Logout
   */
  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'success' => true,
      'message' => 'Successfully logged out',
    ]);
  }
}
