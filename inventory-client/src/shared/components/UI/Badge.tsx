// src/shared/components/UI/Badge.tsx

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "info" | "purple" | "neutral";
  icon?: string;
  size?: "sm" | "md";
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  icon,
  size = "sm",
}) => {
  const variantClasses = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {icon && <i className={`fas ${icon} text-[10px]`} />}
      {children}
    </span>
  );
};

export default Badge;
