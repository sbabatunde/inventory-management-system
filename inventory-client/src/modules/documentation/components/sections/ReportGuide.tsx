// src/modules/documentation/components/sections/ReportGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import StepByStep from "../shared/StepByStep";
import TipBox from "../shared/TipBox";

const ReportGuide: React.FC = () => {
  const reports = [
    {
      name: "Cost Breakdown",
      icon: "fa-money-bill",
      color: "emerald",
      description:
        "Monthly costs by category (installation, maintenance, logistics)",
    },
    {
      name: "Inventory Valuation",
      icon: "fa-boxes-stacked",
      color: "blue",
      description: "Total stock value by store location",
    },
    {
      name: "Stock Movement",
      icon: "fa-arrows-left-right",
      color: "purple",
      description:
        "Summary of all stock movements (receipts, issues, transfers)",
    },
    {
      name: "Low Stock",
      icon: "fa-triangle-exclamation",
      color: "amber",
      description: "Items that are below reorder level",
    },
    {
      name: "Supplier Performance",
      icon: "fa-truck-field",
      color: "red",
      description: "Order fulfillment statistics by supplier",
    },
  ];

  return (
    <div className="space-y-8">
      <DocSection
        title="Reports & Analytics"
        icon="fa-chart-line"
        description="Generate and understand various reports"
      />

      <InfoCard title="Available Reports" icon="fa-list" color="blue">
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.name}
              className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-${report.color}-100 flex items-center justify-center`}
              >
                <i className={`fas ${report.icon} text-${report.color}-600`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {report.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {report.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard
        title="Generating a Report"
        icon="fa-file-export"
        color="emerald"
      >
        <StepByStep
          steps={[
            {
              title: "Navigate to Reports",
              description: "Go to Reports in the sidebar",
              icon: "fa-arrow-right",
            },
            {
              title: "Select Month",
              description: "Choose the month you want to analyze",
              icon: "fa-calendar",
            },
            {
              title: "View Results",
              description: "Reports display automatically",
              icon: "fa-chart-bar",
            },
            {
              title: "Export if Needed",
              description: "Download as Excel, PDF, or CSV",
              icon: "fa-download",
            },
          ]}
        />
      </InfoCard>

      <TipBox title="Report Tip">
        Reports are pre-aggregated for fast loading. Data is updated nightly,
        but you can request an on-demand refresh from your administrator.
      </TipBox>
    </div>
  );
};

export default ReportGuide;
