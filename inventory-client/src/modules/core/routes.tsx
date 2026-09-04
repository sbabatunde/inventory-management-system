// src/modules/core/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const Dashboard = lazy(() => import("./components/Dashboard"));
const UserManagement = lazy(() => import("./components/Users/UserManagement"));
const SettingsPage = lazy(() => import("./components/Settings/SettingsPage"));
const ProfilePage = lazy(() => import("./components/Profile/ProfilePage"));

export const coreRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <UserManagement />,
  },
  {
    path: "settings",
    element: <SettingsPage />,
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
];
