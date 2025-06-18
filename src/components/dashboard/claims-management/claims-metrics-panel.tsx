'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedMetric, formatCurrency } from '@/components/ui/animated-metric';
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
import { Doughnut, Line, Pie, Bar, PolarArea } from 'react-chartjs-2'; // Added PolarArea
import { StatusIndicator, StatusType } from '@/components/ui/status-indicator'; // Import StatusType
import {
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

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

interface ClaimsMetricsPanelProps {
  className?: string;
}

export function ClaimsMetricsPanel({ className }: ClaimsMetricsPanelProps) {
  // Demo data
  const cleanClaimsRate = 93.5;
  const avgReimbursementTime = 18; // days
  const totalReimbursement = 2450000; // dollars
  const denialRate = 6.5;
  const appealSuccessRate = 78.2;
  const avgProcessingTime = 3.2; // days

  // Clean Claims Rate trend data (following Prior Auth style)
  const cleanClaimsRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Clean Claims %',
        data: [89.5, 91.2, 90.8, 92.1, 91.0, 93.5],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  // Reimbursement time trend (following Prior Auth style)
  const reimbursementTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Avg Days',
        data: [25, 23, 22, 21, 19, 18],
        borderColor: chartColors.green,
        backgroundColor: chartColors.greenAlpha,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      }
    ],
  };

  // Monthly reimbursement (following Prior Auth bar style)
  const monthlyReimbursementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Reimbursement',
        data: [1890000, 2100000, 2350000, 2200000, 2070000, 2450000],
        backgroundColor: [
          chartColors.blueAlpha,
          chartColors.blueAlpha,
          chartColors.blueAlpha,
          chartColors.blueAlpha,
          chartColors.blueAlpha,
          chartColors.blue,
        ],
        borderColor: [
          chartColors.blue,
          chartColors.blue,
          chartColors.blue,
          chartColors.blue,
          chartColors.blue,
          chartColors.blue,
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ],
  };

  // Denial reasons (following Prior Auth pie style with EXACT colors)
  const denialReasonsData = {
    labels: ['Missing Info', 'Not Covered', 'Prior Auth', 'Duplicate'],
    datasets: [
      {
        label: 'Denial Rate',
        data: [38, 29, 17, 16],
        backgroundColor: [
          chartColors.redAlpha, 
          chartColors.yellowAlpha, // Changed from orangeAlpha
          chartColors.blueAlpha,
          chartColors.purpleAlpha,
        ],
        borderColor: [
          chartColors.red, 
          chartColors.yellow, // Changed from orange
          chartColors.blue,
          chartColors.purple,
        ],
        borderWidth: 3,
        hoverOffset: 5,
      },
    ],
  };

  // Appeal success by type (following Prior Auth bar style)
  const appealSuccessData = {
    labels: ['Medical Necessity', 'Prior Auth', 'Coverage', 'Billing Error', 'Documentation'],
    datasets: [
      {
        label: 'Success Rate',
        data: [85, 72, 68, 92, 78],
        backgroundColor: [
          chartColors.blueAlpha,
          chartColors.greenAlpha,
          chartColors.purpleAlpha,
          chartColors.yellowAlpha, 
          chartColors.blueLightAlpha, // Changed from tealAlpha
        ],
        borderColor: [
          chartColors.blue,
          chartColors.green,
          chartColors.purple,
          chartColors.yellow,   
          chartColors.blueLight,   // Changed from teal
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // Processing time stages (following Prior Auth bar style)
  const processingTimeData = {
    labels: ['Submission', 'Review', 'Validation', 'Payment'],
    datasets: [
      {
        label: 'Hours',
        data: [24, 48, 18, 12],
        backgroundColor: [
          chartColors.blueAlpha,
          chartColors.greenAlpha,
          chartColors.yellowAlpha, 
          chartColors.purpleAlpha, // Changed from tealAlpha
        ],
        borderColor: [
          chartColors.blue,
          chartColors.green,
          chartColors.yellow,   
          chartColors.purple,   // Changed from teal
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // AR Aging data with new treemap visualization
  const arAgingTreemapData = {
    labels: ['0-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
    datasets: [
      {
        label: 'AR Amount',
        data: [1250000, 620000, 310000, 220000],
        backgroundColor: [
          chartColors.blueAlpha,
          chartColors.greenAlpha,
          chartColors.yellowAlpha, 
          chartColors.redAlpha, 
        ],
        borderColor: [
          chartColors.blue,
          chartColors.green,
          chartColors.yellow,   
          chartColors.red,   
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // Payer performance (following Prior Auth horizontal bar style)
  const payerPerformanceData = {
    labels: ['Aetna', 'UnitedHealth', 'Blue Cross', 'Cigna', 'Humana'],
    datasets: [
      {
        label: 'First Time Success Rate',
        data: [94, 89, 85, 78, 72],
        backgroundColor: [
          chartColors.blueAlpha,
          chartColors.greenAlpha,
          chartColors.purpleAlpha,
          chartColors.yellowAlpha, 
          chartColors.redAlpha, // Changed from orangeAlpha
        ],
        borderColor: [
          chartColors.blue,
          chartColors.green,
          chartColors.purple,
          chartColors.yellow,   
          chartColors.red,   // Changed from orange
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // Chart options (EXACT copy from Prior Auth)
  const miniLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        display: true,
        ticks: {
          color: '#ededed',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: { 
        display: true,
        ticks: {
          color: '#ededed',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    plugins: { 
      legend: { display: false }, 
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ededed',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      } 
    },
  };

  const pieOptions = { // Renamed from donutOptions to match prior-auth
    responsive: true,
    maintainAspectRatio: false,
    // cutout: '75%', // Removed for Pie chart if not desired, can be added for Doughnut
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

  const barOptions = { // Copied from prior-auth
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, 
    scales: {
      x: {
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
          text: 'Rate (%)', // Updated to match prior-auth example if applicable
          color: '#ededed',
          font: {
            size: 12,
          },
        },
      },
      y: {
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
        display: false,
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

  const verticalBarOptions = { // Copied from prior-auth (adapted for vertical)
    responsive: true,
    maintainAspectRatio: false,
    // indexAxis: 'x' as const, // Default for vertical bar
    scales: {
      y: { // Y-axis for vertical bar
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
          text: 'Amount', 
          color: '#ededed',
          font: {
            size: 12,
          },
        },
      },
      x: { // X-axis for vertical bar
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
        display: false,
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
            return `${label}: ${formatCurrency(value)}`; // Assuming formatCurrency is available
          }
        }
      },
    },
  };

  return (
    <div className={clsx("grid grid-cols-1 lg:grid-cols-4 gap-4", className)}>
      {/* Clean Claims Rate - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Clean Claims Rate</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={cleanClaimsRate}
                  suffix="%"
                  className="text-4xl font-bold text-white"
                  precision={1}
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+2.5%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Industry benchmark: 90%</div>
            </div>
            <StatusIndicator status="online" size="lg" /> 
          </div>
          <div className="h-96">
            <ChartContainer>
              <Line options={miniLineOptions} data={cleanClaimsRateData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* Average Reimbursement Time - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Average Reimbursement Time</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={avgReimbursementTime}
                  suffix=" days"
                  className="text-4xl font-bold text-white"
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">-3.5 days</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Industry benchmark: 25 days</div>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Line options={miniLineOptions} data={reimbursementTimeData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* Total Reimbursement - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Reimbursement (MTD)</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={totalReimbursement}
                  formatter={formatCurrency}
                  className="text-4xl font-bold text-white"
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+18.2%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">2,450 claims processed</div>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-purple-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Bar options={verticalBarOptions} data={monthlyReimbursementData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* Denial Rate - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Denial Rate</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={denialRate}
                  suffix="%"
                  className="text-4xl font-bold text-white"
                  precision={1}
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">-1.2%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Breakdown by reason</div>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Pie options={pieOptions} data={denialReasonsData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* Appeal Success Rate - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Appeal Success Rate</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={appealSuccessRate}
                  suffix="%"
                  className="text-4xl font-bold text-white"
                  precision={1}
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+5.1%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Success by category</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Bar options={barOptions} data={appealSuccessData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* Processing Time - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Avg Processing Time</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={avgProcessingTime}
                  suffix=" days"
                  className="text-4xl font-bold text-white"
                  precision={1}
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">-0.8 days</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Time by stage</div>
            </div>
            <ClockIcon className="h-8 w-8 text-cyan-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Bar options={verticalBarOptions} data={processingTimeData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* AR Aging - NEW VISUAL - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">AR Aging Distribution</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={2400000}
                  formatter={formatCurrency}
                  className="text-4xl font-bold text-white"
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">-8.5%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Total AR value</div>
            </div>
            <BanknotesIcon className="h-8 w-8 text-yellow-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Bar options={verticalBarOptions} data={arAgingTreemapData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>

      {/* Payer Performance - Double Height */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Payer Performance</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedMetric
                  value={83.6}
                  suffix="%"
                  className="text-4xl font-bold text-white"
                  precision={1}
                />
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+2.1%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500">First time submission rate</div>
            </div>
            <DocumentCheckIcon className="h-8 w-8 text-blue-400 opacity-60" />
          </div>
          <div className="h-96">
            <ChartContainer>
              <Bar options={barOptions} data={payerPerformanceData} />
            </ChartContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
