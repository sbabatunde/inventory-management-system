<?php

namespace App\Http\Middleware;

use App\Services\Auth\CrmTokenService;
use App\Models\User;
use App\Models\CrmToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateCrmToken
{
    protected CrmTokenService $tokenService;

    public function __construct(CrmTokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        // Extract token
        $token = $this->extractToken($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'No authentication token provided',
            ], 401);
        }

        // Validate token with CRM
        $userData = $this->tokenService->validateToken($token);

        if (!$userData) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Find or create local user with race condition protection
        try {
            $user = DB::transaction(function () use ($userData) {
                return $this->syncUser($userData);
            }, 3); // Retry 3 times if deadlock occurs
        } catch (\Exception $e) {
            Log::error('Failed to sync user', [
                'error' => $e->getMessage(),
                'crm_user_id' => $userData['crm_user_id'] ?? null,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to synchronize user',
            ], 500);
        }

        // Store token locally with race condition protection
        $this->storeToken($user, $token, $request);

        // Sync roles and permissions
        $this->syncRolesAndPermissions($user, $userData);

        // Set the authenticated user
        Auth::login($user);

        // Attach user data to request
        $request->merge([
            'auth_user' => $user,
            'crm_user_data' => $userData,
            'crm_token' => $token,
        ]);

        return $next($request);
    }

    /**
     * Extract token from request
     */
    protected function extractToken(Request $request): ?string
    {
        $header = $request->header(config('crm-auth.token.header'));
        $tokenType = config('crm-auth.token.type');

        if ($header && preg_match('/^' . $tokenType . '\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }

        // Check query parameter as fallback
        if ($request->has('access_token')) {
            return $request->query('access_token');
        }

        // Check request body as fallback
        if ($request->has('token')) {
            return $request->input('token');
        }

        return null;
    }

    /**
     * Sync user with race condition protection
     */
    protected function syncUser(array $userData): User
    {
        // Use pessimistic lock to prevent race condition
        $user = User::where('crm_user_id', $userData['crm_user_id'])
            ->lockForUpdate()
            ->first();

        if (!$user) {
            // Check again within transaction to prevent duplicate
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
                ]);
            } else {
                // Update existing user with CRM ID
                $user->crm_user_id = $userData['crm_user_id'];
                $user->save();
            }
        } else {
            // Update user details
            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->is_active = true;
            $user->save();
        }

        return $user;
    }

    /**
     * Store token locally
     */
    protected function storeToken(User $user, string $token, Request $request): void
    {
        $tokenHash = hash('sha256', $token);

        // Use updateOrCreate with transaction for race condition protection
        DB::transaction(function () use ($user, $tokenHash, $request) {
            CrmToken::updateOrCreate(
                ['token_hash' => $tokenHash],
                [
                    'user_id' => $user->id,
                    'expires_at' => $this->getTokenExpiry($request),
                    'last_used_at' => now(),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'is_active' => true,
                ]
            );
        });
    }

    /**
     * Sync roles and permissions
     */
    protected function syncRolesAndPermissions(User $user, array $userData): void
    {
        if (!config('crm-auth.sync.roles') && !config('crm-auth.sync.permissions')) {
            return;
        }

        DB::transaction(function () use ($user, $userData) {
            // Sync roles if enabled
            if (config('crm-auth.sync.roles') && isset($userData['roles'])) {
                $user->syncRoles($userData['roles']);
            }

            // Sync permissions if enabled
            if (config('crm-auth.sync.permissions') && isset($userData['permissions'])) {
                $user->syncPermissions($userData['permissions']);
            }
        });
    }

    /**
     * Get token expiry from request or user data
     */
    protected function getTokenExpiry(Request $request): ?string
    {
        $crmData = $request->input('crm_user_data');

        if (isset($crmData['expires_at'])) {
            return $crmData['expires_at'];
        }

        return null;
    }
}
