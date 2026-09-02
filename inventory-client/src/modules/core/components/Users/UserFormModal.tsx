// src/modules/core/components/Users/UserFormModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "../../../../shared/components/UI";
import { User } from "../../../../shared/types/global";
import { userService } from "../../services/user.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
  availableRoles: Array<{ value: string; label: string }>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
  availableRoles,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: [] as string[],
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        roles: user.roles || [],
        is_active: user.is_active,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        roles: [],
        is_active: true,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!user && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading(
      user ? "Updating user..." : "Creating user...",
    );

    try {
      if (user) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          is_active: formData.is_active,
          roles: formData.roles,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await userService.updateUser(user.id, updateData);
        dismissToast(loadingToast);
        showSuccess("User updated successfully");
      } else {
        await userService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          is_active: formData.is_active,
          roles: formData.roles,
        });
        dismissToast(loadingToast);
        showSuccess("User created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message = error.response?.data?.message || "Failed to save user";
      showError(message);

      // Set field errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Create User"}
      subtitle={
        user
          ? `Update details for ${user.name}`
          : "Add a new user to the system"
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
            icon={user ? "fa-save" : "fa-plus"}
          >
            {user ? "Update User" : "Create User"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            icon="fa-user"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            icon="fa-envelope"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            required
          />
        </div>

        {/* Password */}
        <Input
          label={user ? "Password (leave blank to keep current)" : "Password"}
          icon="fa-lock"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
          required={!user}
          hint={!user ? "Minimum 8 characters" : undefined}
        />

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
                onChange={() => setFormData({ ...formData, is_active: true })}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!formData.is_active}
                onChange={() => setFormData({ ...formData, is_active: false })}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Inactive</span>
            </label>
          </div>
        </div>

        {/* Roles */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => toggleRole(role.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  formData.roles.includes(role.value)
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
