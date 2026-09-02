// src/modules/inventory/components/Store/StoreDetailsModal.tsx

import React from "react";
import { Modal, Badge, Button } from "../../../../shared/components/UI";
import { Store } from "../../types";
import { STORE_TYPE_MAP } from "../../constants";

interface StoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  onEdit: (store: Store) => void;
}

const StoreDetailsModal: React.FC<StoreDetailsModalProps> = ({
  isOpen,
  onClose,
  store,
  onEdit,
}) => {
  if (!store) return null;

  const typeInfo = STORE_TYPE_MAP[store.type];

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Store Details"
      subtitle={`Viewing information for ${store.name}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button icon="fa-edit" onClick={() => onEdit(store)}>
            Edit Store
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-warehouse" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
            <p className="text-sm text-slate-500">{store.code}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={store.is_active ? "success" : "danger"}>
              {store.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={
                typeInfo.color === "blue"
                  ? "info"
                  : typeInfo.color === "green"
                    ? "success"
                    : "purple"
              }
            >
              {typeInfo.label}
            </Badge>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-location-dot text-blue-600" />
            Location Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Address" value={store.address || "N/A"} />
            <DetailItem label="City" value={store.city || "N/A"} />
            <DetailItem label="State" value={store.state || "N/A"} />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-address-book text-blue-600" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Contact Person"
              value={store.contact_person || "N/A"}
            />
            <DetailItem label="Phone" value={store.contact_phone || "N/A"} />
            <DetailItem label="Email" value={store.contact_email || "N/A"} />
          </div>
        </div>

        {/* Timestamps */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <i className="fas fa-clock text-blue-600" />
            Timestamps
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Created At"
              value={new Date(store.created_at).toLocaleString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(store.updated_at).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StoreDetailsModal;
