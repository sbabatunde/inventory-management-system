// src/modules/inventory/services/stock-movement.service.ts

import api from '../../../shared/services/api';
import { StockMovement, StockMovementFilters, StockMovementSummary } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const stockMovementService = {
    async getMovements(filters: StockMovementFilters = {}): Promise<{ movements: StockMovement[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/inventory/stock-movements', { params: filters });
        return {
            movements: response.data.data.movements,
            pagination: response.data.data.pagination,
        };
    },

    async getMovement(id: number): Promise<StockMovement> {
        const response = await api.get(`/v1/inventory/stock-movements/${id}`);
        return response.data.data;
    },

    async getMovementsByItem(stockItemId: number, filters: StockMovementFilters = {}): Promise<StockMovement[]> {
        const response = await api.get(`/v1/inventory/stock-movements/item/${stockItemId}`, { params: filters });
        return response.data.data;
    },

    async getMovementsBySerial(stockSerialId: number, filters: StockMovementFilters = {}): Promise<StockMovement[]> {
        const response = await api.get(`/v1/inventory/stock-movements/serial/${stockSerialId}`, { params: filters });
        return response.data.data;
    },

    async getMovementsByStore(storeId: number, filters: StockMovementFilters = {}): Promise<StockMovement[]> {
        const response = await api.get(`/v1/inventory/stock-movements/store/${storeId}`, { params: filters });
        return response.data.data;
    },

    async getStockSummary(filters: StockMovementFilters = {}): Promise<StockMovementSummary> {
        const response = await api.get('/v1/inventory/stock-movements/summary', { params: filters });
        return response.data.data;
    },

    async getMovementTypes(): Promise<Array<{ value: string; label: string }>> {
        const response = await api.get('/v1/inventory/stock-movements/types');
        return response.data.data;
    },
};