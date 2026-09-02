// src/modules/assets/components/AssetList.tsx

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
  StatCard,
} from "../../../shared/components/UI";
import { Asset, AssetStatus, AssetType } from "../types";
import { useAssets } from "../hooks/useAssets";
import { assetService } from "../services/asset.service";
import {
  ASSET_TYPES,
  ASSET_TYPE_MAP,
  ASSET_STATUSES,
  ASSET_STATUS_MAP,
} from "../constants";
import { showSuccess, showError } from "../../../shared/utils/toast";
import AssetFormModal from "./AssetFormModal";
import AssetDetailsModal from "./AssetDetailsModal";

const AssetList: React.FC = () => {
  const {
    assets,
    pagination,
    summary,
    isLoading,
    handlePageChange,
    handleSearch,
    handleTypeFilter,
    handleStatusFilter,
    refreshAssets,
  } = useAssets();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewAsset = (asset: Asset): void => {
    setSelectedAsset(asset);
    setIsDetailsModalOpen(true);
  };

  const handleEditAsset = (asset: Asset): void => {
    setSelectedAsset(asset);
    setIsEditModalOpen(true);
  };

  const handleDeleteAsset = async (): Promise<void> => {
    if (!assetToDelete) return;

    setIsDeleting(true);
    try {
      await assetService.deleteAsset(assetToDelete.id);
      showSuccess("Asset deleted successfully");
      setAssetToDelete(null);
      refreshAssets();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to delete asset");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    const statusInfo = ASSET_STATUS_MAP[status];
    const variant =
      statusInfo.color === "green"
        ? "success"
        : statusInfo.color === "blue"
          ? "info"
          : statusInfo.color === "purple"
            ? "purple"
            : statusInfo.color === "amber"
              ? "warning"
              : "danger";
    return <Badge variant={variant}>{statusInfo.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const columns = [
    {
      key: "asset",
      header: "Asset",
      render: (asset: Asset) => (
        <div>
          <p className="font-medium text-slate-900">{asset.name}</p>
          <p className="text-xs text-slate-400">{asset.asset_code}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (asset: Asset) => {
        const typeInfo = ASSET_TYPE_MAP[asset.type];
        const variant =
          typeInfo.color === "blue"
            ? "info"
            : typeInfo.color === "green"
              ? "success"
              : typeInfo.color === "purple"
                ? "purple"
                : typeInfo.color === "amber"
                  ? "warning"
                  : "neutral";
        return <Badge variant={variant}>{typeInfo.label}</Badge>;
      },
    },
    {
      key: "serial",
      header: "Serial No",
      render: (asset: Asset) => (
        <span className="text-sm text-slate-600 font-mono">
          {asset.serial_no || "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (asset: Asset) => getStatusBadge(asset.status),
    },
    {
      key: "location",
      header: "Location",
      render: (asset: Asset) => (
        <div>
          {asset.current_store ? (
            <>
              <p className="text-sm text-slate-600">
                {asset.current_store.name}
              </p>
              <p className="text-xs text-slate-400">
                {asset.current_store.code}
              </p>
            </>
          ) : asset.assigned_to_user ? (
            <>
              <p className="text-sm text-slate-600">
                {asset.assigned_to_user.name}
              </p>
              <p className="text-xs text-slate-400">Assigned</p>
            </>
          ) : (
            <span className="text-sm text-slate-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "value",
      header: "Current Value",
      render: (asset: Asset) => (
        <span className="text-sm text-slate-600 font-medium">
          {formatCurrency(asset.current_value)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (asset: Asset) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewAsset(asset)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          <button
            onClick={() => handleEditAsset(asset)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            title="Edit"
          >
            <i className="fas fa-edit text-xs" />
          </button>
          <button
            onClick={() => setAssetToDelete(asset)}
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
        title="Assets"
        icon="fa-microchip"
        breadcrumbs={[{ label: "Assets" }, { label: "All Assets" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            Add Asset
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Assets"
            value={summary.total_assets}
            icon="fa-microchip"
            color="blue"
          />
          <StatCard
            label="In Stock"
            value={summary.in_stock}
            icon="fa-box"
            color="green"
          />
          <StatCard
            label="Assigned"
            value={summary.assigned}
            icon="fa-user-check"
            color="purple"
          />
          <StatCard
            label="Total Value"
            value={formatCurrency(summary.total_value)}
            icon="fa-money-bill"
            color="amber"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search assets..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Types"
            options={ASSET_TYPES}
            onChange={(e) => handleTypeFilter(e.target.value as AssetType)}
            wrapperClassName="w-40"
          />
          <Select
            placeholder="All Statuses"
            options={ASSET_STATUSES}
            onChange={(e) => handleStatusFilter(e.target.value as AssetStatus)}
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {assets.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-microchip"
            title="No assets found"
            description="Get started by adding your first asset"
            actionLabel="Add Asset"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<Asset>
            columns={columns}
            data={assets}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <AssetFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshAssets();
        }}
      />

      <AssetFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        asset={selectedAsset}
        onSuccess={() => {
          setIsEditModalOpen(false);
          refreshAssets();
        }}
      />

      <AssetDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        asset={selectedAsset}
        onEdit={(asset: Asset) => {
          setIsDetailsModalOpen(false);
          handleEditAsset(asset);
        }}
      />

      <ConfirmDialog
        isOpen={!!assetToDelete}
        onClose={() => setAssetToDelete(null)}
        onConfirm={handleDeleteAsset}
        title="Delete Asset"
        message={`Are you sure you want to delete ${assetToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AssetList;
