// src/modules/procurement/components/Requisition/PurchaseRequisitionList.tsx

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
import {
  PurchaseRequisition,
  RequisitionStatus,
  RequisitionPriority,
} from "../../types";
import { usePurchaseRequisitions } from "../../hooks/usePurchaseRequisitions";
import { purchaseRequisitionService } from "../../services/purchase-requisition.service";
import {
  REQUISITION_STATUSES,
  REQUISITION_STATUS_MAP,
  REQUISITION_PRIORITIES,
  REQUISITION_PRIORITY_MAP,
} from "../../constants";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import PurchaseRequisitionFormModal from "./PurchaseRequisitionFormModal";
import PurchaseRequisitionDetailsModal from "./PurchaseRequisitionDetailsModal";

const PurchaseRequisitionList: React.FC = () => {
  const {
    requisitions,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handlePriorityFilter,
    refreshRequisitions,
  } = usePurchaseRequisitions();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] =
    useState<PurchaseRequisition | null>(null);
  const [requisitionToCancel, setRequisitionToCancel] =
    useState<PurchaseRequisition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewRequisition = (requisition: PurchaseRequisition): void => {
    setSelectedRequisition(requisition);
    setIsDetailsModalOpen(true);
  };

  const handleCancelRequisition = async (): Promise<void> => {
    if (!requisitionToCancel) return;

    setIsProcessing(true);
    try {
      await purchaseRequisitionService.cancelRequisition(
        requisitionToCancel.id,
      );
      showSuccess("Requisition cancelled successfully");
      setRequisitionToCancel(null);
      refreshRequisitions();
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Failed to cancel requisition",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: RequisitionStatus) => {
    const statusInfo = REQUISITION_STATUS_MAP[status];
    const variant =
      statusInfo.color === "green"
        ? "success"
        : statusInfo.color === "blue"
          ? "info"
          : statusInfo.color === "amber"
            ? "warning"
            : statusInfo.color === "red"
              ? "danger"
              : statusInfo.color === "purple"
                ? "purple"
                : "neutral";
    return <Badge variant={variant}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (priority: RequisitionPriority) => {
    const priorityInfo = REQUISITION_PRIORITY_MAP[priority];
    const variant =
      priorityInfo.color === "red"
        ? "danger"
        : priorityInfo.color === "amber"
          ? "warning"
          : priorityInfo.color === "blue"
            ? "info"
            : "neutral";
    return (
      <Badge variant={variant} size="sm">
        {priorityInfo.label}
      </Badge>
    );
  };

  const columns = [
    {
      key: "pr_no",
      header: "PR No",
      render: (requisition: PurchaseRequisition) => (
        <div>
          <p className="font-medium text-slate-900">{requisition.pr_no}</p>
          <p className="text-xs text-slate-400">
            {new Date(requisition.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (requisition: PurchaseRequisition) => (
        <div>
          <p className="font-medium text-slate-900">{requisition.title}</p>
          <p className="text-xs text-slate-400">
            {requisition.requested_by_user?.name || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (requisition: PurchaseRequisition) =>
        getPriorityBadge(requisition.priority),
    },
    {
      key: "items",
      header: "Items",
      render: (requisition: PurchaseRequisition) => (
        <span className="font-semibold text-slate-900">
          {requisition.item_count || requisition.items?.length || 0} items
        </span>
      ),
    },
    {
      key: "cost",
      header: "Est. Cost",
      render: (requisition: PurchaseRequisition) => (
        <span className="text-sm text-slate-600 font-medium">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(requisition.total_estimated_cost || 0)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (requisition: PurchaseRequisition) =>
        getStatusBadge(requisition.status),
    },
    {
      key: "actions",
      header: "Actions",
      render: (requisition: PurchaseRequisition) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewRequisition(requisition)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          {["draft", "pending_approval"].includes(requisition.status) && (
            <button
              onClick={() => setRequisitionToCancel(requisition)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              title="Cancel"
            >
              <i className="fas fa-ban text-xs" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Purchase Requisitions"
        icon="fa-clipboard-list"
        breadcrumbs={[{ label: "Procurement" }, { label: "Requisitions" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            New Requisition
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search requisitions..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Statuses"
            options={REQUISITION_STATUSES}
            onChange={(e) =>
              handleStatusFilter(e.target.value as RequisitionStatus)
            }
            wrapperClassName="w-40"
          />
          <Select
            placeholder="All Priorities"
            options={REQUISITION_PRIORITIES}
            onChange={(e) =>
              handlePriorityFilter(e.target.value as RequisitionPriority)
            }
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Requisitions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {requisitions.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-clipboard-list"
            title="No requisitions found"
            description="Create a purchase requisition to request items"
            actionLabel="New Requisition"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<PurchaseRequisition>
            columns={columns}
            data={requisitions}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <PurchaseRequisitionFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshRequisitions();
        }}
      />

      <PurchaseRequisitionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        requisition={selectedRequisition}
        onRefresh={refreshRequisitions}
      />

      <ConfirmDialog
        isOpen={!!requisitionToCancel}
        onClose={() => setRequisitionToCancel(null)}
        onConfirm={handleCancelRequisition}
        title="Cancel Requisition"
        message={`Are you sure you want to cancel requisition ${requisitionToCancel?.pr_no}?`}
        confirmLabel="Cancel Requisition"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default PurchaseRequisitionList;
