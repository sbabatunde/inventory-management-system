// src/modules/inventory/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

const StoreList = lazy(() => import("./components/Store/StoreList"));
const StockItemList = lazy(
  () => import("./components/StockItem/StockItemList"),
);
const StockTransferList = lazy(
  () => import("./components/StockTransfer/StockTransferList"),
);
const StockMovementList = lazy(
  () => import("./components/StockMovement/StockMovementList"),
);
const StockAdjustmentList = lazy(
  () => import("./components/StockAdjustment/StockAdjustmentList"),
);

export const inventoryRoutes: RouteObject[] = [
  {
    path: "inventory/stores",
    element: (
      <ProtectedRoute>
        <StoreList />
      </ProtectedRoute>
    ),
  },
  {
    path: "inventory/stock-items",
    element: (
      <ProtectedRoute>
        <StockItemList />
      </ProtectedRoute>
    ),
  },
  {
    path: "inventory/stock-transfers",
    element: (
      <ProtectedRoute>
        <StockTransferList />
      </ProtectedRoute>
    ),
  },
  {
    path: "inventory/stock-movements",
    element: (
      <ProtectedRoute>
        <StockMovementList />
      </ProtectedRoute>
    ),
  },
  {
    path: "inventory/stock-adjustments",
    element: (
      <ProtectedRoute>
        <StockAdjustmentList />
      </ProtectedRoute>
    ),
  },
];
