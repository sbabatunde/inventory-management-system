// src/modules/assets/hooks/useAssets.ts

import { useState, useEffect, useCallback } from 'react';
import { assetService } from '../services/asset.service';
import { Asset, AssetFilters, AssetSummary } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useAssets = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [summary, setSummary] = useState<AssetSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<AssetFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchAssets = useCallback(async () => {
        setIsLoading(true);
        try {
            const [assetsResponse, summaryResponse] = await Promise.all([
                assetService.getAssets(filters),
                assetService.getAssetSummary(),
            ]);
            setAssets(assetsResponse.assets);
            setPagination(assetsResponse.pagination);
            setSummary(summaryResponse);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch assets');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const updateFilters = (newFilters: Partial<AssetFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1,
        }));
    };

    const handlePageChange = (page: number) => {
        updateFilters({ page });
    };

    const handleSearch = (search: string) => {
        updateFilters({ search });
    };

    const handleTypeFilter = (type?: Asset['type']) => {
        updateFilters({ type });
    };

    const handleStatusFilter = (status?: Asset['status']) => {
        updateFilters({ status });
    };

    const refreshAssets = () => {
        fetchAssets();
    };

    return {
        assets,
        pagination,
        summary,
        isLoading,
        filters,
        fetchAssets,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleTypeFilter,
        handleStatusFilter,
        refreshAssets,
    };
};