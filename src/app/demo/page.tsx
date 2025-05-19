'use client';

import React from 'react';
import { usePatientData } from '@/context/PatientDataContext';

export default function DemoDashboard() {
  const { data } = usePatientData();

  if (!data) {
    return <div>Loading patient data...</div>;
  }

  const { patientData } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
      <div className="bg-zinc-800 p-4 rounded mb-4">
        <p>
          <span className="font-semibold">Name:</span> {patientData.full_name}
        </p>
        <p>
          <span className="font-semibold">MRN:</span> {patientData.mrn}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {patientData.status}
        </p>
      </div>
      <div id="critical-alerts" className="bg-ai-blue/20 p-4 rounded mb-4">
        <p className="font-semibold text-ai-blue">Critical Alerts & Tasks</p>
        <p className="text-sm text-ai-blue">PRIOR AUTH PENDING: Inpatient Rehabilitation Facility Stay</p>
      </div>
      <p className="text-zinc-400">This is a simplified demo dashboard.</p>
    </div>
  );
}

