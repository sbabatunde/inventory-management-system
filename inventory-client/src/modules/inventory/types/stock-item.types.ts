// src/modules/inventory/types/stock-item.types.ts

export type StockNature = 'asset' | 'solid' | 'liquid';

export interface StockItem {
    id: number;
    code: string;
    name: string;
    description?: string;
    category_id?: number;
    nature: StockNature;
    is_serialized: boolean;
    unit_of_measure: string;
    reorder_level: number;
    unit_cost: number;
    is_active: boolean;
    total_stock?: number;
    created_at: string;
    updated_at: string;
}

export interface StockBalance {
    id: number;
    store_id: number;
    stock_item_id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    quantity_available: number;
    last_counted_at?: string;
    store?: {
        id: number;
        name: string;
        code: string;
    };
    stock_item?: {
        id: number;
        code: string;
        name: string;
        unit_of_measure: string;
    };
}

export interface StockSerial {
    id: number;
    stock_item_id: number;
    serial_no: string;
    current_status: 'in_stock' | 'issued' | 'in_transit' | 'maintenance' | 'retired';
    current_store_id?: number;
    current_store?: string;
    updated_at: string;
}

export interface StockItemFilters {
    search?: string;
    nature?: StockNature;
    is_serialized?: boolean;
    category_id?: number;
    status?: 'active' | 'inactive';
    sort?: string;
    page?: number;
    per_page?: number;
}

export interface StockItemFormData {
    code?: string;
    name: string;
    description?: string;
    category_id?: number;
    nature: StockNature;
    is_serialized: boolean;
    unit_of_measure: string;
    reorder_level: number;
    unit_cost: number;
    is_active: boolean;
}