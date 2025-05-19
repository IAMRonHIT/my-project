'use client';
import React from 'react';
import { usePatientData } from '@/context/PatientDataContext';

export default function PriorAuthPage() {
  const { data } = usePatientData();

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Prior Authorizations</h1>
      <ul className="space-y-2">
        {data.priorAuthorizations.map((pa) => (
          <li key={pa.id} className="bg-zinc-800 p-3 rounded">
            <p className="font-semibold">{pa.description}</p>
            <p className="text-sm text-zinc-400">Status: {pa.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
