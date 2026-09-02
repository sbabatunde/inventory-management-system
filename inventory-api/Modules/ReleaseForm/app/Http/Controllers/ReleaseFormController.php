<?php
// Modules/ReleaseForm/app/Http/Controllers/ReleaseFormController.php

namespace Modules\ReleaseForm\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\ReleaseForm\app\Services\ReleaseFormService;
use Modules\ReleaseForm\app\Http\Requests\StoreReleaseFormRequest;
use Modules\ReleaseForm\app\Http\Requests\UpdateReleaseFormRequest;
use Modules\ReleaseForm\app\Http\Requests\ApproveReleaseFormRequest;
use Modules\ReleaseForm\app\Http\Requests\UploadManualReleaseFormRequest;
use Modules\ReleaseForm\app\Enums\ReleaseCategory;
use Modules\ReleaseForm\app\Enums\ReleaseStatus;
use Modules\ReleaseForm\app\Enums\DestinationType;
use Modules\Core\Http\Controllers\ModuleBaseController;

class ReleaseFormController extends ModuleBaseController
{
    protected string $moduleName = 'Release Forms';
    protected string $moduleColor = 'purple';
    protected string $moduleIcon = 'fa-file-signature';

    protected ReleaseFormService $releaseFormService;

    public function __construct(ReleaseFormService $releaseFormService)
    {
        $this->releaseFormService = $releaseFormService;
    }

    /**
     * Display a listing of release forms
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'category' => $request->category,
            'status' => $request->status,
            'store_id' => $request->store_id,
            'is_manual_entry' => $request->is_manual_entry,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'sort' => $request->sort,
            'per_page' => $request->per_page,
        ];

        $forms = $this->releaseFormService->getPaginatedForms($filters);

        return $this->success([
            'forms' => $forms->items(),
            'pagination' => [
                'current_page' => $forms->currentPage(),
                'last_page' => $forms->lastPage(),
                'per_page' => $forms->perPage(),
                'total' => $forms->total(),
                'from' => $forms->firstItem(),
                'to' => $forms->lastItem(),
            ],
        ], 'Release forms retrieved successfully');
    }

    /**
     * Store a newly created release form
     */
    public function store(StoreReleaseFormRequest $request)
    {
        try {
            $form = $this->releaseFormService->createForm($request->validated());
            return $this->success($form, 'Release form created successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Display the specified release form
     */
    public function show(int $id)
    {
        $form = $this->releaseFormService->getForm($id);

        if (!$form) {
            return $this->error('Release form not found', 404);
        }

        return $this->success($form, 'Release form retrieved successfully');
    }

    /**
     * Update the specified release form
     */
    public function update(UpdateReleaseFormRequest $request, int $id)
    {
        try {
            $form = $this->releaseFormService->updateForm($id, $request->validated());
            return $this->success($form, 'Release form updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Submit form for approval
     */
    public function submitForApproval(int $id)
    {
        try {
            $form = $this->releaseFormService->submitForApproval($id);
            return $this->success($form, 'Release form submitted for approval');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Approve release form
     */
    public function approve(int $id, ApproveReleaseFormRequest $request)
    {
        try {
            $form = $this->releaseFormService->approveForm($id, $request->notes);
            return $this->success($form, 'Release form approved successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Dispatch release form
     */
    public function dispatch(int $id)
    {
        try {
            $form = $this->releaseFormService->dispatchForm($id);
            return $this->success($form, 'Release form dispatched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Complete release form
     */
    public function complete(int $id)
    {
        try {
            $form = $this->releaseFormService->completeForm($id);
            return $this->success($form, 'Release form completed successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Reject release form
     */
    public function reject(int $id, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            $form = $this->releaseFormService->rejectForm($id, $request->reason);
            return $this->success($form, 'Release form rejected successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Cancel release form
     */
    public function cancel(int $id)
    {
        try {
            $form = $this->releaseFormService->cancelForm($id);
            return $this->success($form, 'Release form cancelled successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Create manual entry form
     */
    public function createManual(UploadManualReleaseFormRequest $request)
    {
        try {
            $form = $this->releaseFormService->createManualForm($request->validated());
            return $this->success($form, 'Manual release form created successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Reconcile manual form
     */
    public function reconcile(int $id)
    {
        try {
            $form = $this->releaseFormService->reconcileForm($id);
            return $this->success($form, 'Manual release form reconciled successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Get pending approvals
     */
    public function pendingApprovals()
    {
        $forms = $this->releaseFormService->getPendingApprovals();
        return $this->success($forms, 'Pending approvals retrieved successfully');
    }

    /**
     * Get pending reconciliations
     */
    public function pendingReconciliations()
    {
        $forms = $this->releaseFormService->getPendingReconciliations();
        return $this->success($forms, 'Pending reconciliations retrieved successfully');
    }

    /**
     * Get release summary
     */
    public function summary(Request $request)
    {
        $filters = [
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $summary = $this->releaseFormService->getReleaseSummary($filters);
        return $this->success($summary, 'Release summary retrieved successfully');
    }

    /**
     * Get categories
     */
    public function categories()
    {
        return $this->success(ReleaseCategory::options(), 'Categories retrieved successfully');
    }

    /**
     * Get statuses
     */
    public function statuses()
    {
        return $this->success(ReleaseStatus::options(), 'Statuses retrieved successfully');
    }

    /**
     * Get destination types
     */
    public function destinationTypes()
    {
        return $this->success(DestinationType::options(), 'Destination types retrieved successfully');
    }
}
