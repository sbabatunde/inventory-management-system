<?php
// Modules/Integration/app/Services/TicketService.php

namespace Modules\Integration\app\Services;

use Modules\Integration\app\DTOs\TicketDTO;
use Modules\Integration\app\Services\CrmApiClient;

class TicketService
{
  protected CrmApiClient $crmApiClient;

  public function __construct(CrmApiClient $crmApiClient)
  {
    $this->crmApiClient = $crmApiClient;
  }

  /**
   * Get ticket by ID
   */
  public function getTicket(int $id): ?array
  {
    $endpoint = config('crm.endpoints.tickets') . "/{$id}";
    $response = $this->crmApiClient->get($endpoint);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return TicketDTO::fromArray($response['data'])->toArray();
  }

  /**
   * Get tickets by client
   */
  public function getTicketsByClient(int $clientId): ?array
  {
    $endpoint = config('crm.endpoints.tickets');
    $response = $this->crmApiClient->get($endpoint, ['client_id' => $clientId]);

    if (!$response || !isset($response['data'])) {
      return null;
    }

    return array_map(function ($ticket) {
      return TicketDTO::fromArray($ticket)->toArray();
    }, $response['data']);
  }

  /**
   * Update ticket status
   */
  public function updateTicketStatus(int $id, string $status): bool
  {
    $endpoint = str_replace('{id}', $id, config('crm.endpoints.ticket_status'));
    $response = $this->crmApiClient->post($endpoint, ['status' => $status]);

    return $response !== null;
  }
}
