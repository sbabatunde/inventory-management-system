// src/modules/assets/components/AssetDetailsModal.tsx

import React, { useState } from "react";
import { Modal, Badge, Button } from "../../../shared/components/UI";
import { Asset } from "../types";
import { ASSET_TYPE_MAP, ASSET_STATUS_MAP } from "../constants";
import { assetService } from "../services/asset.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../shared/utils/toast";

interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onEdit: (asset: Asset) => void;
}

const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  isOpen,
  onClose,
  asset,
  onEdit,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!asset) return null;

  const typeInfo = ASSET_TYPE_MAP[asset.type];
  const statusInfo = ASSET_STATUS_MAP[asset.status];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleCalculateDepreciation = async (): Promise<void> => {
    setIsProcessing(true);
    const loadingToast = showLoading("Calculating depreciation...");

    try {
      const result = await assetService.calculateDepreciation(asset.id);
      dismissToast(loadingToast);
      showSuccess(`Current value: ${formatCurrency(result.current_value)}`);
    } catch (error: any) {
      dismissToast(loadingToast);
      showError(error.message || "Failed to calculate depreciation");
    } finally {
      setIsProcessing(false);
    }
  };

  const DetailItem: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <p className="text-sm text-slate-900 font-medium">{value || "N/A"}</p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asset Details"
      subtitle={`Viewing information for ${asset.name}`}
      size="xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleCalculateDepreciation}
            isLoading={isProcessing}
          >
            Calculate Depreciation
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button icon="fa-edit" onClick={() => onEdit(asset)}>
            Edit Asset
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-microchip" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{asset.name}</h3>
            <p className="text-sm text-slate-500">{asset.asset_code}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge
              variant={
                statusInfo.color === "green"
                  ? "success"
                  : statusInfo.color === "blue"
                    ? "info"
                    : statusInfo.color === "purple"
                      ? "purple"
                      : statusInfo.color === "amber"
                        ? "warning"
                        : "danger"
              }
            >
              {statusInfo.label}
            </Badge>
            <Badge variant="neutral">{typeInfo.label}</Badge>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle text-teal-600" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem
              label="Serial Number"
              value={asset.serial_no || "N/A"}
            />
            <DetailItem label="Type" value={typeInfo.label} />
            <DetailItem label="Status" value={statusInfo.label} />
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-location-dot text-teal-600" />
            Location
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Current Store"
              value={
                asset.current_store
                  ? `${asset.current_store.name} (${asset.current_store.code})`
                  : "N/A"
              }
            />
            <DetailItem
              label="Assigned To"
              value={
                asset.assigned_to_user ? asset.assigned_to_user.name : "N/A"
              }
            />
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-money-bill text-teal-600" />
            Financial Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem
              label="Purchase Cost"
              value={formatCurrency(asset.purchase_cost)}
            />
            <DetailItem
              label="Current Value"
              value={formatCurrency(asset.current_value)}
            />
            <DetailItem
              label="Salvage Value"
              value={formatCurrency(asset.salvage_value)}
            />
          </div>
        </div>

        {/* Depreciation */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-chart-line text-teal-600" />
            Depreciation Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem
              label="Useful Life"
              value={`${asset.useful_life_months} months`}
            />
            <DetailItem
              label="Method"
              value={asset.depreciation_method
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            />
            <DetailItem
              label="Purchase Date"
              value={
                asset.purchase_date
                  ? new Date(asset.purchase_date).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* Timestamps */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-clock text-teal-600" />
            Timestamps
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Created At"
              value={new Date(asset.created_at).toLocaleString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(asset.updated_at).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssetDetailsModal;
