// src/shared/components/UI/PageHeader.tsx

import React from "react";

interface PageHeaderProps {
  title: string;
  icon?: string;
  breadcrumbs?: Array<{ label: string; link?: string }>;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  breadcrumbs = [],
  actions,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 mb-1">
            {icon && <i className={`fas ${icon} text-emerald-600`} />}
            {title}
          </h1>
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <i className="fas fa-chevron-right text-xs" />}
                  {crumb.link ? (
                    <a
                      href={crumb.link}
                      className="text-emerald-600 font-medium hover:underline"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
