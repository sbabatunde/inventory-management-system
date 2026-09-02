// src/shared/components/UI/Input.tsx

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  required?: boolean;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      required,
      wrapperClassName = "",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {icon && iconPosition === "left" && (
            <i
              className={`fas ${icon} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm transition-colors group-focus-within:text-emerald-600`}
            />
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15
                    ${icon && iconPosition === "left" ? "pl-11" : "pl-4"}
                    ${icon && iconPosition === "right" ? "pr-11" : "pr-4"}
                    ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/15" : ""}
                    ${className}`}
            required={required}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <i
              className={`fas ${icon} absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm transition-colors group-focus-within:text-emerald-600`}
            />
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
            <i className="fas fa-circle-exclamation text-[10px]" />
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
