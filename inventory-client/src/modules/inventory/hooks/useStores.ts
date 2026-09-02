// src/modules/inventory/hooks/useStores.ts

import { useState, useEffect, useCallback } from 'react';
import { storeService } from '../services/store.service';
import { Store, StoreFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useStores = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<StoreFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await storeService.getStores(filters);
            setStores(response.stores);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch stores');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const updateFilters = (newFilters: Partial<StoreFilters>) => {
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

    const handleTypeFilter = (type?: Store['type']) => {
        updateFilters({ type });
    };

    const handleStatusFilter = (status?: 'active' | 'inactive') => {
        updateFilters({ status });
    };

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        updateFilters({ sort: `${direction === 'desc' ? '-' : ''}${key}` });
    };

    const refreshStores = () => {
        fetchStores();
    };

    return {
        stores,
        pagination,
        isLoading,
        filters,
        fetchStores,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleTypeFilter,
        handleStatusFilter,
        handleSort,
        refreshStores,
    };
};