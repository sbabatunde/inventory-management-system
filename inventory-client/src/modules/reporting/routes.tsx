// src/modules/reporting/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const ReportDashboard = lazy(() => import("./components/ReportDashboard"));

export const reportingRoutes: RouteObject[] = [
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportDashboard />
      </ProtectedRoute>
    ),
  },
];
