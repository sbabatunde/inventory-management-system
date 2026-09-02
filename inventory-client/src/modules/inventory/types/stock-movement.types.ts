// src/modules/inventory/types/stock-movement.types.ts

export type StockMovementType = 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';

export interface StockMovement {
    id: number;
    stock_item_id: number;
    stock_serial_id?: number;
    from_store_id?: number;
    to_store_id?: number;
    movement_type: StockMovementType;
    quantity: number;
    quantity_before: number;
    quantity_after: number;
    reference_type?: string;
    reference_id?: number;
    created_by: number;
    stock_item?: {
        id: number;
        code: string;
        name: string;
        unit_of_measure: string;
    };
    stock_serial?: {
        id: number;
        serial_no: string;
    };
    from_store?: {
        id: number;
        name: string;
        code: string;
    };
    to_store?: {
        id: number;
        name: string;
        code: string;
    };
    created_by_user?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface StockMovementFilters {
    search?: string;
    movement_type?: StockMovementType;
    stock_item_id?: number;
    stock_serial_id?: number;
    store_id?: number;
    date_from?: string;
    date_to?: string;
    sort?: string;
    page?: number;
    per_page?: number;
}

export interface StockMovementSummary {
    stock_in: {
        total_quantity: number;
        total_movements: number;
    };
    stock_out: {
        total_quantity: number;
        total_movements: number;
    };
    net_movement: number;
}