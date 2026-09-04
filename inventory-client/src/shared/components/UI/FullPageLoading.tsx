// src/shared/components/UI/FullPageLoading.tsx

import React, { useState, useEffect } from "react";

interface FullPageLoadingProps {
  message?: string;
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = "Loading...",
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([
    { id: 1, label: "Connecting to server", completed: false },
    { id: 2, label: "Loading data", completed: false },
    { id: 3, label: "Preparing interface", completed: false },
    { id: 4, label: "Finalizing", completed: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;

        if (newProgress >= 100) {
          clearInterval(interval);
          setLoadingSteps((steps) =>
            steps.map((step) => ({ ...step, completed: true })),
          );
          return 100;
        }

        // Update steps based on progress
        setLoadingSteps((steps) =>
          steps.map((step) => {
            if (newProgress >= step.id * 25) {
              return { ...step, completed: true };
            }
            return step;
          }),
        );

        return Math.floor(newProgress);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-lg px-6">
        {/* Animated Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
              <i className="fas fa-boxes-stacked text-3xl text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center animate-spin">
              <i className="fas fa-sync text-white text-xs" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Inventory System
          </h1>
          <p className="text-sm text-slate-400">{message}</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3 mb-6">
          {loadingSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.completed
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {step.completed ? (
                  <i className="fas fa-check text-[10px]" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  step.completed ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
              {!step.completed && (
                <span className="ml-auto w-4 h-4 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Overall Progress</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoading;
