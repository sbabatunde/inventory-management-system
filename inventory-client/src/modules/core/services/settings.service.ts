// src/modules/core/services/settings.service.ts

import api from '../../../shared/services/api';
import { Setting } from '../types';

export const settingsService = {
    async getSettings(group: string = 'general'): Promise<Setting[]> {
        const response = await api.get('/v1/settings', { params: { group } });
        return response.data.data;
    },

    async updateSettings(settings: Partial<Setting>[]): Promise<void> {
        await api.post('/v1/settings', { settings });
    },

    async getSetting(key: string): Promise<Setting> {
        const response = await api.get(`/v1/settings/${key}`);
        return response.data.data;
    },
};