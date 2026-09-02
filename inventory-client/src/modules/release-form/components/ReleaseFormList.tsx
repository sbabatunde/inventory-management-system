// src/modules/release-form/components/ReleaseFormList.tsx

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
import { ReleaseForm, ReleaseCategory, ReleaseStatus } from "../types";
import { useReleaseForms } from "../hooks/useReleaseForms";
import { releaseFormService } from "../services/release-form.service";
import {
  RELEASE_CATEGORIES,
  RELEASE_CATEGORY_MAP,
  RELEASE_STATUSES,
  RELEASE_STATUS_MAP,
} from "../constants";
import { showSuccess, showError } from "../../../shared/utils/toast";
import ReleaseFormCreateModal from "./ReleaseFormCreateModal";
import ReleaseFormDetailsModal from "./ReleaseFormDetailsModal";
import ManualEntryModal from "./ManualEntryModal";

const ReleaseFormList: React.FC = () => {
  const {
    forms,
    pagination,
    summary,
    isLoading,
    handlePageChange,
    handleSearch,
    handleCategoryFilter,
    handleStatusFilter,
    refreshForms,
  } = useReleaseForms();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManualEntryModalOpen, setIsManualEntryModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ReleaseForm | null>(null);
  const [formToCancel, setFormToCancel] = useState<ReleaseForm | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewForm = (form: ReleaseForm): void => {
    setSelectedForm(form);
    setIsDetailsModalOpen(true);
  };

  const handleCancelForm = async (): Promise<void> => {
    if (!formToCancel) return;

    setIsProcessing(true);
    try {
      await releaseFormService.cancelForm(formToCancel.id);
      showSuccess("Release form cancelled successfully");
      setFormToCancel(null);
      refreshForms();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to cancel form");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: ReleaseStatus) => {
    const statusInfo = RELEASE_STATUS_MAP[status];
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

  const getCategoryBadge = (category: ReleaseCategory) => {
    const categoryInfo = RELEASE_CATEGORY_MAP[category];
    const variant =
      categoryInfo.color === "blue"
        ? "info"
        : categoryInfo.color === "amber"
          ? "warning"
          : "purple";
    return <Badge variant={variant}>{categoryInfo.label}</Badge>;
  };

  const columns = [
    {
      key: "form_no",
      header: "Form No",
      render: (form: ReleaseForm) => (
        <div>
          <p className="font-medium text-slate-900">{form.form_no}</p>
          <p className="text-xs text-slate-400">
            {new Date(form.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (form: ReleaseForm) => getCategoryBadge(form.category),
    },
    {
      key: "reference",
      header: "Reference",
      render: (form: ReleaseForm) => (
        <div>
          {form.reference_id ? (
            <>
              <p className="text-sm font-medium text-slate-900">
                {form.reference_id}
              </p>
              <p className="text-xs text-slate-400">{form.reference_type}</p>
            </>
          ) : (
            <span className="text-sm text-slate-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "destination",
      header: "Destination",
      render: (form: ReleaseForm) => (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {form.destination_type}
          </p>
          <p className="text-xs text-slate-400">
            {form.destination_name || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (form: ReleaseForm) => (
        <span className="font-semibold text-slate-900">
          {form.items?.length || 0} items
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (form: ReleaseForm) => getStatusBadge(form.status),
    },
    {
      key: "manual",
      header: "Entry",
      render: (form: ReleaseForm) =>
        form.is_manual_entry ? (
          <Badge variant="warning" size="sm">
            Manual
          </Badge>
        ) : (
          <Badge variant="neutral" size="sm">
            System
          </Badge>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (form: ReleaseForm) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewForm(form)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          {["draft", "pending_approval", "approved"].includes(form.status) && (
            <button
              onClick={() => setFormToCancel(form)}
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
        title="Release Forms"
        icon="fa-file-signature"
        breadcrumbs={[{ label: "Release Forms" }, { label: "All Forms" }]}
        actions={
          <>
            <Button
              variant="outline"
              icon="fa-upload"
              onClick={() => setIsManualEntryModalOpen(true)}
            >
              Manual Entry
            </Button>
            <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
              New Release Form
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Forms"
            value={summary.total_forms}
            icon="fa-file-signature"
            color="blue"
          />
          <StatCard
            label="Pending Approval"
            value={summary.pending_approval}
            icon="fa-clock"
            color="amber"
          />
          <StatCard
            label="Approved"
            value={summary.approved}
            icon="fa-check-circle"
            color="green"
          />
          <StatCard
            label="Completed"
            value={summary.completed}
            icon="fa-flag-checkered"
            color="purple"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search forms..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Categories"
            options={RELEASE_CATEGORIES}
            onChange={(e) =>
              handleCategoryFilter(e.target.value as ReleaseCategory)
            }
            wrapperClassName="w-40"
          />
          <Select
            placeholder="All Statuses"
            options={RELEASE_STATUSES}
            onChange={(e) =>
              handleStatusFilter(e.target.value as ReleaseStatus)
            }
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {forms.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-file-signature"
            title="No release forms found"
            description="Create a release form to start managing equipment releases"
            actionLabel="New Release Form"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<ReleaseForm>
            columns={columns}
            data={forms}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <ReleaseFormCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshForms();
        }}
      />

      <ManualEntryModal
        isOpen={isManualEntryModalOpen}
        onClose={() => setIsManualEntryModalOpen(false)}
        onSuccess={() => {
          setIsManualEntryModalOpen(false);
          refreshForms();
        }}
      />

      <ReleaseFormDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        form={selectedForm}
        onRefresh={refreshForms}
      />

      <ConfirmDialog
        isOpen={!!formToCancel}
        onClose={() => setFormToCancel(null)}
        onConfirm={handleCancelForm}
        title="Cancel Release Form"
        message={`Are you sure you want to cancel form ${formToCancel?.form_no}?`}
        confirmLabel="Cancel Form"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default ReleaseFormList;
