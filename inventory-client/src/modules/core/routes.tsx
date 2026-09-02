// src/modules/core/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const Dashboard = lazy(() => import("./components/Dashboard"));
const UserManagement = lazy(() => import("./components/Users/UserManagement"));
const SettingsPage = lazy(() => import("./components/Settings/SettingsPage"));
const ProfilePage = lazy(() => import("./components/Profile/ProfilePage"));

export const coreRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <UserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
];
