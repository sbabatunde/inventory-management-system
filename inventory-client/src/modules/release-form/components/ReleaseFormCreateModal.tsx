// src/modules/release-form/components/ReleaseFormCreateModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  DataTable,
  Badge,
} from "../../../shared/components/UI";
import {
  ReleaseForm,
  ReleaseCategory,
  DestinationType,
  ReleaseFormItem,
} from "../types";
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

interface ReleaseFormCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormItem {
  stock_item_id: number;
  stock_item_name?: string;
  stock_item_code?: string;
  serial_no?: string;
  qty_requested: number;
  unit_of_measure: string;
  available_quantity?: number;
  notes?: string;
}

const ReleaseFormCreateModal: React.FC<ReleaseFormCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    category: "installation" as ReleaseCategory,
    reference_id: "",
    reference_description: "",
    store_id: "" as number | "",
    destination_type: "CPE" as DestinationType,
    destination_name: "",
    destination_address: "",
    notes: "",
  });
  const [items, setItems] = useState<FormItem[]>([]);
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
      total_stock?: number;
    }>
  >([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Item selection state
  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [selectedSerialNo, setSelectedSerialNo] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      fetchStores();
      fetchStockItems();
      resetForm();
    }
  }, [isOpen]);

  const fetchStores = async (): Promise<void> => {
    setIsLoadingStores(true);
    try {
      const response = await storeService.getStores({
        per_page: 100,
        status: "active",
      });
      setStores(response.stores);
    } catch (error: any) {
      showError(error.message || "Failed to load stores");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const fetchStockItems = async (): Promise<void> => {
    setIsLoadingItems(true);
    try {
      const response = await stockItemService.getStockItems({
        per_page: 100,
        status: "active",
      });
      setStockItems(response.stockItems);
    } catch (error: any) {
      showError(error.message || "Failed to load stock items");
    } finally {
      setIsLoadingItems(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      category: "installation",
      reference_id: "",
      reference_description: "",
      store_id: "",
      destination_type: "CPE",
      destination_name: "",
      destination_address: "",
      notes: "",
    });
    setItems([]);
    setSelectedItemId("");
    setSelectedSerialNo("");
    setSelectedQuantity(1);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.store_id) {
      newErrors.store_id = "Store is required";
    }

    if (formData.category !== "others" && !formData.reference_id.trim()) {
      newErrors.reference_id =
        formData.category === "installation"
          ? "Job Order number is required"
          : "Ticket number is required";
    }

    if (
      formData.category === "others" &&
      !formData.reference_description.trim()
    ) {
      newErrors.reference_description =
        "Reference description is required for other releases";
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

    if (existingItem && !existingItem.serial_no) {
      showError("Item already added to form");
      return;
    }

    const stockItem = stockItems.find((item) => item.id === selectedItemId);

    if (!stockItem) {
      showError("Stock item not found");
      return;
    }

    // Validate serial number for serialized items
    if (stockItem.is_serialized && !selectedSerialNo.trim()) {
      showError("Serial number is required for serialized items");
      return;
    }

    const newItem: FormItem = {
      stock_item_id: stockItem.id,
      stock_item_name: stockItem.name,
      stock_item_code: stockItem.code,
      serial_no: stockItem.is_serialized ? selectedSerialNo : undefined,
      qty_requested: selectedQuantity,
      unit_of_measure: stockItem.unit_of_measure,
      available_quantity: stockItem.total_stock || 0,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId("");
    setSelectedSerialNo("");
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (index: number): void => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading("Creating release form...");

    try {
      const submitData = {
        category: formData.category,
        reference_type:
          formData.category === "installation"
            ? "job_order"
            : formData.category === "maintenance"
              ? "ticket"
              : null,
        reference_id: formData.reference_id || null,
        reference_description: formData.reference_description || null,
        store_id: formData.store_id,
        destination_type: formData.destination_type,
        destination_name: formData.destination_name,
        destination_address: formData.destination_address,
        notes: formData.notes,
        items: items.map((item) => ({
          stock_item_id: item.stock_item_id,
          serial_no: item.serial_no,
          qty_requested: item.qty_requested,
          unit_of_measure: item.unit_of_measure,
          notes: item.notes,
        })),
      };

      await releaseFormService.createForm(submitData);

      dismissToast(loadingToast);
      showSuccess("Release form created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to create release form";
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
          {item.serial_no && (
            <p className="text-xs text-slate-500 font-mono">
              SN: {item.serial_no}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "available",
      header: "Available",
      render: (item: FormItem) => (
        <span className="text-sm text-slate-600">
          {item.available_quantity ?? 0} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: FormItem) => (
        <span className="font-semibold text-slate-900">
          {item.qty_requested} {item.unit_of_measure}
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Release Form"
      subtitle="Create a new equipment release form"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon="fa-paper-plane"
          >
            Create Form
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category and Reference */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-tag text-purple-600" />
            Category & Reference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {formData.category !== "others" ? (
              <Input
                label={
                  formData.category === "installation"
                    ? "Job Order No."
                    : "Ticket No."
                }
                icon="fa-hashtag"
                placeholder={
                  formData.category === "installation"
                    ? "JO-2024-001"
                    : "TCK-2024-001"
                }
                value={formData.reference_id}
                onChange={(e) =>
                  setFormData({ ...formData, reference_id: e.target.value })
                }
                error={errors.reference_id}
                required
              />
            ) : (
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
                error={errors.reference_description}
                required
              />
            )}
          </div>
        </div>

        {/* Store and Destination */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-location-dot text-purple-600" />
            Store & Destination
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Source Store"
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
              label="Destination Address"
              icon="fa-map-marker-alt"
              placeholder="Address"
              value={formData.destination_address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destination_address: e.target.value,
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
                  placeholder="Serial No (if serialized)"
                  value={selectedSerialNo}
                  onChange={(e) => setSelectedSerialNo(e.target.value)}
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
                <Button onClick={handleAddItem} icon="fa-plus" fullWidth>
                  Add Item
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
              <DataTable<FormItem>
                columns={itemColumns}
                data={items.map((item, index) => ({ ...item, id: index }))}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-align-left text-purple-600" />
            Additional Notes
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

export default ReleaseFormCreateModal;
