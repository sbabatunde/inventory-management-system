// src/modules/release-form/components/ReleaseFormDetailsModal.tsx

import React, { useState } from "react";
import {
  Modal,
  Badge,
  Button,
  DataTable,
  EmptyState,
} from "../../../shared/components/UI";
import { ReleaseForm, ReleaseStatus } from "../types";
import { RELEASE_STATUS_MAP, RELEASE_CATEGORY_MAP } from "../constants";
import { releaseFormService } from "../services/release-form.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../shared/utils/toast";

interface ReleaseFormDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: ReleaseForm | null;
  onRefresh: () => void;
}

const ReleaseFormDetailsModal: React.FC<ReleaseFormDetailsModalProps> = ({
  isOpen,
  onClose,
  form,
  onRefresh,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  if (!form) return null;

  const statusInfo = RELEASE_STATUS_MAP[form.status];
  const categoryInfo = RELEASE_CATEGORY_MAP[form.category];

  const getStatusBadge = (status: ReleaseStatus) => {
    const info = RELEASE_STATUS_MAP[status];
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

  const handleAction = async (action: string, data?: any): Promise<void> => {
    setIsProcessing(true);
    const loadingToast = showLoading(`Processing ${action}...`);

    try {
      switch (action) {
        case "submit":
          await releaseFormService.submitForApproval(form.id);
          showSuccess("Form submitted for approval");
          break;
        case "approve":
          await releaseFormService.approveForm(form.id, data?.notes);
          showSuccess("Form approved successfully");
          break;
        case "dispatch":
          await releaseFormService.dispatchForm(form.id);
          showSuccess("Form dispatched successfully");
          break;
        case "complete":
          await releaseFormService.completeForm(form.id);
          showSuccess("Form completed successfully");
          break;
        case "reject":
          if (!rejectionReason.trim()) {
            throw new Error("Rejection reason is required");
          }
          await releaseFormService.rejectForm(form.id, rejectionReason);
          showSuccess("Form rejected successfully");
          break;
        case "reconcile":
          await releaseFormService.reconcileForm(form.id);
          showSuccess("Form reconciled successfully");
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
          `Failed to ${action} form`,
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
          {item.serial_no && (
            <p className="text-xs text-slate-500 font-mono">
              SN: {item.serial_no}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "qty_before",
      header: "Qty Before",
      render: (item: any) => (
        <span className="text-sm text-slate-600">
          {item.qty_before ?? "N/A"}
        </span>
      ),
    },
    {
      key: "qty_requested",
      header: "Requested",
      render: (item: any) => (
        <span className="font-semibold text-slate-900">
          {item.qty_requested} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "qty_released",
      header: "Released",
      render: (item: any) => (
        <span className="font-semibold text-emerald-600">
          {item.qty_released} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "qty_after",
      header: "Qty After",
      render: (item: any) => (
        <span className="text-sm text-slate-600">
          {item.qty_after ?? "N/A"}
        </span>
      ),
    },
  ];

  const signatoryColumns = [
    {
      key: "name",
      header: "Name",
      render: (signatory: any) => (
        <div>
          <p className="font-medium text-slate-900">{signatory.name}</p>
          <p className="text-xs text-slate-400">
            {signatory.user?.email || signatory.crm_user_id}
          </p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (signatory: any) => (
        <Badge variant="info" size="sm">
          {signatory.role.charAt(0).toUpperCase() + signatory.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (signatory: any) =>
        signatory.signed_at ? (
          <Badge variant="success" size="sm">
            Signed
          </Badge>
        ) : (
          <Badge variant="warning" size="sm">
            Pending
          </Badge>
        ),
    },
    {
      key: "signed_at",
      header: "Signed At",
      render: (signatory: any) => (
        <span className="text-sm text-slate-600">
          {signatory.signed_at
            ? new Date(signatory.signed_at).toLocaleString()
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Release Form Details"
      subtitle={form.form_no}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {form.status === "draft" && (
            <Button
              onClick={() => handleAction("submit")}
              isLoading={isProcessing}
              icon="fa-paper-plane"
            >
              Submit for Approval
            </Button>
          )}

          {form.status === "pending_approval" && (
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

          {form.status === "approved" && (
            <Button
              onClick={() => handleAction("dispatch")}
              isLoading={isProcessing}
              icon="fa-truck"
            >
              Dispatch
            </Button>
          )}

          {form.status === "dispatched" && (
            <Button
              onClick={() => handleAction("complete")}
              isLoading={isProcessing}
              icon="fa-flag-checkered"
            >
              Complete
            </Button>
          )}

          {form.status === "pending_reconciliation" && (
            <Button
              onClick={() => handleAction("reconcile")}
              isLoading={isProcessing}
              icon="fa-check-double"
            >
              Reconcile
            </Button>
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-file-signature" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{form.form_no}</h3>
            <p className="text-sm text-slate-500">
              Created by {form.created_by_user?.name || "N/A"} on{" "}
              {new Date(form.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {getStatusBadge(form.status)}
            <Badge
              variant={
                categoryInfo.color === "blue"
                  ? "info"
                  : categoryInfo.color === "amber"
                    ? "warning"
                    : "purple"
              }
            >
              {categoryInfo.label}
            </Badge>
          </div>
        </div>

        {/* Form Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Store
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {form.store?.name} ({form.store?.code})
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Destination
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {form.destination_type} - {form.destination_name || "N/A"}
            </p>
          </div>
          {form.reference_id && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {form.reference_type === "job_order" ? "Job Order" : "Ticket"}{" "}
                Number
              </label>
              <p className="text-sm text-slate-900 font-medium">
                {form.reference_id}
              </p>
            </div>
          )}
          {form.is_manual_entry && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <label className="block text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
                Manual Entry
              </label>
              <p className="text-sm text-amber-700 font-medium">
                Recorded on:{" "}
                {form.recorded_at
                  ? new Date(form.recorded_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-purple-600" />
            Items ({form.items?.length || 0})
          </h4>

          {form.items?.length === 0 ? (
            <EmptyState
              icon="fa-boxes-stacked"
              title="No items"
              description="No items in this release form"
            />
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<any>
                columns={itemColumns}
                data={form.items}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Signatories */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-signature text-purple-600" />
            Signatories ({form.signatories?.length || 0})
          </h4>

          {form.signatories?.length === 0 ? (
            <EmptyState
              icon="fa-signature"
              title="No signatories"
              description="No signatories added to this form"
            />
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<any>
                columns={signatoryColumns}
                data={form.signatories}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        {form.notes && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-align-left text-purple-600" />
              Notes
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                {form.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReleaseFormDetailsModal;
