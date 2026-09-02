// src/modules/procurement/components/Requisition/PurchaseRequisitionDetailsModal.tsx

import React, { useState } from "react";
import {
  Modal,
  Badge,
  Button,
  DataTable,
  EmptyState,
} from "../../../../shared/components/UI";
import { PurchaseRequisition, RequisitionStatus } from "../../types";
import {
  REQUISITION_STATUS_MAP,
  REQUISITION_PRIORITY_MAP,
} from "../../constants";
import { purchaseRequisitionService } from "../../services/purchase-requisition.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface PurchaseRequisitionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisition: PurchaseRequisition | null;
  onRefresh: () => void;
}

const PurchaseRequisitionDetailsModal: React.FC<
  PurchaseRequisitionDetailsModalProps
> = ({ isOpen, onClose, requisition, onRefresh }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  if (!requisition) return null;

  const statusInfo = REQUISITION_STATUS_MAP[requisition.status];
  const priorityInfo = REQUISITION_PRIORITY_MAP[requisition.priority];

  const getStatusBadge = (status: RequisitionStatus) => {
    const info = REQUISITION_STATUS_MAP[status];
    const variant =
      info.color === "green"
        ? "success"
        : info.color === "blue"
          ? "info"
          : info.color === "amber"
            ? "warning"
            : info.color === "red"
              ? "danger"
              : info.color === "purple"
                ? "purple"
                : "neutral";
    return <Badge variant={variant}>{info.label}</Badge>;
  };

  const handleAction = async (action: string): Promise<void> => {
    setIsProcessing(true);
    const loadingToast = showLoading(`Processing ${action}...`);

    try {
      switch (action) {
        case "submit":
          await purchaseRequisitionService.submitForApproval(requisition.id);
          showSuccess("Requisition submitted for approval");
          break;
        case "approve":
          await purchaseRequisitionService.approveRequisition(requisition.id);
          showSuccess("Requisition approved successfully");
          break;
        case "reject":
          if (!rejectionReason.trim()) {
            throw new Error("Rejection reason is required");
          }
          await purchaseRequisitionService.rejectRequisition(
            requisition.id,
            rejectionReason,
          );
          showSuccess("Requisition rejected successfully");
          break;
      }

      dismissToast(loadingToast);
      onRefresh();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      showError(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${action} requisition`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const itemColumns = [
    {
      key: "item",
      header: "Item",
      render: (item: any) => (
        <div>
          <p className="font-medium text-slate-900">{item.stock_item?.name}</p>
          <p className="text-xs text-slate-400">{item.stock_item?.code}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: any) => (
        <span className="font-semibold text-slate-900">
          {item.quantity} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "unit_cost",
      header: "Unit Cost",
      render: (item: any) => (
        <span className="text-sm text-slate-600">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(item.estimated_unit_cost)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (item: any) => (
        <span className="font-semibold text-slate-900">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(item.estimated_total_cost)}
        </span>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Requisition Details"
      subtitle={requisition.pr_no}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {requisition.status === "draft" && (
            <Button
              onClick={() => handleAction("submit")}
              isLoading={isProcessing}
              icon="fa-paper-plane"
            >
              Submit for Approval
            </Button>
          )}

          {requisition.status === "pending_approval" && (
            <>
              <Button
                variant="danger"
                onClick={() => setShowRejectionInput(true)}
                icon="fa-times"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleAction("approve")}
                isLoading={isProcessing}
                icon="fa-check"
              >
                Approve
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Rejection Input */}
        {showRejectionInput && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <label className="block text-sm font-semibold text-rose-700 mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-rose-200 rounded-lg text-sm"
              rows={3}
              placeholder="Enter reason for rejection..."
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectionInput(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction("reject")}
                isLoading={isProcessing}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-clipboard-list" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              {requisition.title}
            </h3>
            <p className="text-sm text-slate-500">
              Requested by {requisition.requested_by_user?.name || "N/A"} on{" "}
              {new Date(requisition.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {getStatusBadge(requisition.status)}
            <Badge
              variant={
                priorityInfo.color === "red"
                  ? "danger"
                  : priorityInfo.color === "amber"
                    ? "warning"
                    : priorityInfo.color === "blue"
                      ? "info"
                      : "neutral"
              }
            >
              {priorityInfo.label} Priority
            </Badge>
          </div>
        </div>

        {/* Description */}
        {requisition.description && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-align-left text-amber-600" />
              Description
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                {requisition.description}
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-amber-600" />
            Items ({requisition.items?.length || 0})
          </h4>

          {requisition.items?.length === 0 ? (
            <EmptyState
              icon="fa-boxes-stacked"
              title="No items"
              description="No items in this requisition"
            />
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<any>
                columns={itemColumns}
                data={requisition.items}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Total */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
          <span className="text-sm font-semibold text-amber-700">
            Total Estimated Cost
          </span>
          <span className="text-lg font-bold text-amber-800">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(requisition.total_estimated_cost || 0)}
          </span>
        </div>

        {/* Rejection Reason */}
        {requisition.rejection_reason && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <h4 className="text-sm font-bold text-rose-700 mb-2">
              Rejection Reason
            </h4>
            <p className="text-sm text-rose-600">
              {requisition.rejection_reason}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PurchaseRequisitionDetailsModal;
