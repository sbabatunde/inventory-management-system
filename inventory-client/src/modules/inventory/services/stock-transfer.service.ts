// src/modules/inventory/services/stock-transfer.service.ts

import api from '../../../shared/services/api';
import { StockTransfer, StockTransferFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const stockTransferService = {
    async getTransfers(filters: StockTransferFilters = {}): Promise<{ transfers: StockTransfer[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/inventory/stock-transfers', { params: filters });
        return {
            transfers: response.data.data.transfers,
            pagination: response.data.data.pagination,
        };
    },

    async getTransfer(id: number): Promise<StockTransfer> {
        const response = await api.get(`/v1/inventory/stock-transfers/${id}`);
        return response.data.data;
    },

    async createTransfer(data: any): Promise<StockTransfer> {
        const response = await api.post('/v1/inventory/stock-transfers', data);
        return response.data.data;
    },

    async approveTransfer(id: number): Promise<StockTransfer> {
        const response = await api.post(`/v1/inventory/stock-transfers/${id}/approve`);
        return response.data.data;
    },

    async receiveTransfer(id: number): Promise<StockTransfer> {
        const response = await api.post(`/v1/inventory/stock-transfers/${id}/receive`);
        return response.data.data;
    },

    async cancelTransfer(id: number): Promise<StockTransfer> {
        const response = await api.post(`/v1/inventory/stock-transfers/${id}/cancel`);
        return response.data.data;
    },
};