'use client';

import React from 'react';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { GlassCard } from '@/components/ui/glass-card';
import { chartColors } from '@/components/ui/chart-config';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

interface AppointmentsMetricsPanelProps {
  className?: string;
}

export function AppointmentsMetricsPanel({ className }: AppointmentsMetricsPanelProps) {
  const waitTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Avg Wait Time',
        data: [25, 20, 22, 18, 15],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#ededed', font: { size: 11 } },
      },
      x: {
        grid: { display: false },
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
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Upcoming Appointments</h3>
          <AnimatedMetric value={58} className="text-4xl font-bold text-white" />
        </div>
      </GlassCard>
      <GlassCard glow="blue" className="lg:col-span-2">
        <div className="p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Avg Wait Time</h3>
          <div className="h-64">
            <Line options={lineOptions} data={waitTimeData} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

