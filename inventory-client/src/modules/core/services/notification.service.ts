// src/modules/core/services/notification.service.ts

import api from '../../../shared/services/api';
import { Notification } from '../types';
import { PaginationMeta } from '../../../shared/types/global';

export const notificationService = {
    async getNotifications(page: number = 1): Promise<{ notifications: Notification[], pagination: PaginationMeta }> {
        const response = await api.get('/v1/notifications', { params: { page } });
        return {
            notifications: response.data.data,
            pagination: response.data.pagination,
        };
    },

    async markAsRead(id: number): Promise<void> {
        await api.post(`/v1/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await api.post('/v1/notifications/read-all');
    },
};