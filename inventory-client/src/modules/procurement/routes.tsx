// src/modules/procurement/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const SupplierList = lazy(() => import("./components/Supplier/SupplierList"));
const PurchaseRequisitionList = lazy(
  () => import("./components/Requisition/PurchaseRequisitionList"),
);
const PurchaseOrderList = lazy(
  () => import("./components/Order/PurchaseOrderList"),
);

export const procurementRoutes: RouteObject[] = [
  {
    path: "/procurement/suppliers",
    element: (
      <ProtectedRoute>
        <SupplierList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/procurement/requisitions",
    element: (
      <ProtectedRoute>
        <PurchaseRequisitionList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/procurement/purchase-orders",
    element: (
      <ProtectedRoute>
        <PurchaseOrderList />
      </ProtectedRoute>
    ),
  },
];
