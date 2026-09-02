<?php
// Modules/Inventory/app/Http/Controllers/StoreController.php

namespace Modules\Inventory\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Inventory\app\DTOs\StoreDTO;
use Modules\Inventory\app\Enums\StoreType;
use Modules\Inventory\app\Http\Requests\StoreStoreRequest;
use Modules\Inventory\app\Http\Requests\UpdateStoreRequest;
use Modules\Inventory\app\Services\StoreService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class StoreController extends ModuleBaseController
{
    protected string $moduleName = 'Inventory';
    protected string $moduleColor = 'blue';
    protected string $moduleIcon = 'fa-warehouse';

    protected StoreService $storeService;

    public function __construct(StoreService $storeService)
    {
        $this->storeService = $storeService;
    }

    /**
     * Display a listing of stores
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'type' => $request->type,
            'status' => $request->status,
            'sort' => $request->sort,
        ];

        $stores = $this->storeService->getPaginatedStores($filters);

        return $this->success([
            'stores' => $stores->through(fn($store) => StoreDTO::fromArray($store->toArray())->toArray()),
            'pagination' => [
                'current_page' => $stores->currentPage(),
                'last_page' => $stores->lastPage(),
                'per_page' => $stores->perPage(),
                'total' => $stores->total(),
                'from' => $stores->firstItem(),
                'to' => $stores->lastItem(),
            ],
        ], 'Stores retrieved successfully');
    }

    /**
     * Store a newly created store
     */
    public function store(StoreStoreRequest $request)
    {
        try {
            $store = $this->storeService->createStore($request->validated());
            $storeDTO = StoreDTO::fromArray($store->toArray());

            return $this->success($storeDTO->toArray(), 'Store created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create store', 500, $e->getMessage());
        }
    }

    /**
     * Display the specified store
     */
    public function show(int $id)
    {
        $store = $this->storeService->getStoreWithDetails($id);

        if (!$store) {
            return $this->error('Store not found', 404);
        }

        $storeDTO = StoreDTO::fromArray($store->toArray());

        return $this->success($storeDTO->toArray(), 'Store retrieved successfully');
    }

    /**
     * Update the specified store 
     */
    public function update(UpdateStoreRequest $request, int $id)
    {
        try {
            $store = $this->storeService->updateStore($id, $request->validated());
            $storeDTO = StoreDTO::fromArray($store->toArray());

            return $this->success($storeDTO->toArray(), 'Store updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update store', 500, $e->getMessage());
        }
    }

    /**
     * Remove the specified store
     */
    public function destroy(int $id)
    {
        try {
            $this->storeService->deleteStore($id);
            return $this->success(null, 'Store deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Toggle store active status
     */
    public function toggleActive(int $id)
    {
        try {
            $store = $this->storeService->toggleStoreActive($id);
            $storeDTO = StoreDTO::fromArray($store->toArray());

            return $this->success($storeDTO->toArray(), 'Store status updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update store status', 500, $e->getMessage());
        }
    }

    /**
     * Get store stock
     */
    public function getStock(int $id)
    {
        $stock = $this->storeService->getStoreStock($id);

        return $this->success($stock, 'Store stock retrieved successfully');
    }

    /**
     * Get store types
     */
    public function types()
    {
        return $this->success(StoreType::options(), 'Store types retrieved successfully');
    }
}
