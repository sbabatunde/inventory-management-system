// src/modules/inventory/components/StockAdjustment/StockAdjustmentList.tsx

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
import { StockAdjustment, AdjustmentStatus } from "../../types";
import { useStockAdjustments } from "../../hooks/useStockAdjustments";
import { stockAdjustmentService } from "../../services/stock-adjustment.service";
import { ADJUSTMENT_STATUSES, ADJUSTMENT_STATUS_MAP } from "../../constants";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import StockAdjustmentFormModal from "./StockAdjustmentFormModal";

const StockAdjustmentList: React.FC = () => {
  const {
    adjustments,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    refreshAdjustments,
  } = useStockAdjustments();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [adjustmentToApprove, setAdjustmentToApprove] =
    useState<StockAdjustment | null>(null);
  const [adjustmentToReject, setAdjustmentToReject] =
    useState<StockAdjustment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusBadge = (status: AdjustmentStatus) => {
    const statusInfo = ADJUSTMENT_STATUS_MAP[status];
    const variant =
      statusInfo.color === "green"
        ? "success"
        : statusInfo.color === "amber"
          ? "warning"
          : "danger";
    return <Badge variant={variant}>{statusInfo.label}</Badge>;
  };

  const handleApprove = async (): Promise<void> => {
    if (!adjustmentToApprove) return;

    setIsProcessing(true);
    try {
      await stockAdjustmentService.approveAdjustment(adjustmentToApprove.id);
      showSuccess("Stock adjustment approved successfully");
      setAdjustmentToApprove(null);
      refreshAdjustments();
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Failed to approve adjustment",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (): Promise<void> => {
    if (!adjustmentToReject) return;

    setIsProcessing(true);
    try {
      await stockAdjustmentService.rejectAdjustment(adjustmentToReject.id);
      showSuccess("Stock adjustment rejected successfully");
      setAdjustmentToReject(null);
      refreshAdjustments();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to reject adjustment");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      key: "adjustment_no",
      header: "Adjustment No",
      render: (adjustment: StockAdjustment) => (
        <div>
          <p className="font-medium text-slate-900">
            {adjustment.adjustment_no}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(adjustment.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "item",
      header: "Item",
      render: (adjustment: StockAdjustment) => (
        <div>
          <p className="font-medium text-slate-900">
            {adjustment.stock_item?.name}
          </p>
          <p className="text-xs text-slate-400">
            {adjustment.stock_item?.code}
          </p>
        </div>
      ),
    },
    {
      key: "store",
      header: "Store",
      render: (adjustment: StockAdjustment) => (
        <div>
          <p className="font-medium text-slate-900">{adjustment.store?.name}</p>
          <p className="text-xs text-slate-400">{adjustment.store?.code}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity Change",
      render: (adjustment: StockAdjustment) => (
        <div>
          <p className="text-xs text-slate-400">
            From: {adjustment.previous_quantity}
          </p>
          <p className="text-xs text-slate-400">
            To: {adjustment.new_quantity}
          </p>
          <p
            className={`text-xs font-semibold ${
              adjustment.quantity_difference > 0
                ? "text-emerald-600"
                : adjustment.quantity_difference < 0
                  ? "text-rose-600"
                  : "text-slate-600"
            }`}
          >
            {adjustment.quantity_difference > 0 ? "+" : ""}
            {adjustment.quantity_difference}
          </p>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (adjustment: StockAdjustment) => (
        <span className="text-sm text-slate-600">{adjustment.reason}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (adjustment: StockAdjustment) =>
        getStatusBadge(adjustment.status),
    },
    {
      key: "actions",
      header: "Actions",
      render: (adjustment: StockAdjustment) => (
        <div className="flex items-center gap-1.5">
          {adjustment.status === "pending" && (
            <>
              <button
                onClick={() => setAdjustmentToApprove(adjustment)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                title="Approve"
              >
                <i className="fas fa-check text-xs" />
              </button>
              <button
                onClick={() => setAdjustmentToReject(adjustment)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Reject"
              >
                <i className="fas fa-times text-xs" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Adjustments"
        icon="fa-sliders"
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock Adjustments" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            New Adjustment
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search adjustments..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Statuses"
            options={ADJUSTMENT_STATUSES}
            onChange={(e) =>
              handleStatusFilter(e.target.value as AdjustmentStatus)
            }
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {adjustments.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-sliders"
            title="No stock adjustments found"
            description="Create a stock adjustment to correct inventory levels"
            actionLabel="New Adjustment"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<StockAdjustment>
            columns={columns}
            data={adjustments}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <StockAdjustmentFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshAdjustments();
        }}
      />

      <ConfirmDialog
        isOpen={!!adjustmentToApprove}
        onClose={() => setAdjustmentToApprove(null)}
        onConfirm={handleApprove}
        title="Approve Adjustment"
        message={`Are you sure you want to approve adjustment ${adjustmentToApprove?.adjustment_no}?`}
        confirmLabel="Approve"
        isLoading={isProcessing}
        variant="success"
      />

      <ConfirmDialog
        isOpen={!!adjustmentToReject}
        onClose={() => setAdjustmentToReject(null)}
        onConfirm={handleReject}
        title="Reject Adjustment"
        message={`Are you sure you want to reject adjustment ${adjustmentToReject?.adjustment_no}?`}
        confirmLabel="Reject"
        isLoading={isProcessing}
        variant="danger"
      />
    </div>
  );
};

export default StockAdjustmentList;
