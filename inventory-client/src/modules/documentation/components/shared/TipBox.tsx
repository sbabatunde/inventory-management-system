// src/modules/documentation/components/shared/TipBox.tsx

import React from "react";

interface TipBoxProps {
  title?: string;
  children: React.ReactNode;
  type?: "tip" | "note" | "important";
}

const TipBox: React.FC<TipBoxProps> = ({ title, children, type = "tip" }) => {
  const config = {
    tip: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "fa-lightbulb",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-800",
      textColor: "text-emerald-700",
      defaultTitle: "Pro Tip",
    },
    note: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "fa-circle-info",
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      textColor: "text-blue-700",
      defaultTitle: "Note",
    },
    important: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "fa-triangle-exclamation",
      iconColor: "text-amber-600",
      titleColor: "text-amber-800",
      textColor: "text-amber-700",
      defaultTitle: "Important",
    },
  };

  const cfg = config[type];

  return (
    <div
      className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 flex items-start gap-3`}
    >
      <i className={`fas ${cfg.icon} ${cfg.iconColor} text-lg mt-0.5`} />
      <div>
        <h4 className={`text-sm font-bold ${cfg.titleColor}`}>
          {title || cfg.defaultTitle}
        </h4>
        <div className={`text-sm ${cfg.textColor} mt-1`}>{children}</div>
      </div>
    </div>
  );
};

export default TipBox;
