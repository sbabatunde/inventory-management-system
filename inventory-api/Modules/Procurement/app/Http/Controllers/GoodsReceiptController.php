<?php
// Modules/Procurement/app/Http/Controllers/GoodsReceiptController.php

namespace Modules\Procurement\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Procurement\app\Services\GoodsReceiptService;
use Modules\Procurement\app\Http\Requests\StoreGoodsReceiptRequest;
use Modules\Core\Http\Controllers\ModuleBaseController;

class GoodsReceiptController extends ModuleBaseController
{
  protected string $moduleName = 'Procurement';
  protected string $moduleColor = 'amber';
  protected string $moduleIcon = 'fa-box-open';

  protected GoodsReceiptService $goodsReceiptService;

  public function __construct(GoodsReceiptService $goodsReceiptService)
  {
    $this->goodsReceiptService = $goodsReceiptService;
  }

  /**
   * Display a listing of goods receipts
   */
  public function index(Request $request)
  {
    $filters = [
      'search' => $request->search,
      'status' => $request->status,
      'purchase_order_id' => $request->purchase_order_id,
      'store_id' => $request->store_id,
      'per_page' => $request->per_page,
    ];

    $result = $this->goodsReceiptService->getPaginatedReceipts($filters);

    return $this->success($result, 'Goods receipts retrieved successfully');
  }

  /**
   * Store a newly created goods receipt
   */
  public function store(StoreGoodsReceiptRequest $request)
  {
    try {
      $receipt = $this->goodsReceiptService->createReceipt($request->validated());
      return $this->success($receipt, 'Goods receipt created successfully', 201);
    } catch (\Exception $e) {
      return $this->error($e->getMessage(), 422);
    }
  }

  /**
   * Display the specified goods receipt
   */
  public function show(int $id)
  {
    $receipt = $this->goodsReceiptService->getReceipt($id);

    if (!$receipt) {
      return $this->error('Goods receipt not found', 404);
    }

    return $this->success($receipt, 'Goods receipt retrieved successfully');
  }
}
