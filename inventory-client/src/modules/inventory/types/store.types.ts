// src/modules/inventory/types/store.types.ts

export type StoreType = 'HQ' | 'Branch' | 'POP';

export interface Store {
    id: number;
    name: string;
    code: string;
    type: StoreType;
    address?: string;
    city?: string;
    state?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface StoreFilters {
    search?: string;
    type?: StoreType;
    status?: 'active' | 'inactive';
    sort?: string;
    page?: number;
    per_page?: number;
}

export interface StoreFormData {
    name: string;
    code?: string;
    type: StoreType;
    address?: string;
    city?: string;
    state?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    is_active: boolean;
}