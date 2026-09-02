// src/modules/inventory/components/StockMovement/StockMovementList.tsx

import React, { useState } from "react";
import {
  PageHeader,
  Input,
  Select,
  DataTable,
  Badge,
  EmptyState,
  StatCard,
} from "../../../../shared/components/UI";
import { StockMovement, StockMovementType } from "../../types";
import { useStockMovements } from "../../hooks/useStockMovements";
import { MOVEMENT_TYPES, MOVEMENT_TYPE_MAP } from "../../constants";

const StockMovementList: React.FC = () => {
  const {
    movements,
    pagination,
    summary,
    isLoading,
    handlePageChange,
    handleSearch,
    handleTypeFilter,
    handleDateFilter,
  } = useStockMovements();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getMovementBadge = (type: StockMovementType) => {
    const typeInfo = MOVEMENT_TYPE_MAP[type];
    const variant =
      typeInfo.color === "green"
        ? "success"
        : typeInfo.color === "blue"
          ? "info"
          : typeInfo.color === "purple"
            ? "purple"
            : typeInfo.color === "amber"
              ? "warning"
              : "neutral";
    return <Badge variant={variant}>{typeInfo.label}</Badge>;
  };

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (movement: StockMovement) => (
        <div>
          <p className="font-medium text-slate-900">
            {new Date(movement.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(movement.created_at).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (movement: StockMovement) =>
        getMovementBadge(movement.movement_type),
    },
    {
      key: "item",
      header: "Item",
      render: (movement: StockMovement) => (
        <div>
          <p className="font-medium text-slate-900">
            {movement.stock_item?.name}
          </p>
          <p className="text-xs text-slate-400">{movement.stock_item?.code}</p>
        </div>
      ),
    },
    {
      key: "movement",
      header: "Movement",
      render: (movement: StockMovement) => (
        <div className="flex items-center gap-2">
          {movement.from_store && (
            <span className="text-sm text-slate-600">
              {movement.from_store.name}
            </span>
          )}
          {movement.from_store && movement.to_store && (
            <i className="fas fa-arrow-right text-xs text-slate-400" />
          )}
          {movement.to_store && (
            <span className="text-sm text-slate-600">
              {movement.to_store.name}
            </span>
          )}
          {!movement.from_store && !movement.to_store && (
            <span className="text-sm text-slate-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (movement: StockMovement) => (
        <div>
          <span
            className={`font-semibold ${
              movement.quantity > 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {movement.quantity > 0 ? "+" : ""}
            {movement.quantity}
          </span>
          <span className="text-xs text-slate-400 ml-1">
            {movement.stock_item?.unit_of_measure}
          </span>
        </div>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      render: (movement: StockMovement) => (
        <div>
          <p className="text-xs text-slate-400">
            Before: {movement.quantity_before}
          </p>
          <p className="text-xs text-slate-400">
            After: {movement.quantity_after}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (movement: StockMovement) => (
        <span className="text-sm text-slate-600">
          {movement.created_by_user?.name || "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Movements"
        icon="fa-arrows-left-right"
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock Movements" }]}
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Stock In"
            value={summary.stock_in.total_quantity}
            icon="fa-arrow-down"
            color="green"
          />
          <StatCard
            label="Stock Out"
            value={summary.stock_out.total_quantity}
            icon="fa-arrow-up"
            color="red"
          />
          <StatCard
            label="Net Movement"
            value={summary.net_movement}
            icon="fa-scale-balanced"
            color="blue"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search by item..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Types"
            options={MOVEMENT_TYPES}
            onChange={(e) =>
              handleTypeFilter(e.target.value as StockMovementType)
            }
            wrapperClassName="w-40"
          />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              handleDateFilter(e.target.value, dateTo);
            }}
            wrapperClassName="w-40"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              handleDateFilter(dateFrom, e.target.value);
            }}
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {movements.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-arrows-left-right"
            title="No stock movements found"
            description="Stock movements will appear here when items are received, issued, or transferred"
          />
        ) : (
          <DataTable<StockMovement>
            columns={columns}
            data={movements}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default StockMovementList;
