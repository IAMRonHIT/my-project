'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { GlassCard } from '@/components/ui/glass-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { chartColors } from '@/components/ui/chart-config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ClockIcon, ArrowTrendingDownIcon, CheckIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriorAuthMetricsProps {
  className?: string;
}

export function PriorAuthMetrics({ className }: PriorAuthMetricsProps) {
  // Demo data
  const averageTurnaround = 1.3; // days
  const previousTurnaround = 7.8; // days
  const timeReduction = Math.round(((previousTurnaround - averageTurnaround) / previousTurnaround) * 100);
  
  const approvalRate = 94;
  const pendingAuths = 46;
  const completedToday = 27;

  const approvalTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Approval %',
        data: [90, 91, 92, 93, 94, 94],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
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

  const statusTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Pending',
        data: [40, 42, 39, 50, 46],
        borderColor: chartColors.yellow,
        backgroundColor: chartColors.yellowAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Completed',
        data: [20, 22, 25, 26, 27],
        borderColor: chartColors.green,
        backgroundColor: chartColors.greenAlpha,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
  
  // Denial reasons chart data
  const denialData = {
    labels: ['Missing Info', 'Not Medically Necessary', 'Not Covered', 'Out of Network', 'Other'],
    datasets: [
      {
        label: 'Denial Rate',
        data: [38, 29, 17, 9, 7],
        backgroundColor: [
          chartColors.red,
          chartColors.yellow,
          chartColors.blueDark,
          chartColors.purple,
          chartColors.gray,
        ],
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };
  
  // Turnaround time trend data
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Without Ron AI',
        data: [7.5, 7.6, 7.9, 7.8, 7.7, 7.8],
        borderColor: chartColors.gray,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'With Ron AI',
        data: [7.5, 7.6, 6.2, 3.8, 2.4, 1.3],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: chartColors.blue,
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  // Chart options for turnaround trend
  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#ededed',
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: 'Days',
          color: '#ededed',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#ededed',
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#ededed',
          usePointStyle: true,
          pointStyleWidth: 10,
          boxWidth: 6,
          boxHeight: 6,
          padding: 20,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ededed',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          // @ts-expect-error - Chart.js typing compatibility
          title: function(tooltipItems) {
            return tooltipItems[0]?.label || '';
          },
          // @ts-expect-error - Chart.js typing compatibility
          label: function(tooltipItem) {
            const label = tooltipItem.dataset?.label || '';
            const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw.toFixed(1) : '0';
            return `${label}: ${value} days`;
          }
        }
      },
    },
  };
  
  // Chart options for denials donut
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          color: '#ededed',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ededed',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        callbacks: {
          // @ts-expect-error - Chart.js typing compatibility
          label: function(context) {
            const label = context.label || '';
            const value = typeof context.raw === 'number' ? context.raw : 0;
            return `${label}: ${value}%`;
          }
        }
      },
    },
  };
  
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Hero Metric: Average Turnaround Time */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium">Average Turnaround Time</h3>
              <div className="flex items-baseline gap-3 mt-2">
                <AnimatedMetric
                  value={averageTurnaround}
                  suffix=" days"
                  className="text-4xl font-bold text-white"
                  trend="down"
                />
                <div className="flex items-center text-success text-sm">
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  <span>{timeReduction}% reduction</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500 mt-1">Previous: {previousTurnaround} days</div>
            </div>
            <StatusIndicator status="online" label="Improving" animate={true} />
          </div>
          
          <div className="h-64">
            <Line options={trendOptions} data={trendData} />
          </div>
        </div>
      </GlassCard>
      
      {/* Approval Rate */}
      <GlassCard className="lg:col-span-1" glow="blue">
        <div className="p-5 h-full flex flex-col">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Approval Rate</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <AnimatedMetric
                value={approvalRate}
                suffix="%"
                className="text-4xl font-bold text-white"
              />
              <motion.div
                className="absolute -top-1 -right-7 bg-success rounded-md px-1.5 py-0.5 text-xs font-medium text-white"
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                +5%
              </motion.div>
            </div>
            <div className="flex items-center mt-3 text-sm text-zinc-400">
              <CheckIcon className="h-4 w-4 mr-1.5 text-success" />
              <span>Higher than industry average</span>
            </div>
            <div className="w-full h-16 mt-4">
              <Line options={miniLineOptions} data={approvalTrendData} />
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Pending & Completed */}
      <GlassCard className="lg:col-span-1" glow="blue">
        <div className="p-5 h-full flex flex-col">
          <h3 className="text-zinc-400 text-sm font-medium mb-4">Status</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-zinc-500 mb-1">Pending</div>
              <AnimatedMetric
                value={pendingAuths}
                className="text-2xl font-semibold text-warning"
              />
              <div className="flex items-center mt-2">
                <ClockIcon className="h-3.5 w-3.5 text-zinc-500 mr-1" />
                <span className="text-xs text-zinc-400">Auths</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-zinc-500 mb-1">Today</div>
              <AnimatedMetric
                value={completedToday}
                className="text-2xl font-semibold text-success"
              />
              <div className="flex items-center mt-2">
                <CheckIcon className="h-3.5 w-3.5 text-zinc-500 mr-1" />
                <span className="text-xs text-zinc-400">Completed</span>
              </div>
            </div>
          </div>
          <div className="w-full h-16 mt-4">
            <Line options={miniLineOptions} data={statusTrendData} />
          </div>
        </div>
      </GlassCard>
      
      {/* Denial Reasons */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Denial Reasons</h3>
          <ChartContainer height={200}>
            <Doughnut data={denialData} options={donutOptions} />
          </ChartContainer>
        </div>
      </GlassCard>
      
      {/* Heat Map Visualization (simplified) */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-4">Time to Approval by Payer</h3>
          <div className="space-y-3">
            {[
              { payer: 'Blue Cross', time: 1.2, color: 'bg-green-500' },
              { payer: 'UnitedHealth', time: 1.5, color: 'bg-green-400' },
              { payer: 'Aetna', time: 1.9, color: 'bg-yellow-400' },
              { payer: 'Cigna', time: 1.7, color: 'bg-green-400' },
              { payer: 'Humana', time: 2.3, color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.payer} className="flex items-center gap-3">
                <div className="w-24 text-xs text-zinc-300">{item.payer}</div>
                <div className={`h-4 rounded-full ${item.color} w-[${Math.min(100, item.time * 20)}%]`} />
                <div className="text-xs text-zinc-400">{item.time} days</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
