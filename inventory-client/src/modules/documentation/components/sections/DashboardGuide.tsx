// src/modules/documentation/components/sections/DashboardGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import TipBox from "../shared/TipBox";

const DashboardGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <DocSection
        title="Dashboard Overview"
        icon="fa-gauge"
        description="Understanding your main dashboard and its features"
      />

      <InfoCard title="Dashboard Components" icon="fa-layout" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <i className="fas fa-chart-bar text-2xl text-blue-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900">
              Statistics Cards
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Shows key metrics like total users, active stores, pending
              approvals
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <i className="fas fa-clock text-2xl text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900">
              Recent Activities
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Displays latest actions taken by users in the system
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <i className="fas fa-bell text-2xl text-purple-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
            <p className="text-xs text-slate-600 mt-1">
              Alerts for approvals, low stock, and important updates
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl">
            <i className="fas fa-user text-2xl text-amber-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900">Profile Menu</h4>
            <p className="text-xs text-slate-600 mt-1">
              Access your profile settings, notifications, and logout
            </p>
          </div>
        </div>
      </InfoCard>

      <TipBox title="Dashboard Tip">
        Click on any statistic card to see detailed information about that
        metric.
      </TipBox>
    </div>
  );
};

export default DashboardGuide;
