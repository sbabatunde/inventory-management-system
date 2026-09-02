<?php
// Modules/Integration/app/Http/Controllers/TicketController.php

namespace Modules\Integration\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Integration\app\Services\TicketService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class TicketController extends ModuleBaseController
{
  protected string $moduleName = 'Integration';
  protected string $moduleColor = 'indigo';
  protected string $moduleIcon = 'fa-plug';

  protected TicketService $ticketService;

  public function __construct(TicketService $ticketService)
  {
    $this->ticketService = $ticketService;
  }

  /**
   * Get ticket by ID
   */
  public function show(int $id)
  {
    $ticket = $this->ticketService->getTicket($id);

    if (!$ticket) {
      return $this->error('Ticket not found or CRM unavailable', 404);
    }

    return $this->success($ticket, 'Ticket retrieved successfully');
  }

  /**
   * Get tickets by client
   */
  public function byClient(Request $request)
  {
    $request->validate([
      'client_id' => 'required|integer',
    ]);

    $tickets = $this->ticketService->getTicketsByClient($request->client_id);

    if ($tickets === null) {
      return $this->error('Failed to fetch tickets from CRM', 503);
    }

    return $this->success($tickets, 'Tickets retrieved successfully');
  }
}
