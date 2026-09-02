// modules/auth/types/index.ts

import type { User } from "../../../shared/types/global";

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
    method?: 'local' | 'crm';
    crm_token?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        token: string;
        token_type: string;
        expires_at?: string;
    };
    errors?: Record<string, string[]>;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}