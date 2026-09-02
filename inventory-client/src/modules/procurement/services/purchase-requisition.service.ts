// src/modules/procurement/services/purchase-requisition.service.ts

import api from '../../../shared/services/api';
import { PurchaseRequisition, RequisitionFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const purchaseRequisitionService = {
    async getRequisitions(filters: RequisitionFilters = {}): Promise<{ requisitions: PurchaseRequisition[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/procurement/purchase-requisitions', { params: filters });
        return {
            requisitions: response.data.data.requisitions,
            pagination: response.data.data.pagination,
        };
    },

    async getRequisition(id: number): Promise<PurchaseRequisition> {
        const response = await api.get(`/v1/procurement/purchase-requisitions/${id}`);
        return response.data.data;
    },

    async createRequisition(data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
        const response = await api.post('/v1/procurement/purchase-requisitions', data);
        return response.data.data;
    },

    async updateRequisition(id: number, data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
        const response = await api.put(`/v1/procurement/purchase-requisitions/${id}`, data);
        return response.data.data;
    },

    async submitForApproval(id: number): Promise<PurchaseRequisition> {
        const response = await api.post(`/v1/procurement/purchase-requisitions/${id}/submit`);
        return response.data.data;
    },

    async approveRequisition(id: number): Promise<PurchaseRequisition> {
        const response = await api.post(`/v1/procurement/purchase-requisitions/${id}/approve`);
        return response.data.data;
    },

    async rejectRequisition(id: number, reason: string): Promise<PurchaseRequisition> {
        const response = await api.post(`/v1/procurement/purchase-requisitions/${id}/reject`, { reason });
        return response.data.data;
    },

    async cancelRequisition(id: number): Promise<PurchaseRequisition> {
        const response = await api.post(`/v1/procurement/purchase-requisitions/${id}/cancel`);
        return response.data.data;
    },
};