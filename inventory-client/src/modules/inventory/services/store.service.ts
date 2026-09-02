// src/modules/inventory/services/store.service.ts

import api from '../../../shared/services/api';
import { Store, StoreFilters, StoreFormData } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const storeService = {
    async getStores(filters: StoreFilters = {}): Promise<{ stores: Store[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/inventory/stores', { params: filters });
        return {
            stores: response.data.data.stores,
            pagination: response.data.data.pagination,
        };
    },

    async getStore(id: number): Promise<Store> {
        const response = await api.get(`/v1/inventory/stores/${id}`);
        return response.data.data;
    },

    async createStore(data: StoreFormData): Promise<Store> {
        const response = await api.post('/v1/inventory/stores', data);
        return response.data.data;
    },

    async updateStore(id: number, data: StoreFormData): Promise<Store> {
        const response = await api.put(`/v1/inventory/stores/${id}`, data);
        return response.data.data;
    },

    async deleteStore(id: number): Promise<void> {
        await api.delete(`/v1/inventory/stores/${id}`);
    },

    async toggleStoreActive(id: number): Promise<Store> {
        const response = await api.post(`/v1/inventory/stores/${id}/toggle-active`);
        return response.data.data;
    },

    async getStoreStock(id: number): Promise<any> {
        const response = await api.get(`/v1/inventory/stores/${id}/stock`);
        return response.data.data;
    },
};