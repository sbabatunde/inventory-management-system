// src/shared/components/UI/LazyLoadingWrapper.tsx

import React, { useState, useEffect } from "react";

interface LazyLoadingWrapperProps {
  children: React.ReactNode;
}

const LazyLoadingWrapper: React.FC<LazyLoadingWrapperProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(Math.floor(newProgress));

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-20 h-20 mb-6">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              style={{ transition: "stroke-dashoffset 0.2s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-emerald-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="h-1.5 w-48 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-slate-400 mt-3">Loading component...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LazyLoadingWrapper;
