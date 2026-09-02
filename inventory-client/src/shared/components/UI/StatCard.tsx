// src/shared/components/UI/StatCard.tsx

import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: "blue" | "green" | "purple" | "amber" | "red";
  loading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = "green",
  loading = false,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
    red: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  };

  const style = colorStyles[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200 ${onClick ? "cursor-pointer" : ""}`}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="w-11 h-11 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-3 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-base mb-4 ${style.bg} ${style.text} ${style.border}`}
          >
            <i className={`fas ${icon}`} />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2">
            {value}
          </div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {label}
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;
