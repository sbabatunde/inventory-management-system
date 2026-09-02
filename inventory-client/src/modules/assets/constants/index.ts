// src/modules/assets/constants/index.ts

import { AssetType, AssetStatus, DepreciationMethod } from '../types';

export const ASSET_TYPES: Array<{ value: AssetType; label: string; color: string }> = [
    { value: 'pop', label: 'POP Equipment', color: 'blue' },
    { value: 'client', label: 'Client Equipment', color: 'green' },
    { value: 'fibre', label: 'Fibre Equipment', color: 'purple' },
    { value: 'radio', label: 'Radio Equipment', color: 'amber' },
    { value: 'other', label: 'Other', color: 'neutral' },
];

export const ASSET_TYPE_MAP = ASSET_TYPES.reduce((acc, type) => {
    acc[type.value] = type;
    return acc;
}, {} as Record<AssetType, typeof ASSET_TYPES[0]>);

export const ASSET_STATUSES: Array<{ value: AssetStatus; label: string; color: string }> = [
    { value: 'in_stock', label: 'In Stock', color: 'green' },
    { value: 'assigned', label: 'Assigned', color: 'blue' },
    { value: 'installed', label: 'Installed', color: 'purple' },
    { value: 'maintenance', label: 'Maintenance', color: 'amber' },
    { value: 'retired', label: 'Retired', color: 'red' },
];

export const ASSET_STATUS_MAP = ASSET_STATUSES.reduce((acc, status) => {
    acc[status.value] = status;
    return acc;
}, {} as Record<AssetStatus, typeof ASSET_STATUSES[0]>);

export const DEPRECIATION_METHODS: Array<{ value: DepreciationMethod; label: string }> = [
    { value: 'straight_line', label: 'Straight Line' },
    { value: 'declining_balance', label: 'Declining Balance' },
    { value: 'sum_of_years', label: 'Sum of Years' },
];