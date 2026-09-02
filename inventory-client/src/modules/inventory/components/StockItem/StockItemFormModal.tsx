// src/modules/inventory/components/StockItem/StockItemFormModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "../../../../shared/components/UI";
import { StockItem, StockItemFormData } from "../../types";
import { stockItemService } from "../../services/stock-item.service";
import { STOCK_NATURES } from "../../constants";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface StockItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem?: StockItem | null;
  onSuccess: () => void;
}

const StockItemFormModal: React.FC<StockItemFormModalProps> = ({
  isOpen,
  onClose,
  stockItem,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<StockItemFormData>({
    code: "",
    name: "",
    description: "",
    nature: "solid",
    is_serialized: false,
    unit_of_measure: "pcs",
    reorder_level: 0,
    unit_cost: 0,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stockItem) {
      setFormData({
        code: stockItem.code,
        name: stockItem.name,
        description: stockItem.description || "",
        nature: stockItem.nature,
        is_serialized: stockItem.is_serialized,
        unit_of_measure: stockItem.unit_of_measure,
        reorder_level: stockItem.reorder_level,
        unit_cost: stockItem.unit_cost,
        is_active: stockItem.is_active,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        nature: "solid",
        is_serialized: false,
        unit_of_measure: "pcs",
        reorder_level: 0,
        unit_cost: 0,
        is_active: true,
      });
    }
    setErrors({});
  }, [stockItem, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.unit_of_measure.trim()) {
      newErrors.unit_of_measure = "Unit of measure is required";
    }

    if (formData.reorder_level < 0) {
      newErrors.reorder_level = "Reorder level cannot be negative";
    }

    if (formData.unit_cost < 0) {
      newErrors.unit_cost = "Unit cost cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading(
      stockItem ? "Updating stock item..." : "Creating stock item...",
    );

    try {
      if (stockItem) {
        await stockItemService.updateStockItem(stockItem.id, formData);
        dismissToast(loadingToast);
        showSuccess("Stock item updated successfully");
      } else {
        await stockItemService.createStockItem(formData);
        dismissToast(loadingToast);
        showSuccess("Stock item created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to save stock item";
      showError(message);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StockItemFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stockItem ? "Edit Stock Item" : "Create Stock Item"}
      subtitle={
        stockItem
          ? `Update details for ${stockItem.name}`
          : "Add a new stock item to inventory"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={stockItem ? "fa-save" : "fa-plus"}
          >
            {stockItem ? "Update Item" : "Create Item"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-emerald-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Item Name"
              icon="fa-box"
              placeholder="Fibre Cable"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Item Code"
              icon="fa-barcode"
              placeholder="SLD-000001"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              error={errors.code}
              hint="Leave blank to auto-generate"
            />
            <div className="md:col-span-2">
              <Input
                label="Description"
                icon="fa-align-left"
                placeholder="Brief description of the item"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-tags text-emerald-600" />
            Classification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Nature"
              options={STOCK_NATURES}
              value={formData.nature}
              onChange={(e) => handleInputChange("nature", e.target.value)}
              required
            />
            <Select
              label="Unit of Measure"
              options={[
                { value: "pcs", label: "Pieces (pcs)" },
                { value: "m", label: "Meters (m)" },
                { value: "kg", label: "Kilograms (kg)" },
                { value: "l", label: "Liters (l)" },
                { value: "roll", label: "Roll" },
                { value: "box", label: "Box" },
                { value: "set", label: "Set" },
              ]}
              value={formData.unit_of_measure}
              onChange={(e) =>
                handleInputChange("unit_of_measure", e.target.value)
              }
              error={errors.unit_of_measure}
              required
            />
          </div>
        </div>

        {/* Stock Configuration */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-gear text-emerald-600" />
            Stock Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Reorder Level"
              icon="fa-arrow-trend-down"
              type="number"
              value={formData.reorder_level}
              onChange={(e) =>
                handleInputChange(
                  "reorder_level",
                  parseInt(e.target.value) || 0,
                )
              }
              error={errors.reorder_level}
              hint="Alert when stock reaches this level"
            />
            <Input
              label="Unit Cost (NGN)"
              icon="fa-money-bill"
              type="number"
              step="0.01"
              value={formData.unit_cost}
              onChange={(e) =>
                handleInputChange("unit_cost", parseFloat(e.target.value) || 0)
              }
              error={errors.unit_cost}
            />
          </div>

          {/* Serialization Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_serialized}
                onChange={(e) =>
                  handleInputChange("is_serialized", e.target.checked)
                }
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Serialized Item
                </span>
                <p className="text-xs text-slate-400">
                  Track individual serial numbers for this item
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.is_active}
                onChange={() => handleInputChange("is_active", true)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!formData.is_active}
                onChange={() => handleInputChange("is_active", false)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Inactive</span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default StockItemFormModal;
