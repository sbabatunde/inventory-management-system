// src/shared/components/UI/EmptyState.tsx

import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "fa-inbox",
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i className={`fas ${icon} text-3xl text-slate-300`} />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="fa-plus">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
