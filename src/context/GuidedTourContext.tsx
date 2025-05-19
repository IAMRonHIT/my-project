'use client';
import React, { createContext, useContext, useState } from 'react';

export interface TourStep {
  id: number;
  message: string;
  targetSelector?: string;
}

const STEPS: TourStep[] = [
  { id: 1, message: 'Welcome to the Ron AI demo for John Smith.' },
  { id: 2, message: 'This widget surfaces critical alerts.', targetSelector: '#critical-alerts' },
  { id: 3, message: 'View detailed AI agent findings here.', targetSelector: '#insights-link' },
];

interface GuidedTourContextValue {
  step: number;
  next: () => void;
  steps: TourStep[];
}

const GuidedTourContext = createContext<GuidedTourContextValue>({
  step: 0,
  next: () => {},
  steps: STEPS,
});

export function useGuidedTour() {
  return useContext(GuidedTourContext);
}

export function GuidedTourProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));

  return (
    <GuidedTourContext.Provider value={{ step, next, steps: STEPS }}>
      {children}
    </GuidedTourContext.Provider>
  );
}

