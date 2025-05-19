'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface PatientData {
  patientData: {
    full_name: string;
    mrn: string;
    dob: string;
    primary_diagnosis: string;
    admission_date: string;
    patient_sdoh_concerns: string[];
    allergies: string[];
    status: string;
  };
  clinicalData: {
    primary_diagnosis_text: string;
    medications: string[];
    labs: unknown[];
    last_imaging_summary: string;
    last_ecg_summary: string;
  };
  priorAuthorizations: {
    id: string;
    description: string;
    status: string;
    approval_confidence: number;
    cpt_code: string[];
    criteria_met_details: string;
    estimated_submission: string;
  }[];
}

interface PatientDataContextValue {
  data?: PatientData;
}

const PatientDataContext = createContext<PatientDataContextValue>({});

export function usePatientData() {
  return useContext(PatientDataContext);
}

export function PatientDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PatientData | undefined>(undefined);

  useEffect(() => {
    fetch('/CarePlanJsonData.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load patient data', err));
  }, []);

  return (
    <PatientDataContext.Provider value={{ data }}>
      {children}
    </PatientDataContext.Provider>
  );
}

