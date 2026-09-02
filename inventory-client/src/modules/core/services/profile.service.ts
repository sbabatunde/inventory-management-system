// src/modules/core/services/profile.service.ts

import api from '../../../shared/services/api';
import { User } from '../../../shared/types/global';

export const profileService = {
    async getProfile(): Promise<User> {
        const response = await api.get('/v1/profile');
        return response.data.data;
    },

    async updateProfile(profileData: Partial<User>): Promise<User> {
        const response = await api.put('/v1/profile', profileData);
        return response.data.data;
    },

    async updatePassword(
        currentPassword: string,
        newPassword: string,
        newPasswordConfirmation: string
    ): Promise<void> {
        await api.put('/v1/profile/password', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        });
    },
};