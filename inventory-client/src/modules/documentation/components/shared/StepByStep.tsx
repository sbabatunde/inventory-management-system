// src/modules/documentation/components/shared/StepByStep.tsx

import React from "react";

interface Step {
  title: string;
  description: string;
  icon: string;
  tip?: string;
}

interface StepByStepProps {
  steps: Step[];
  orientation?: "vertical" | "horizontal";
}

const StepByStep: React.FC<StepByStepProps> = ({
  steps,
  orientation = "vertical",
}) => {
  if (orientation === "horizontal") {
    return (
      <div className="flex items-start gap-4 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-emerald-200" />
              )}
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <i className={`fas ${step.icon} text-emerald-600 mb-2`} />
              <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{step.description}</p>
              {step.tip && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <i className="fas fa-lightbulb" />
                  {step.tip}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4 mb-6 last:mb-0">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 flex-1 bg-emerald-200 my-2" />
            )}
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <i className={`fas ${step.icon} text-emerald-600 text-sm`} />
              <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
            </div>
            <p className="text-sm text-slate-600">{step.description}</p>
            {step.tip && (
              <div className="mt-2 p-2 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-700 flex items-center gap-1">
                  <i className="fas fa-lightbulb" />
                  {step.tip}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepByStep;
