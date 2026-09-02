// src/modules/inventory/components/StockTransfer/StockTransferDetailsModal.tsx

import React from "react";
import {
  Modal,
  Badge,
  Button,
  DataTable,
  EmptyState,
} from "../../../../shared/components/UI";
import { StockTransfer, TransferStatus } from "../../types";
import { TRANSFER_STATUS_MAP } from "../../constants";

interface StockTransferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: StockTransfer | null;
  onApprove?: (transfer: StockTransfer) => Promise<void>;
  onReceive?: (transfer: StockTransfer) => Promise<void>;
  onCancel?: (transfer: StockTransfer) => void;
}

const StockTransferDetailsModal: React.FC<StockTransferDetailsModalProps> = ({
  isOpen,
  onClose,
  transfer,
  onApprove,
  onReceive,
  onCancel,
}) => {
  if (!transfer) return null;

  const statusInfo = TRANSFER_STATUS_MAP[transfer.status];

  const getStatusBadge = (status: TransferStatus) => {
    const info = TRANSFER_STATUS_MAP[status];
    const variant =
      info.color === "green"
        ? "success"
        : info.color === "blue"
          ? "info"
          : info.color === "amber"
            ? "warning"
            : info.color === "red"
              ? "danger"
              : "purple";
    return <Badge variant={variant}>{info.label}</Badge>;
  };

  const DetailItem: React.FC<{ label: string; value: string }> = ({
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

  const itemColumns = [
    {
      key: "item",
      header: "Item",
      render: (item: any) => (
        <div>
          <p className="font-medium text-slate-900">{item.stock_item?.name}</p>
          <p className="text-xs text-slate-400">{item.stock_item?.code}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: any) => (
        <span className="font-semibold text-slate-900">
          {item.quantity} {item.stock_item?.unit_of_measure}
        </span>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Transfer Details"
      subtitle={`Transfer ${transfer.transfer_no}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {transfer.status === "requested" && onApprove && (
            <Button icon="fa-check" onClick={() => onApprove(transfer)}>
              Approve Transfer
            </Button>
          )}

          {transfer.status === "approved" && onReceive && (
            <Button icon="fa-box-open" onClick={() => onReceive(transfer)}>
              Receive Transfer
            </Button>
          )}

          {(transfer.status === "requested" ||
            transfer.status === "approved") &&
            onCancel && (
              <Button
                variant="danger"
                icon="fa-ban"
                onClick={() => onCancel(transfer)}
              >
                Cancel Transfer
              </Button>
            )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-right-left" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              {transfer.transfer_no}
            </h3>
            <p className="text-sm text-slate-500">
              Created: {new Date(transfer.created_at).toLocaleString()}
            </p>
          </div>
          {getStatusBadge(transfer.status)}
        </div>

        {/* Transfer Details */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle text-blue-600" />
            Transfer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="From Store"
              value={`${transfer.from_store?.name} (${transfer.from_store?.code})`}
            />
            <DetailItem
              label="To Store"
              value={`${transfer.to_store?.name} (${transfer.to_store?.code})`}
            />
          </div>
        </div>

        {/* Notes */}
        {transfer.notes && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-align-left text-blue-600" />
              Notes
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                {transfer.notes}
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-blue-600" />
            Items ({transfer.items.length})
          </h4>

          {transfer.items.length === 0 ? (
            <EmptyState
              icon="fa-boxes-stacked"
              title="No items"
              description="No items in this transfer"
            />
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<any>
                columns={itemColumns}
                data={transfer.items}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-clock text-blue-600" />
            Timeline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Created At"
              value={new Date(transfer.created_at).toLocaleString()}
            />
            {transfer.approved_at && (
              <DetailItem
                label="Approved At"
                value={new Date(transfer.approved_at).toLocaleString()}
              />
            )}
            {transfer.received_at && (
              <DetailItem
                label="Received At"
                value={new Date(transfer.received_at).toLocaleString()}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StockTransferDetailsModal;
