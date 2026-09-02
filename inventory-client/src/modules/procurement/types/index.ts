// src/modules/procurement/types/index.ts

export type RequisitionStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled' | 'converted';
export type RequisitionPriority = 'low' | 'medium' | 'high' | 'urgent';
export type PurchaseOrderStatus = 'draft' | 'sent' | 'partially_received' | 'completed' | 'cancelled';

export interface Supplier {
    id: number;
    name: string;
    code: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    tax_id?: string;
    bank_name?: string;
    bank_account_no?: string;
    bank_account_name?: string;
    is_active: boolean;
    notes?: string;
    total_orders?: number;
    total_spent?: number;
    created_at: string;
    updated_at: string;
}

export interface PurchaseRequisition {
    id: number;
    pr_no: string;
    title: string;
    description?: string;
    priority: RequisitionPriority;
    status: RequisitionStatus;
    requested_by: number;
    approved_by?: number;
    approved_at?: string;
    rejection_reason?: string;
    notes?: string;
    total_estimated_cost?: number;
    item_count?: number;
    items: PurchaseRequisitionItem[];
    requested_by_user?: {
        id: number;
        name: string;
    };
    approved_by_user?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface PurchaseRequisitionItem {
    id?: number;
    purchase_requisition_id?: number;
    stock_item_id: number;
    quantity: number;
    unit_of_measure: string;
    estimated_unit_cost: number;
    estimated_total_cost: number;
    notes?: string;
    stock_item?: {
        id: number;
        code: string;
        name: string;
        unit_of_measure: string;
    };
}

export interface PurchaseOrder {
    id: number;
    po_no: string;
    supplier_id: number;
    purchase_requisition_id?: number;
    store_id: number;
    status: PurchaseOrderStatus;
    order_date: string;
    expected_delivery_date?: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    shipping_cost: number;
    total_amount: number;
    notes?: string;
    terms_and_conditions?: string;
    created_by: number;
    approved_by?: number;
    approved_at?: string;
    sent_at?: string;
    total_items?: number;
    total_quantity_ordered?: number;
    total_quantity_received?: number;
    receipt_percentage?: number;
    supplier?: {
        id: number;
        name: string;
        code: string;
    };
    store?: {
        id: number;
        name: string;
        code: string;
    };
    items: PurchaseOrderItem[];
    created_by_user?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderItem {
    id?: number;
    purchase_order_id?: number;
    stock_item_id: number;
    quantity_ordered: number;
    quantity_received: number;
    unit_of_measure: string;
    unit_price: number;
    total_price: number;
    notes?: string;
    stock_item?: {
        id: number;
        code: string;
        name: string;
        unit_of_measure: string;
    };
}

export interface GoodsReceipt {
    id: number;
    gr_no: string;
    purchase_order_id: number;
    store_id: number;
    received_at: string;
    status: string;
    notes?: string;
    received_by: number;
    purchase_order?: {
        id: number;
        po_no: string;
        supplier?: {
            name: string;
        };
    };
    store?: {
        id: number;
        name: string;
        code: string;
    };
    items: GoodsReceiptItem[];
    received_by_user?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface GoodsReceiptItem {
    id: number;
    goods_receipt_id: number;
    purchase_order_item_id: number;
    stock_item_id: number;
    quantity_received: number;
    unit_of_measure: string;
    notes?: string;
    stock_item?: {
        id: number;
        code: string;
        name: string;
    };
}

export interface SupplierFilters {
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    per_page?: number;
}

export interface RequisitionFilters {
    search?: string;
    status?: RequisitionStatus;
    priority?: RequisitionPriority;
    requested_by?: number;
    page?: number;
    per_page?: number;
}

export interface PurchaseOrderFilters {
    search?: string;
    status?: PurchaseOrderStatus;
    supplier_id?: number;
    store_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}