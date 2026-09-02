// src/modules/inventory/types/stock-adjustment.types.ts

export type AdjustmentStatus = 'pending' | 'approved' | 'rejected';

export interface StockAdjustment {
    id: number;
    adjustment_no: string;
    store_id: number;
    stock_item_id: number;
    previous_quantity: number;
    new_quantity: number;
    quantity_difference: number;
    reason: string;
    notes?: string;
    status: AdjustmentStatus;
    requested_by: number;
    approved_by?: number;
    approved_at?: string;
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
    created_at: string;
    updated_at: string;
}

export interface StockAdjustmentFilters {
    search?: string;
    status?: AdjustmentStatus;
    store_id?: number;
    stock_item_id?: number;
    sort?: string;
    page?: number;
    per_page?: number;
}