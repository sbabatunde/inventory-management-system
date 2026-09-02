<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CRM Authentication Settings
    |--------------------------------------------------------------------------
    */
    'crm_url' => env('CRM_URL', 'http://your-crm-url.com'),
    'token_endpoint' => env('CRM_TOKEN_ENDPOINT', '/api/auth/verify'),
    'user_endpoint' => env('CRM_USER_ENDPOINT', '/api/auth/user'),
    
    /*
    |--------------------------------------------------------------------------
    | Token Cache Settings
    |--------------------------------------------------------------------------
    */
    'cache' => [
        'enabled' => env('CRM_TOKEN_CACHE_ENABLED', true),
        'ttl' => env('CRM_TOKEN_CACHE_TTL', 300), // 5 minutes
        'prefix' => 'crm_token:',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Token Validation
    |--------------------------------------------------------------------------
    */
    'token' => [
        'header' => env('CRM_TOKEN_HEADER', 'Authorization'),
        'type' => env('CRM_TOKEN_TYPE', 'Bearer'),
        'secret' => env('CRM_APP_SECRET'),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | User Synchronization
    |--------------------------------------------------------------------------
    */
    'sync' => [
        'enabled' => env('CRM_USER_SYNC_ENABLED', true),
        'roles' => env('CRM_SYNC_ROLES', true),
        'permissions' => env('CRM_SYNC_PERMISSIONS', true),
    ],
];