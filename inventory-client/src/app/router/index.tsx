// src/app/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../../shared/components/Layout/AppLayout";
import { authRoutes } from "../../modules/auth/routes";
import { coreRoutes } from "../../modules/core/routes";
import { inventoryRoutes } from "../../modules/inventory/routes";
import { assetsRoutes } from "../../modules/assets/routes";
import { releaseFormRoutes } from "../../modules/release-form/routes";
import { procurementRoutes } from "../../modules/procurement/routes";
import { reportingRoutes } from "../../modules/reporting/routes";
import { documentationRoutes } from "../../modules/documentation/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      ...coreRoutes,
      ...inventoryRoutes,
      ...assetsRoutes,
      ...releaseFormRoutes,
      ...procurementRoutes,
      ...reportingRoutes,
      ...documentationRoutes,
    ],
  },
  ...authRoutes,
]);
