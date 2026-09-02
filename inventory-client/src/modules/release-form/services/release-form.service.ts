// src/modules/release-form/services/release-form.service.ts

import api from '../../../shared/services/api';
import { ReleaseForm, ReleaseFormFilters, ReleaseFormSummary } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const releaseFormService = {
    async getForms(filters: ReleaseFormFilters = {}): Promise<{ forms: ReleaseForm[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/release-forms', { params: filters });
        return {
            forms: response.data.data.forms,
            pagination: response.data.data.pagination,
        };
    },

    async getForm(id: number): Promise<ReleaseForm> {
        const response = await api.get(`/v1/release-forms/${id}`);
        return response.data.data;
    },

    async createForm(data: Partial<ReleaseForm>): Promise<ReleaseForm> {
        const response = await api.post('/v1/release-forms', data);
        return response.data.data;
    },

    async updateForm(id: number, data: Partial<ReleaseForm>): Promise<ReleaseForm> {
        const response = await api.put(`/v1/release-forms/${id}`, data);
        return response.data.data;
    },

    async submitForApproval(id: number): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/submit`);
        return response.data.data;
    },

    async approveForm(id: number, notes?: string): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/approve`, { notes });
        return response.data.data;
    },

    async dispatchForm(id: number): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/dispatch`);
        return response.data.data;
    },

    async completeForm(id: number): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/complete`);
        return response.data.data;
    },

    async rejectForm(id: number, reason: string): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/reject`, { reason });
        return response.data.data;
    },

    async cancelForm(id: number): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/cancel`);
        return response.data.data;
    },

    async createManualForm(data: Partial<ReleaseForm> & { attachment?: File }): Promise<ReleaseForm> {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'attachment' && key !== 'items') {
                formData.append(key, (data as any)[key]);
            }
        });
        
        if (data.items) {
            formData.append('items', JSON.stringify(data.items));
        }
        
        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }
        
        const response = await api.post('/v1/release-forms/manual/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    async reconcileForm(id: number): Promise<ReleaseForm> {
        const response = await api.post(`/v1/release-forms/${id}/reconcile`);
        return response.data.data;
    },

    async getSummary(filters: ReleaseFormFilters = {}): Promise<ReleaseFormSummary> {
        const response = await api.get('/v1/release-forms/summary', { params: filters });
        return response.data.data;
    },

    async getPendingApprovals(): Promise<ReleaseForm[]> {
        const response = await api.get('/v1/release-forms/pending-approvals');
        return response.data.data;
    },

    async getPendingReconciliations(): Promise<ReleaseForm[]> {
        const response = await api.get('/v1/release-forms/pending-reconciliations');
        return response.data.data;
    },
};