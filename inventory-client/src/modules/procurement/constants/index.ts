// src/modules/procurement/constants/index.ts

import { RequisitionStatus, RequisitionPriority, PurchaseOrderStatus } from '../types';

export const REQUISITION_STATUSES: Array<{ value: RequisitionStatus; label: string; color: string }> = [
    { value: 'draft', label: 'Draft', color: 'neutral' },
    { value: 'pending_approval', label: 'Pending Approval', color: 'amber' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'converted', label: 'Converted to PO', color: 'purple' },
];

export const REQUISITION_STATUS_MAP = REQUISITION_STATUSES.reduce((acc, status) => {
    acc[status.value] = status;
    return acc;
}, {} as Record<RequisitionStatus, typeof REQUISITION_STATUSES[0]>);

export const REQUISITION_PRIORITIES: Array<{ value: RequisitionPriority; label: string; color: string }> = [
    { value: 'low', label: 'Low', color: 'neutral' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'high', label: 'High', color: 'amber' },
    { value: 'urgent', label: 'Urgent', color: 'red' },
];

export const REQUISITION_PRIORITY_MAP = REQUISITION_PRIORITIES.reduce((acc, priority) => {
    acc[priority.value] = priority;
    return acc;
}, {} as Record<RequisitionPriority, typeof REQUISITION_PRIORITIES[0]>);

export const PURCHASE_ORDER_STATUSES: Array<{ value: PurchaseOrderStatus; label: string; color: string }> = [
    { value: 'draft', label: 'Draft', color: 'neutral' },
    { value: 'sent', label: 'Sent', color: 'blue' },
    { value: 'partially_received', label: 'Partially Received', color: 'amber' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

export const PURCHASE_ORDER_STATUS_MAP = PURCHASE_ORDER_STATUSES.reduce((acc, status) => {
    acc[status.value] = status;
    return acc;
}, {} as Record<PurchaseOrderStatus, typeof PURCHASE_ORDER_STATUSES[0]>);