// src/modules/procurement/hooks/usePurchaseOrders.ts

import { useState, useEffect, useCallback } from 'react';
import { purchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrder, PurchaseOrderFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const usePurchaseOrders = () => {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<PurchaseOrderFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await purchaseOrderService.getOrders(filters);
            setOrders(response.orders);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch purchase orders');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateFilters = (newFilters: Partial<PurchaseOrderFilters>) => {
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

    const handleStatusFilter = (status?: PurchaseOrder['status']) => {
        updateFilters({ status });
    };

    const refreshOrders = () => {
        fetchOrders();
    };

    return {
        orders,
        pagination,
        isLoading,
        filters,
        fetchOrders,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleStatusFilter,
        refreshOrders,
    };
};