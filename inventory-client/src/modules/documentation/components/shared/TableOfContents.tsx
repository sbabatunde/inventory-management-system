// src/modules/documentation/components/shared/TableOfContents.tsx

import React from "react";

interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onNavigate?: (id: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  onNavigate,
}) => {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate?.(item.id)}
          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
            activeId === item.id
              ? "bg-emerald-50 text-emerald-700 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          style={{ paddingLeft: `${(item.level || 1) * 16}px` }}
        >
          {item.title}
        </button>
      ))}
    </nav>
  );
};

export default TableOfContents;
