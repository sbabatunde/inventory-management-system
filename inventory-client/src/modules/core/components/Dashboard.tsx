// src/modules/core/components/Dashboard.tsx (updated)

import React, { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import { DashboardStats, Activity } from "../types";
import {
  PageHeader,
  StatCard,
  LoadingSpinner,
  EmptyState,
} from "../../../shared/components/UI";
import { showError } from "../../../shared/utils/toast";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivities(),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        showError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." fullScreen />;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        icon="fa-gauge"
        breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fas fa-clock text-emerald-600" />
            Recent Activities
          </h2>
        </div>

        {activities.length === 0 ? (
          <EmptyState
            icon="fa-clock"
            title="No recent activities"
            description="Activities will appear here as they happen"
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50"
              >
                <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-emerald-600 text-xs" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-medium">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activity.user_name}
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
