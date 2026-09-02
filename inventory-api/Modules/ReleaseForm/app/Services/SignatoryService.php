<?php
// Modules/ReleaseForm/app/Services/SignatoryService.php

namespace Modules\ReleaseForm\app\Services;

use Modules\ReleaseForm\app\Models\ReleaseFormSignatory;
use Modules\Integration\app\Services\CrmUserService;
use Illuminate\Support\Facades\DB;

class SignatoryService
{
  protected CrmUserService $crmUserService;

  public function __construct(CrmUserService $crmUserService)
  {
    $this->crmUserService = $crmUserService;
  }

  /**
   * Get signatories for a release form
   */
  public function getSignatories(int $releaseFormId): array
  {
    return ReleaseFormSignatory::with('user')
      ->where('release_form_id', $releaseFormId)
      ->get()
      ->toArray();
  }

  /**
   * Add signatory
   */
  public function addSignatory(int $releaseFormId, array $data): array
  {
    return DB::transaction(function () use ($releaseFormId, $data) {
      $signatory = ReleaseFormSignatory::create([
        'release_form_id' => $releaseFormId,
        'user_id' => $data['user_id'] ?? null,
        'crm_user_id' => $data['crm_user_id'] ?? null,
        'name' => $data['name'],
        'role' => $data['role'],
      ]);

      // Log activity
      activity()
        ->performedOn($signatory)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('added signatory');

      return $signatory->toArray();
    });
  }

  /**
   * Remove signatory
   */
  public function removeSignatory(int $signatoryId): void
  {
    $signatory = ReleaseFormSignatory::findOrFail($signatoryId);

    // Log activity
    activity()
      ->performedOn($signatory)
      ->causedBy(auth()->user())
      ->log('removed signatory');

    $signatory->delete();
  }

  /**
   * Sign release form
   */
  public function signForm(int $signatoryId, string $signatureRef): array
  {
    return DB::transaction(function () use ($signatoryId, $signatureRef) {
      $signatory = ReleaseFormSignatory::findOrFail($signatoryId);

      if ($signatory->signed_at) {
        throw new \Exception('Signatory has already signed');
      }

      $signatory->update([
        'signature_ref' => $signatureRef,
        'signed_at' => now(),
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
      ]);

      // Log activity
      activity()
        ->performedOn($signatory)
        ->causedBy(auth()->user())
        ->log('signed release form');

      return $signatory->toArray();
    });
  }

  /**
   * Search CRM users for signatory selection
   */
  public function searchCrmUsers(string $search): array
  {
    return $this->crmUserService->searchUsers($search) ?? [];
  }
}
