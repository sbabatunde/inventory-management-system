// src/modules/documentation/types/index.ts

export interface DocSection {
    id: string;
    title: string;
    icon: string;
    description: string;
    badge?: string;
}

export interface DocStep {
    title: string;
    description: string;
    icon: string;
    tip?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQCategory {
    category: string;
    questions: FAQItem[];
}

export interface TroubleshootingItem {
    problem: string;
    icon: string;
    color: string;
    solutions: string[];
}