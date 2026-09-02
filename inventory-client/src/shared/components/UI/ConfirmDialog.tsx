// src/shared/components/UI/ConfirmDialog.tsx

import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const iconMap = {
    danger: { icon: "fa-trash", bg: "bg-rose-50", text: "text-rose-600" },
    warning: {
      icon: "fa-triangle-exclamation",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    info: { icon: "fa-circle-info", bg: "bg-blue-50", text: "text-blue-600" },
  };

  const config = iconMap[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={
              variant === "danger"
                ? "danger"
                : variant === "warning"
                  ? "warning"
                  : "primary"
            }
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} ${config.text}`}
        >
          <i className={`fas ${config.icon} text-lg`} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
