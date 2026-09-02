// src/modules/inventory/types/stock-transfer.types.ts

export type TransferStatus = 'requested' | 'approved' | 'in_transit' | 'received' | 'cancelled';

export interface StockTransfer {
    id: number;
    transfer_no: string;
    from_store_id: number;
    to_store_id: number;
    status: TransferStatus;
    notes?: string;
    requested_by: number;
    approved_by?: number;
    received_by?: number;
    approved_at?: string;
    received_at?: string;
    items: StockTransferItem[];
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
    created_at: string;
    updated_at: string;
}

export interface StockTransferItem {
    id: number;
    stock_transfer_id: number;
    stock_item_id: number;
    quantity: number;
    serial_numbers?: string[];
    stock_item?: {
        id: number;
        code: string;
        name: string;
        unit_of_measure: string;
    };
}

export interface StockTransferFilters {
    search?: string;
    status?: TransferStatus;
    from_store_id?: number;
    to_store_id?: number;
    sort?: string;
    page?: number;
    per_page?: number;
}