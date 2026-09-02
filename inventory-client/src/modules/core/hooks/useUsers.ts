// src/modules/core/hooks/useUsers.ts

import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import { User } from '../../../shared/types/global';
import { UserFilters } from '../types';
import { PaginationMeta } from '../../../shared/types/global';
import { showError, showSuccess } from '../../../shared/utils/toast';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        per_page: 10,
    });

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers(filters);
            setUsers(response.users);
            setPagination(response.pagination);
        } catch (error: any) {
            showError(error.message || 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const updateFilters = (newFilters: Partial<UserFilters>) => {
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

    const handleRoleFilter = (role?: string) => {
        updateFilters({ role });
    };

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        updateFilters({ sort: `${direction === 'desc' ? '-' : ''}${key}` });
    };

    return {
        users,
        pagination,
        isLoading,
        filters,
        fetchUsers,
        updateFilters,
        handlePageChange,
        handleSearch,
        handleStatusFilter,
        handleRoleFilter,
        handleSort,
    };
};