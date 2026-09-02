// src/modules/inventory/components/Store/StoreFormModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "../../../../shared/components/UI";
import { Store, StoreFormData } from "../../types";
import { storeService } from "../../services/store.service";
import { STORE_TYPES } from "../../constants";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  store?: Store | null;
  onSuccess: () => void;
}

const StoreFormModal: React.FC<StoreFormModalProps> = ({
  isOpen,
  onClose,
  store,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    code: "",
    type: "HQ",
    address: "",
    city: "",
    state: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        code: store.code,
        type: store.type,
        address: store.address || "",
        city: store.city || "",
        state: store.state || "",
        contact_person: store.contact_person || "",
        contact_phone: store.contact_phone || "",
        contact_email: store.contact_email || "",
        is_active: store.is_active,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        type: "HQ",
        address: "",
        city: "",
        state: "",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        is_active: true,
      });
    }
    setErrors({});
  }, [store, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Store name is required";
    }

    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading(
      store ? "Updating store..." : "Creating store...",
    );

    try {
      if (store) {
        await storeService.updateStore(store.id, formData);
        dismissToast(loadingToast);
        showSuccess("Store updated successfully");
      } else {
        await storeService.createStore(formData);
        dismissToast(loadingToast);
        showSuccess("Store created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message = error.response?.data?.message || "Failed to save store";
      showError(message);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StoreFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={store ? "Edit Store" : "Create Store"}
      subtitle={
        store
          ? `Update details for ${store.name}`
          : "Add a new store to the system"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={store ? "fa-save" : "fa-plus"}
          >
            {store ? "Update Store" : "Create Store"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-emerald-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Store Name"
              icon="fa-warehouse"
              placeholder="Main Store"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Store Code"
              icon="fa-barcode"
              placeholder="HQ-0001"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              error={errors.code}
              hint="Leave blank to auto-generate"
            />
            <Select
              label="Store Type"
              options={STORE_TYPES}
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              error={errors.type}
              required
            />
            <Input
              label="Contact Person"
              icon="fa-user"
              placeholder="John Doe"
              value={formData.contact_person}
              onChange={(e) =>
                handleInputChange("contact_person", e.target.value)
              }
            />
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-location-dot text-emerald-600" />
            Location Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Address"
                icon="fa-map-marker-alt"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <Input
              label="City"
              icon="fa-city"
              placeholder="Lagos"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            <Input
              label="State"
              icon="fa-map"
              placeholder="Lagos State"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-phone text-emerald-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              icon="fa-phone"
              placeholder="+234..."
              value={formData.contact_phone}
              onChange={(e) =>
                handleInputChange("contact_phone", e.target.value)
              }
            />
            <Input
              label="Email Address"
              icon="fa-envelope"
              type="email"
              placeholder="store@example.com"
              value={formData.contact_email}
              onChange={(e) =>
                handleInputChange("contact_email", e.target.value)
              }
              error={errors.contact_email}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.is_active}
                onChange={() => handleInputChange("is_active", true)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!formData.is_active}
                onChange={() => handleInputChange("is_active", false)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Inactive</span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default StoreFormModal;
