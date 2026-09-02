// src/modules/inventory/components/StockItem/StockItemDetailsModal.tsx

import React from "react";
import { Modal, Badge, Button } from "../../../../shared/components/UI";
import { StockItem } from "../../types";

interface StockItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem | null;
  onEdit: (item: StockItem) => void;
}

const StockItemDetailsModal: React.FC<StockItemDetailsModalProps> = ({
  isOpen,
  onClose,
  stockItem,
  onEdit,
}) => {
  if (!stockItem) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
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
      title="Stock Item Details"
      subtitle={`Viewing information for ${stockItem.name}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button icon="fa-edit" onClick={() => onEdit(stockItem)}>
            Edit Item
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-box" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              {stockItem.name}
            </h3>
            <p className="text-sm text-slate-500">{stockItem.code}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={stockItem.is_active ? "success" : "danger"}>
              {stockItem.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={stockItem.is_serialized ? "purple" : "neutral"}>
              {stockItem.is_serialized ? "Serialized" : "Non-Serialized"}
            </Badge>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle text-emerald-600" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Nature" value={stockItem.nature} />
            <DetailItem
              label="Unit of Measure"
              value={stockItem.unit_of_measure}
            />
            <DetailItem label="Reorder Level" value={stockItem.reorder_level} />
            <DetailItem
              label="Unit Cost"
              value={formatCurrency(stockItem.unit_cost)}
            />
          </div>
        </div>

        {/* Description */}
        {stockItem.description && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-align-left text-emerald-600" />
              Description
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                {stockItem.description}
              </p>
            </div>
          </div>
        )}

        {/* Stock Summary */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-chart-bar text-emerald-600" />
            Stock Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="text-2xl font-extrabold text-emerald-700">
                {stockItem.total_stock ?? 0}
              </div>
              <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mt-1">
                Total Stock
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="text-2xl font-extrabold text-blue-700">
                {stockItem.reorder_level}
              </div>
              <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1">
                Reorder Level
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-clock text-emerald-600" />
            Timestamps
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Created At"
              value={new Date(stockItem.created_at).toLocaleString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(stockItem.updated_at).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StockItemDetailsModal;
