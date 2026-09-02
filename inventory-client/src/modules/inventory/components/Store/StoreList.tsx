// src/modules/inventory/components/Store/StoreList.tsx

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
import { Store } from "../../types";
import { useStores } from "../../hooks/useStores";
import { storeService } from "../../services/store.service";
import { STORE_TYPES, STORE_TYPE_MAP } from "../../constants";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import StoreFormModal from "./StoreFormModal";
import StoreDetailsModal from "./StoreDetailsModal";
import StoreStockModal from "./StoreStockModal";

const StoreList: React.FC = () => {
  const {
    stores,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleTypeFilter,
    handleStatusFilter,
    handleSort,
    refreshStores,
  } = useStores();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewStore = (store: Store) => {
    setSelectedStore(store);
    setIsDetailsModalOpen(true);
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const handleViewStock = (store: Store) => {
    setSelectedStore(store);
    setIsStockModalOpen(true);
  };

  const handleDeleteStore = async () => {
    if (!storeToDelete) return;

    setIsDeleting(true);
    try {
      await storeService.deleteStore(storeToDelete.id);
      showSuccess("Store deleted successfully");
      setStoreToDelete(null);
      refreshStores();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to delete store");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (store: Store) => {
    try {
      await storeService.toggleStoreActive(store.id);
      showSuccess(
        `Store ${store.is_active ? "deactivated" : "activated"} successfully`,
      );
      refreshStores();
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Failed to update store status",
      );
    }
  };

  const columns = [
    {
      key: "name",
      header: "Store",
      render: (store: Store) => (
        <div>
          <p className="font-medium text-slate-900">{store.name}</p>
          <p className="text-xs text-slate-400">{store.code}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (store: Store) => {
        const typeInfo = STORE_TYPE_MAP[store.type];
        return (
          <Badge
            variant={
              typeInfo.color === "blue"
                ? "info"
                : typeInfo.color === "green"
                  ? "success"
                  : "purple"
            }
          >
            {typeInfo.label}
          </Badge>
        );
      },
    },
    {
      key: "location",
      header: "Location",
      render: (store: Store) => (
        <span className="text-sm text-slate-600">
          {store.city || "N/A"}
          {store.state ? `, ${store.state}` : ""}
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (store: Store) => (
        <div>
          <p className="text-sm text-slate-600">
            {store.contact_person || "N/A"}
          </p>
          <p className="text-xs text-slate-400">{store.contact_phone || ""}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (store: Store) => (
        <Badge variant={store.is_active ? "success" : "danger"}>
          {store.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (store: Store) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewStore(store)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          <button
            onClick={() => handleViewStock(store)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            title="View Stock"
          >
            <i className="fas fa-boxes-stacked text-xs" />
          </button>
          <button
            onClick={() => handleEditStore(store)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
            title="Edit"
          >
            <i className="fas fa-edit text-xs" />
          </button>
          <button
            onClick={() => handleToggleActive(store)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              store.is_active
                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
            title={store.is_active ? "Deactivate" : "Activate"}
          >
            <i
              className={`fas ${store.is_active ? "fa-ban" : "fa-check"} text-xs`}
            />
          </button>
          <button
            onClick={() => setStoreToDelete(store)}
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
        title="Stores"
        icon="fa-warehouse"
        breadcrumbs={[{ label: "Inventory" }, { label: "Stores" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            Add Store
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search stores..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Types"
            options={STORE_TYPES}
            onChange={(e) => handleTypeFilter(e.target.value as Store["type"])}
            wrapperClassName="w-40"
          />
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

      {/* Stores Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {stores.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-warehouse"
            title="No stores found"
            description="Get started by adding your first store"
            actionLabel="Add Store"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable
            columns={columns}
            data={stores}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            onSort={handleSort}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <StoreFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshStores();
        }}
      />

      <StoreFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        store={selectedStore}
        onSuccess={() => {
          setIsEditModalOpen(false);
          refreshStores();
        }}
      />

      <StoreDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        store={selectedStore}
        onEdit={(store) => {
          setIsDetailsModalOpen(false);
          handleEditStore(store);
        }}
      />

      <StoreStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        store={selectedStore}
      />

      <ConfirmDialog
        isOpen={!!storeToDelete}
        onClose={() => setStoreToDelete(null)}
        onConfirm={handleDeleteStore}
        title="Delete Store"
        message={`Are you sure you want to delete ${storeToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StoreList;
