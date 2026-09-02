// src/modules/inventory/hooks/useStockTransfers.ts

import { useState, useEffect, useCallback } from 'react';
import { stockTransferService } from '../services/stock-transfer.service';
import { StockTransfer, StockTransferFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useStockTransfers = () => {
    const [transfers, setTransfers] = useState<StockTransfer[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<StockTransferFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchTransfers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await stockTransferService.getTransfers(filters);
            setTransfers(response.transfers);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch transfers');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTransfers();
    }, [fetchTransfers]);

    const updateFilters = (newFilters: Partial<StockTransferFilters>) => {
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

    const handleStatusFilter = (status?: StockTransfer['status']) => {
        updateFilters({ status });
    };

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        updateFilters({ sort: `${direction === 'desc' ? '-' : ''}${key}` });
    };

    const refreshTransfers = () => {
        fetchTransfers();
    };

    return {
        transfers,
        pagination,
        isLoading,
        filters,
        fetchTransfers,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleStatusFilter,
        handleSort,
        refreshTransfers,
    };
};