// src/modules/procurement/hooks/useSuppliers.ts

import { useState, useEffect, useCallback } from 'react';
import { supplierService } from '../services/supplier.service';
import { Supplier, SupplierFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useSuppliers = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<SupplierFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchSuppliers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await supplierService.getSuppliers(filters);
            setSuppliers(response.suppliers);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch suppliers');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const updateFilters = (newFilters: Partial<SupplierFilters>) => {
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

    const handleStatusFilter = (status?: 'active' | 'inactive') => {
        updateFilters({ status });
    };

    const refreshSuppliers = () => {
        fetchSuppliers();
    };

    return {
        suppliers,
        pagination,
        isLoading,
        filters,
        fetchSuppliers,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleStatusFilter,
        refreshSuppliers,
    };
};