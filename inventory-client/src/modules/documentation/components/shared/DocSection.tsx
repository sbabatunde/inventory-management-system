// src/modules/documentation/components/shared/DocSection.tsx

import React from "react";

interface DocSectionProps {
  title: string;
  icon: string;
  description: string;
  badge?: string;
}

const DocSection: React.FC<DocSectionProps> = ({
  title,
  icon,
  description,
  badge,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
          <i className={`fas ${icon} text-2xl`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{title}</h2>
            {badge && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-emerald-100 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DocSection;
