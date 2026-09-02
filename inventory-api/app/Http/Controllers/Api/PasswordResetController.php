<?php
// app/Http/Controllers/Api/PasswordResetController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
  /**
   * Send password reset link
   */
  public function forgotPassword(Request $request)
  {
    $request->validate([
      'email' => 'required|email',
    ]);

    $status = Password::sendResetLink(
      $request->only('email')
    );

    if ($status === Password::RESET_LINK_SENT) {
      return response()->json([
        'success' => true,
        'message' => 'Password reset link sent to your email',
      ]);
    }

    return response()->json([
      'success' => false,
      'message' => 'Failed to send reset link',
      'errors' => ['email' => [__($status)]],
    ], 422);
  }

  /**
   * Reset password
   */
  public function resetPassword(Request $request)
  {
    $request->validate([
      'token' => 'required|string',
      'email' => 'required|email',
      'password' => 'required|string|min:8|confirmed',
    ]);

    $status = Password::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      function ($user, $password) {
        $user->forceFill([
          'password' => Hash::make($password),
        ])->setRememberToken(Str::random(60));

        $user->save();

        event(new PasswordReset($user));

        // Log activity
        activity()
          ->performedOn($user)
          ->causedBy($user)
          ->log('reset password');
      }
    );

    if ($status === Password::PASSWORD_RESET) {
      return response()->json([
        'success' => true,
        'message' => 'Password has been reset successfully',
      ]);
    }

    return response()->json([
      'success' => false,
      'message' => 'Failed to reset password',
      'errors' => ['email' => [__($status)]],
    ], 422);
  }
}
