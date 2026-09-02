// src/modules/assets/types/index.ts

export type AssetType = 'pop' | 'client' | 'fibre' | 'radio' | 'other';
export type AssetStatus = 'in_stock' | 'assigned' | 'installed' | 'maintenance' | 'retired';
export type DepreciationMethod = 'straight_line' | 'declining_balance' | 'sum_of_years';

export interface Asset {
    id: number;
    asset_code: string;
    name: string;
    description?: string;
    type: AssetType;
    stock_item_id?: number;
    serial_no?: string;
    status: AssetStatus;
    current_store_id?: number;
    current_location_type?: string;
    current_location_id?: number;
    assigned_to?: number;
    assigned_at?: string;
    installed_at?: string;
    last_maintenance_at?: string;
    next_maintenance_due?: string;
    purchase_cost: number;
    purchase_date?: string;
    current_value: number;
    salvage_value: number;
    useful_life_months: number;
    depreciation_method: DepreciationMethod;
    is_active: boolean;
    stock_item?: {
        id: number;
        code: string;
        name: string;
        unit_of_measure: string;
    };
    current_store?: {
        id: number;
        name: string;
        code: string;
    };
    assigned_to_user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

export interface AssetFilters {
    search?: string;
    type?: AssetType;
    status?: AssetStatus;
    store_id?: number;
    assigned_to?: number;
    sort?: string;
    page?: number;
    per_page?: number;
}

export interface AssetSummary {
    total_assets: number;
    total_value: number;
    in_stock: number;
    assigned: number;
    installed: number;
    maintenance: number;
    retired: number;
}