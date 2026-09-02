// src/shared/components/UI/DataTable.tsx

import React, { useState } from "react";
import { PaginationMeta } from "../../types/global";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  loading?: boolean;
  emptyMessage?: string;
  showSerialNumbers?: boolean;
  onRowClick?: (item: T) => void;
}

function DataTable<T>({
  columns,
  data,
  pagination,
  onPageChange,
  onSort,
  loading = false,
  emptyMessage = "No records found",
  showSerialNumbers = true,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const getItemId = (item: any, index: number): string | number => {
    return item?.id ?? index;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {showSerialNumbers && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                S/N
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                  >
                    {column.header}
                    <i
                      className={`fas fa-sort text-[10px] ${
                        sortKey === column.key
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showSerialNumbers ? 1 : 0)}
                className="px-4 py-16 text-center"
              >
                <div className="text-slate-400">
                  <i className="fas fa-inbox text-4xl mb-4 opacity-40" />
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={getItemId(item, index)}
                onClick={() => onRowClick?.(item)}
                className={`hover:bg-slate-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {showSerialNumbers && (
                  <td className="px-4 py-3 text-sm text-slate-500 font-medium">
                    {((pagination?.current_page || 1) - 1) *
                      (pagination?.per_page || 10) +
                      index +
                      1}
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-slate-700"
                  >
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold">{pagination.from}</span> -{" "}
            <span className="font-semibold">{pagination.to}</span> of{" "}
            <span className="font-semibold">{pagination.total}</span> results
          </p>

          <div className="flex gap-1.5">
            <button
              onClick={() => onPageChange?.(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-chevron-left text-xs" />
            </button>

            {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.last_page ||
                  Math.abs(page - pagination.current_page) <= 2,
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => onPageChange?.(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      page === pagination.current_page
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => onPageChange?.(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-chevron-right text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
