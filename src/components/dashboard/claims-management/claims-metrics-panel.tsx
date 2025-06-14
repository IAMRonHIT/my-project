'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedMetric, formatCurrency } from '@/components/ui/animated-metric';
import { ChartContainer } from '@/components/ui/chart-container';
import { chartColors } from '@/components/ui/chart-config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowTrendingUpIcon, BanknotesIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
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
  
  // Top performing payers data
  const payerPerformanceData = {
    labels: ['Aetna', 'UnitedHealth', 'Blue Cross', 'Cigna', 'Humana'],
    datasets: [
      {
        label: 'Average Days to Payment',
        data: [12, 14, 18, 22, 25],
        backgroundColor: chartColors.blue,
        borderRadius: 4,
      }
    ],
  };
  
  // Chart options
  const barOptions = {
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
          text: 'Days',
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
          title: function(tooltipItems) {
            return tooltipItems[0]?.label || '';
          },
          // @ts-expect-error - Chart.js typing compatibility
          label: function(context) {
            const value = typeof context.raw === 'number' ? context.raw : 0;
            return `${value} days to payment`;
          }
        }
      },
    },
  };

  // AR aging data
  const arAgingCategories = [
    { label: '0-30 Days', amount: 1250000, percentage: 52 },
    { label: '31-60 Days', amount: 620000, percentage: 26 },
    { label: '61-90 Days', amount: 310000, percentage: 13 },
    { label: '90+ Days', amount: 220000, percentage: 9 },
  ];
  
  // Calculate total AR
  const totalAR = arAgingCategories.reduce((sum, category) => sum + category.amount, 0);
  
  // Get color for aging category
  const getAgingColor = (index: number) => {
    const colors = ['bg-success', 'bg-ai-blue', 'bg-warning', 'bg-error'];
    return colors[index] || colors[0];
  };
  
  return (
    <div className={clsx("grid grid-cols-1 lg:grid-cols-3 gap-4", className)}>
      {/* Top metrics */}
      <GlassCard className="p-5" glow="blue">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">Clean Claims Rate</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AnimatedMetric
              value={cleanClaimsRate}
              suffix="%"
              className="text-4xl font-bold text-white"
              precision={1}
            />
            <div className="flex items-center justify-center mt-2 text-sm text-success">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+2.5% from last month</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <div className="text-xs text-zinc-500">Industry benchmark: 90%</div>
        </div>
      </GlassCard>
      
      <GlassCard className="p-5" glow="blue">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">Average Reimbursement Time</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AnimatedMetric
              value={avgReimbursementTime}
              suffix=" days"
              className="text-4xl font-bold text-white"
            />
            <div className="flex items-center justify-center mt-2 text-sm text-success">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>-3.5 days from last month</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <div className="text-xs text-zinc-500">Industry benchmark: 25 days</div>
        </div>
      </GlassCard>
      
      <GlassCard className="p-5" glow="blue">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">Total Reimbursement (MTD)</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AnimatedMetric
              value={totalReimbursement}
              formatter={formatCurrency}
              className="text-4xl font-bold text-white"
            />
            <div className="flex items-center justify-center mt-2 text-sm text-success">
              <BanknotesIcon className="h-4 w-4 mr-1" />
              <span>+18.2% from last month</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <div className="flex items-center justify-center text-xs text-zinc-500">
            <DocumentCheckIcon className="h-3.5 w-3.5 mr-1" />
            <span>2,450 claims processed</span>
          </div>
        </div>
      </GlassCard>

      {/* AR Aging */}
      <GlassCard className="p-5 lg:col-span-2" glow="blue">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">AR Aging</h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-xs text-zinc-500">Total AR Value</div>
              <div className="text-xl font-semibold text-white">{formatCurrency(totalAR)}</div>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              {arAgingCategories.map((category, index) => (
                <div
                  key={index}
                  className={clsx("h-full float-left", getAgingColor(index), `w-[${category.percentage}%]`)}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {arAgingCategories.map((category, index) => (
              <motion.div
                key={index}
                className="p-3 bg-black/20 rounded-lg border border-zinc-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-xs text-zinc-500 mb-1">{category.label}</div>
                <div className="text-base font-semibold text-white">{formatCurrency(category.amount)}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className={clsx("w-2.5 h-2.5 rounded-full", getAgingColor(index))}></div>
                  <div className="text-xs text-zinc-400">{category.percentage}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Payer Performance */}
      <GlassCard className="p-5" glow="blue">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">Payer Performance</h3>
        <div className="h-64">
          <ChartContainer>
            <Bar options={barOptions} data={payerPerformanceData} />
          </ChartContainer>
        </div>
      </GlassCard>
    </div>
  );
}
