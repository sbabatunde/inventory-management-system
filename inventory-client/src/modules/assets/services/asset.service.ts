// src/modules/assets/services/asset.service.ts

import api from '../../../shared/services/api';
import { Asset, AssetFilters, AssetSummary } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const assetService = {
    async getAssets(filters: AssetFilters = {}): Promise<{ assets: Asset[]; pagination: PaginationMeta }> {
        const response = await api.get('/v1/assets', { params: filters });
        return {
            assets: response.data.data.assets,
            pagination: response.data.data.pagination,
        };
    },

    async getAsset(id: number): Promise<Asset> {
        const response = await api.get(`/v1/assets/${id}`);
        return response.data.data;
    },

    async createAsset(data: Partial<Asset>): Promise<Asset> {
        const response = await api.post('/v1/assets', data);
        return response.data.data;
    },

    async updateAsset(id: number, data: Partial<Asset>): Promise<Asset> {
        const response = await api.put(`/v1/assets/${id}`, data);
        return response.data.data;
    },

    async deleteAsset(id: number): Promise<void> {
        await api.delete(`/v1/assets/${id}`);
    },

    async assignAsset(id: number, userId: number): Promise<Asset> {
        const response = await api.post(`/v1/assets/${id}/assign`, { user_id: userId });
        return response.data.data;
    },

    async unassignAsset(id: number): Promise<Asset> {
        const response = await api.post(`/v1/assets/${id}/unassign`);
        return response.data.data;
    },

    async updateAssetStatus(id: number, status: string): Promise<Asset> {
        const response = await api.post(`/v1/assets/${id}/status`, { status });
        return response.data.data;
    },

    async calculateDepreciation(id: number): Promise<any> {
        const response = await api.post(`/v1/assets/${id}/depreciation`);
        return response.data.data;
    },

    async getAssetSummary(): Promise<AssetSummary> {
        const response = await api.get('/v1/assets/summary');
        return response.data.data;
    },
};