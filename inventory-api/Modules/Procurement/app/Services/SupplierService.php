<?php
// Modules/Procurement/app/Services/SupplierService.php

namespace Modules\Procurement\app\Services;

use Modules\Procurement\app\Models\Supplier;
use Modules\Procurement\app\DTOs\SupplierDTO;
use Modules\Procurement\app\Repositories\Contracts\SupplierRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SupplierService
{
  protected SupplierRepositoryInterface $supplierRepository;

  public function __construct(SupplierRepositoryInterface $supplierRepository)
  {
    $this->supplierRepository = $supplierRepository;
  }

  /**
   * Get paginated suppliers with DTO transformation
   */
  public function getPaginatedSuppliers(array $filters = []): array
  {
    $suppliers = $this->supplierRepository->paginate($filters);

    return [
      'suppliers' => $suppliers->through(function ($supplier) {
        return SupplierDTO::fromArray($supplier->toArray())->toArray();
      })->items(),
      'pagination' => [
        'current_page' => $suppliers->currentPage(),
        'last_page' => $suppliers->lastPage(),
        'per_page' => $suppliers->perPage(),
        'total' => $suppliers->total(),
        'from' => $suppliers->firstItem(),
        'to' => $suppliers->lastItem(),
      ],
    ];
  }

  /**
   * Get supplier by ID with DTO
   */
  public function getSupplier(int $id): ?array
  {
    $supplier = $this->supplierRepository->find($id);

    if (!$supplier) {
      return null;
    }

    // Load relationships for computed attributes
    $supplier->loadCount('purchaseOrders as total_orders');
    $supplier->total_spent = $supplier->purchaseOrders()
      ->whereIn('status', ['sent', 'partially_received', 'completed'])
      ->sum('total_amount');

    return SupplierDTO::fromArray($supplier->toArray())->toArray();
  }

  /**
   * Create supplier with DTO return
   */
  public function createSupplier(array $data): array
  {
    return DB::transaction(function () use ($data) {
      // Generate code if not provided
      if (empty($data['code'])) {
        $data['code'] = $this->generateSupplierCode();
      }

      $supplier = $this->supplierRepository->create($data);

      // Log activity
      activity()
        ->performedOn($supplier)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('created supplier');

      return SupplierDTO::fromArray($supplier->toArray())->toArray();
    });
  }

  /**
   * Update supplier with DTO return
   */
  public function updateSupplier(int $id, array $data): array
  {
    return DB::transaction(function () use ($id, $data) {
      $supplier = $this->supplierRepository->find($id);

      if (!$supplier) {
        throw new \Exception('Supplier not found');
      }

      $supplier = $this->supplierRepository->update($id, $data);

      // Log activity
      activity()
        ->performedOn($supplier)
        ->causedBy(auth()->user())
        ->withProperties($data)
        ->log('updated supplier');

      return SupplierDTO::fromArray($supplier->toArray())->toArray();
    });
  }

  /**
   * Delete supplier
   */
  public function deleteSupplier(int $id): void
  {
    DB::transaction(function () use ($id) {
      $supplier = $this->supplierRepository->find($id);

      if (!$supplier) {
        throw new \Exception('Supplier not found');
      }

      // Check if supplier has purchase orders
      $hasOrders = $supplier->purchaseOrders()->exists();

      if ($hasOrders) {
        throw new \Exception('Cannot delete supplier with existing purchase orders');
      }

      // Log before deleting
      activity()
        ->performedOn($supplier)
        ->causedBy(auth()->user())
        ->log('deleted supplier');

      $this->supplierRepository->delete($id);
    });
  }

  /**
   * Toggle supplier active status with DTO return
   */
  public function toggleSupplierActive(int $id): array
  {
    return DB::transaction(function () use ($id) {
      $supplier = $this->supplierRepository->find($id);

      if (!$supplier) {
        throw new \Exception('Supplier not found');
      }

      $supplier = $this->supplierRepository->update($id, [
        'is_active' => !$supplier->is_active,
      ]);

      // Log activity
      activity()
        ->performedOn($supplier)
        ->causedBy(auth()->user())
        ->withProperties(['is_active' => $supplier->is_active])
        ->log($supplier->is_active ? 'activated supplier' : 'deactivated supplier');

      return SupplierDTO::fromArray($supplier->toArray())->toArray();
    });
  }

  /**
   * Generate supplier code
   */
  protected function generateSupplierCode(): string
  {
    $prefix = 'SUP';
    $count = Supplier::count() + 1;
    return $prefix . '-' . str_pad($count, 6, '0', STR_PAD_LEFT);
  }
}
