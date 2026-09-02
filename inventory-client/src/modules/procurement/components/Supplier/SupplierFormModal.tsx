// src/modules/procurement/components/Supplier/SupplierFormModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "../../../../shared/components/UI";
import { Supplier } from "../../types";
import { supplierService } from "../../services/supplier.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  onSuccess: () => void;
}

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    tax_id: "",
    bank_name: "",
    bank_account_no: "",
    bank_account_name: "",
    is_active: true,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        code: supplier.code,
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        city: supplier.city || "",
        state: supplier.state || "",
        country: supplier.country || "Nigeria",
        contact_person: supplier.contact_person || "",
        contact_phone: supplier.contact_phone || "",
        contact_email: supplier.contact_email || "",
        tax_id: supplier.tax_id || "",
        bank_name: supplier.bank_name || "",
        bank_account_no: supplier.bank_account_no || "",
        bank_account_name: supplier.bank_account_name || "",
        is_active: supplier.is_active,
        notes: supplier.notes || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "Nigeria",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        tax_id: "",
        bank_name: "",
        bank_account_no: "",
        bank_account_name: "",
        is_active: true,
        notes: "",
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Invalid contact email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading(
      supplier ? "Updating supplier..." : "Creating supplier...",
    );

    try {
      if (supplier) {
        await supplierService.updateSupplier(supplier.id, formData);
        dismissToast(loadingToast);
        showSuccess("Supplier updated successfully");
      } else {
        await supplierService.createSupplier(formData);
        dismissToast(loadingToast);
        showSuccess("Supplier created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to save supplier";
      showError(message);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? "Edit Supplier" : "Create Supplier"}
      subtitle={
        supplier ? `Update details for ${supplier.name}` : "Add a new supplier"
      }
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={supplier ? "fa-save" : "fa-plus"}
          >
            {supplier ? "Update Supplier" : "Create Supplier"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-amber-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Supplier Name"
              icon="fa-building"
              placeholder="ABC Supplies Ltd"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              required
            />
            <Input
              label="Supplier Code"
              icon="fa-barcode"
              placeholder="SUP-000001"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              hint="Leave blank to auto-generate"
            />
            <Input
              label="Email"
              icon="fa-envelope"
              type="email"
              placeholder="supplier@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />
            <Input
              label="Phone"
              icon="fa-phone"
              placeholder="+234..."
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-location-dot text-amber-600" />
            Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Address"
                icon="fa-map-marker-alt"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <Input
              label="City"
              icon="fa-city"
              placeholder="Lagos"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
            <Input
              label="State"
              icon="fa-map"
              placeholder="Lagos State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            />
            <Input
              label="Country"
              icon="fa-globe"
              placeholder="Nigeria"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-user-tie text-amber-600" />
            Contact Person
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Name"
              icon="fa-user"
              placeholder="John Doe"
              value={formData.contact_person}
              onChange={(e) =>
                setFormData({ ...formData, contact_person: e.target.value })
              }
            />
            <Input
              label="Phone"
              icon="fa-phone"
              placeholder="+234..."
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
            />
            <Input
              label="Email"
              icon="fa-envelope"
              type="email"
              placeholder="contact@example.com"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              error={errors.contact_email}
            />
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-bank text-amber-600" />
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Bank Name"
              icon="fa-building-columns"
              placeholder="GTBank"
              value={formData.bank_name}
              onChange={(e) =>
                setFormData({ ...formData, bank_name: e.target.value })
              }
            />
            <Input
              label="Account Number"
              icon="fa-hashtag"
              placeholder="0123456789"
              value={formData.bank_account_no}
              onChange={(e) =>
                setFormData({ ...formData, bank_account_no: e.target.value })
              }
            />
            <Input
              label="Account Name"
              icon="fa-user"
              placeholder="ABC Supplies Ltd"
              value={formData.bank_account_name}
              onChange={(e) =>
                setFormData({ ...formData, bank_account_name: e.target.value })
              }
            />
          </div>
        </div>

        {/* Tax & Status */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-file-invoice text-amber-600" />
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax ID"
              icon="fa-receipt"
              placeholder="TIN-123456789"
              value={formData.tax_id}
              onChange={(e) =>
                setFormData({ ...formData, tax_id: e.target.value })
              }
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.is_active}
                    onChange={() =>
                      setFormData({ ...formData, is_active: true })
                    }
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.is_active}
                    onChange={() =>
                      setFormData({ ...formData, is_active: false })
                    }
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-align-left text-amber-600" />
            Notes
          </h3>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default SupplierFormModal;
