// src/modules/inventory/components/StockTransfer/StockTransferFormModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Button,
  DataTable,
  Badge,
} from "../../../../shared/components/UI";
import { Store, StockItem } from "../../types";
import { storeService } from "../../services/store.service";
import { stockItemService } from "../../services/stock-item.service";
import { stockTransferService } from "../../services/stock-transfer.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface StockTransferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TransferItem {
  stock_item_id: number;
  stock_item_name?: string;
  stock_item_code?: string;
  quantity: number;
  available_quantity?: number;
}

const StockTransferFormModal: React.FC<StockTransferFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fromStoreId, setFromStoreId] = useState<number | "">("");
  const [toStoreId, setToStoreId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<TransferItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      fetchStores();
      fetchStockItems();
      resetForm();
    }
  }, [isOpen]);

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
    setFromStoreId("");
    setToStoreId("");
    setNotes("");
    setItems([]);
    setSelectedItemId("");
    setSelectedQuantity(1);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fromStoreId) {
      newErrors.from_store_id = "Source store is required";
    }

    if (!toStoreId) {
      newErrors.to_store_id = "Destination store is required";
    }

    if (fromStoreId === toStoreId) {
      newErrors.to_store_id = "Source and destination stores must be different";
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
      showError("Item already added to transfer");
      return;
    }

    const stockItem = stockItems.find((item) => item.id === selectedItemId);

    if (!stockItem) {
      showError("Stock item not found");
      return;
    }

    const newItem: TransferItem = {
      stock_item_id: stockItem.id,
      stock_item_name: stockItem.name,
      stock_item_code: stockItem.code,
      quantity: selectedQuantity,
      available_quantity: stockItem.total_stock || 0,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId("");
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (index: number): void => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number): void => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading("Creating stock transfer...");

    try {
      const transferData = {
        from_store_id: fromStoreId,
        to_store_id: toStoreId,
        notes,
        items: items.map((item) => ({
          stock_item_id: item.stock_item_id,
          quantity: item.quantity,
        })),
      };

      await stockTransferService.createTransfer(transferData);

      dismissToast(loadingToast);
      showSuccess("Stock transfer created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to create transfer";
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
      render: (item: TransferItem) => (
        <div>
          <p className="font-medium text-slate-900">{item.stock_item_name}</p>
          <p className="text-xs text-slate-400">{item.stock_item_code}</p>
        </div>
      ),
    },
    {
      key: "available",
      header: "Available",
      render: (item: TransferItem) => (
        <span className="text-slate-600">{item.available_quantity || 0}</span>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: TransferItem, index?: number) => (
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            handleQuantityChange(index!, parseInt(e.target.value) || 1)
          }
          className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-sm"
        />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: TransferItem, index?: number) => (
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
      title="Create Stock Transfer"
      subtitle="Transfer stock items between stores"
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
            Create Transfer
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="From Store"
            options={stores.map((store) => ({
              value: store.id,
              label: `${store.name} (${store.code})`,
            }))}
            value={fromStoreId}
            onChange={(e) => setFromStoreId(Number(e.target.value))}
            error={errors.from_store_id}
            placeholder="Select source store"
            required
          />
          <Select
            label="To Store"
            options={stores.map((store) => ({
              value: store.id,
              label: `${store.name} (${store.code})`,
            }))}
            value={toStoreId}
            onChange={(e) => setToStoreId(Number(e.target.value))}
            error={errors.to_store_id}
            placeholder="Select destination store"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Add Items */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-emerald-600" />
            Add Items
          </h3>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
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
            <div className="w-32">
              <input
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) =>
                  setSelectedQuantity(parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Qty"
              />
            </div>
            <Button onClick={handleAddItem} icon="fa-plus">
              Add
            </Button>
          </div>

          {errors.items && (
            <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
              <i className="fas fa-circle-exclamation text-[10px]" />
              {errors.items}
            </p>
          )}

          {/* Items Table */}
          {items.length > 0 && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<TransferItem>
                columns={itemColumns}
                data={items.map((item, index) => ({ ...item, id: index }))}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default StockTransferFormModal;
