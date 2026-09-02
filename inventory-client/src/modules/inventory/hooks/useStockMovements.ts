// src/modules/inventory/hooks/useStockMovements.ts

import { useState, useEffect, useCallback } from 'react';
import { stockMovementService } from '../services/stock-movement.service';
import { StockMovement, StockMovementFilters, StockMovementSummary } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useStockMovements = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [summary, setSummary] = useState<StockMovementSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<StockMovementFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchMovements = useCallback(async () => {
        setIsLoading(true);
        try {
            const [movementsResponse, summaryResponse] = await Promise.all([
                stockMovementService.getMovements(filters),
                stockMovementService.getStockSummary(filters),
            ]);
            setMovements(movementsResponse.movements);
            setPagination(movementsResponse.pagination);
            setSummary(summaryResponse);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch stock movements');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    const updateFilters = (newFilters: Partial<StockMovementFilters>) => {
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

    const handleTypeFilter = (movementType?: StockMovement['movement_type']) => {
        updateFilters({ movement_type: movementType });
    };

    const handleDateFilter = (dateFrom?: string, dateTo?: string) => {
        updateFilters({ date_from: dateFrom, date_to: dateTo });
    };

    const refreshMovements = () => {
        fetchMovements();
    };

    return {
        movements,
        pagination,
        summary,
        isLoading,
        filters,
        fetchMovements,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleTypeFilter,
        handleDateFilter,
        refreshMovements,
    };
};