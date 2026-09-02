// src/modules/core/components/Users/UserManagement.tsx

import React, { useState } from "react";
import {
  PageHeader,
  Button,
  Input,
  Select,
  DataTable,
  Badge,
  ConfirmDialog,
  EmptyState,
} from "../../../../shared/components/UI";
import UserFormModal from "./UserFormModal";
import UserDetailsModal from "./UserDetailsModal";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../../../shared/types/global";
import { userService } from "../../services/user.service";
import { showSuccess, showError } from "../../../../shared/utils/toast";

const UserManagement: React.FC = () => {
  const {
    users,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handleRoleFilter,
    handleSort,
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const availableRoles = [
    { value: "super-admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
    { value: "user", label: "User" },
  ];

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await userService.deleteUser(userToDelete.id);
      showSuccess("User deleted successfully");
      setUserToDelete(null);
      // Refresh users
      handlePageChange(pagination?.current_page || 1);
    } catch (error: any) {
      showError(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await userService.toggleUserActive(user.id);
      showSuccess(
        `User ${user.is_active ? "deactivated" : "activated"} successfully`,
      );
      handlePageChange(pagination?.current_page || 1);
    } catch (error: any) {
      showError(error.message || "Failed to update user status");
    }
  };

  const handleSyncFromCrm = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      const result = await userService.syncFromCrm();
      showSuccess(
        `Synced ${result.total_synced} users from CRM (${result.created} created, ${result.updated} updated)`,
      );
      refreshUsers();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to sync from CRM");
    } finally {
      setIsSyncing(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "roles",
      header: "Roles",
      render: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.slice(0, 2).map((role) => (
            <Badge key={role} variant="purple" size="sm">
              {role}
            </Badge>
          ))}
          {user.roles.length > 2 && (
            <Badge variant="neutral" size="sm">
              +{user.roles.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: User) => (
        <Badge variant={user.is_active ? "success" : "danger"} size="sm">
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "last_login",
      header: "Last Login",
      render: (user: User) => (
        <span className="text-xs text-slate-500">
          {user.last_login_at
            ? new Date(user.last_login_at).toLocaleDateString()
            : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewUser(user)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            title="Edit"
          >
            <i className="fas fa-edit text-xs" />
          </button>
          <button
            onClick={() => handleToggleActive(user)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              user.is_active
                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
            title={user.is_active ? "Deactivate" : "Activate"}
          >
            <i
              className={`fas ${user.is_active ? "fa-ban" : "fa-check"} text-xs`}
            />
          </button>
          <button
            onClick={() => setUserToDelete(user)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete"
          >
            <i className="fas fa-trash text-xs" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        icon="fa-users"
        breadcrumbs={[{ label: "Home" }, { label: "Users" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            Add User
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search users..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            onChange={(e) => handleStatusFilter(e.target.value as any)}
            wrapperClassName="w-40"
          />
          <Select
            placeholder="All Roles"
            options={availableRoles}
            onChange={(e) => handleRoleFilter(e.target.value)}
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {users.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-users"
            title="No users found"
            description="Get started by adding your first user"
            actionLabel="Add User"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable
            columns={columns}
            data={users}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            onSort={handleSort}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => handlePageChange(1)}
        availableRoles={availableRoles}
      />

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSuccess={() => handlePageChange(pagination?.current_page || 1)}
        availableRoles={availableRoles}
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={selectedUser}
        onEdit={(user) => {
          setIsDetailsModalOpen(false);
          handleEditUser(user);
        }}
      />

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserManagement;
