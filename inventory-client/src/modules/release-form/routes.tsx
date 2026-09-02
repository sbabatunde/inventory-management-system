// src/modules/release-form/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const ReleaseFormList = lazy(() => import("./components/ReleaseFormList"));

export const releaseFormRoutes: RouteObject[] = [
  {
    path: "/release-forms",
    element: (
      <ProtectedRoute>
        <ReleaseFormList />
      </ProtectedRoute>
    ),
  },
];
