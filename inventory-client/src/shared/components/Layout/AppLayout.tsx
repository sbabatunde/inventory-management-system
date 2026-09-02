// src/shared/components/Layout/AppLayout.tsx

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../modules/auth/context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

interface ModuleInfo {
  name: string;
  key: string;
  icon: string;
  colorClass: string;
  description?: string;
}

interface NavItem {
  name: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const modules: ModuleInfo[] = [
    { name: "Dashboard", key: "core", icon: "fa-gauge", colorClass: "emerald" },
    {
      name: "Inventory",
      key: "inventory",
      icon: "fa-boxes-stacked",
      colorClass: "blue",
    },
    {
      name: "Release Forms",
      key: "release-form",
      icon: "fa-file-signature",
      colorClass: "purple",
    },
    { name: "Assets", key: "assets", icon: "fa-microchip", colorClass: "teal" },
    {
      name: "Procurement",
      key: "procurement",
      icon: "fa-truck-field",
      colorClass: "amber",
    },
    {
      name: "Reports",
      key: "reporting",
      icon: "fa-chart-line",
      colorClass: "pink",
    },
  ];

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      icon: "fa-gauge",
      route: "/dashboard",
    },
    {
      name: "User Management",
      icon: "fa-users",
      route: "/users",
    },
    {
      name: "Settings",
      icon: "fa-gear",
      children: [
        { name: "General", icon: "fa-sliders", route: "/settings" },
        {
          name: "Notifications",
          icon: "fa-bell",
          route: "/settings/notifications",
        },
        { name: "Security", icon: "fa-shield", route: "/settings/security" },
      ],
    },
    {
      name: "Profile",
      icon: "fa-user",
      route: "/profile",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigation = (route?: string) => {
    if (route) {
      navigate(route);
      setMobileSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActiveRoute = (route?: string): boolean => {
    if (!route) return false;
    return location.pathname === route || location.pathname.startsWith(route);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3 min-w-[200px] lg:min-w-[250px] border-r border-slate-200 pr-4">
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 transition-colors"
          >
            <i className="fas fa-bars text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
              <i className="fas fa-cubes text-white text-sm" />
            </div>
            <span className="font-bold text-slate-900 hidden sm:block">
              Inventory System
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <NotificationDropdown />

          <div className="relative group">
            <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.name || "User"}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {user?.roles?.[0] || "Staff"}
                </div>
              </div>
              <i className="fas fa-chevron-down text-[10px] text-slate-400" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <i className="fas fa-user text-slate-400 text-xs" />
                  Profile
                </button>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <i className="fas fa-cog text-slate-400 text-xs" />
                  Settings
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <i className="fas fa-sign-out-alt text-xs" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-slate-950 text-slate-300 z-40 transition-all duration-300 ${
          sidebarCollapsed ? "w-[70px]" : "w-[250px]"
        } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-3 border-b border-slate-800">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left text-xs" />
            {!sidebarCollapsed && (
              <span className="text-xs font-medium">Back to Dashboard</span>
            )}
          </button>
        </div>

        <div className="m-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-gauge text-emerald-400 text-sm" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-sm font-bold text-white">Core</div>
                <div className="text-[10px] text-slate-500">4 sections</div>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus[index] || false;
            const isActive = isActiveRoute(item.route);

            if (hasChildren) {
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleMenu(index.toString())}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <i
                        className={`fas ${item.icon} text-xs w-4 text-center`}
                      />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </div>
                    {!sidebarCollapsed && (
                      <i
                        className={`fas fa-chevron-right text-[10px] transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </button>
                  {!sidebarCollapsed && isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children?.map((child, childIndex) => (
                        <button
                          key={childIndex}
                          onClick={() => handleNavigation(child.route)}
                          className={`w-full flex items-center gap-3 pl-8 pr-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActiveRoute(child.route)
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <i className={`fas ${child.icon} text-[10px]`} />
                          <span>{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <i className={`fas ${item.icon} text-xs w-4 text-center`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-3 border-t border-slate-800">
          {!sidebarCollapsed && (
            <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">
              Other Modules
            </div>
          )}
          <div
            className={`grid ${sidebarCollapsed ? "grid-cols-1" : "grid-cols-2"} gap-1.5`}
          >
            {modules
              .filter((m) => m.key !== "core")
              .map((module) => (
                <button
                  key={module.key}
                  onClick={() => handleNavigation(`/modules/${module.key}`)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                  title={module.name}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      module.colorClass === "blue"
                        ? "bg-blue-500"
                        : module.colorClass === "purple"
                          ? "bg-purple-500"
                          : module.colorClass === "amber"
                            ? "bg-amber-500"
                            : module.colorClass === "teal"
                              ? "bg-teal-500"
                              : module.colorClass === "pink"
                                ? "bg-pink-500"
                                : "bg-emerald-500"
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="text-[10px] text-slate-400 font-medium truncate">
                      {module.name}
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-[250px]"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
