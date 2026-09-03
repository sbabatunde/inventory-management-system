// src/modules/documentation/components/sections/TroubleshootingGuide.tsx

import React from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";
import WarningBox from "../shared/WarningBox";
import TipBox from "../shared/TipBox";

const TroubleshootingGuide: React.FC = () => {
  const commonIssues = [
    {
      problem: "Can't log in",
      icon: "fa-sign-in-alt",
      color: "red",
      solutions: [
        "Check your email and password",
        "Ensure caps lock is off",
        "Clear browser cache",
        "Contact administrator if locked out",
      ],
    },
    {
      problem: "Item not showing in stock",
      icon: "fa-box",
      color: "amber",
      solutions: [
        "Verify item exists in Stock Items",
        "Check if item is marked as active",
        "Confirm stock balance exists for that store",
        "Check if there are pending transfers",
      ],
    },
    {
      problem: "Release form won't approve",
      icon: "fa-file-signature",
      color: "purple",
      solutions: [
        "Check stock availability",
        "Ensure all signatories have signed",
        "Verify you have approval permissions",
        "Check form status (must be pending approval)",
      ],
    },
    {
      problem: "Stock count mismatch",
      icon: "fa-scale-balanced",
      color: "blue",
      solutions: [
        "Create a stock adjustment",
        "Enter actual count",
        "Provide reason for discrepancy",
        "Submit for approval",
      ],
    },
    {
      problem: "CRM fetch failing",
      icon: "fa-cloud",
      color: "red",
      solutions: [
        "Check internet connection",
        "Verify CRM is online",
        "Use manual entry as fallback",
        "Contact administrator for CRM issues",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <DocSection
        title="Troubleshooting Guide"
        icon="fa-wrench"
        description="Solutions to common issues"
      />

      <InfoCard
        title="Common Issues & Solutions"
        icon="fa-list-check"
        color="blue"
      >
        <div className="space-y-4">
          {commonIssues.map((issue) => (
            <div
              key={issue.problem}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <div
                className={`bg-${issue.color}-50 px-4 py-3 flex items-center gap-3`}
              >
                <i className={`fas ${issue.icon} text-${issue.color}-600`} />
                <h4 className="text-sm font-bold text-slate-900">
                  {issue.problem}
                </h4>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {issue.solutions.map((solution, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <i className="fas fa-chevron-right text-emerald-500 mt-1 text-xs" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      <WarningBox title="Still Having Issues?">
        If you've tried all solutions and still experiencing problems, contact
        your system administrator or IT support team for assistance.
      </WarningBox>

      <TipBox title="Preventive Measures">
        <ul className="space-y-1">
          <li>• Regularly update your browser</li>
          <li>• Clear cache weekly</li>
          <li>• Keep your password secure</li>
          <li>• Log out when leaving your workstation</li>
        </ul>
      </TipBox>
    </div>
  );
};

export default TroubleshootingGuide;
