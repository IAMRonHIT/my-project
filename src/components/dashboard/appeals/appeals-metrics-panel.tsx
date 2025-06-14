'use client';

import React from 'react';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { GlassCard } from '@/components/ui/glass-card';
import { chartColors } from '@/components/ui/chart-config';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

interface AppealsMetricsPanelProps {
  className?: string;
}

export function AppealsMetricsPanel({ className }: AppealsMetricsPanelProps) {
  const resolutionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Resolution Time',
        data: [14, 13, 11, 10, 9, 8],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const resolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#ededed', font: { size: 11 } },
        title: { display: true, text: 'Days', color: '#ededed', font: { size: 12 } },
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

  const miniLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false },
      x: { display: false },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const successTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Success %',
        data: [70, 72, 74, 75, 76, 78],
        borderColor: chartColors.green,
        backgroundColor: chartColors.greenAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const filedTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Filed',
        data: [30, 28, 32, 22],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
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
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Open Appeals</h3>
          <AnimatedMetric value={37} className="text-4xl font-bold text-white" />
        </div>
      </GlassCard>

      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Success Rate</h3>
          <AnimatedMetric value={78} suffix="%" className="text-3xl font-bold text-white" />
          <div className="w-full h-12 mt-4">
            <Line options={miniLineOptions} data={successTrendData} />
          </div>
        </div>
      </GlassCard>

      <GlassCard glow="blue">
        <div className="p-5 text-center">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Appeals Filed (MTD)</h3>
          <AnimatedMetric value={112} className="text-3xl font-bold text-white" />
          <div className="w-full h-12 mt-4">
            <Line options={miniLineOptions} data={filedTrendData} />
          </div>
        </div>
      </GlassCard>

      <GlassCard glow="blue" className="lg:col-span-4">
        <div className="p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Avg. Resolution Time</h3>
          <div className="h-64">
            <Line options={resolutionOptions} data={resolutionData} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

