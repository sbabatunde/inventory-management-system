<?php
// Modules/Procurement/app/Http/Controllers/PurchaseOrderController.php

namespace Modules\Procurement\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Procurement\app\Services\PurchaseOrderService;
use Modules\Procurement\app\Http\Requests\StorePurchaseOrderRequest;
use Modules\Procurement\app\Http\Requests\ReceiveGoodsRequest;
use Modules\Procurement\app\Http\Requests\CancelPurchaseOrderRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class PurchaseOrderController extends ModuleBaseController
{
    protected string $moduleName = 'Procurement';
    protected string $moduleColor = 'amber';
    protected string $moduleIcon = 'fa-file-invoice';
    
    protected PurchaseOrderService $purchaseOrderService;

    public function __construct(PurchaseOrderService $purchaseOrderService)
    {
        $this->purchaseOrderService = $purchaseOrderService;
    }

    /**
     * Display a listing of purchase orders
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'status' => $request->status,
            'supplier_id' => $request->supplier_id,
            'store_id' => $request->store_id,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'per_page' => $request->per_page,
        ];

        $result = $this->purchaseOrderService->getPaginatedOrders($filters);
        
        return $this->success($result, 'Purchase orders retrieved successfully');
    }

    /**
     * Store a newly created purchase order
     */
    public function store(StorePurchaseOrderRequest $request)
    {
        try {
            $order = $this->purchaseOrderService->createOrder($request->validated());
            return $this->success($order, 'Purchase order created successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Display the specified purchase order
     */
    public function show(int $id)
    {
        $order = $this->purchaseOrderService->getOrder($id);
        
        if (!$order) {
            return $this->error('Purchase order not found', 404);
        }

        return $this->success($order, 'Purchase order retrieved successfully');
    }

    /**
     * Send purchase order
     */
    public function send(int $id)
    {
        try {
            $order = $this->purchaseOrderService->sendOrder($id);
            return $this->success($order, 'Purchase order sent successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Receive goods for purchase order
     */
    public function receive(int $id, ReceiveGoodsRequest $request)
    {
        try {
            $order = $this->purchaseOrderService->receiveGoods($id, $request->received_items);
            return $this->success($order, 'Goods received successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Cancel purchase order
     */
    public function cancel(int $id, CancelPurchaseOrderRequest $request)
    {
        try {
            $order = $this->purchaseOrderService->cancelOrder($id);
            return $this->success($order, 'Purchase order cancelled successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }
}