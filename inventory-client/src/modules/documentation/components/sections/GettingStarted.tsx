// src/modules/documentation/components/sections/GettingStarted.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import StepByStep from "../shared/StepByStep";
import TipBox from "../shared/TipBox";
import WarningBox from "../shared/WarningBox";

const GettingStarted: React.FC = () => {
  return (
    <div className="space-y-8">
      <DocSection
        title="Getting Started"
        icon="fa-rocket"
        description="Welcome to the Inventory & Equipment Release Management System! This guide will help you get started quickly."
      />

      {/* Quick Start */}
      <InfoCard title="Quick Start" icon="fa-bolt" color="emerald">
        <p className="text-sm text-slate-600 mb-4">
          Follow these simple steps to get started with the system:
        </p>
        <StepByStep
          steps={[
            {
              title: "Log In",
              description: "Use your email and password to access the system",
              icon: "fa-sign-in-alt",
            },
            {
              title: "Explore Dashboard",
              description: "Familiarize yourself with the main dashboard",
              icon: "fa-gauge",
            },
            {
              title: "Check Permissions",
              description: "Understand what you can and cannot do",
              icon: "fa-shield",
            },
            {
              title: "Start Working",
              description: "Begin with your assigned tasks",
              icon: "fa-briefcase",
            },
          ]}
        />
      </InfoCard>

      {/* User Roles */}
      <InfoCard title="Understanding Your Role" icon="fa-users" color="blue">
        <div className="space-y-4">
          {[
            {
              role: "Super Admin",
              color: "red",
              description:
                "Full system access, can manage all modules and users",
              permissions: ["Everything"],
            },
            {
              role: "Admin",
              color: "orange",
              description: "System administration, user management",
              permissions: ["User management", "Settings", "Reports"],
            },
            {
              role: "Manager",
              color: "purple",
              description: "Department management, approvals",
              permissions: [
                "Approve forms",
                "View reports",
                "Manage inventory",
              ],
            },
            {
              role: "Staff",
              color: "blue",
              description: "Regular operations, create forms",
              permissions: ["Create forms", "View inventory", "Add items"],
            },
            {
              role: "User",
              color: "green",
              description: "Basic access, view only",
              permissions: ["View items", "View forms"],
            },
          ].map((role) => (
            <div
              key={role.role}
              className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-${role.color}-100 flex items-center justify-center`}
              >
                <i className={`fas fa-user-shield text-${role.color}-600`} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {role.role}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {role.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Navigation */}
      <InfoCard title="Navigating the System" icon="fa-compass" color="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fas fa-bars text-purple-600 mr-2" />
              Sidebar Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                • <strong>Dashboard</strong> - Overview and statistics
              </li>
              <li>
                • <strong>Inventory</strong> - Stores and stock
              </li>
              <li>
                • <strong>Release Forms</strong> - Equipment releases
              </li>
              <li>
                • <strong>Assets</strong> - Asset tracking
              </li>
              <li>
                • <strong>Procurement</strong> - Suppliers and orders
              </li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fas fa-ellipsis-h text-purple-600 mr-2" />
              Quick Actions
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Use search to find items quickly</li>
              <li>• Check notifications regularly</li>
              <li>• Use breadcrumbs to navigate back</li>
              <li>• Access profile from top right</li>
            </ul>
          </div>
        </div>
      </InfoCard>

      <TipBox title="Pro Tip">
        Bookmark the system URL in your browser for quick access. You can also
        add it to your home screen for mobile access.
      </TipBox>

      <WarningBox title="Important">
        Never share your login credentials with anyone. If you suspect your
        account has been compromised, contact your administrator immediately.
      </WarningBox>
    </div>
  );
};

export default GettingStarted;
