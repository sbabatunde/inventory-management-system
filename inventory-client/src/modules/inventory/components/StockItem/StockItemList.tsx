// src/modules/inventory/components/StockItem/StockItemList.tsx

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
import { StockItem } from "../../types";
import { useStockItems } from "../../hooks/useStockItems";
import { stockItemService } from "../../services/stock-item.service";
import { STOCK_NATURES } from "../../constants";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import StockItemFormModal from "./StockItemFormModal";
import StockItemDetailsModal from "./StockItemDetailsModal";
import StockBalanceModal from "./StockBalanceModal";

const StockItemList: React.FC = () => {
  const {
    stockItems,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleNatureFilter,
    handleSerializedFilter,
    handleStatusFilter,
    handleSort,
    refreshStockItems,
  } = useStockItems();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewItem = (item: StockItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleEditItem = (item: StockItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleViewBalance = (item: StockItem) => {
    setSelectedItem(item);
    setIsBalanceModalOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await stockItemService.deleteStockItem(itemToDelete.id);
      showSuccess("Stock item deleted successfully");
      setItemToDelete(null);
      refreshStockItems();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to delete stock item");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const columns = [
    {
      key: "item",
      header: "Item",
      render: (item: StockItem) => (
        <div>
          <p className="font-medium text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-400">{item.code}</p>
        </div>
      ),
    },
    {
      key: "nature",
      header: "Nature",
      render: (item: StockItem) => (
        <Badge
          variant={
            item.nature === "asset"
              ? "purple"
              : item.nature === "solid"
                ? "info"
                : "warning"
          }
        >
          {item.nature.charAt(0).toUpperCase() + item.nature.slice(1)}
        </Badge>
      ),
    },
    {
      key: "stock",
      header: "Total Stock",
      render: (item: StockItem) => (
        <div>
          <span className="font-semibold text-slate-900">
            {item.total_stock ?? 0}
          </span>
          <span className="text-xs text-slate-400 ml-1">
            {item.unit_of_measure}
          </span>
          {item.total_stock !== undefined &&
            item.total_stock <= item.reorder_level && (
              <span className="ml-2">
                <Badge variant="danger" size="sm">
                  Low
                </Badge>
              </span>
            )}
        </div>
      ),
    },
    {
      key: "unit_cost",
      header: "Unit Cost",
      render: (item: StockItem) => (
        <span className="text-sm text-slate-600">
          {formatCurrency(item.unit_cost)}
        </span>
      ),
    },
    {
      key: "serialized",
      header: "Type",
      render: (item: StockItem) => (
        <Badge variant={item.is_serialized ? "success" : "neutral"}>
          {item.is_serialized ? "Serialized" : "Non-Serialized"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: StockItem) => (
        <Badge variant={item.is_active ? "success" : "danger"}>
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: StockItem) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewItem(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          <button
            onClick={() => handleViewBalance(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            title="View Balance"
          >
            <i className="fas fa-scale-balanced text-xs" />
          </button>
          <button
            onClick={() => handleEditItem(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
            title="Edit"
          >
            <i className="fas fa-edit text-xs" />
          </button>
          <button
            onClick={() => setItemToDelete(item)}
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
        title="Stock Items"
        icon="fa-boxes-stacked"
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock Items" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            Add Stock Item
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search stock items..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Natures"
            options={STOCK_NATURES}
            onChange={(e) =>
              handleNatureFilter(e.target.value as StockItem["nature"])
            }
            wrapperClassName="w-40"
          />
          <Select
            placeholder="All Types"
            options={[
              { value: "true", label: "Serialized" },
              { value: "false", label: "Non-Serialized" },
            ]}
            onChange={(e) => handleSerializedFilter(e.target.value === "true")}
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

      {/* Stock Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {stockItems.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-boxes-stacked"
            title="No stock items found"
            description="Get started by adding your first stock item"
            actionLabel="Add Stock Item"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<StockItem>
            columns={columns}
            data={stockItems}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            onSort={handleSort}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <StockItemFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshStockItems();
        }}
      />

      <StockItemFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        stockItem={selectedItem}
        onSuccess={() => {
          setIsEditModalOpen(false);
          refreshStockItems();
        }}
      />

      <StockItemDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        stockItem={selectedItem}
        onEdit={(item) => {
          setIsDetailsModalOpen(false);
          handleEditItem(item);
        }}
      />

      <StockBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        stockItem={selectedItem}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        title="Delete Stock Item"
        message={`Are you sure you want to delete ${itemToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StockItemList;
