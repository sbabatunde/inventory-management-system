<?php
// Modules/Assets/app/Http/Controllers/AssetController.php

namespace Modules\Assets\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Assets\app\Services\AssetService;
use Modules\Assets\app\Http\Requests\StoreAssetRequest;
use Modules\Assets\app\Http\Requests\UpdateAssetRequest;
use Modules\Assets\app\Enums\AssetType;
use Modules\Assets\app\Enums\AssetStatus;
use Modules\Assets\app\Enums\DepreciationMethod;
use Modules\Core\Http\Controllers\ModuleBaseController;

class AssetsController extends ModuleBaseController
{
    protected string $moduleName = 'Assets';
    protected string $moduleColor = 'teal';
    protected string $moduleIcon = 'fa-microchip';

    protected AssetService $assetService;

    public function __construct(AssetService $assetService)
    {
        $this->assetService = $assetService;
    }

    /**
     * Display a listing of assets
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'type' => $request->type,
            'status' => $request->status,
            'store_id' => $request->store_id,
            'assigned_to' => $request->assigned_to,
            'sort' => $request->sort,
            'per_page' => $request->per_page,
        ];

        $assets = $this->assetService->getPaginatedAssets($filters);

        return $this->success([
            'assets' => $assets->items(),
            'pagination' => [
                'current_page' => $assets->currentPage(),
                'last_page' => $assets->lastPage(),
                'per_page' => $assets->perPage(),
                'total' => $assets->total(),
                'from' => $assets->firstItem(),
                'to' => $assets->lastItem(),
            ],
        ], 'Assets retrieved successfully');
    }

    /**
     * Store a newly created asset
     */
    public function store(StoreAssetRequest $request)
    {
        try {
            $asset = $this->assetService->createAsset($request->validated());
            return $this->success($asset, 'Asset created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create asset', 500, $e->getMessage());
        }
    }

    /**
     * Display the specified asset
     */
    public function show(int $id)
    {
        $asset = $this->assetService->getAsset($id);

        if (!$asset) {
            return $this->error('Asset not found', 404);
        }

        return $this->success($asset, 'Asset retrieved successfully');
    }

    /**
     * Update the specified asset
     */
    public function update(UpdateAssetRequest $request, int $id)
    {
        try {
            $asset = $this->assetService->updateAsset($id, $request->validated());
            return $this->success($asset, 'Asset updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Remove the specified asset
     */
    public function destroy(int $id)
    {
        try {
            $this->assetService->deleteAsset($id);
            return $this->success(null, 'Asset deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Assign asset to user
     */
    public function assign(Request $request, int $id)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        try {
            $asset = $this->assetService->assignAsset($id, $request->user_id);
            return $this->success($asset, 'Asset assigned successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Unassign asset
     */
    public function unassign(int $id)
    {
        try {
            $asset = $this->assetService->unassignAsset($id);
            return $this->success($asset, 'Asset unassigned successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Update asset status
     */
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|string|in:' . implode(',', AssetStatus::values()),
        ]);

        try {
            $asset = $this->assetService->updateAssetStatus($id, $request->status);
            return $this->success($asset, 'Asset status updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Calculate depreciation
     */
    public function calculateDepreciation(int $id)
    {
        try {
            $depreciation = $this->assetService->calculateDepreciation($id);
            return $this->success($depreciation, 'Depreciation calculated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 404);
        }
    }

    /**
     * Get asset summary
     */
    public function summary()
    {
        $summary = $this->assetService->getAssetSummary();
        return $this->success($summary, 'Asset summary retrieved successfully');
    }

    /**
     * Get asset types
     */
    public function types()
    {
        return $this->success(AssetType::options(), 'Asset types retrieved successfully');
    }

    /**
     * Get asset statuses
     */
    public function statuses()
    {
        return $this->success(AssetStatus::options(), 'Asset statuses retrieved successfully');
    }

    /**
     * Get depreciation methods
     */
    public function depreciationMethods()
    {
        return $this->success(DepreciationMethod::options(), 'Depreciation methods retrieved successfully');
    }
}
