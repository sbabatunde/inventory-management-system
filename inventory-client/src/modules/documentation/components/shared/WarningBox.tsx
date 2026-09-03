// src/modules/documentation/components/shared/WarningBox.tsx

import React from "react";

interface WarningBoxProps {
  title?: string;
  children: React.ReactNode;
}

const WarningBox: React.FC<WarningBoxProps> = ({
  title = "Warning",
  children,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
      <i className="fas fa-circle-exclamation text-red-600 text-lg mt-0.5" />
      <div>
        <h4 className="text-sm font-bold text-red-800">{title}</h4>
        <div className="text-sm text-red-700 mt-1">{children}</div>
      </div>
    </div>
  );
};

export default WarningBox;
