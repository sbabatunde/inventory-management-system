// src/modules/release-form/hooks/useReleaseForms.ts

import { useState, useEffect, useCallback } from 'react';
import { releaseFormService } from '../services/release-form.service';
import { ReleaseForm, ReleaseFormFilters, ReleaseFormSummary } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError } from '../../../shared/utils/toast';

export const useReleaseForms = () => {
    const [forms, setForms] = useState<ReleaseForm[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [summary, setSummary] = useState<ReleaseFormSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<ReleaseFormFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchForms = useCallback(async () => {
        setIsLoading(true);
        try {
            const [formsResponse, summaryResponse] = await Promise.all([
                releaseFormService.getForms(filters),
                releaseFormService.getSummary(filters),
            ]);
            setForms(formsResponse.forms);
            setPagination(formsResponse.pagination);
            setSummary(summaryResponse);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch release forms');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchForms();
    }, [fetchForms]);

    const updateFilters = (newFilters: Partial<ReleaseFormFilters>) => {
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

    const handleCategoryFilter = (category?: ReleaseForm['category']) => {
        updateFilters({ category });
    };

    const handleStatusFilter = (status?: ReleaseForm['status']) => {
        updateFilters({ status });
    };

    const refreshForms = () => {
        fetchForms();
    };

    return {
        forms,
        pagination,
        summary,
        isLoading,
        filters,
        fetchForms,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleCategoryFilter,
        handleStatusFilter,
        refreshForms,
    };
};