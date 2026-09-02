// src/modules/procurement/services/purchase-order.service.ts

import api from '../../../shared/services/api';
import { PurchaseOrder, PurchaseOrderFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const purchaseOrderService = {
    async getOrders(filters: PurchaseOrderFilters = {}): Promise<{ orders: PurchaseOrder[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/procurement/purchase-orders', { params: filters });
        return {
            orders: response.data.data.orders,
            pagination: response.data.data.pagination,
        };
    },

    async getOrder(id: number): Promise<PurchaseOrder> {
        const response = await api.get(`/v1/procurement/purchase-orders/${id}`);
        return response.data.data;
    },

    async createOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
        const response = await api.post('/v1/procurement/purchase-orders', data);
        return response.data.data;
    },

    async sendOrder(id: number): Promise<PurchaseOrder> {
        const response = await api.post(`/v1/procurement/purchase-orders/${id}/send`);
        return response.data.data;
    },

    async receiveGoods(id: number, receivedItems: Array<{ item_id: number; quantity_received: number }>): Promise<PurchaseOrder> {
        const response = await api.post(`/v1/procurement/purchase-orders/${id}/receive`, { received_items: receivedItems });
        return response.data.data;
    },

    async cancelOrder(id: number): Promise<PurchaseOrder> {
        const response = await api.post(`/v1/procurement/purchase-orders/${id}/cancel`);
        return response.data.data;
    },
};