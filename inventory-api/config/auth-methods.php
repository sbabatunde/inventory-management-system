<?php

return [
  /*
    |--------------------------------------------------------------------------
    | Authentication Methods
    |--------------------------------------------------------------------------
    | Toggle different authentication methods on/off
    */
  'methods' => [
    'local' => [
      'enabled' => env('AUTH_LOCAL_ENABLED', true),
      'name' => 'Local Authentication',
    ],
    'crm' => [
      'enabled' => env('AUTH_CRM_ENABLED', false),
      'name' => 'CRM Authentication',
    ],
    'sso' => [
      'enabled' => env('AUTH_SSO_ENABLED', false),
      'name' => 'Single Sign-On',
    ],
  ],

  /*
    |--------------------------------------------------------------------------
    | Default Authentication Method
    |--------------------------------------------------------------------------
    | This will be used when multiple methods are enabled
    */
  'default' => env('AUTH_DEFAULT_METHOD', 'local'),

  /*
    |--------------------------------------------------------------------------
    | CRM Settings
    |--------------------------------------------------------------------------
    */
  'crm' => [
    'url' => env('CRM_URL', 'http://your-crm-url.com'),
    'token_endpoint' => env('CRM_TOKEN_ENDPOINT', '/api/auth/verify'),
    'user_endpoint' => env('CRM_USER_ENDPOINT', '/api/auth/user'),
    'app_secret' => env('CRM_APP_SECRET'),
    'cache_enabled' => env('CRM_TOKEN_CACHE_ENABLED', true),
    'cache_ttl' => env('CRM_TOKEN_CACHE_TTL', 300),
  ],

  /*
    |--------------------------------------------------------------------------
    | Session Settings
    |--------------------------------------------------------------------------
    */
  'session' => [
    'lifetime' => env('AUTH_SESSION_LIFETIME', 120), // minutes
    'expire_on_close' => env('AUTH_EXPIRE_ON_CLOSE', false),
    'encrypt' => env('AUTH_ENCRYPT_COOKIES', true),
  ],

  /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    */
  'security' => [
    'max_attempts' => env('AUTH_MAX_ATTEMPTS', 5),
    'decay_minutes' => env('AUTH_DECAY_MINUTES', 30),
    'lockout_duration' => env('AUTH_LOCKOUT_DURATION', 15), // minutes
    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800), // 3 hours
  ],
];
