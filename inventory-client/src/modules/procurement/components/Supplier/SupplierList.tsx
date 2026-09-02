// src/modules/procurement/components/Supplier/SupplierList.tsx

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
import { Supplier } from "../../types";
import { useSuppliers } from "../../hooks/useSuppliers";
import { supplierService } from "../../services/supplier.service";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import SupplierFormModal from "./SupplierFormModal";
import SupplierDetailsModal from "./SupplierDetailsModal";

const SupplierList: React.FC = () => {
  const {
    suppliers,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    refreshSuppliers,
  } = useSuppliers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewSupplier = (supplier: Supplier): void => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier): void => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDeleteSupplier = async (): Promise<void> => {
    if (!supplierToDelete) return;

    setIsDeleting(true);
    try {
      await supplierService.deleteSupplier(supplierToDelete.id);
      showSuccess("Supplier deleted successfully");
      setSupplierToDelete(null);
      refreshSuppliers();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to delete supplier");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (supplier: Supplier): Promise<void> => {
    try {
      await supplierService.toggleSupplierActive(supplier.id);
      showSuccess(
        `Supplier ${supplier.is_active ? "deactivated" : "activated"} successfully`,
      );
      refreshSuppliers();
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Failed to update supplier status",
      );
    }
  };

  const columns = [
    {
      key: "supplier",
      header: "Supplier",
      render: (supplier: Supplier) => (
        <div>
          <p className="font-medium text-slate-900">{supplier.name}</p>
          <p className="text-xs text-slate-400">{supplier.code}</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (supplier: Supplier) => (
        <div>
          <p className="text-sm text-slate-600">
            {supplier.contact_person || "N/A"}
          </p>
          <p className="text-xs text-slate-400">
            {supplier.contact_phone || supplier.phone || ""}
          </p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (supplier: Supplier) => (
        <span className="text-sm text-slate-600">
          {supplier.email || "N/A"}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (supplier: Supplier) => (
        <span className="text-sm text-slate-600">
          {supplier.city || "N/A"}
          {supplier.state ? `, ${supplier.state}` : ""}
        </span>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      render: (supplier: Supplier) => (
        <span className="font-semibold text-slate-900">
          {supplier.total_orders || 0}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (supplier: Supplier) => (
        <Badge variant={supplier.is_active ? "success" : "danger"}>
          {supplier.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewSupplier(supplier)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          <button
            onClick={() => handleEditSupplier(supplier)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
            title="Edit"
          >
            <i className="fas fa-edit text-xs" />
          </button>
          <button
            onClick={() => handleToggleActive(supplier)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              supplier.is_active
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
            title={supplier.is_active ? "Deactivate" : "Activate"}
          >
            <i
              className={`fas ${supplier.is_active ? "fa-ban" : "fa-check"} text-xs`}
            />
          </button>
          <button
            onClick={() => setSupplierToDelete(supplier)}
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
        title="Suppliers"
        icon="fa-truck-field"
        breadcrumbs={[{ label: "Procurement" }, { label: "Suppliers" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            Add Supplier
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search suppliers..."
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
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {suppliers.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-truck-field"
            title="No suppliers found"
            description="Get started by adding your first supplier"
            actionLabel="Add Supplier"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<Supplier>
            columns={columns}
            data={suppliers}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <SupplierFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshSuppliers();
        }}
      />

      <SupplierFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supplier={selectedSupplier}
        onSuccess={() => {
          setIsEditModalOpen(false);
          refreshSuppliers();
        }}
      />

      <SupplierDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        supplier={selectedSupplier}
        onEdit={(supplier: Supplier) => {
          setIsDetailsModalOpen(false);
          handleEditSupplier(supplier);
        }}
      />

      <ConfirmDialog
        isOpen={!!supplierToDelete}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleDeleteSupplier}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${supplierToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SupplierList;
