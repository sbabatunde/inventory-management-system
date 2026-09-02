// src/modules/inventory/services/stock-adjustment.service.ts

import api from '../../../shared/services/api';
import { StockAdjustment, StockAdjustmentFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const stockAdjustmentService = {
    async getAdjustments(filters: StockAdjustmentFilters = {}): Promise<{ adjustments: StockAdjustment[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/inventory/stock-adjustments', { params: filters });
        return {
            adjustments: response.data.data.adjustments,
            pagination: response.data.data.pagination,
        };
    },

    async getAdjustment(id: number): Promise<StockAdjustment> {
        const response = await api.get(`/v1/inventory/stock-adjustments/${id}`);
        return response.data.data;
    },

    async createAdjustment(data: Partial<StockAdjustment>): Promise<StockAdjustment> {
        const response = await api.post('/v1/inventory/stock-adjustments', data);
        return response.data.data;
    },

    async approveAdjustment(id: number): Promise<StockAdjustment> {
        const response = await api.post(`/v1/inventory/stock-adjustments/${id}/approve`);
        return response.data.data;
    },

    async rejectAdjustment(id: number, notes?: string): Promise<StockAdjustment> {
        const response = await api.post(`/v1/inventory/stock-adjustments/${id}/reject`, { notes });
        return response.data.data;
    },
};