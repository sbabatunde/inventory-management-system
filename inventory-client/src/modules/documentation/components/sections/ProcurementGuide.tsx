// src/modules/documentation/components/sections/ProcurementGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import StepByStep from "../shared/StepByStep";
import TipBox from "../shared/TipBox";

const ProcurementGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <DocSection
        title="Procurement Management"
        icon="fa-truck-field"
        description="Manage suppliers, requisitions, and purchase orders"
      />

      <InfoCard title="Procurement Flow" icon="fa-diagram-project" color="blue">
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            {[
              "Requisition",
              "Approval",
              "Purchase Order",
              "Send",
              "Receive",
            ].map((step, index) => (
              <React.Fragment key={step}>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">
                    {index + 1}
                  </div>
                  <span className="text-xs font-semibold text-blue-700">
                    {step}
                  </span>
                </div>
                {index < 4 && (
                  <i className="fas fa-arrow-right text-blue-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </InfoCard>

      <InfoCard
        title="Creating Purchase Requisition"
        icon="fa-clipboard-list"
        color="emerald"
      >
        <StepByStep
          steps={[
            {
              title: "Navigate to Requisitions",
              description: "Go to Procurement → Requisitions",
              icon: "fa-arrow-right",
            },
            {
              title: "Click New Requisition",
              description: "Start a new purchase request",
              icon: "fa-plus",
            },
            {
              title: "Fill Details",
              description: "Enter title, priority, and description",
              icon: "fa-edit",
            },
            {
              title: "Add Items",
              description: "Select items, quantities, and estimated costs",
              icon: "fa-box",
            },
            {
              title: "Submit for Approval",
              description: "Send to manager for approval",
              icon: "fa-paper-plane",
            },
          ]}
        />
      </InfoCard>

      <InfoCard title="Receiving Goods" icon="fa-box-open" color="purple">
        <StepByStep
          steps={[
            {
              title: "Open Purchase Order",
              description: "Find the PO that's been delivered",
              icon: "fa-file-invoice",
            },
            {
              title: "Click Receive Goods",
              description: "Start the receiving process",
              icon: "fa-box-open",
            },
            {
              title: "Enter Quantities",
              description: "Input actual received quantities",
              icon: "fa-edit",
            },
            {
              title: "Confirm Receipt",
              description: "Stock automatically updates in system",
              icon: "fa-check",
            },
          ]}
        />
        <TipBox title="Receiving Tip">
          You can receive partial deliveries. The system will track remaining
          quantities automatically.
        </TipBox>
      </InfoCard>
    </div>
  );
};

export default ProcurementGuide;
