<?php
// Modules/Procurement/app/Http/Controllers/SupplierController.php

namespace Modules\Procurement\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Procurement\app\Services\SupplierService;
use Modules\Procurement\app\Http\Requests\StoreSupplierRequest;
use Modules\Procurement\app\Http\Requests\UpdateSupplierRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class SupplierController extends ModuleBaseController
{
  protected string $moduleName = 'Procurement';
  protected string $moduleColor = 'amber';
  protected string $moduleIcon = 'fa-truck-field';

  protected SupplierService $supplierService;

  public function __construct(SupplierService $supplierService)
  {
    $this->supplierService = $supplierService;
  }

  /**
   * Display a listing of suppliers
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'status' => $request->status,
      'per_page' => $request->per_page,
    ];

    $result = $this->supplierService->getPaginatedSuppliers($filters);

    return $this->success($result, 'Suppliers retrieved successfully');
  }

  /**
   * Store a newly created supplier
   */
  public function store(StoreSupplierRequest $request)
  {
    try {
      $supplier = $this->supplierService->createSupplier($request->validated());
      return $this->success($supplier, 'Supplier created successfully', 201);
    } catch (\Exception $e) {
      return $this->error('Failed to create supplier', 500, $e->getMessage());
    }
  }

  /**
   * Display the specified supplier
   */
  public function show(int $id)
  {
    $supplier = $this->supplierService->getSupplier($id);

    if (!$supplier) {
      return $this->error('Supplier not found', 404);
    }

    return $this->success($supplier, 'Supplier retrieved successfully');
  }

  /**
   * Update the specified supplier
   */
  public function update(UpdateSupplierRequest $request, int $id)
  {
    try {
      $supplier = $this->supplierService->updateSupplier($id, $request->validated());
      return $this->success($supplier, 'Supplier updated successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Remove the specified supplier
   */
  public function destroy(int $id)
  {
    try {
      $this->supplierService->deleteSupplier($id);
      return $this->success(null, 'Supplier deleted successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Toggle supplier active status
   */
  public function toggleActive(int $id)
  {
    try {
      $supplier = $this->supplierService->toggleSupplierActive($id);
      return $this->success($supplier, 'Supplier status updated successfully');
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }
}
