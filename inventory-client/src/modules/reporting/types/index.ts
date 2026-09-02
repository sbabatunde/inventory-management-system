// src/modules/reporting/types/index.ts

export interface CostBreakdown {
    installation: {
        total_cost: number;
        count: number;
    };
    maintenance: {
        total_cost: number;
        count: number;
    };
    logistics: {
        total_cost: number;
        count: number;
    };
    collection: {
        total_cost: number;
        count: number;
    };
    total: number;
}

export interface InventoryValuation {
    store_name: string;
    store_code: string;
    total_quantity: number;
    total_value: number;
}

export interface StockMovementSummary {
    receipts: number;
    issues: number;
    transfers: number;
    adjustments: number;
    returns: number;
}

export interface LowStockItem {
    item_name: string;
    item_code: string;
    store_name: string;
    quantity_available: number;
    reorder_level: number;
}

export interface SupplierPerformance {
    name: string;
    code: string;
    total_orders: number;
    total_value: number;
    average_order_value: number;
    completed_orders: number;
    cancelled_orders: number;
}