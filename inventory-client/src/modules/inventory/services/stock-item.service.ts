// src/modules/inventory/services/stock-item.service.ts

import api from '../../../shared/services/api';
import { StockItem, StockItemFilters, StockItemFormData, StockBalance, StockSerial } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const stockItemService = {
    async getStockItems(filters: StockItemFilters = {}): Promise<{ stockItems: StockItem[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/inventory/stock-items', { params: filters });
        return {
            stockItems: response.data.data.stock_items,
            pagination: response.data.data.pagination,
        };
    },

    async getStockItem(id: number): Promise<StockItem> {
        const response = await api.get(`/v1/inventory/stock-items/${id}`);
        return response.data.data;
    },

    async createStockItem(data: StockItemFormData): Promise<StockItem> {
        const response = await api.post('/v1/inventory/stock-items', data);
        return response.data.data;
    },

    async updateStockItem(id: number, data: StockItemFormData): Promise<StockItem> {
        const response = await api.put(`/v1/inventory/stock-items/${id}`, data);
        return response.data.data;
    },

    async deleteStockItem(id: number): Promise<void> {
        await api.delete(`/v1/inventory/stock-items/${id}`);
    },

    async getStockItemBalance(id: number): Promise<StockBalance[]> {
        const response = await api.get(`/v1/inventory/stock-items/${id}/balance`);
        return response.data.data;
    },

    async getStockItemSerials(id: number): Promise<StockSerial[]> {
        const response = await api.get(`/v1/inventory/stock-items/${id}/serials`);
        return response.data.data;
    },
};