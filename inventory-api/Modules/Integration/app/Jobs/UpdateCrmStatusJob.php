<?php
// Modules/Integration/app/Jobs/UpdateCrmStatusJob.php

namespace Modules\Integration\app\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\Integration\app\Services\JobOrderService;
use Modules\Integration\app\Services\TicketService;

class UpdateCrmStatusJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  protected string $category;
  protected string $referenceId;
  protected string $status;

  public function __construct(string $category, string $referenceId, string $status)
  {
    $this->category = $category;
    $this->referenceId = $referenceId;
    $this->status = $status;
  }

  public function handle(JobOrderService $jobOrderService, TicketService $ticketService): void
  {
    try {
      if ($this->category === 'installation') {
        $jobOrderService->updateJobOrderStatus((int) $this->referenceId, $this->status);
      } elseif ($this->category === 'maintenance') {
        $ticketService->updateTicketStatus((int) $this->referenceId, $this->status);
      }
    } catch (\Exception $e) {
      \Illuminate\Support\Facades\Log::error('Failed to update CRM status: ' . $e->getMessage());

      // Retry with backoff
      if ($this->attempts() < 3) {
        $this->release(30);
      }
    }
  }
}
