// src/app/router/index.tsx

import { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AppLayout from "../../shared/components/Layout/AppLayout";
import ProtectedRoute from "../../modules/auth/components/ProtectedRoute";
import { authRoutes } from "../../modules/auth/routes";
import { coreRoutes } from "../../modules/core/routes";
import { inventoryRoutes } from "../../modules/inventory/routes";
import { assetsRoutes } from "../../modules/assets/routes";
import { releaseFormRoutes } from "../../modules/release-form/routes";
import { procurementRoutes } from "../../modules/procurement/routes";
import { reportingRoutes } from "../../modules/reporting/routes";
import { documentationRoutes } from "../../modules/documentation/routes";

// Fallback spinner while lazy chunks load
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
  </div>
);

export const router = createBrowserRouter([
  // Public auth routes (login, forgot-password)
  ...authRoutes,

  // Protected app wrapper
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          // Redirect root to dashboard
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // Module routes
          ...coreRoutes,
          ...inventoryRoutes,
          ...assetsRoutes,
          ...releaseFormRoutes,
          ...procurementRoutes,
          ...reportingRoutes,
          ...documentationRoutes,
        ],
      },
    ],
  },

  // Catch-all route
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
