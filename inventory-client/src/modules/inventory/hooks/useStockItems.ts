// src/modules/inventory/hooks/useStockItems.ts

import { useState, useEffect, useCallback } from 'react';
import { stockItemService } from '../services/stock-item.service';
import { StockItem, StockItemFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useStockItems = () => {
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<StockItemFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchStockItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await stockItemService.getStockItems(filters);
            setStockItems(response.stockItems);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch stock items');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchStockItems();
    }, [fetchStockItems]);

    const updateFilters = (newFilters: Partial<StockItemFilters>) => {
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

    const handleNatureFilter = (nature?: StockItem['nature']) => {
        updateFilters({ nature });
    };

    const handleSerializedFilter = (isSerialized?: boolean) => {
        updateFilters({ is_serialized: isSerialized });
    };

    const handleStatusFilter = (status?: 'active' | 'inactive') => {
        updateFilters({ status });
    };

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        updateFilters({ sort: `${direction === 'desc' ? '-' : ''}${key}` });
    };

    const refreshStockItems = () => {
        fetchStockItems();
    };

    return {
        stockItems,
        pagination,
        isLoading,
        filters,
        fetchStockItems,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleNatureFilter,
        handleSerializedFilter,
        handleStatusFilter,
        handleSort,
        refreshStockItems,
    };
};