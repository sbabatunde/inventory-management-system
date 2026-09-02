// src/modules/procurement/hooks/usePurchaseRequisitions.ts

import { useState, useEffect, useCallback } from 'react';
import { purchaseRequisitionService } from '../services/purchase-requisition.service';
import { PurchaseRequisition, RequisitionFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const usePurchaseRequisitions = () => {
    const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<RequisitionFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchRequisitions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await purchaseRequisitionService.getRequisitions(filters);
            setRequisitions(response.requisitions);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch requisitions');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchRequisitions();
    }, [fetchRequisitions]);

    const updateFilters = (newFilters: Partial<RequisitionFilters>) => {
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

    const handleStatusFilter = (status?: PurchaseRequisition['status']) => {
        updateFilters({ status });
    };

    const handlePriorityFilter = (priority?: PurchaseRequisition['priority']) => {
        updateFilters({ priority });
    };

    const refreshRequisitions = () => {
        fetchRequisitions();
    };

    return {
        requisitions,
        pagination,
        isLoading,
        filters,
        fetchRequisitions,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleStatusFilter,
        handlePriorityFilter,
        refreshRequisitions,
    };
};