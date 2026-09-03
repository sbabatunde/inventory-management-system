// src/modules/documentation/components/shared/InfoCard.tsx

import React from "react";

interface InfoCardProps {
  title: string;
  icon: string;
  color?: "emerald" | "blue" | "purple" | "amber" | "red";
  children: React.ReactNode;
  action?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  color = "emerald",
  children,
  action,
}) => {
  const colorClasses = {
    emerald: {
      header: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: "text-emerald-600",
    },
    blue: {
      header: "bg-blue-50 text-blue-600 border-blue-200",
      icon: "text-blue-600",
    },
    purple: {
      header: "bg-purple-50 text-purple-600 border-purple-200",
      icon: "text-purple-600",
    },
    amber: {
      header: "bg-amber-50 text-amber-600 border-amber-200",
      icon: "text-amber-600",
    },
    red: {
      header: "bg-red-50 text-red-600 border-red-200",
      icon: "text-red-600",
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className={`px-6 py-4 border-b ${colorClasses[color].header} flex items-center justify-between`}
      >
        <h3 className="text-base font-bold flex items-center gap-2">
          <i className={`fas ${icon} ${colorClasses[color].icon}`} />
          {title}
        </h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default InfoCard;
