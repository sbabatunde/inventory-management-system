// src/modules/assets/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const AssetList = lazy(() => import("./components/AssetList"));

export const assetsRoutes: RouteObject[] = [
  {
    path: "/assets",
    element: (
      <ProtectedRoute>
        <AssetList />
      </ProtectedRoute>
    ),
  },
];
