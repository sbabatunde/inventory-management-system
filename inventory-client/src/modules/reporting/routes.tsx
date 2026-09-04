// src/modules/reporting/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const ReportDashboard = lazy(() => import("./components/ReportDashboard"));

export const reportingRoutes: RouteObject[] = [
  {
    path: "reports",
    element: <ReportDashboard />, // Clean! ProtectedRoute is already on the parent AppLayout in router/index.tsx
  },
];
