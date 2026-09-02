// src/modules/core/components/Users/UserDetailsModal.tsx

import React from "react";
import { Modal, Badge, Button } from "../../../../shared/components/UI";
import { User } from "../../../../shared/types/global";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      subtitle={`Viewing information for ${user.name}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button icon="fa-edit" onClick={() => onEdit(user)}>
            Edit User
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="ml-auto">
            <Badge variant={user.is_active ? "success" : "danger"}>
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Employee ID
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {user.employee_id || "Not assigned"}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {user.department || "Not assigned"}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Last Login
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {user.last_login_at
                ? new Date(user.last_login_at).toLocaleString()
                : "Never logged in"}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Created At
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Roles */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">Roles</h4>
          <div className="flex flex-wrap gap-2">
            {user.roles.length > 0 ? (
              user.roles.map((role) => (
                <Badge key={role} variant="purple" icon="fa-user-shield">
                  {role}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">No roles assigned</p>
            )}
          </div>
        </div>

        {/* Permissions */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {user.permissions.length > 0 ? (
              user.permissions.map((permission) => (
                <Badge key={permission} variant="info" icon="fa-check">
                  {permission}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No direct permissions assigned
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
