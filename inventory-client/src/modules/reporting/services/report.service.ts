// src/modules/reporting/services/report.service.ts

import api from '../../../shared/services/api';
import { CostBreakdown, InventoryValuation, StockMovementSummary, LowStockItem, SupplierPerformance } from '../types';

export const reportService = {
    async getCostBreakdown(month: string): Promise<CostBreakdown> {
        const response = await api.get('/v1/reports/cost-breakdown', { params: { month } });
        return response.data.data;
    },

    async getInventoryReport(storeId?: number): Promise<InventoryValuation[]> {
        const response = await api.get('/v1/reports/inventory', { params: { store_id: storeId } });
        return response.data.data;
    },

    async getStockMovement(month: string): Promise<StockMovementSummary> {
        const response = await api.get('/v1/reports/stock-movement', { params: { month } });
        return response.data.data;
    },

    async getLowStock(): Promise<LowStockItem[]> {
        const response = await api.get('/v1/reports/low-stock');
        return response.data.data;
    },

    async getSupplierPerformance(month: string): Promise<SupplierPerformance[]> {
        const response = await api.get('/v1/reports/supplier-performance', { params: { month } });
        return response.data.data;
    },

    async exportReport(reportType: string, format: 'excel' | 'pdf' | 'csv'): Promise<string> {
        const response = await api.post('/v1/reports/export', { report_type: reportType, format });
        return response.data.data.filename;
    },
};