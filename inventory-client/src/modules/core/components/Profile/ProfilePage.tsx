// src/modules/core/components/Profile/ProfilePage.tsx

import React, { useState } from "react";
import {
  PageHeader,
  Button,
  Input,
  Badge,
} from "../../../../shared/components/UI";
import { useAuth } from "../../../auth/context/AuthContext";
import { profileService } from "../../services/profile.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    employee_id: user?.employee_id || "",
    department: user?.department || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const loadingToast = showLoading("Updating profile...");

    try {
      const updatedUser = await profileService.updateProfile(profileData);
      updateUser(updatedUser);

      dismissToast(loadingToast);
      showSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      dismissToast(loadingToast);
      showError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const loadingToast = showLoading("Changing password...");

    try {
      await profileService.updatePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.new_password_confirmation,
      );

      dismissToast(loadingToast);
      showSuccess("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error: any) {
      dismissToast(loadingToast);
      showError(error.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        icon="fa-user"
        breadcrumbs={[{ label: "Home" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>

            <div className="flex justify-center gap-2 mt-4">
              {user?.roles.map((role) => (
                <Badge key={role} variant="purple">
                  {role}
                </Badge>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">
                  Employee ID
                </label>
                <p className="text-sm font-medium text-slate-700">
                  {user?.employee_id || "Not assigned"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">
                  Department
                </label>
                <p className="text-sm font-medium text-slate-700">
                  {user?.department || "Not assigned"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">
                  Last Login
                </label>
                <p className="text-sm font-medium text-slate-700">
                  {user?.last_login_at
                    ? new Date(user.last_login_at).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-900">
                Profile Information
              </h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  icon="fa-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    icon="fa-user"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email Address"
                    icon="fa-envelope"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Employee ID"
                    icon="fa-id-card"
                    value={profileData.employee_id}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        employee_id: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Department"
                    icon="fa-building"
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        department: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving} icon="fa-save">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">
                      Full Name
                    </label>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {user?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">
                      Email
                    </label>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">
                      Employee ID
                    </label>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {user?.employee_id || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">
                      Department
                    </label>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {user?.department || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-900">
                Change Password
              </h3>
              {!isChangingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  icon="fa-lock"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change
                </Button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
                  icon="fa-lock"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      current_password: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="New Password"
                  icon="fa-key"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  required
                  hint="Minimum 8 characters"
                />
                <Input
                  label="Confirm New Password"
                  icon="fa-check"
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password_confirmation: e.target.value,
                    })
                  }
                  required
                />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving} icon="fa-key">
                    Change Password
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-slate-500">
                Change your password regularly to keep your account secure.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
