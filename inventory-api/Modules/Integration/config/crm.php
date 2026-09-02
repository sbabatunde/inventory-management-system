<?php
// Modules/Integration/config/crm.php

return [
  /*
    |--------------------------------------------------------------------------
    | CRM API Configuration
    |--------------------------------------------------------------------------
    */
  'base_url' => env('CRM_URL', 'http://your-crm-url.com'),
  'api_version' => env('CRM_API_VERSION', 'v1'),
  'app_secret' => env('CRM_APP_SECRET'),

  /*
    |--------------------------------------------------------------------------
    | CRM Endpoints
    |--------------------------------------------------------------------------
    */
  'endpoints' => [
    'job_orders' => '/api/v1/job-orders',
    'tickets' => '/api/v1/tickets',
    'users' => '/api/v1/users',
    'job_order_status' => '/api/v1/job-orders/{id}/status',
    'ticket_status' => '/api/v1/tickets/{id}/status',
  ],

  /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    */
  'cache' => [
    'enabled' => env('CRM_CACHE_ENABLED', true),
    'ttl' => env('CRM_CACHE_TTL', 300), // 5 minutes
    'prefix' => 'crm:',
  ],

  /*
    |--------------------------------------------------------------------------
    | Retry Settings
    |--------------------------------------------------------------------------
    */
  'retry' => [
    'max_attempts' => env('CRM_RETRY_ATTEMPTS', 3),
    'delay_seconds' => env('CRM_RETRY_DELAY', 2),
    'circuit_breaker_threshold' => env('CRM_CIRCUIT_BREAKER_THRESHOLD', 5),
    'circuit_breaker_timeout' => env('CRM_CIRCUIT_BREAKER_TIMEOUT', 60),
  ],

  /*
    |--------------------------------------------------------------------------
    | Timeout Settings
    |--------------------------------------------------------------------------
    */
  'timeout' => [
    'connection' => env('CRM_CONNECTION_TIMEOUT', 10),
    'request' => env('CRM_REQUEST_TIMEOUT', 30),
  ],
];
