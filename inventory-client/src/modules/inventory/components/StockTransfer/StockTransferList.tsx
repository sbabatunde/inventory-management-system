// src/modules/inventory/components/StockTransfer/StockTransferList.tsx

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
import { StockTransfer, TransferStatus } from "../../types";
import { useStockTransfers } from "../../hooks/useStockTransfers";
import { stockTransferService } from "../../services/stock-transfer.service";
import { TRANSFER_STATUSES, TRANSFER_STATUS_MAP } from "../../constants";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import StockTransferFormModal from "./StockTransferFormModal";
import StockTransferDetailsModal from "./StockTransferDetailsModal";

const StockTransferList: React.FC = () => {
  const {
    transfers,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handleSort,
    refreshTransfers,
  } = useStockTransfers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<StockTransfer | null>(null);
  const [transferToCancel, setTransferToCancel] =
    useState<StockTransfer | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleViewTransfer = (transfer: StockTransfer): void => {
    setSelectedTransfer(transfer);
    setIsDetailsModalOpen(true);
  };

  const handleCancelTransfer = async (): Promise<void> => {
    if (!transferToCancel) return;

    setIsCancelling(true);
    try {
      await stockTransferService.cancelTransfer(transferToCancel.id);
      showSuccess("Transfer cancelled successfully");
      setTransferToCancel(null);
      refreshTransfers();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to cancel transfer");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleApproveTransfer = async (
    transfer: StockTransfer,
  ): Promise<void> => {
    try {
      await stockTransferService.approveTransfer(transfer.id);
      showSuccess("Transfer approved successfully");
      refreshTransfers();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to approve transfer");
    }
  };

  const handleReceiveTransfer = async (
    transfer: StockTransfer,
  ): Promise<void> => {
    try {
      await stockTransferService.receiveTransfer(transfer.id);
      showSuccess("Transfer received successfully");
      refreshTransfers();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to receive transfer");
    }
  };

  const getStatusBadge = (status: TransferStatus) => {
    const statusInfo = TRANSFER_STATUS_MAP[status];
    const variant =
      statusInfo.color === "green"
        ? "success"
        : statusInfo.color === "blue"
          ? "info"
          : statusInfo.color === "amber"
            ? "warning"
            : statusInfo.color === "red"
              ? "danger"
              : "purple";
    return <Badge variant={variant}>{statusInfo.label}</Badge>;
  };

  const columns = [
    {
      key: "transfer_no",
      header: "Transfer No",
      render: (transfer: StockTransfer) => (
        <div>
          <p className="font-medium text-slate-900">{transfer.transfer_no}</p>
          <p className="text-xs text-slate-400">
            {new Date(transfer.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "from",
      header: "From Store",
      render: (transfer: StockTransfer) => (
        <div>
          <p className="font-medium text-slate-900">
            {transfer.from_store?.name}
          </p>
          <p className="text-xs text-slate-400">{transfer.from_store?.code}</p>
        </div>
      ),
    },
    {
      key: "to",
      header: "To Store",
      render: (transfer: StockTransfer) => (
        <div>
          <p className="font-medium text-slate-900">
            {transfer.to_store?.name}
          </p>
          <p className="text-xs text-slate-400">{transfer.to_store?.code}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (transfer: StockTransfer) => (
        <span className="font-semibold text-slate-900">
          {transfer.items.length} items
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (transfer: StockTransfer) => getStatusBadge(transfer.status),
    },
    {
      key: "actions",
      header: "Actions",
      render: (transfer: StockTransfer) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewTransfer(transfer)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>

          {transfer.status === "requested" && (
            <>
              <button
                onClick={() => handleApproveTransfer(transfer)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                title="Approve"
              >
                <i className="fas fa-check text-xs" />
              </button>
              <button
                onClick={() => setTransferToCancel(transfer)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Cancel"
              >
                <i className="fas fa-ban text-xs" />
              </button>
            </>
          )}

          {transfer.status === "approved" && (
            <button
              onClick={() => handleReceiveTransfer(transfer)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
              title="Receive"
            >
              <i className="fas fa-box-open text-xs" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Transfers"
        icon="fa-right-left"
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock Transfers" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            New Transfer
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search transfers..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Statuses"
            options={TRANSFER_STATUSES}
            onChange={(e) =>
              handleStatusFilter(e.target.value as TransferStatus)
            }
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {transfers.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-right-left"
            title="No transfers found"
            description="Create a stock transfer to move items between stores"
            actionLabel="New Transfer"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<StockTransfer>
            columns={columns}
            data={transfers}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            onSort={handleSort}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <StockTransferFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshTransfers();
        }}
      />

      <StockTransferDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        transfer={selectedTransfer}
        onApprove={handleApproveTransfer}
        onReceive={handleReceiveTransfer}
        onCancel={(transfer) => setTransferToCancel(transfer)}
      />

      <ConfirmDialog
        isOpen={!!transferToCancel}
        onClose={() => setTransferToCancel(null)}
        onConfirm={handleCancelTransfer}
        title="Cancel Transfer"
        message={`Are you sure you want to cancel transfer ${transferToCancel?.transfer_no}?`}
        confirmLabel="Cancel Transfer"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default StockTransferList;
