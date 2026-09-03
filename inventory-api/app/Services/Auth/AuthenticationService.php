<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Services\Auth\CrmTokenService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticationService
{
  /**
   * Attempt local authentication
   */
  public function attemptLocalLogin(string $email, string $password, bool $remember = false): array
  {
    // Check if local auth is enabled
    if (!$this->isMethodEnabled('local')) {
      throw ValidationException::withMessages([
        'email' => ['Local authentication is currently disabled.'],
      ]);
    }

    // Rate limiting
    $this->ensureNotRateLimited($email);

    // Find user
    $user = User::where('email', $email)->first();

    if (!$user || !Hash::check($password, $user->password)) {
      RateLimiter::hit($this->throttleKey($email));

      throw ValidationException::withMessages([
        'email' => ['The provided credentials are incorrect.'],
      ]);
    }

    // Check if user is active
    if (!$user->is_active) {
      throw ValidationException::withMessages([
        'email' => ['This account has been deactivated.'],
      ]);
    }

    // Clear rate limiter
    RateLimiter::clear($this->throttleKey($email));

    // Generate token
    $token = $this->generateSanctumToken($user, 'local');

    // Update last login
    $user->update([
      'last_login_at' => now(),
      'last_login_ip' => request()->ip(),
    ]);

    return [
      'user' => $user,
      'token' => $token,
      'token_type' => 'Bearer',
      'expires_at' => $this->getTokenExpiry(),
    ];
  }

  /**
   * Attempt CRM authentication
   */
  public function attemptCrmLogin(string $crmToken): array
  {
    if (!$this->isMethodEnabled('crm')) {
      throw ValidationException::withMessages([
        'token' => ['CRM authentication is currently disabled.'],
      ]);
    }

    // Validate with CRM
    $crmService = app(CrmTokenService::class);
    $userData = $crmService->validateToken($crmToken);

    if (!$userData) {
      throw ValidationException::withMessages([
        'token' => ['Invalid or expired CRM token.'],
      ]);
    }

    // Find or create user
    $user = $this->syncCrmUser($userData);

    // Generate local token
    $token = $this->generateSanctumToken($user, 'crm');

    return [
      'user' => $user,
      'token' => $token,
      'token_type' => 'Bearer',
      'expires_at' => $this->getTokenExpiry(),
    ];
  }

  /**
   * Generate Sanctum token
   */

  protected function generateSanctumToken(User $user, string $source): string
  {
    // Delete old tokens
    if (\Illuminate\Support\Facades\Schema::hasTable('personal_access_tokens')) {
      $user->tokens()->where('name', 'auth_token')->delete();
    }

    // Create new token with expiry
    $token = $user->createToken(
      'auth_token',
      ['*'],
      $this->getTokenExpiry()  // Pass Carbon instance directly, not array
    )->plainTextToken;

    return $token;
  }

  /**
   * Sync CRM user
   */
  protected function syncCrmUser(array $userData): User
  {
    return DB::transaction(function () use ($userData) {
      // Try to find by crm_user_id first
      $user = User::where('crm_user_id', $userData['crm_user_id'])
        ->lockForUpdate()
        ->first();

      if (!$user) {
        // Try to find by email
        $user = User::where('email', $userData['email'])
          ->lockForUpdate()
          ->first();

        if (!$user) {
          // Create new user
          $user = User::create([
            'crm_user_id' => $userData['crm_user_id'],
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make(uniqid('crm_', true)),
            'is_active' => true,
            'email_verified_at' => now(),
            'last_synced_at' => now(),
          ]);
        } else {
          // Link existing user to CRM AND update their info
          $user->update([
            'crm_user_id' => $userData['crm_user_id'],
            'name' => $userData['name'],  // Update name
            'is_active' => true,
            'last_synced_at' => now(),
          ]);
        }
      } else {
        // Update existing CRM user
        $user->update([
          'name' => $userData['name'],  // Update name
          'email' => $userData['email'],  // Update email
          'is_active' => true,
          'last_synced_at' => now(),
        ]);
      }

      // Sync roles
      if (isset($userData['roles']) && is_array($userData['roles'])) {
        $user->syncRoles($userData['roles']);
      }

      // Sync permissions
      if (isset($userData['permissions']) && is_array($userData['permissions'])) {
        $user->syncPermissions($userData['permissions']);
      }

      return $user;
    });
  }

  /**
   * Check if authentication method is enabled
   */
  public function isMethodEnabled(string $method): bool
  {
    return config("auth-methods.methods.{$method}.enabled", false);
  }

  /**
   * Get enabled authentication methods
   */
  public function getEnabledMethods(): array
  {
    return array_keys(array_filter(
      config('auth-methods.methods', []),
      fn($config) => $config['enabled'] ?? false
    ));
  }

  /**
   * Rate limiting
   */
  protected function ensureNotRateLimited(string $email): void
  {
    if (!RateLimiter::tooManyAttempts($this->throttleKey($email), config('auth-methods.security.max_attempts'))) {
      return;
    }

    $seconds = RateLimiter::availableIn($this->throttleKey($email));

    throw ValidationException::withMessages([
      'email' => [trans('auth.throttle', [
        'seconds' => $seconds,
        'minutes' => ceil($seconds / 60),
      ])],
    ]);
  }

  protected function throttleKey(string $email): string
  {
    return strtolower($email) . '|' . request()->ip();
  }

  protected function getTokenExpiry(): ?Carbon
  {
    return now()->addMinutes((int) config('auth-methods.session.lifetime', 120));
  }
}
