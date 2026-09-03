<?php
// Modules/ReleaseForm/app/Services/ReleaseFormService.php

namespace Modules\ReleaseForm\app\Services;

use Modules\ReleaseForm\App\Models\ReleaseForm;
use Modules\ReleaseForm\App\Models\ReleaseFormItem;
use Modules\ReleaseForm\App\Enums\ReleaseCategory;
use Modules\ReleaseForm\App\Enums\ReleaseStatus;
use Modules\ReleaseForm\App\Repositories\Contracts\ReleaseFormRepositoryInterface;
use Modules\Integration\App\Services\JobOrderService;
use Modules\Integration\App\Services\TicketService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ReleaseFormService
{
  protected ReleaseFormRepositoryInterface $releaseFormRepository;
  protected \Modules\Inventory\App\Services\StockBalanceService $stockBalanceService;
  protected JobOrderService $jobOrderService;
  protected TicketService $ticketService;

  public function __construct(
    ReleaseFormRepositoryInterface $releaseFormRepository,
    \Modules\Inventory\App\Services\StockBalanceService $stockBalanceService,
    JobOrderService $jobOrderService,
    TicketService $ticketService
  ) {
    $this->releaseFormRepository = $releaseFormRepository;
    $this->stockBalanceService = $stockBalanceService;
    $this->jobOrderService = $jobOrderService;
    $this->ticketService = $ticketService;
  }

  /**
   * Create release form with CRM integration
   */
  public function createForm(array $data): array
  {
    return DB::transaction(function () use ($data) {
      // Generate form number
      $data['form_no'] = $this->generateFormNo();
      $data['status'] = ReleaseStatus::DRAFT->value;
      $data['created_by'] = auth()->id();
      $data['recorded_at'] = now();

      // Fetch CRM data if reference provided
      if (isset($data['reference_id']) && $data['reference_id']) {
        $crmData = $this->fetchCrmData($data['category'], $data['reference_id']);

        if ($crmData) {
          $data['reference_description'] = $data['reference_description'] ?? $crmData['description'];

          // Auto-fill destination from CRM
          if (empty($data['destination_name']) && isset($crmData['client_name'])) {
            $data['destination_name'] = $crmData['client_name'];
          }

          if (empty($data['destination_address']) && isset($crmData['site_location'])) {
            $data['destination_address'] = $crmData['site_location'];
          }
        }
      }

      $releaseForm = $this->releaseFormRepository->create($data);

      // Create items with qty_before snapshot
      foreach ($data['items'] as $item) {
        $balance = $this->stockBalanceService->getBalance(
          $data['store_id'],
          $item['stock_item_id']
        );

        ReleaseFormItem::create([
          'release_form_id' => $releaseForm->id,
          'stock_item_id' => $item['stock_item_id'],
          'serial_no' => $item['serial_no'] ?? null,
          'qty_requested' => $item['qty_requested'],
          'qty_released' => 0,
          'qty_before' => $balance->quantity_on_hand ?? 0,
          'qty_after' => null,
          'unit_of_measure' => $item['unit_of_measure'],
          'notes' => $item['notes'] ?? null,
        ]);
      }

      // Create signatories
      if (isset($data['signatories']) && is_array($data['signatories'])) {
        foreach ($data['signatories'] as $signatory) {
          \Modules\ReleaseForm\App\Models\ReleaseFormSignatory::create([
            'release_form_id' => $releaseForm->id,
            'user_id' => $signatory['user_id'] ?? null,
            'crm_user_id' => $signatory['crm_user_id'] ?? null,
            'name' => $signatory['name'],
            'role' => $signatory['role'],
          ]);
        }
      } else {
        // Auto-add requester as signatory
        \Modules\ReleaseForm\app\Models\ReleaseFormSignatory::create([
          'release_form_id' => $releaseForm->id,
          'user_id' => auth()->id(),
          'name' => auth()->user()->name,
          'role' => 'requester',
        ]);
      }

      // Log activity
      activity()
        ->performedOn($releaseForm)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created release form');

      return $this->getForm($releaseForm->id);
    });
  }

  /**
   * Approve release form with CRM notification
   */
  public function approveForm(int $id, ?string $notes = null): array
  {
    return DB::transaction(function () use ($id, $notes) {
      $form = $this->releaseFormRepository->findWithRelations($id);

      if (!$form) {
        throw new \Exception('Release form not found');
      }

      if (!$form->status->canTransitionTo(ReleaseStatus::APPROVED)) {
        throw new \Exception('Form cannot be approved from current status');
      }

      // Validate stock availability
      $this->validateStockAvailability($form);

      // Update form status
      $this->releaseFormRepository->update($id, [
        'status' => ReleaseStatus::APPROVED->value,
        'approved_by' => auth()->id(),
        'approved_at' => now(),
        'notes' => $notes ?? $form->notes,
      ]);

      // Notify CRM (async)
      if ($form->reference_id) {
        dispatch(new \Modules\Integration\app\Jobs\UpdateCrmStatusJob(
          $form->category->value,
          $form->reference_id,
          'approved'
        ));
      }

      // Log activity
      activity()
        ->performedOn($form)
        ->causedBy(auth()->user())
        ->log('approved release form');

      return $this->getForm($id);
    });
  }

  /**
   * Dispatch release form with CRM notification
   */
  public function dispatchForm(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $form = $this->releaseFormRepository->findWithRelations($id);

      if (!$form) {
        throw new \Exception('Release form not found');
      }

      if (!$form->status->canTransitionTo(ReleaseStatus::DISPATCHED)) {
        throw new \Exception('Form cannot be dispatched from current status');
      }

      // Deduct stock for each item
      foreach ($form->items as $item) {
        $balance = $this->stockBalanceService->getBalance(
          $form->store_id,
          $item->stock_item_id
        );

        if (!$balance || $balance->quantity_available < $item->qty_requested) {
          throw new \Exception("Insufficient stock for item: {$item->stockItem->name}");
        }

        // Update stock balance
        $newQuantity = $balance->quantity_on_hand - $item->qty_requested;
        $this->stockBalanceService->updateBalance(
          $form->store_id,
          $item->stock_item_id,
          $newQuantity,
          $balance->quantity_reserved
        );

        // Update form item
        $item->qty_released = $item->qty_requested;
        $item->qty_after = $newQuantity;
        $item->save();
      }

      // Update form status
      $this->releaseFormRepository->update($id, [
        'status' => ReleaseStatus::DISPATCHED->value,
        'dispatched_by' => auth()->id(),
        'dispatched_at' => now(),
      ]);

      // Notify CRM (async)
      if ($form->reference_id) {
        dispatch(new \Modules\Integration\app\Jobs\UpdateCrmStatusJob(
          $form->category->value,
          $form->reference_id,
          'dispatched'
        ));
      }

      // Log activity
      activity()
        ->performedOn($form)
        ->causedBy(auth()->user())
        ->log('dispatched release form');

      return $this->getForm($id);
    });
  }

  /**
   * Complete release form with CRM notification
   */
  public function completeForm(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $form = $this->releaseFormRepository->find($id);

      if (!$form) {
        throw new \Exception('Release form not found');
      }

      if (!$form->status->canTransitionTo(ReleaseStatus::COMPLETED)) {
        throw new \Exception('Form cannot be completed from current status');
      }

      $this->releaseFormRepository->update($id, [
        'status' => ReleaseStatus::COMPLETED->value,
        'completed_by' => auth()->id(),
        'completed_at' => now(),
      ]);

      // Notify CRM (async)
      if ($form->reference_id) {
        dispatch(new \Modules\Integration\app\Jobs\UpdateCrmStatusJob(
          $form->category->value,
          $form->reference_id,
          'completed'
        ));
      }

      // Log activity
      activity()
        ->performedOn($form)
        ->causedBy(auth()->user())
        ->log('completed release form');

      return $this->getForm($id);
    });
  }

  /**
   * Attach job order to release form
   */
  public function attachJobOrder(int $id, string $jobOrderId): array
  {
    return DB::transaction(function () use ($id, $jobOrderId) {
      $form = $this->releaseFormRepository->find($id);

      if (!$form) {
        throw new \Exception('Release form not found');
      }

      // Fetch job order from CRM
      $jobOrder = $this->jobOrderService->getJobOrder((int) $jobOrderId);

      if (!$jobOrder) {
        throw new \Exception('Job order not found in CRM');
      }

      $this->releaseFormRepository->update($id, [
        'reference_type' => 'job_order',
        'reference_id' => $jobOrderId,
        'reference_description' => $jobOrder['description'] ?? null,
        'destination_name' => $jobOrder['client_name'] ?? $form->destination_name,
        'destination_address' => $jobOrder['site_location'] ?? $form->destination_address,
      ]);

      // Add engineers as signatories
      if (isset($jobOrder['assigned_engineers'])) {
        foreach ($jobOrder['assigned_engineers'] as $engineer) {
          \Modules\ReleaseForm\App\Models\ReleaseFormSignatory::firstOrCreate(
            [
              'release_form_id' => $id,
              'crm_user_id' => $engineer['id'],
            ],
            [
              'name' => $engineer['name'],
              'role' => 'engineer',
            ]
          );
        }
      }

      // Log activity
      activity()
        ->performedOn($form)
        ->causedBy(auth()->user())
        ->withProperties(['job_order_id' => $jobOrderId])
        ->log('attached job order to release form');

      return $this->getForm($id);
    });
  }

  /**
   * Attach ticket to release form
   */
  public function attachTicket(int $id, string $ticketId): array
  {
    return DB::transaction(function () use ($id, $ticketId) {
      $form = $this->releaseFormRepository->find($id);

      if (!$form) {
        throw new \Exception('Release form not found');
      }

      // Fetch ticket from CRM
      $ticket = $this->ticketService->getTicket((int) $ticketId);

      if (!$ticket) {
        throw new \Exception('Ticket not found in CRM');
      }

      $this->releaseFormRepository->update($id, [
        'reference_type' => 'ticket',
        'reference_id' => $ticketId,
        'reference_description' => $ticket['description'] ?? null,
        'destination_name' => $ticket['client_name'] ?? $form->destination_name,
        'destination_address' => $ticket['site_location'] ?? $form->destination_address,
      ]);

      // Add engineers as signatories
      if (isset($ticket['assigned_engineers'])) {
        foreach ($ticket['assigned_engineers'] as $engineer) {
          \Modules\ReleaseForm\App\Models\ReleaseFormSignatory::firstOrCreate(
            [
              'release_form_id' => $id,
              'crm_user_id' => $engineer['id'],
            ],
            [
              'name' => $engineer['name'],
              'role' => 'engineer',
            ]
          );
        }
      }

      // Log activity
      activity()
        ->performedOn($form)
        ->causedBy(auth()->user())
        ->withProperties(['ticket_id' => $ticketId])
        ->log('attached ticket to release form');

      return $this->getForm($id);
    });
  }

  /**
   * Get form with CRM reference details
   */
  public function getForm(int $id): ?array
  {
    $form = $this->releaseFormRepository->findWithRelations($id);

    if (!$form) {
      return null;
    }

    // Fetch CRM reference details if available
    $crmReference = null;
    if ($form->reference_id) {
      if ($form->reference_type === 'job_order') {
        $crmReference = $this->jobOrderService->getJobOrder((int) $form->reference_id);
      } elseif ($form->reference_type === 'ticket') {
        $crmReference = $this->ticketService->getTicket((int) $form->reference_id);
      }
    }

    return [
      'form' => $form,
      'crm_reference' => $crmReference,
    ];
  }

  /**
   * Fetch CRM data based on category
   */
  protected function fetchCrmData(string $category, string $referenceId): ?array
  {
    try {
      if ($category === ReleaseCategory::INSTALLATION->value) {
        return $this->jobOrderService->getJobOrder((int) $referenceId);
      } elseif ($category === ReleaseCategory::MAINTENANCE->value) {
        return $this->ticketService->getTicket((int) $referenceId);
      }
    } catch (\Exception $e) {
      // CRM unavailable - proceed without CRM data
      \Illuminate\Support\Facades\Log::warning('Failed to fetch CRM data: ' . $e->getMessage());
    }

    return null;
  }

  /**
   * Validate stock availability
   */
  protected function validateStockAvailability(ReleaseForm $form): void
  {
    foreach ($form->items as $item) {
      $balance = $this->stockBalanceService->getBalance(
        $form->store_id,
        $item->stock_item_id
      );

      if (!$balance || $balance->quantity_available < $item->qty_requested) {
        throw new \Exception("Insufficient stock for item: {$item->stockItem->name}");
      }
    }
  }

  /**
   * Generate form number
   */
  protected function generateFormNo(): string
  {
    $prefix = 'RF';
    $year = date('Y');
    $count = ReleaseForm::whereYear('created_at', $year)->count() + 1;
    return "{$prefix}-{$year}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
  }
}
