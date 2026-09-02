// src/modules/inventory/constants/index.ts

import { StoreType, StockNature, TransferStatus,StockMovementType,AdjustmentStatus } from '../types';

export const STORE_TYPES: Array<{ value: StoreType; label: string; color: string }> = [
    { value: 'HQ', label: 'Headquarters', color: 'blue' },
    { value: 'Branch', label: 'Branch', color: 'purple' },
    { value: 'POP', label: 'Point of Presence', color: 'green' },
];

export const STORE_TYPE_MAP = STORE_TYPES.reduce((acc, type) => {
    acc[type.value] = type;
    return acc;
}, {} as Record<StoreType, typeof STORE_TYPES[0]>);

export const STOCK_NATURES: Array<{ value: StockNature; label: string }> = [
    { value: 'asset', label: 'Asset' },
    { value: 'solid', label: 'Solid' },
    { value: 'liquid', label: 'Liquid' },
];

export const TRANSFER_STATUSES: Array<{ value: TransferStatus; label: string; color: string }> = [
    { value: 'requested', label: 'Requested', color: 'blue' },
    { value: 'approved', label: 'Approved', color: 'purple' },
    { value: 'in_transit', label: 'In Transit', color: 'amber' },
    { value: 'received', label: 'Received', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

export const TRANSFER_STATUS_MAP = TRANSFER_STATUSES.reduce((acc, status) => {
    acc[status.value] = status;
    return acc;
}, {} as Record<TransferStatus, typeof TRANSFER_STATUSES[0]>);


export const MOVEMENT_TYPES: Array<{ value: StockMovementType; label: string; color: string }> = [
    { value: 'receipt', label: 'Goods Receipt', color: 'green' },
    { value: 'issue', label: 'Stock Issue', color: 'blue' },
    { value: 'transfer', label: 'Stock Transfer', color: 'purple' },
    { value: 'adjustment', label: 'Stock Adjustment', color: 'amber' },
    { value: 'return', label: 'Stock Return', color: 'teal' },
];

export const MOVEMENT_TYPE_MAP = MOVEMENT_TYPES.reduce((acc, type) => {
    acc[type.value] = type;
    return acc;
}, {} as Record<StockMovementType, typeof MOVEMENT_TYPES[0]>);

export const ADJUSTMENT_STATUSES: Array<{ value: AdjustmentStatus; label: string; color: string }> = [
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
];

export const ADJUSTMENT_STATUS_MAP = ADJUSTMENT_STATUSES.reduce((acc, status) => {
    acc[status.value] = status;
    return acc;
}, {} as Record<AdjustmentStatus, typeof ADJUSTMENT_STATUSES[0]>);
