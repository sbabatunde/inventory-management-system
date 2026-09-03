// src/modules/documentation/components/sections/AssetGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import StepByStep from "../shared/StepByStep";
import TipBox from "../shared/TipBox";

const AssetGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <DocSection
        title="Asset Management"
        icon="fa-microchip"
        description="Track and manage your company assets"
      />

      <InfoCard title="Asset Types" icon="fa-tags" color="blue">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <i className="fas fa-network-wired text-2xl text-blue-600 mb-2" />
            <h4 className="text-sm font-bold">POP Equipment</h4>
            <p className="text-xs text-slate-600 mt-1">
              Routers, switches, servers
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <i className="fas fa-house text-2xl text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold">Client Equipment</h4>
            <p className="text-xs text-slate-600 mt-1">
              CPE, modems, set-top boxes
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <i className="fas fa-wave-square text-2xl text-purple-600 mb-2" />
            <h4 className="text-sm font-bold">Fibre Equipment</h4>
            <p className="text-xs text-slate-600 mt-1">
              Splice closures, patch cords
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl">
            <i className="fas fa-broadcast-tower text-2xl text-amber-600 mb-2" />
            <h4 className="text-sm font-bold">Radio Equipment</h4>
            <p className="text-xs text-slate-600 mt-1">
              Antennas, radios, transmitters
            </p>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        title="Depreciation Methods"
        icon="fa-chart-line"
        color="purple"
      >
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900">Straight Line</h4>
            <p className="text-xs text-slate-600 mt-1">
              Equal depreciation each month. Best for most equipment.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900">
              Declining Balance
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Faster depreciation early on. Best for technology that becomes
              obsolete quickly.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900">Sum of Years</h4>
            <p className="text-xs text-slate-600 mt-1">
              Accelerated depreciation between straight-line and declining
              balance.
            </p>
          </div>
        </div>
      </InfoCard>

      <StepByStep
        steps={[
          {
            title: "Add Asset",
            description:
              "Enter asset details including purchase cost and useful life",
            icon: "fa-plus",
          },
          {
            title: "Set Depreciation",
            description: "Choose depreciation method and set parameters",
            icon: "fa-chart-line",
          },
          {
            title: "Assign to User",
            description: "Assign asset to an employee when deployed",
            icon: "fa-user-check",
          },
          {
            title: "Track Value",
            description:
              "System automatically calculates depreciation over time",
            icon: "fa-trending-down",
          },
        ]}
      />

      <TipBox title="Depreciation Tip">
        Use declining balance method for technology assets that lose value
        quickly, and straight-line for durable equipment.
      </TipBox>
    </div>
  );
};

export default AssetGuide;
