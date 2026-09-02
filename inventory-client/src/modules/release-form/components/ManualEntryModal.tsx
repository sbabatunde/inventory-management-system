// src/modules/release-form/components/ManualEntryModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  DataTable,
} from "../../../shared/components/UI";
import { ReleaseCategory, DestinationType } from "../types";
import { releaseFormService } from "../services/release-form.service";
import { storeService } from "../../inventory/services/store.service";
import { stockItemService } from "../../inventory/services/stock-item.service";
import { RELEASE_CATEGORIES, DESTINATION_TYPES } from "../constants";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../shared/utils/toast";

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ManualItem {
  stock_item_id: number;
  stock_item_name?: string;
  stock_item_code?: string;
  serial_no?: string;
  qty_requested: number;
  qty_released: number;
  unit_of_measure: string;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    category: "installation" as ReleaseCategory,
    store_id: "" as number | "",
    destination_type: "CPE" as DestinationType,
    destination_name: "",
    occurred_at: "",
    reference_description: "",
    notes: "",
  });
  const [items, setItems] = useState<ManualItem[]>([]);
  const [stores, setStores] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const [stockItems, setStockItems] = useState<
    Array<{
      id: number;
      name: string;
      code: string;
      unit_of_measure: string;
      is_serialized: boolean;
    }>
  >([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Item selection
  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [selectedSerialNo, setSelectedSerialNo] = useState("");
  const [selectedQtyRequested, setSelectedQtyRequested] = useState<number>(1);
  const [selectedQtyReleased, setSelectedQtyReleased] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      fetchStores();
      fetchStockItems();
      resetForm();
    }
  }, [isOpen]);

  const fetchStores = async (): Promise<void> => {
    try {
      const response = await storeService.getStores({
        per_page: 100,
        status: "active",
      });
      setStores(response.stores);
    } catch (error: any) {
      showError(error.message || "Failed to load stores");
    }
  };

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
      category: "installation",
      store_id: "",
      destination_type: "CPE",
      destination_name: "",
      occurred_at: new Date().toISOString().split("T")[0],
      reference_description: "",
      notes: "",
    });
    setItems([]);
    setAttachment(null);
    setSelectedItemId("");
    setSelectedSerialNo("");
    setSelectedQtyRequested(1);
    setSelectedQtyReleased(0);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.store_id) {
      newErrors.store_id = "Store is required";
    }

    if (!formData.occurred_at) {
      newErrors.occurred_at = "Date is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = (): void => {
    if (!selectedItemId || selectedQtyRequested <= 0) {
      showError("Please select an item and enter valid quantities");
      return;
    }

    const stockItem = stockItems.find((item) => item.id === selectedItemId);

    if (!stockItem) {
      showError("Stock item not found");
      return;
    }

    if (stockItem.is_serialized && !selectedSerialNo.trim()) {
      showError("Serial number is required for serialized items");
      return;
    }

    const newItem: ManualItem = {
      stock_item_id: stockItem.id,
      stock_item_name: stockItem.name,
      stock_item_code: stockItem.code,
      serial_no: stockItem.is_serialized ? selectedSerialNo : undefined,
      qty_requested: selectedQtyRequested,
      qty_released: selectedQtyReleased,
      unit_of_measure: stockItem.unit_of_measure,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId("");
    setSelectedSerialNo("");
    setSelectedQtyRequested(1);
    setSelectedQtyReleased(0);
  };

  const handleRemoveItem = (index: number): void => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading("Creating manual entry...");

    try {
      const submitData = {
        category: formData.category,
        store_id: formData.store_id,
        destination_type: formData.destination_type,
        destination_name: formData.destination_name,
        occurred_at: formData.occurred_at,
        reference_description: formData.reference_description,
        notes: formData.notes,
        items: items.map((item) => ({
          stock_item_id: item.stock_item_id,
          serial_no: item.serial_no,
          qty_requested: item.qty_requested,
          qty_released: item.qty_released,
          unit_of_measure: item.unit_of_measure,
        })),
        attachment: attachment || undefined,
      };

      await releaseFormService.createManualForm(submitData as any);

      dismissToast(loadingToast);
      showSuccess("Manual release form created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to create manual entry";
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
      render: (item: ManualItem) => (
        <div>
          <p className="font-medium text-slate-900">{item.stock_item_name}</p>
          <p className="text-xs text-slate-400">{item.stock_item_code}</p>
          {item.serial_no && (
            <p className="text-xs text-slate-500 font-mono">
              SN: {item.serial_no}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "requested",
      header: "Requested",
      render: (item: ManualItem) => (
        <span className="text-sm text-slate-600">
          {item.qty_requested} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "released",
      header: "Released",
      render: (item: ManualItem) => (
        <span className="font-semibold text-emerald-600">
          {item.qty_released} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: ManualItem, index?: number) => (
        <button
          onClick={() => handleRemoveItem(index!)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
        >
          <i className="fas fa-trash text-xs" />
        </button>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Entry"
      subtitle="Upload a manually signed release form"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon="fa-upload"
          >
            Create Manual Entry
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <i className="fas fa-triangle-exclamation text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Manual Entry</p>
            <p className="text-xs text-amber-600 mt-1">
              This form will be marked as pending reconciliation. You'll need to
              verify and reconcile it later.
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-purple-600" />
            Form Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Category"
              options={RELEASE_CATEGORIES}
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ReleaseCategory,
                })
              }
              required
            />
            <Select
              label="Store"
              options={stores.map((store) => ({
                value: store.id,
                label: `${store.name} (${store.code})`,
              }))}
              value={formData.store_id}
              onChange={(e) =>
                setFormData({ ...formData, store_id: Number(e.target.value) })
              }
              error={errors.store_id}
              placeholder="Select store"
              required
            />
            <Input
              label="Date on Form"
              icon="fa-calendar"
              type="date"
              value={formData.occurred_at}
              onChange={(e) =>
                setFormData({ ...formData, occurred_at: e.target.value })
              }
              error={errors.occurred_at}
              required
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-location-dot text-purple-600" />
            Destination
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Destination Type"
              options={DESTINATION_TYPES}
              value={formData.destination_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destination_type: e.target.value as DestinationType,
                })
              }
              required
            />
            <Input
              label="Destination Name"
              icon="fa-building"
              placeholder="Client name or location"
              value={formData.destination_name}
              onChange={(e) =>
                setFormData({ ...formData, destination_name: e.target.value })
              }
            />
            <Input
              label="Reference Description"
              icon="fa-align-left"
              placeholder="Purpose of release"
              value={formData.reference_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reference_description: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-purple-600" />
            Items
          </h3>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
                  placeholder="Serial No"
                  value={selectedSerialNo}
                  onChange={(e) => setSelectedSerialNo(e.target.value)}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Requested"
                  value={selectedQtyRequested}
                  onChange={(e) =>
                    setSelectedQtyRequested(parseInt(e.target.value) || 1)
                  }
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Released"
                  value={selectedQtyReleased}
                  onChange={(e) =>
                    setSelectedQtyReleased(parseInt(e.target.value) || 0)
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
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<ManualItem>
                columns={itemColumns}
                data={items.map((item, index) => ({ ...item, id: index }))}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Attachment */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-paperclip text-purple-600" />
            Attachment
          </h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {attachment ? (
                  <>
                    <i className="fas fa-file-pdf text-2xl text-purple-600 mb-2" />
                    <p className="text-sm text-slate-600 font-medium">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt text-2xl text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-purple-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-slate-400">
                      PDF, JPG, or PNG (max 10MB)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-align-left text-purple-600" />
            Notes
          </h3>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default ManualEntryModal;
