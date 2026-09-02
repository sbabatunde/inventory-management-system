// src/modules/procurement/services/supplier.service.ts

import api from '../../../shared/services/api';
import { Supplier, SupplierFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const supplierService = {
    async getSuppliers(filters: SupplierFilters = {}): Promise<{ suppliers: Supplier[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/procurement/suppliers', { params: filters });
        return {
            suppliers: response.data.data.suppliers,
            pagination: response.data.data.pagination,
        };
    },

    async getSupplier(id: number): Promise<Supplier> {
        const response = await api.get(`/v1/procurement/suppliers/${id}`);
        return response.data.data;
    },

    async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
        const response = await api.post('/v1/procurement/suppliers', data);
        return response.data.data;
    },

    async updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
        const response = await api.put(`/v1/procurement/suppliers/${id}`, data);
        return response.data.data;
    },

    async deleteSupplier(id: number): Promise<void> {
        await api.delete(`/v1/procurement/suppliers/${id}`);
    },

    async toggleSupplierActive(id: number): Promise<Supplier> {
        const response = await api.post(`/v1/procurement/suppliers/${id}/toggle-active`);
        return response.data.data;
    },
};