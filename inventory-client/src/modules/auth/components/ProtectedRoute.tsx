// src/modules/auth/components/ProtectedRoute.tsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Skeleton matching your AppLayout sidebar + navbar structure
const AppSkeleton = () => (
  <div className="flex h-screen bg-slate-50 animate-pulse">
    <div className="w-64 bg-slate-900 border-r border-slate-800" />{" "}
    {/* Sidebar */}
    <div className="flex-1 flex flex-col">
      <div className="h-16 bg-white border-b border-slate-200" /> {/* Navbar */}
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-32 bg-white rounded-2xl border border-slate-200" />
      </div>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AppSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
