// src/modules/reporting/components/ReportDashboard.tsx

import React, { useState, useEffect } from "react";
import {
  PageHeader,
  StatCard,
  DataTable,
  Badge,
  LoadingSpinner,
} from "../../../shared/components/UI";
import { reportService } from "../services/report.service";
import {
  CostBreakdown,
  InventoryValuation,
  SupplierPerformance,
} from "../types";
import { showError } from "../../../shared/utils/toast";

const ReportDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(
    null,
  );
  const [inventoryValuation, setInventoryValuation] = useState<
    InventoryValuation[]
  >([]);
  const [supplierPerformance, setSupplierPerformance] = useState<
    SupplierPerformance[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [selectedMonth]);

  const fetchReports = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [cost, inventory, suppliers] = await Promise.all([
        reportService.getCostBreakdown(selectedMonth),
        reportService.getInventoryReport(),
        reportService.getSupplierPerformance(selectedMonth),
      ]);
      setCostBreakdown(cost);
      setInventoryValuation(inventory);
      setSupplierPerformance(suppliers);
    } catch (error: any) {
      showError(error.message || "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading reports..." />;
  }

  const supplierColumns = [
    {
      key: "supplier",
      header: "Supplier",
      render: (supplier: SupplierPerformance) => (
        <div>
          <p className="font-medium text-slate-900">{supplier.name}</p>
          <p className="text-xs text-slate-400">{supplier.code}</p>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      render: (supplier: SupplierPerformance) => (
        <span className="font-semibold text-slate-900">
          {supplier.total_orders}
        </span>
      ),
    },
    {
      key: "total_value",
      header: "Total Value",
      render: (supplier: SupplierPerformance) => (
        <span className="text-sm text-slate-600">
          {formatCurrency(supplier.total_value)}
        </span>
      ),
    },
    {
      key: "average",
      header: "Avg Order",
      render: (supplier: SupplierPerformance) => (
        <span className="text-sm text-slate-600">
          {formatCurrency(supplier.average_order_value)}
        </span>
      ),
    },
    {
      key: "completed",
      header: "Completed",
      render: (supplier: SupplierPerformance) => (
        <Badge variant="success">{supplier.completed_orders}</Badge>
      ),
    },
    {
      key: "cancelled",
      header: "Cancelled",
      render: (supplier: SupplierPerformance) => (
        <Badge variant="danger">{supplier.cancelled_orders}</Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        icon="fa-chart-line"
        breadcrumbs={[{ label: "Reports" }, { label: "Dashboard" }]}
      />

      {/* Month Selector */}
      <div className="mb-6">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15"
        />
      </div>

      {/* Cost Summary Cards */}
      {costBreakdown && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Installation Cost"
            value={formatCurrency(costBreakdown.installation.total_cost)}
            icon="fa-wrench"
            color="blue"
          />
          <StatCard
            label="Maintenance Cost"
            value={formatCurrency(costBreakdown.maintenance.total_cost)}
            icon="fa-tools"
            color="amber"
          />
          <StatCard
            label="Total Cost"
            value={formatCurrency(costBreakdown.total)}
            icon="fa-money-bill"
            color="green"
          />
          <StatCard
            label="Total Releases"
            value={
              costBreakdown.installation.count + costBreakdown.maintenance.count
            }
            icon="fa-file-signature"
            color="purple"
          />
        </div>
      )}

      {/* Inventory Valuation */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">
            Inventory Valuation
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Store
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Total Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryValuation.map((store, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      {store.store_name}
                    </p>
                    <p className="text-xs text-slate-400">{store.store_code}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {store.total_quantity}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatCurrency(store.total_value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Performance */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">
            Supplier Performance
          </h2>
        </div>
        <DataTable<SupplierPerformance>
          columns={supplierColumns}
          data={supplierPerformance}
        />
      </div>
    </div>
  );
};

export default ReportDashboard;
