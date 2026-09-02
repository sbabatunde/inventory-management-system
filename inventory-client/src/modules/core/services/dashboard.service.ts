// src/modules/core/services/dashboard.service.ts

import api from '../../../shared/services/api';
import { DashboardStats, Activity } from '../types';

export const dashboardService = {
    async getStats(): Promise<DashboardStats[]> {
        const response = await api.get('/v1/dashboard/stats');
        return response.data.data;
    },

    async getRecentActivities(): Promise<Activity[]> {
        const response = await api.get('/v1/dashboard/activities');
        return response.data.data;
    }
};