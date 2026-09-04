// src/shared/components/UI/LoadingProgress.tsx

import React, { useState, useEffect } from "react";

interface LoadingProgressProps {
  message?: string;
  onComplete?: () => void;
  duration?: number; // in milliseconds
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  message = "Loading...",
  onComplete,
  duration = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    let currentProgress = 0;
    const interval = 30; // Update every 30ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatus("Complete!");
        clearInterval(timer);
        onComplete?.();
      } else {
        setProgress(Math.floor(currentProgress));

        // Update status message based on progress
        if (currentProgress < 20) {
          setStatus("Initializing...");
        } else if (currentProgress < 40) {
          setStatus("Loading data...");
        } else if (currentProgress < 60) {
          setStatus("Processing...");
        } else if (currentProgress < 80) {
          setStatus("Almost there...");
        } else {
          setStatus("Finalizing...");
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <i className="fas fa-cubes text-2xl text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Inventory System</h2>
          <p className="text-sm text-slate-400 mt-1">{message}</p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-200 bg-emerald-600/20">
                {status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-white">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-700">
            <div
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease-in-out",
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"
            />
          </div>
        </div>

        {/* Percentage Circle */}
        <div className="flex justify-center mt-6">
          <div className="relative w-24 h-24">
            <svg
              className="w-24 h-24 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#334155"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.3s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{
                animationDelay: `${dot * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;
