// src/modules/documentation/components/sections/FAQGuide.tsx

import React, { useState } from "react";
import DocSection from "../shared/DocSection";
import InfoCard from "../shared/InfoCard";

const FAQGuide: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "How do I reset my password?",
          a: 'Go to the login page and click "Forgot Password". Enter your email and follow the instructions sent to your inbox.',
        },
        {
          q: "Can I use the system on my phone?",
          a: "Yes! The system is fully responsive and works on mobile devices, tablets, and desktops.",
        },
        {
          q: "How often is data backed up?",
          a: "Data is backed up automatically every 24 hours by your system administrator.",
        },
      ],
    },
    {
      category: "Inventory",
      questions: [
        {
          q: "What is the difference between serialized and non-serialized items?",
          a: "Serialized items have unique serial numbers tracked individually (like routers). Non-serialized items are tracked by quantity (like cables).",
        },
        {
          q: "How do I transfer stock between stores?",
          a: "Go to Inventory → Transfers → New Transfer. Select source and destination stores, add items, and submit for approval.",
        },
        {
          q: "What should I do if stock count doesn't match?",
          a: "Create a stock adjustment with the correct quantity and reason. This will be reviewed and approved by a manager.",
        },
      ],
    },
    {
      category: "Release Forms",
      questions: [
        {
          q: "What is the difference between installation and maintenance releases?",
          a: "Installation releases are for new equipment setup (requires Job Order). Maintenance releases are for repairs (requires Ticket).",
        },
        {
          q: "Can I create a release form without CRM?",
          a: 'Yes, use the "Others" category for general releases that don\'t require CRM references.',
        },
        {
          q: "How do I track a release form status?",
          a: "Open the release form to see its current status. You can also filter by status in the list view.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <DocSection
        title="Frequently Asked Questions"
        icon="fa-question-circle"
        description="Quick answers to common questions"
      />

      {faqs.map((category, categoryIndex) => (
        <InfoCard
          key={category.category}
          title={category.category}
          icon="fa-folder"
          color={
            categoryIndex === 0
              ? "blue"
              : categoryIndex === 1
                ? "emerald"
                : "purple"
          }
        >
          <div className="space-y-2">
            {category.questions.map((faq, faqIndex) => {
              const globalIndex = categoryIndex * 10 + faqIndex;
              const isOpen = openQuestion === globalIndex;

              return (
                <div
                  key={faqIndex}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenQuestion(isOpen ? null : globalIndex)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {faq.q}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 bg-white">
                      <p className="text-sm text-slate-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </InfoCard>
      ))}
    </div>
  );
};

export default FAQGuide;
