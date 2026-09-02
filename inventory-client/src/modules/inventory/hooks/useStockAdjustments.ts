// src/modules/inventory/hooks/useStockAdjustments.ts

import { useState, useEffect, useCallback } from 'react';
import { stockAdjustmentService } from '../services/stock-adjustment.service';
import { StockAdjustment, StockAdjustmentFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useStockAdjustments = () => {
    const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<StockAdjustmentFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchAdjustments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await stockAdjustmentService.getAdjustments(filters);
            setAdjustments(response.adjustments);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch stock adjustments');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAdjustments();
    }, [fetchAdjustments]);

    const updateFilters = (newFilters: Partial<StockAdjustmentFilters>) => {
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

    const handleStatusFilter = (status?: StockAdjustment['status']) => {
        updateFilters({ status });
    };

    const refreshAdjustments = () => {
        fetchAdjustments();
    };

    return {
        adjustments,
        pagination,
        isLoading,
        filters,
        fetchAdjustments,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleStatusFilter,
        refreshAdjustments,
    };
};