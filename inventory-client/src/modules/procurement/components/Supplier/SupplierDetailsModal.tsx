// src/modules/procurement/components/Supplier/SupplierDetailsModal.tsx

import React from "react";
import { Modal, Badge, Button } from "../../../../shared/components/UI";
import { Supplier } from "../../types";

interface SupplierDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onEdit: (supplier: Supplier) => void;
}

const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onEdit,
}) => {
  if (!supplier) return null;

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
      title="Supplier Details"
      subtitle={`Viewing information for ${supplier.name}`}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button icon="fa-edit" onClick={() => onEdit(supplier)}>
            Edit Supplier
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-building" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              {supplier.name}
            </h3>
            <p className="text-sm text-slate-500">{supplier.code}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={supplier.is_active ? "success" : "danger"}>
              {supplier.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="info">{supplier.total_orders || 0} Orders</Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-address-book text-amber-600" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Email" value={supplier.email || "N/A"} />
            <DetailItem label="Phone" value={supplier.phone || "N/A"} />
            <DetailItem
              label="Contact Person"
              value={supplier.contact_person || "N/A"}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-location-dot text-amber-600" />
            Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Address" value={supplier.address || "N/A"} />
            <DetailItem label="City" value={supplier.city || "N/A"} />
            <DetailItem label="State" value={supplier.state || "N/A"} />
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-bank text-amber-600" />
            Bank Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Bank Name" value={supplier.bank_name || "N/A"} />
            <DetailItem
              label="Account Number"
              value={supplier.bank_account_no || "N/A"}
            />
            <DetailItem
              label="Account Name"
              value={supplier.bank_account_name || "N/A"}
            />
          </div>
        </div>

        {/* Financial Summary */}
        {supplier.total_spent !== undefined && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-chart-bar text-amber-600" />
              Financial Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                label="Total Orders"
                value={supplier.total_orders || 0}
              />
              <DetailItem
                label="Total Spent"
                value={formatCurrency(supplier.total_spent || 0)}
              />
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-clock text-amber-600" />
            Timestamps
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Created At"
              value={new Date(supplier.created_at).toLocaleString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(supplier.updated_at).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SupplierDetailsModal;
