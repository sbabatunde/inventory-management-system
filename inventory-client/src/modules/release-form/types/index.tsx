// src/modules/release-form/types/index.ts

export type ReleaseCategory = "installation" | "maintenance" | "others";
export type ReleaseStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "dispatched"
  | "completed"
  | "rejected"
  | "cancelled"
  | "pending_reconciliation";
export type DestinationType = "CPE" | "NOC" | "POP" | "Other";
export type SignatoryRole =
  | "requester"
  | "storekeeper"
  | "engineer"
  | "approver"
  | "receiver";

export interface ReleaseForm {
  id: number;
  form_no: string;
  category: ReleaseCategory;
  reference_type?: string;
  reference_id?: string;
  reference_description?: string;
  store_id: number;
  destination_type: DestinationType;
  destination_name?: string;
  destination_address?: string;
  status: ReleaseStatus;
  is_manual_entry: boolean;
  occurred_at?: string;
  recorded_at?: string;
  notes?: string;
  rejection_reason?: string;
  created_by: number;
  approved_by?: number;
  dispatched_by?: number;
  completed_by?: number;
  approved_at?: string;
  dispatched_at?: string;
  completed_at?: string;
  attachment_path?: string;
  pdf_path?: string;
  store?: {
    id: number;
    name: string;
    code: string;
  };
  items: ReleaseFormItem[];
  signatories: ReleaseFormSignatory[];
  created_by_user?: {
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

export interface ReleaseFormItem {
  id?: number;
  release_form_id?: number;
  stock_item_id: number;
  serial_no?: string;
  qty_requested: number;
  qty_released: number;
  qty_before?: number;
  qty_after?: number;
  unit_of_measure: string;
  notes?: string;
  stock_item?: {
    id: number;
    code: string;
    name: string;
    unit_of_measure: string;
    is_serialized: boolean;
  };
}

export interface ReleaseFormSignatory {
  id: number;
  release_form_id: number;
  user_id?: number;
  crm_user_id?: string;
  name: string;
  role: SignatoryRole;
  signature_ref?: string;
  signed_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ReleaseFormFilters {
  search?: string;
  category?: ReleaseCategory;
  status?: ReleaseStatus;
  store_id?: number;
  is_manual_entry?: boolean;
  date_from?: string;
  date_to?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface ReleaseFormSummary {
  total_forms: number;
  pending_approval: number;
  approved: number;
  dispatched: number;
  completed: number;
  rejected: number;
}
