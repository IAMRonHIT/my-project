'use client';

import React from 'react';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { GlassCard } from '@/components/ui/glass-card';
import { chartColors } from '@/components/ui/chart-config';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

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

  const miniLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false },
      x: { display: false },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const newJourneyData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [
      {
        label: 'New',
        data: [20, 24, 22, 25],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const avgDurationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Avg Days',
        data: [45, 42, 40, 38, 39, 37],
        borderColor: chartColors.green,
        backgroundColor: chartColors.greenAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-4 ${className}`}>
      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Active Journeys</h3>
          <AnimatedMetric value={124} className="text-4xl font-bold text-white" />
        </div>
      </GlassCard>

      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">New Journeys (MTD)</h3>
          <AnimatedMetric value={57} className="text-3xl font-bold text-white" />
          <div className="w-full h-12 mt-4">
            <Line options={miniLineOptions} data={newJourneyData} />
          </div>
        </div>
      </GlassCard>

      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Avg Journey Length</h3>
          <AnimatedMetric value={37} suffix=" days" className="text-3xl font-bold text-white" />
          <div className="w-full h-12 mt-4">
            <Line options={miniLineOptions} data={avgDurationData} />
          </div>
        </div>
      </GlassCard>

      <GlassCard glow="blue" className="lg:col-span-4">
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

