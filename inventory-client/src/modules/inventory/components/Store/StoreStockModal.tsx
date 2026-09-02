// src/modules/inventory/components/Store/StoreStockModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  DataTable,
  Badge,
  EmptyState,
  LoadingSpinner,
} from "../../../../shared/components/UI";
import { Store } from "../../types";
import { storeService } from "../../services/store.service";
import { showError } from "../../../../shared/utils/toast";

interface StoreStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
}

interface StockItem {
  id: string; // Add id for DataTable
  stock_item_id: number;
  item_code: string;
  item_name: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  unit_of_measure: string;
  is_serialized: boolean;
}

const StoreStockModal: React.FC<StoreStockModalProps> = ({
  isOpen,
  onClose,
  store,
}) => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({
    total_items: 0,
    total_quantity: 0,
  });

  useEffect(() => {
    if (isOpen && store) {
      fetchStock();
    }
  }, [isOpen, store]);

  const fetchStock = async () => {
    if (!store) return;

    setIsLoading(true);
    try {
      const data = await storeService.getStoreStock(store.id);
      // Add id field for DataTable
      const stockWithIds = data.stock.map((item: any, index: number) => ({
        ...item,
        id: `${item.stock_item_id}-${index}`,
      }));
      setStock(stockWithIds);
      setSummary({
        total_items: data.total_items,
        total_quantity: data.total_quantity,
      });
    } catch (error: any) {
      showError(error.message || "Failed to load stock");
    } finally {
      setIsLoading(false);
    }
  };

  if (!store) return null;

  const columns = [
    {
      key: "item",
      header: "Item",
      render: (item: StockItem) => (
        <div>
          <p className="font-medium text-slate-900">{item.item_name}</p>
          <p className="text-xs text-slate-400">{item.item_code}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Qty On Hand",
      render: (item: StockItem) => (
        <span className="font-semibold text-slate-900">
          {item.quantity_on_hand} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "reserved",
      header: "Reserved",
      render: (item: StockItem) => (
        <span className="text-slate-600">
          {item.quantity_reserved} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "available",
      header: "Available",
      render: (item: StockItem) => (
        <Badge variant={item.quantity_available > 0 ? "success" : "danger"}>
          {item.quantity_available} {item.unit_of_measure}
        </Badge>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item: StockItem) => (
        <Badge variant={item.is_serialized ? "purple" : "neutral"}>
          {item.is_serialized ? "Serialized" : "Non-Serialized"}
        </Badge>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Store Stock"
      subtitle={`Current stock levels for ${store.name}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="text-2xl font-extrabold text-emerald-700">
              {summary.total_items}
            </div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mt-1">
              Total Items
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="text-2xl font-extrabold text-blue-700">
              {summary.total_quantity}
            </div>
            <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1">
              Total Quantity
            </div>
          </div>
        </div>

        {/* Stock Table */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading stock..." />
        ) : stock.length === 0 ? (
          <EmptyState
            icon="fa-boxes-stacked"
            title="No stock available"
            description="This store currently has no stock"
          />
        ) : (
          <DataTable<StockItem>
            columns={columns}
            data={stock}
            showSerialNumbers={false}
          />
        )}
      </div>
    </Modal>
  );
};

export default StoreStockModal;
