<?php
// Modules/ReleaseForm/app/Repositories/ReleaseFormRepository.php

namespace Modules\ReleaseForm\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\ReleaseForm\app\Models\ReleaseForm;
use Modules\ReleaseForm\app\Repositories\Contracts\ReleaseFormRepositoryInterface;
use Modules\ReleaseForm\app\Enums\ReleaseStatus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReleaseFormRepository implements ReleaseFormRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = ReleaseForm::with(['store', 'items.stockItem', 'signatories', 'createdBy', 'approvedBy'])
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('form_no', 'like', "%{$search}%")
            ->orWhere('reference_id', 'like', "%{$search}%")
            ->orWhere('destination_name', 'like', "%{$search}%");
        });
      })
      ->when($filters['category'] ?? null, function ($q, $category) {
        return $q->where('category', $category);
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('status', $status);
      })
      ->when($filters['store_id'] ?? null, function ($q, $storeId) {
        return $q->where('store_id', $storeId);
      })
      ->when($filters['is_manual_entry'] ?? null, function ($q, $isManual) {
        return $q->where('is_manual_entry', $isManual);
      })
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      })
      ->when($filters['sort'] ?? null, function ($q, $sort) {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');
        return $q->orderBy($column, $direction);
      }, function ($q) {
        return $q->latest();
      });

    return $query->paginate($perPage);
  }

  public function find(int $id): ?ReleaseForm
  {
    return Cache::remember("release_form:{$id}", 300, function () use ($id) {
      return ReleaseForm::find($id);
    });
  }

  public function findWithRelations(int $id): ?ReleaseForm
  {
    return Cache::remember("release_form_details:{$id}", 300, function () use ($id) {
      return ReleaseForm::with([
        'store',
        'items.stockItem',
        'signatories.user',
        'createdBy',
        'approvedBy',
        'dispatchedBy',
        'completedBy',
      ])->find($id);
    });
  }

  public function create(array $data): ReleaseForm
  {
    $releaseForm = ReleaseForm::create($data);
    Cache::forget("release_form:{$releaseForm->id}");
    return $releaseForm;
  }

  public function update(int $id, array $data): ReleaseForm
  {
    $releaseForm = ReleaseForm::findOrFail($id);
    $releaseForm->update($data);
    Cache::forget("release_form:{$id}");
    Cache::forget("release_form_details:{$id}");
    return $releaseForm->fresh();
  }

  public function delete(int $id): void
  {
    $releaseForm = ReleaseForm::findOrFail($id);
    $releaseForm->delete();
    Cache::forget("release_form:{$id}");
    Cache::forget("release_form_details:{$id}");
  }

  public function findByFormNo(string $formNo): ?ReleaseForm
  {
    return ReleaseForm::where('form_no', $formNo)->first();
  }

  public function getPendingApprovals(): LengthAwarePaginator
  {
    return ReleaseForm::with(['store', 'items.stockItem', 'createdBy'])
      ->where('status', ReleaseStatus::PENDING_APPROVAL->value)
      ->latest()
      ->paginate(15);
  }

  public function getPendingReconciliation(): LengthAwarePaginator
  {
    return ReleaseForm::with(['store', 'items.stockItem', 'createdBy'])
      ->where('status', ReleaseStatus::PENDING_RECONCILIATION->value)
      ->where('is_manual_entry', true)
      ->latest()
      ->paginate(15);
  }

  public function getReleaseSummary(array $filters = []): array
  {
    $query = ReleaseForm::query()
      ->when($filters['date_from'] ?? null, function ($q, $dateFrom) {
        return $q->whereDate('created_at', '>=', $dateFrom);
      })
      ->when($filters['date_to'] ?? null, function ($q, $dateTo) {
        return $q->whereDate('created_at', '<=', $dateTo);
      });

    return [
      'total_forms' => $query->count(),
      'pending_approval' => (clone $query)->where('status', ReleaseStatus::PENDING_APPROVAL->value)->count(),
      'approved' => (clone $query)->where('status', ReleaseStatus::APPROVED->value)->count(),
      'dispatched' => (clone $query)->where('status', ReleaseStatus::DISPATCHED->value)->count(),
      'completed' => (clone $query)->where('status', ReleaseStatus::COMPLETED->value)->count(),
      'rejected' => (clone $query)->where('status', ReleaseStatus::REJECTED->value)->count(),
    ];
  }
}
