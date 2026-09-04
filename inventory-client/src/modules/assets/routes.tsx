// src/modules/assets/routes.tsx

import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const AssetList = lazy(() => import("./components/AssetList"));

export const assetsRoutes: RouteObject[] = [
  {
    path: "assets",
    element: <AssetList />,
  },
];
