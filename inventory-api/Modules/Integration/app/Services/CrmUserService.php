<?php
// Modules/Integration/app/Services/CrmUserService.php

namespace Modules\Integration\app\Services;

use Modules\Integration\app\DTOs\CrmUserDTO;
use Modules\Integration\app\Services\CrmApiClient;

class CrmUserService
{
  protected CrmApiClient $crmApiClient;

  public function __construct(CrmApiClient $crmApiClient)
  {
    $this->crmApiClient = $crmApiClient;
  }

  /**
   * Get all CRM users
   */
  public function getUsers(): ?array
  {
    $endpoint = config('crm.endpoints.users');
    $response = $this->crmApiClient->get($endpoint);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return array_map(function ($user) {
      return CrmUserDTO::fromArray($user)->toArray();
    }, $response['data']);
  }

  /**
   * Get CRM user by ID
   */
  public function getUser(int $id): ?array
  {
    $endpoint = config('crm.endpoints.users') . "/{$id}";
    $response = $this->crmApiClient->get($endpoint);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return CrmUserDTO::fromArray($response['data'])->toArray();
  }

  /**
   * Search CRM users
   */
  public function searchUsers(string $search): ?array
  {
    $endpoint = config('crm.endpoints.users');
    $response = $this->crmApiClient->get($endpoint, ['search' => $search]);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return array_map(function ($user) {
      return CrmUserDTO::fromArray($user)->toArray();
    }, $response['data']);
  }
}
