// shared/types/global.ts

export interface User {
    id: number;
    name: string;
    email: string;
    employee_id?: string;
    department?: string;
    roles: string[];
    permissions: string[];
    is_active: boolean;
    last_login_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Store {
    id: number;
    name: string;
    code: string;
    type: 'HQ' | 'Branch' | 'POP';
    address?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface StockItem {
    id: number;
    code: string;
    name: string;
    description?: string;
    category_id?: number;
    nature: 'asset' | 'solid' | 'liquid';
    is_serialized: boolean;
    unit_of_measure: string;
    reorder_level: number;
    unit_cost: number;
}

export interface StockBalance {
    id: number;
    store_id: number;  // Changed from warehouse_id
    stock_item_id: number;
    quantity_on_hand: number;
    last_counted_at?: string;
}

export interface ReleaseForm {
    id: number;
    form_no: string;
    category: 'installation' | 'maintenance' | 'others';
    reference_type?: string;
    reference_id?: string;
    store_id: number;  // Changed from warehouse_id
    destination_type: string;
    destination_name: string;
    status: string;
    is_manual_entry: boolean;
    items: ReleaseFormItem[];
}

export interface ReleaseFormItem {
    id: number;
    release_form_id: number;
    stock_item_id: number;
    serial_no?: string;
    qty_requested: number;
    qty_released: number;
    qty_before: number;
    qty_after: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    pagination?: PaginationMeta;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface ModuleInfo {
    name: string;
    key: string;
    icon: string;
    colorClass: string;
    description?: string;
}