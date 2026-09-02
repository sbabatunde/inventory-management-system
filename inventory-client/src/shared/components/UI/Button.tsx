// src/shared/components/UI/Button.tsx

import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "outline"
    | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  to?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
  to,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 focus:ring-emerald-500",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 focus:ring-rose-500",
    warning:
      "bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 focus:ring-amber-500",
    outline:
      "bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 focus:ring-emerald-500",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400",
  };

  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        icon &&
        iconPosition === "left" && <i className={`fas ${icon} text-xs`} />
      )}
      {children}
      {icon && iconPosition === "right" && !isLoading && (
        <i className={`fas ${icon} text-xs`} />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
};

export default Button;
