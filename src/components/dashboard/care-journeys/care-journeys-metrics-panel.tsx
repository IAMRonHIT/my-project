'use client';

import React from 'react';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { GlassCard } from '@/components/ui/glass-card';
import { chartColors } from '@/components/ui/chart-config';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CareJourneysMetricsPanelProps {
  className?: string;
}

export function CareJourneysMetricsPanel({ className }: CareJourneysMetricsPanelProps) {
  const completionData = {
    labels: ['Diabetes', 'Cardio', 'Maternity', 'Oncology'],
    datasets: [
      {
        label: 'Completion %',
        data: [82, 76, 91, 68],
        backgroundColor: chartColors.blue,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#ededed', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#ededed', font: { size: 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ededed',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
      },
    },
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Active Journeys</h3>
          <AnimatedMetric value={124} className="text-4xl font-bold text-white" />
        </div>
      </GlassCard>
      <GlassCard glow="blue">
        <div className="p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Completion Rates</h3>
          <div className="h-64">
            <Bar options={barOptions} data={completionData} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

