<?php
// Modules/Integration/app/Services/JobOrderService.php

namespace Modules\Integration\app\Services;

use Modules\Integration\app\DTOs\JobOrderDTO;
use Modules\Integration\app\Services\CrmApiClient;

class JobOrderService
{
  protected CrmApiClient $crmApiClient;

  public function __construct(CrmApiClient $crmApiClient)
  {
    $this->crmApiClient = $crmApiClient;
  }

  /**
   * Get job order by ID
   */
  public function getJobOrder(int $id): ?array
  {
    $endpoint = config('crm.endpoints.job_orders') . "/{$id}";
    $response = $this->crmApiClient->get($endpoint);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return JobOrderDTO::fromArray($response['data'])->toArray();
  }

  /**
   * Get job orders by client
   */
  public function getJobOrdersByClient(int $clientId): ?array
  {
    $endpoint = config('crm.endpoints.job_orders');
    $response = $this->crmApiClient->get($endpoint, ['client_id' => $clientId]);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return array_map(function ($jobOrder) {
      return JobOrderDTO::fromArray($jobOrder)->toArray();
    }, $response['data']);
  }

  /**
   * Update job order status
   */
  public function updateJobOrderStatus(int $id, string $status): bool
  {
    $endpoint = str_replace('{id}', $id, config('crm.endpoints.job_order_status'));
    $response = $this->crmApiClient->post($endpoint, ['status' => $status]);

    return $response !== null;
  }
}
