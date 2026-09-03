// src/modules/documentation/components/sections/ReleaseFormGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import StepByStep from "../shared/StepByStep";
import TipBox from "../shared/TipBox";
import WarningBox from "../shared/WarningBox";

const ReleaseFormGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <DocSection
        title="Release Forms"
        icon="fa-file-signature"
        description="Complete guide to creating and managing release forms"
      />

      {/* Categories */}
      <InfoCard title="Release Categories" icon="fa-tags" color="purple">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-wrench" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Installation</h4>
              <p className="text-xs text-slate-600 mt-1">
                For new equipment installations. Requires Job Order number from
                CRM.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-blue-600">
                  Job Order Required
                </span>
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-blue-600">
                  CRM Integration
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-tools" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Maintenance</h4>
              <p className="text-xs text-slate-600 mt-1">
                For equipment repairs and maintenance. Requires Ticket number
                from CRM.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-amber-600">
                  Ticket Required
                </span>
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-amber-600">
                  CRM Integration
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-ellipsis" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Others</h4>
              <p className="text-xs text-slate-600 mt-1">
                For general releases not related to installation or maintenance.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-purple-600">
                  No Reference Required
                </span>
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-purple-600">
                  Manual Entry
                </span>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Workflow */}
      <InfoCard
        title="Release Form Workflow"
        icon="fa-diagram-project"
        color="emerald"
      >
        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            {["Draft", "Pending", "Approved", "Dispatched", "Completed"].map(
              (status, index) => (
                <React.Fragment key={status}>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">
                      {status}
                    </span>
                  </div>
                  {index < 4 && (
                    <i className="fas fa-arrow-right text-emerald-400" />
                  )}
                </React.Fragment>
              ),
            )}
          </div>
        </div>
        <StepByStep
          steps={[
            {
              title: "Create Draft",
              description: "Fill in form details, add items",
              icon: "fa-file",
            },
            {
              title: "Submit for Approval",
              description: "Send to manager for review",
              icon: "fa-paper-plane",
            },
            {
              title: "Manager Approves",
              description: "Stock availability checked",
              icon: "fa-check-circle",
            },
            {
              title: "Dispatch Items",
              description: "Stock automatically deducted",
              icon: "fa-truck",
            },
            {
              title: "Complete Form",
              description: "Confirm delivery, update CRM",
              icon: "fa-flag-checkered",
            },
          ]}
        />
      </InfoCard>

      <WarningBox title="Important Note">
        Once a release form is dispatched, stock is automatically deducted. Make
        sure quantities are correct before dispatching.
      </WarningBox>

      <TipBox title="Pro Tip">
        Use "Fetch from CRM" button to automatically populate job order or
        ticket details, saving time and reducing errors.
      </TipBox>
    </div>
  );
};

export default ReleaseFormGuide;
