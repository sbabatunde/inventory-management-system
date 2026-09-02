// src/modules/integration/types/index.ts

export interface JobOrder {
    id: number;
    job_order_no: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    client_id?: number;
    client_name?: string;
    site_location?: string;
    required_equipment?: Array<{
        stock_item_id?: number;
        id?: number;
        name: string;
        code: string;
        quantity?: number;
        unit_of_measure?: string;
        available_quantity?: number;
    }>;
    assigned_engineers?: Array<{
        id: number;
        name: string;
        email?: string;
    }>;
    scheduled_date?: string;
    completed_date?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Ticket {
    id: number;
    ticket_no: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    client_id?: number;
    client_name?: string;
    site_location?: string;
    required_equipment?: Array<{
        stock_item_id?: number;
        id?: number;
        name: string;
        code: string;
        quantity?: number;
        unit_of_measure?: string;
        available_quantity?: number;
    }>;
    assigned_engineers?: Array<{
        id: number;
        name: string;
        email?: string;
    }>;
    created_at?: string;
    updated_at?: string;
}

export interface CrmUser {
    id: number;
    name: string;
    email?: string;
    employee_id?: string;
    department?: string;
    role?: string;
    phone?: string;
    is_active: boolean;
}