// src/modules/procurement/components/Requisition/PurchaseRequisitionFormModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  DataTable,
} from "../../../../shared/components/UI";
import { PurchaseRequisition, RequisitionPriority } from "../../types";
import { purchaseRequisitionService } from "../../services/purchase-requisition.service";
import { stockItemService } from "../../../inventory/services/stock-item.service";
import { REQUISITION_PRIORITIES } from "../../constants";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface PurchaseRequisitionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisition?: PurchaseRequisition | null;
  onSuccess: () => void;
}

interface FormItem {
  stock_item_id: number;
  stock_item_name?: string;
  stock_item_code?: string;
  quantity: number;
  unit_of_measure: string;
  estimated_unit_cost: number;
  estimated_total_cost: number;
}

const PurchaseRequisitionFormModal: React.FC<
  PurchaseRequisitionFormModalProps
> = ({ isOpen, onClose, requisition, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as RequisitionPriority,
    notes: "",
  });
  const [items, setItems] = useState<FormItem[]>([]);
  const [stockItems, setStockItems] = useState<
    Array<{ id: number; name: string; code: string; unit_of_measure: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Item selection
  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedUnitCost, setSelectedUnitCost] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      fetchStockItems();
      if (requisition) {
        setFormData({
          title: requisition.title,
          description: requisition.description || "",
          priority: requisition.priority,
          notes: requisition.notes || "",
        });
        setItems(
          requisition.items.map((item) => ({
            stock_item_id: item.stock_item_id,
            stock_item_name: item.stock_item?.name,
            stock_item_code: item.stock_item?.code,
            quantity: item.quantity,
            unit_of_measure: item.unit_of_measure,
            estimated_unit_cost: item.estimated_unit_cost,
            estimated_total_cost: item.estimated_total_cost,
          })),
        );
      } else {
        resetForm();
      }
    }
    setErrors({});
  }, [isOpen, requisition]);

  const fetchStockItems = async (): Promise<void> => {
    try {
      const response = await stockItemService.getStockItems({
        per_page: 100,
        status: "active",
      });
      setStockItems(response.stockItems);
    } catch (error: any) {
      showError(error.message || "Failed to load stock items");
    }
  };

  const resetForm = (): void => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      notes: "",
    });
    setItems([]);
    setSelectedItemId("");
    setSelectedQuantity(1);
    setSelectedUnitCost(0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = (): void => {
    if (!selectedItemId || selectedQuantity <= 0) {
      showError("Please select an item and enter a valid quantity");
      return;
    }

    const existingItem = items.find(
      (item) => item.stock_item_id === selectedItemId,
    );

    if (existingItem) {
      showError("Item already added to requisition");
      return;
    }

    const stockItem = stockItems.find((item) => item.id === selectedItemId);

    if (!stockItem) {
      showError("Stock item not found");
      return;
    }

    const newItem: FormItem = {
      stock_item_id: stockItem.id,
      stock_item_name: stockItem.name,
      stock_item_code: stockItem.code,
      quantity: selectedQuantity,
      unit_of_measure: stockItem.unit_of_measure,
      estimated_unit_cost: selectedUnitCost,
      estimated_total_cost: selectedQuantity * selectedUnitCost,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId("");
    setSelectedQuantity(1);
    setSelectedUnitCost(0);
  };

  const handleRemoveItem = (index: number): void => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading(
      requisition ? "Updating requisition..." : "Creating requisition...",
    );

    try {
      const submitData = {
        ...formData,
        items: items.map((item) => ({
          stock_item_id: item.stock_item_id,
          quantity: item.quantity,
          unit_of_measure: item.unit_of_measure,
          estimated_unit_cost: item.estimated_unit_cost,
        })),
      };

      if (requisition) {
        await purchaseRequisitionService.updateRequisition(
          requisition.id,
          submitData,
        );
        dismissToast(loadingToast);
        showSuccess("Requisition updated successfully");
      } else {
        await purchaseRequisitionService.createRequisition(submitData);
        dismissToast(loadingToast);
        showSuccess("Requisition created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to save requisition";
      showError(message);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemColumns = [
    {
      key: "item",
      header: "Item",
      render: (item: FormItem) => (
        <div>
          <p className="font-medium text-slate-900">{item.stock_item_name}</p>
          <p className="text-xs text-slate-400">{item.stock_item_code}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: FormItem) => (
        <span className="font-semibold text-slate-900">
          {item.quantity} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "unit_cost",
      header: "Unit Cost",
      render: (item: FormItem) => (
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
      render: (item: FormItem) => (
        <span className="font-semibold text-slate-900">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(item.estimated_total_cost)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: FormItem, index?: number) => (
        <button
          onClick={() => handleRemoveItem(index!)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
        >
          <i className="fas fa-trash text-xs" />
        </button>
      ),
    },
  ];

  const totalEstimatedCost = items.reduce(
    (sum, item) => sum + item.estimated_total_cost,
    0,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={requisition ? "Edit Requisition" : "Create Requisition"}
      subtitle={
        requisition
          ? `Update requisition ${requisition.pr_no}`
          : "Create a new purchase requisition"
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
            icon={requisition ? "fa-save" : "fa-plus"}
          >
            {requisition ? "Update Requisition" : "Create Requisition"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-amber-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              icon="fa-heading"
              placeholder="Requisition title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              required
            />
            <Select
              label="Priority"
              options={REQUISITION_PRIORITIES}
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as RequisitionPriority,
                })
              }
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Description"
                icon="fa-align-left"
                placeholder="Brief description of what's needed"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-amber-600" />
            Items
          </h3>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1">
                <Select
                  options={stockItems.map((item) => ({
                    value: item.id,
                    label: `${item.name} (${item.code})`,
                  }))}
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(Number(e.target.value))}
                  placeholder="Select item"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={selectedQuantity}
                  onChange={(e) =>
                    setSelectedQuantity(parseInt(e.target.value) || 1)
                  }
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Unit Cost"
                  value={selectedUnitCost}
                  onChange={(e) =>
                    setSelectedUnitCost(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="md:col-span-1">
                <Button onClick={handleAddItem} icon="fa-plus" fullWidth>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {errors.items && (
            <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
              <i className="fas fa-circle-exclamation text-[10px]" />
              {errors.items}
            </p>
          )}

          {items.length > 0 && (
            <>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <DataTable<FormItem>
                  columns={itemColumns}
                  data={items.map((item, index) => ({ ...item, id: index }))}
                  showSerialNumbers={false}
                />
              </div>

              {/* Total */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                <span className="text-sm font-semibold text-amber-700">
                  Total Estimated Cost
                </span>
                <span className="text-lg font-bold text-amber-800">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(totalEstimatedCost)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-align-left text-amber-600" />
            Additional Notes
          </h3>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseRequisitionFormModal;
