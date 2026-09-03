// src/modules/documentation/components/DocumentationLayout.tsx (Complete)

import React, { useState, useEffect } from "react";
import { DOC_SECTIONS } from "../constants";

const DocumentationLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sections = {
    "getting-started": React.lazy(() => import("./sections/GettingStarted")),
    dashboard: React.lazy(() => import("./sections/DashboardGuide")),
    inventory: React.lazy(() => import("./sections/InventoryGuide")),
    "release-forms": React.lazy(() => import("./sections/ReleaseFormGuide")),
    assets: React.lazy(() => import("./sections/AssetGuide")),
    procurement: React.lazy(() => import("./sections/ProcurementGuide")),
    reports: React.lazy(() => import("./sections/ReportGuide")),
    troubleshooting: React.lazy(
      () => import("./sections/TroubleshootingGuide"),
    ),
    faq: React.lazy(() => import("./sections/FAQGuide")),
  };

  const activeDoc = DOC_SECTIONS.find((s) => s.id === activeSection);
  const ActiveComponent = sections[activeSection as keyof typeof sections];

  const filteredSections = DOC_SECTIONS.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <i className="fas fa-bars" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900">
                  Documentation
                </h1>
                <p className="text-xs text-slate-500">
                  User Guide & Help Center
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          {sidebarOpen && (
            <aside
              className={`${isMobile ? "fixed inset-0 z-50 bg-white" : "w-64 flex-shrink-0"}`}
            >
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600"
                >
                  <i className="fas fa-times" />
                </button>
              )}
              <nav className="space-y-1 p-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">
                  Contents
                </h2>
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "hover:bg-white border border-transparent text-slate-600"
                    }`}
                  >
                    <i
                      className={`fas ${section.icon} mt-1 text-sm ${
                        activeSection === section.id
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold">{section.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {section.description}
                      </p>
                      {section.badge && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-500">
                          {section.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeDoc && ActiveComponent && (
              <React.Suspense
                fallback={
                  <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                  </div>
                }
              >
                <ActiveComponent />
              </React.Suspense>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocumentationLayout;
