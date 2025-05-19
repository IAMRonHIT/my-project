'use client';
import React from 'react';
import { usePatientData } from '@/context/PatientDataContext';

export default function InsightsPage() {
  const { data } = usePatientData();

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">AI Agent Insights</h1>
      <p className="text-zinc-400">Placeholder for agent insights.</p>
    </div>
  );
}
