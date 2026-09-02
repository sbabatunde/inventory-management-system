// src/modules/assets/components/AssetFormModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "../../../shared/components/UI";
import { Asset, AssetType, AssetStatus, DepreciationMethod } from "../types";
import { assetService } from "../services/asset.service";
import { storeService } from "../../inventory/services/store.service";
import { stockItemService } from "../../inventory/services/stock-item.service";
import {
  ASSET_TYPES,
  ASSET_STATUSES,
  DEPRECIATION_METHODS,
} from "../constants";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../shared/utils/toast";

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset | null;
  onSuccess: () => void;
}

const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  asset,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    asset_code: "",
    description: "",
    type: "other" as AssetType,
    stock_item_id: "" as number | "",
    serial_no: "",
    status: "in_stock" as AssetStatus,
    current_store_id: "" as number | "",
    purchase_cost: 0,
    purchase_date: "",
    salvage_value: 0,
    useful_life_months: 36,
    depreciation_method: "straight_line" as DepreciationMethod,
    is_active: true,
  });
  const [stores, setStores] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const [stockItems, setStockItems] = useState<
    Array<{ id: number; name: string; code: string; is_serialized: boolean }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchStores();
      fetchStockItems();
      if (asset) {
        setFormData({
          name: asset.name,
          asset_code: asset.asset_code,
          description: asset.description || "",
          type: asset.type,
          stock_item_id: asset.stock_item_id || "",
          serial_no: asset.serial_no || "",
          status: asset.status,
          current_store_id: asset.current_store_id || "",
          purchase_cost: asset.purchase_cost,
          purchase_date: asset.purchase_date || "",
          salvage_value: asset.salvage_value,
          useful_life_months: asset.useful_life_months,
          depreciation_method: asset.depreciation_method,
          is_active: asset.is_active,
        });
      } else {
        resetForm();
      }
    }
    setErrors({});
  }, [isOpen, asset]);

  const fetchStores = async (): Promise<void> => {
    try {
      const response = await storeService.getStores({ per_page: 100 });
      setStores(response.stores);
    } catch (error: any) {
      showError(error.message || "Failed to load stores");
    }
  };

  const fetchStockItems = async (): Promise<void> => {
    try {
      const response = await stockItemService.getStockItems({ per_page: 100 });
      setStockItems(response.stockItems);
    } catch (error: any) {
      showError(error.message || "Failed to load stock items");
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      asset_code: "",
      description: "",
      type: "other",
      stock_item_id: "",
      serial_no: "",
      status: "in_stock",
      current_store_id: "",
      purchase_cost: 0,
      purchase_date: "",
      salvage_value: 0,
      useful_life_months: 36,
      depreciation_method: "straight_line",
      is_active: true,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Asset name is required";
    }

    if (formData.purchase_cost < 0) {
      newErrors.purchase_cost = "Purchase cost cannot be negative";
    }

    if (formData.useful_life_months < 1) {
      newErrors.useful_life_months = "Useful life must be at least 1 month";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading(
      asset ? "Updating asset..." : "Creating asset...",
    );

    const submitData = {
      ...formData,
      stock_item_id: formData.stock_item_id || null,
      current_store_id: formData.current_store_id || null,
    };

    try {
      if (asset) {
        await assetService.updateAsset(asset.id, submitData);
        dismissToast(loadingToast);
        showSuccess("Asset updated successfully");
      } else {
        await assetService.createAsset(submitData);
        dismissToast(loadingToast);
        showSuccess("Asset created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message = error.response?.data?.message || "Failed to save asset";
      showError(message);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={asset ? "Edit Asset" : "Create Asset"}
      subtitle={
        asset
          ? `Update details for ${asset.name}`
          : "Add a new asset to the system"
      }
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={asset ? "fa-save" : "fa-plus"}
          >
            {asset ? "Update Asset" : "Create Asset"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-teal-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Asset Name"
              icon="fa-microchip"
              placeholder="Cisco Router"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              required
            />
            <Input
              label="Asset Code"
              icon="fa-barcode"
              placeholder="AST-POP-000001"
              value={formData.asset_code}
              onChange={(e) =>
                setFormData({ ...formData, asset_code: e.target.value })
              }
              hint="Leave blank to auto-generate"
            />
            <div className="md:col-span-2">
              <Input
                label="Description"
                icon="fa-align-left"
                placeholder="Brief description of the asset"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-tags text-teal-600" />
            Classification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Asset Type"
              options={ASSET_TYPES}
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as AssetType })
              }
              required
            />
            <Select
              label="Status"
              options={ASSET_STATUSES}
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as AssetStatus,
                })
              }
              required
            />
            <Select
              label="Link to Stock Item"
              options={stockItems.map((item) => ({
                value: item.id,
                label: `${item.name} (${item.code})`,
              }))}
              value={formData.stock_item_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_item_id: Number(e.target.value),
                })
              }
              placeholder="Select stock item"
            />
          </div>
        </div>

        {/* Identification */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-fingerprint text-teal-600" />
            Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Serial Number"
              icon="fa-hashtag"
              placeholder="SN123456789"
              value={formData.serial_no}
              onChange={(e) =>
                setFormData({ ...formData, serial_no: e.target.value })
              }
            />
            <Select
              label="Current Store"
              options={stores.map((store) => ({
                value: store.id,
                label: `${store.name} (${store.code})`,
              }))}
              value={formData.current_store_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_store_id: Number(e.target.value),
                })
              }
              placeholder="Select store"
            />
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-money-bill text-teal-600" />
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Purchase Cost (NGN)"
              icon="fa-money-bill"
              type="number"
              step="0.01"
              value={formData.purchase_cost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchase_cost: parseFloat(e.target.value) || 0,
                })
              }
              error={errors.purchase_cost}
            />
            <Input
              label="Purchase Date"
              icon="fa-calendar"
              type="date"
              value={formData.purchase_date}
              onChange={(e) =>
                setFormData({ ...formData, purchase_date: e.target.value })
              }
            />
            <Input
              label="Salvage Value (NGN)"
              icon="fa-recycle"
              type="number"
              step="0.01"
              value={formData.salvage_value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salvage_value: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        {/* Depreciation */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-line text-teal-600" />
            Depreciation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Useful Life (Months)"
              icon="fa-clock"
              type="number"
              value={formData.useful_life_months}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  useful_life_months: parseInt(e.target.value) || 36,
                })
              }
              error={errors.useful_life_months}
            />
            <Select
              label="Depreciation Method"
              options={DEPRECIATION_METHODS}
              value={formData.depreciation_method}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  depreciation_method: e.target.value as DepreciationMethod,
                })
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssetFormModal;
