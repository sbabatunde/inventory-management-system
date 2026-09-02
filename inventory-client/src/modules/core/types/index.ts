// src/modules/core/types/index.ts

export interface DashboardStats {
    label: string;
    value: number;
    icon: string;
    color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

export interface Activity {
    id: number;
    description: string;
    created_at: string;
    user_name: string;
}

export interface Notification {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    icon?: string;
    link?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

export interface Setting {
    id: number;
    key: string;
    value: string;
    group: string;
    type: 'string' | 'integer' | 'boolean' | 'json' | 'array';
    is_public: boolean;
}

export interface UserFilters {
    search?: string;
    status?: 'active' | 'inactive';
    role?: string;
    sort?: string;
    page?: number;
    per_page?: number;
}