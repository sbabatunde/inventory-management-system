// src/modules/inventory/components/StockItem/StockBalanceModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  DataTable,
  Badge,
  EmptyState,
  LoadingSpinner,
} from "../../../../shared/components/UI";
import { StockItem, StockBalance } from "../../types";
import { stockItemService } from "../../services/stock-item.service";
import { showError } from "../../../../shared/utils/toast";

interface StockBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem | null;
}

const StockBalanceModal: React.FC<StockBalanceModalProps> = ({
  isOpen,
  onClose,
  stockItem,
}) => {
  const [balances, setBalances] = useState<StockBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && stockItem) {
      fetchBalances();
    }
  }, [isOpen, stockItem]);

  const fetchBalances = async () => {
    if (!stockItem) return;

    setIsLoading(true);
    try {
      const data = await stockItemService.getStockItemBalance(stockItem.id);
      setBalances(data);
    } catch (error: any) {
      showError(error.message || "Failed to load stock balances");
    } finally {
      setIsLoading(false);
    }
  };

  if (!stockItem) return null;

  const columns = [
    {
      key: "store",
      header: "Store",
      render: (balance: StockBalance) => (
        <div>
          <p className="font-medium text-slate-900">{balance.store?.name}</p>
          <p className="text-xs text-slate-400">{balance.store?.code}</p>
        </div>
      ),
    },
    {
      key: "on_hand",
      header: "On Hand",
      render: (balance: StockBalance) => (
        <span className="font-semibold text-slate-900">
          {balance.quantity_on_hand} {stockItem.unit_of_measure}
        </span>
      ),
    },
    {
      key: "reserved",
      header: "Reserved",
      render: (balance: StockBalance) => (
        <span className="text-slate-600">
          {balance.quantity_reserved} {stockItem.unit_of_measure}
        </span>
      ),
    },
    {
      key: "available",
      header: "Available",
      render: (balance: StockBalance) => (
        <Badge variant={balance.quantity_available > 0 ? "success" : "danger"}>
          {balance.quantity_available} {stockItem.unit_of_measure}
        </Badge>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Balance"
      subtitle={`Current balance for ${stockItem.name} across all stores`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="text-xl font-extrabold text-emerald-700">
              {balances.reduce((sum, b) => sum + b.quantity_on_hand, 0)}
            </div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mt-1">
              Total On Hand
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="text-xl font-extrabold text-blue-700">
              {balances.reduce((sum, b) => sum + b.quantity_reserved, 0)}
            </div>
            <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1">
              Total Reserved
            </div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="text-xl font-extrabold text-purple-700">
              {balances.reduce((sum, b) => sum + b.quantity_available, 0)}
            </div>
            <div className="text-xs text-purple-600 font-semibold uppercase tracking-wider mt-1">
              Total Available
            </div>
          </div>
        </div>

        {/* Balances Table */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading balances..." />
        ) : balances.length === 0 ? (
          <EmptyState
            icon="fa-scale-balanced"
            title="No stock balances"
            description="This item has no stock in any store"
          />
        ) : (
          <DataTable<StockBalance>
            columns={columns}
            data={balances}
            showSerialNumbers={false}
          />
        )}
      </div>
    </Modal>
  );
};

export default StockBalanceModal;
