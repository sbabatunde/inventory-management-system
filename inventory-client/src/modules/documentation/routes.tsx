// src/modules/documentation/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const DocumentationLayout = lazy(
  () => import("./components/DocumentationLayout"),
);

export const documentationRoutes: RouteObject[] = [
  {
    path: "documentation",
    element: (
      <ProtectedRoute>
        <DocumentationLayout />
      </ProtectedRoute>
    ),
  },
];
