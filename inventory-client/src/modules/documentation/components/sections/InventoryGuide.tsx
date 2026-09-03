// src/modules/documentation/components/sections/InventoryGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import StepByStep from "../shared/StepByStep";
import TipBox from "../shared/TipBox";

const InventoryGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <DocSection
        title="Inventory Management"
        icon="fa-boxes-stacked"
        description="Learn how to manage stores, stock items, transfers, and adjustments"
      />

      {/* Stores Management */}
      <InfoCard title="Managing Stores" icon="fa-warehouse" color="blue">
        <p className="text-sm text-slate-600 mb-4">
          Stores are physical locations where inventory is kept. You can have:
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <i className="fas fa-building text-2xl text-blue-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">HQ</p>
            <p className="text-xs text-slate-500">Headquarters</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <i className="fas fa-store text-2xl text-purple-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">Branch</p>
            <p className="text-xs text-slate-500">Regional Offices</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl text-center">
            <i className="fas fa-tower-cell text-2xl text-emerald-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">POP</p>
            <p className="text-xs text-slate-500">Point of Presence</p>
          </div>
        </div>
        <StepByStep
          steps={[
            {
              title: "Navigate to Stores",
              description: "Go to Inventory → Stores in the sidebar",
              icon: "fa-arrow-right",
            },
            {
              title: "Click Add Store",
              description: "Button is located in the top right corner",
              icon: "fa-plus",
            },
            {
              title: "Fill Store Details",
              description: "Enter name, type, and location information",
              icon: "fa-edit",
            },
            {
              title: "Create Store",
              description: "Click Create to save the new store",
              icon: "fa-check",
            },
          ]}
        />
      </InfoCard>

      {/* Stock Transfers */}
      <InfoCard title="Stock Transfers" icon="fa-right-left" color="purple">
        <div className="bg-purple-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="font-bold text-purple-700">Store A</span>
            <i className="fas fa-arrow-right text-purple-400" />
            <i className="fas fa-truck text-purple-600 text-xl" />
            <i className="fas fa-arrow-right text-purple-400" />
            <span className="font-bold text-purple-700">Store B</span>
          </div>
        </div>
        <StepByStep
          steps={[
            {
              title: "Create Transfer",
              description: "Go to Inventory → Transfers → New Transfer",
              icon: "fa-plus",
            },
            {
              title: "Select Stores",
              description: "Choose source and destination stores",
              icon: "fa-warehouse",
            },
            {
              title: "Add Items",
              description: "Select items and quantities to transfer",
              icon: "fa-box",
            },
            {
              title: "Submit for Approval",
              description: "Transfer goes to pending approval",
              icon: "fa-paper-plane",
            },
            {
              title: "Approve & Receive",
              description: "Manager approves, destination receives",
              icon: "fa-check-double",
            },
          ]}
        />
        <TipBox title="Transfer Status">
          Track your transfer status: Requested → Approved → In Transit →
          Received
        </TipBox>
      </InfoCard>

      {/* Stock Adjustments */}
      <InfoCard title="Stock Adjustments" icon="fa-sliders" color="amber">
        <p className="text-sm text-slate-600 mb-4">
          Use adjustments when actual stock doesn't match system records.
        </p>
        <div className="bg-amber-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800">
            <strong>Example:</strong> System shows 100 units, but physical count
            is 95. Create an adjustment to correct this.
          </p>
        </div>
        <StepByStep
          steps={[
            {
              title: "Navigate to Adjustments",
              description: "Go to Inventory → Adjustments",
              icon: "fa-sliders",
            },
            {
              title: "Select Item",
              description: "Choose the item and store",
              icon: "fa-box",
            },
            {
              title: "Enter New Quantity",
              description: "Input the actual counted quantity",
              icon: "fa-edit",
            },
            {
              title: "Provide Reason",
              description: "Explain why adjustment is needed",
              icon: "fa-comment",
            },
            {
              title: "Submit for Approval",
              description: "Wait for manager approval",
              icon: "fa-check",
            },
          ]}
        />
      </InfoCard>
    </div>
  );
};

export default InventoryGuide;
