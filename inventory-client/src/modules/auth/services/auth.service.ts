// modules/auth/services/auth.service.ts

import api from '../../../shared/services/api';
import { LoginCredentials, AuthResponse } from '../types';
import { User } from '../../../shared/types/global';

// Helper to normalize roles
const normalizeUser = (user: any): User => {
  // Normalize roles
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    if (typeof user.roles[0] === 'object') {
      user.roles = user.roles.map((role: any) => role.name);
    }
  }

  // Normalize permissions
  if (user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0) {
    if (typeof user.permissions[0] === 'object') {
      user.permissions = user.permissions.map((perm: any) => perm.name);
    }
  }

  return user;
};

export const authService = {
   async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post('/v1/auth/login', credentials);
        if (response.data?.data?.user) {
            response.data.data.user = normalizeUser(response.data.data.user);
        }
        return response.data;
    },


    async logout(): Promise<void> {
        try {
            await api.post('/v1/auth/logout');
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/v1/auth/user');
        return normalizeUser(response.data.data.user);
    },

    async getAvailableMethods(): Promise<string[]> {
        const response = await api.get('/v1/auth/methods');
        return response.data.data.methods;
    },

    async refreshToken(): Promise<string> {
        const response = await api.post('/v1/auth/refresh');
        const token = response.data.data.token;
        localStorage.setItem('auth_token', token);
        return token;
    },

    // Token management
    setToken(token: string): void {
        if (token && token !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    },

    getToken(): string | null {
        const token = localStorage.getItem('auth_token');
        if (!token || token === 'undefined' || token === 'null') {
            return null;
        }
        return token;
    },

    removeToken(): void {
        localStorage.removeItem('auth_token');
    },

    setUser(user: User): void {
        localStorage.setItem('auth_user', JSON.stringify(user));
    },

    getUser(): User | null {
        const user = localStorage.getItem('auth_user');
        return user ? JSON.parse(user) : null;
    },

    removeUser(): void {
        localStorage.removeItem('auth_user');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post('/v1/auth/forgot-password', { email });
    },

    async resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Promise<void> {
        await api.post('/v1/auth/reset-password', {
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
    },
};