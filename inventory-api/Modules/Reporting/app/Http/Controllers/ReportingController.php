<?php
// Modules/Reporting/app/Http/Controllers/ReportController.php

namespace Modules\Reporting\app\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Reporting\app\Services\CostBreakdownService;
use Modules\Reporting\app\Services\InventoryReportService;
use Modules\Reporting\app\Services\SupplierPerformanceService;
use Modules\Reporting\app\Services\ExportService;
use Modules\Core\Http\Controllers\ModuleBaseController;

class ReportingController extends ModuleBaseController
{
    protected string $moduleName = 'Reporting';
    protected string $moduleColor = 'pink';
    protected string $moduleIcon = 'fa-chart-line';

    protected CostBreakdownService $costBreakdownService;
    protected InventoryReportService $inventoryReportService;
    protected SupplierPerformanceService $supplierPerformanceService;
    protected ExportService $exportService;

    public function __construct(
        CostBreakdownService $costBreakdownService,
        InventoryReportService $inventoryReportService,
        SupplierPerformanceService $supplierPerformanceService,
        ExportService $exportService
    ) {
        $this->costBreakdownService = $costBreakdownService;
        $this->inventoryReportService = $inventoryReportService;
        $this->supplierPerformanceService = $supplierPerformanceService;
        $this->exportService = $exportService;
    }

    /**
     * Get cost breakdown report
     */
    public function costBreakdown(Request $request)
    {
        $month = $request->input('month', date('Y-m'));
        $report = $this->costBreakdownService->getMonthlyCostBreakdown($month);

        return $this->success($report, 'Cost breakdown retrieved successfully');
    }

    /**
     * Get inventory report
     */
    public function inventoryReport(Request $request)
    {
        $storeId = $request->input('store_id');
        $valuation = $this->inventoryReportService->getInventoryValuation($storeId);

        return $this->success($valuation, 'Inventory report retrieved successfully');
    }

    /**
     * Get stock movement report
     */
    public function stockMovement(Request $request)
    {
        $month = $request->input('month', date('Y-m'));
        $summary = $this->inventoryReportService->getStockMovementSummary($month);

        return $this->success($summary, 'Stock movement summary retrieved successfully');
    }

    /**
     * Get low stock report
     */
    public function lowStock()
    {
        $items = $this->inventoryReportService->getLowStockItems();

        return $this->success($items, 'Low stock items retrieved successfully');
    }

    /**
     * Get supplier performance report
     */
    public function supplierPerformance(Request $request)
    {
        $month = $request->input('month', date('Y-m'));
        $report = $this->supplierPerformanceService->getSupplierPerformance($month);

        return $this->success($report, 'Supplier performance retrieved successfully');
    }

    /**
     * Export report
     */
    public function export(Request $request)
    {
        $request->validate([
            'report_type' => 'required|string',
            'format' => 'required|string|in:excel,pdf,csv',
        ]);

        try {
            $filename = $this->exportService->exportToExcel([], $request->report_type);
            return $this->success(['filename' => $filename], 'Report exported successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to export report', 500, $e->getMessage());
        }
    }
}
