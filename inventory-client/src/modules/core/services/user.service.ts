// src/modules/core/services/user.service.ts

import api from '../../../shared/services/api';
import { User, PaginationMeta } from '../../../shared/types/global';
import { UserFilters } from '../types';

export interface PaginatedUsers {
    users: User[];
    pagination: PaginationMeta;
}

export const userService = {
    async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
        const response = await api.get('/v1/users', { params: filters });
        return {
            users: response.data.data,
            pagination: response.data.pagination,
        };
    },

    async getUser(id: number): Promise<User> {
        const response = await api.get(`/v1/users/${id}`);
        return response.data.data;
    },

    async createUser(userData: Partial<User> & { password: string }): Promise<User> {
        const response = await api.post('/v1/users', userData);
        return response.data.data;
    },

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const response = await api.put(`/v1/users/${id}`, userData);
        return response.data.data;
    },

    async deleteUser(id: number): Promise<void> {
        await api.delete(`/v1/users/${id}`);
    },

    async toggleUserActive(id: number): Promise<User> {
        const response = await api.post(`/v1/users/${id}/toggle-active`);
        return response.data.data;
    },

    async assignRoles(id: number, roles: string[]): Promise<User> {
        const response = await api.post(`/v1/users/${id}/roles`, { roles });
        return response.data.data;
    },

    async assignPermissions(id: number, permissions: string[]): Promise<User> {
        const response = await api.post(`/v1/users/${id}/permissions`, { permissions });
        return response.data.data;
    },

    async syncFromCrm(): Promise<{ total_synced: number; created: number; updated: number }> {
        const response = await api.post('/v1/users/sync-from-crm');
        return response.data.data;
    },

    async searchCrmUsers(search: string): Promise<any[]> {
        const response = await api.get('/v1/users/search-crm-users', {
            params: { search },
        });
        return response.data.data;
    },
};