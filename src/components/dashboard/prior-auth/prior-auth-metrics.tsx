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
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2'; // Added Pie and Bar
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
      y: { 
        display: true, // Ensure Y axis is displayed
        ticks: {
          color: '#ededed',
          font: { size: 10 },
          // Optional: Add a callback to format Y-axis labels if needed
          // callback: function(value) { return value + '%'; }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: { 
        display: true, // Ensure X axis is displayed
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
    labels: ['Missing Info', 'Not Medically Necessary', 'Not Covered', 'Out of Network'],
    datasets: [
      {
        label: 'Denial Rate',
        data: [38, 29, 17, 9],
        backgroundColor: [
          '#AFFF3380', // Electric Lime with ~50% opacity
          '#FF7F5080', // Coral/Peach with ~50% opacity
          chartColors.blueAlpha,
          chartColors.purpleAlpha,
        ],
        borderColor: [
          '#AFFF33',   // Solid Electric Lime
          '#FF7F50',   // Solid Coral/Peach
          chartColors.blue,
          chartColors.purple,
        ],
        borderWidth: 3, // Reverted to 3
        hoverOffset: 5,
      },
    ],
  };
  
  // Request Types chart data
  const requestTypesData = {
    labels: ['Inpatient', 'Outpatient', 'DME', 'Rx', 'Homecare'],
    datasets: [
      {
        label: 'Request Volume',
        data: [145, 230, 85, 320, 65],
        backgroundColor: [
          chartColors.blueAlpha,
          chartColors.greenAlpha,
          chartColors.purpleAlpha,
          '#AFFF3380', // Electric Lime with opacity
          '#FF7F5080', // Coral/Peach with opacity
        ],
        borderColor: [
          chartColors.blue,
          chartColors.green,
          chartColors.purple,
          '#AFFF33',   // Electric Lime
          '#FF7F50',   // Coral/Peach
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
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
  
  // Chart options for denials donut (now pie)
  const pieOptions = { // Renamed from donutOptions
    responsive: true,
    maintainAspectRatio: false,
    // cutout: '75%', // Removed for Pie chart
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
  
  // Chart options for Request Types bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Horizontal bar chart
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
          text: 'Volume',
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
            return `${label}: ${value} requests`;
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
          <h3 className="text-zinc-400 text-sm font-medium mb-2 text-center">Approval Rate</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative text-center">
              <AnimatedMetric
                value={approvalRate}
                suffix="%"
                className="text-4xl font-bold text-white"
              />
              <motion.div
                className="bg-success rounded-md px-1.5 py-0.5 text-xs font-medium text-white mt-1"
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                +5%
              </motion.div>
            </div>
            <div className="flex items-center mt-3 text-sm text-zinc-400 justify-center">
              <CheckIcon className="h-4 w-4 mr-1.5 text-success" />
              <span>Higher than industry average</span>
            </div>
            <div className="w-full h-48 mt-4"> {/* Increased height from h-40 to h-48 */}
              <Line options={miniLineOptions} data={approvalTrendData} />
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Pending & Completed */}
      <GlassCard className="lg:col-span-1" glow="blue">
        <div className="p-5 h-full flex flex-col">
          <h3 className="text-zinc-400 text-sm font-medium mb-4 text-center">Status</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-xs text-zinc-500 mb-1">Pending</div>
              <AnimatedMetric
                value={pendingAuths}
                className="text-2xl font-semibold text-warning"
              />
              <div className="flex items-center mt-2 justify-center">
                <ClockIcon className="h-3.5 w-3.5 text-zinc-500 mr-1" />
                <span className="text-xs text-zinc-400">Auths</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-xs text-zinc-500 mb-1">Today</div>
              <AnimatedMetric
                value={completedToday}
                className="text-2xl font-semibold text-success"
              />
              <div className="flex items-center mt-2 justify-center">
                <CheckIcon className="h-3.5 w-3.5 text-zinc-500 mr-1" />
                <span className="text-xs text-zinc-400">Completed</span>
              </div>
            </div>
          </div>
          <div className="w-full h-48 mt-4"> {/* Increased height from h-40 to h-48 */}
            <Line options={miniLineOptions} data={statusTrendData} />
          </div>
        </div>
      </GlassCard>
      
      {/* Denial Reasons */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5 h-full flex flex-col">
          <h3 className="text-zinc-400 text-sm font-medium mb-2 text-center">Denial Reasons</h3>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full h-full max-h-[240px]"> 
              <Pie data={denialData} options={pieOptions} /> {/* Changed Doughnut to Pie, options to pieOptions */}
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Request Types */}
      <GlassCard className="lg:col-span-2" glow="blue">
        <div className="p-5 h-full flex flex-col">
          <h3 className="text-zinc-400 text-sm font-medium mb-2 text-center">Request Types</h3>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full h-full max-h-[240px]">
              <Bar data={requestTypesData} options={barOptions} />
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Enhanced Payer Analytics Table - Updated with gradients */}
      <GlassCard className="lg:col-span-4" glow="blue">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-zinc-200 text-lg font-semibold">Payer Performance Analytics</h3>
              <p className="text-zinc-400 text-sm mt-1">Comprehensive overview of payer metrics and trends</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400 text-sm">Show:</span>
                <select className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search payers..."
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg pl-9 pr-4 py-1.5 text-zinc-300 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-48"
                />
                <svg className="absolute left-3 top-2 h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-zinc-700/50">
            <table className="min-w-full divide-y divide-zinc-700/30">
              <thead className="bg-gradient-to-r from-zinc-800/80 to-zinc-800/60 backdrop-blur-sm">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>Payer</span>
                      <svg className="h-3 w-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">Performance</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">Avg. Time</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">Trend</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">Approval Rate</th>
                  <th scope="col" className="relative py-4 pl-3 pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900/20 backdrop-blur-sm divide-y divide-zinc-700/20">
                {[
                  { 
                    payer: 'Blue Cross Blue Shield', 
                    time: 1.2, 
                    trend: -0.1, 
                    volume: 125, 
                    approvalRate: 98.5, 
                    performance: 'excellent',
                    aiImpact: 85,
                    riskScore: 'low',
                    region: 'Northeast',
                    category: 'Commercial'
                  },
                  { 
                    payer: 'UnitedHealthcare', 
                    time: 1.5, 
                    trend: 0.2, 
                    volume: 210, 
                    approvalRate: 95.2, 
                    performance: 'good',
                    aiImpact: 72,
                    riskScore: 'low',
                    region: 'Midwest',
                    category: 'Commercial'
                  },
                  { 
                    payer: 'Aetna', 
                    time: 1.9, 
                    trend: -0.3, 
                    volume: 180, 
                    approvalRate: 92.1, 
                    performance: 'good',
                    aiImpact: 68,
                    riskScore: 'medium',
                    region: 'South',
                    category: 'Commercial'
                  },
                  { 
                    payer: 'Cigna Healthcare', 
                    time: 1.7, 
                    trend: 0.0, 
                    volume: 150, 
                    approvalRate: 96.0, 
                    performance: 'good',
                    aiImpact: 75,
                    riskScore: 'low',
                    region: 'West',
                    category: 'Commercial'
                  },
                  { 
                    payer: 'Humana', 
                    time: 2.3, 
                    trend: 0.5, 
                    volume: 95, 
                    approvalRate: 89.7, 
                    performance: 'fair',
                    aiImpact: 45,
                    riskScore: 'high',
                    region: 'Southeast',
                    category: 'Medicare'
                  },
                  { 
                    payer: 'Kaiser Permanente', 
                    time: 1.4, 
                    trend: -0.2, 
                    volume: 85, 
                    approvalRate: 94.8, 
                    performance: 'good',
                    aiImpact: 78,
                    riskScore: 'low',
                    region: 'West',
                    category: 'HMO'
                  },
                  { 
                    payer: 'Medicaid (State)', 
                    time: 3.1, 
                    trend: -0.8, 
                    volume: 200, 
                    approvalRate: 87.3, 
                    performance: 'fair',
                    aiImpact: 52,
                    riskScore: 'high',
                    region: 'Multi-State',
                    category: 'Government'
                  },
                ].map((item, index) => (
                  <tr key={item.payer} className="hover:bg-zinc-800/30 transition-colors duration-200">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-zinc-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-zinc-600/50 flex items-center justify-center">
                            <span className="text-zinc-300 font-semibold text-xs">
                              {item.payer.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-zinc-200">{item.payer}</div>
                          <div className="text-zinc-500 text-xs">{item.category} • {item.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`inline-flex items-center justify-center w-20 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                          item.performance === 'excellent' 
                            ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-lime-400 border border-lime-500/30 shadow-[0_0_10px_rgba(163,230,53,0.15)] hover:shadow-[0_0_15px_rgba(163,230,53,0.25)]' 
                            : item.performance === 'good'
                            ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(103,232,249,0.15)] hover:shadow-[0_0_15px_rgba(103,232,249,0.25)]'
                            : 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-amber-300 border border-amber-400/30 shadow-[0_0_10px_rgba(252,211,77,0.15)] hover:shadow-[0_0_15px_rgba(252,211,77,0.25)]'
                        } backdrop-blur-sm`} style={{
                          background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 50%, #18181b 100%)',
                          boxShadow: item.performance === 'excellent' 
                            ? '0 0 12px rgba(158, 255, 3, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)' 
                            : item.performance === 'good'
                            ? '0 0 12px rgba(103,232,249,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                            : '0 0 12px rgba(252, 255, 96, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}>
                          <span className={`drop-shadow-sm ${
                            item.performance === 'excellent' 
                              ? 'text-shadow-[0_0_6px_rgba(163,230,53,0.8)]' 
                              : item.performance === 'good'
                              ? 'text-shadow-[0_0_6px_rgba(103,232,249,0.8)]'
                              : 'text-shadow-[0_0_6px_rgba(252,211,77,0.8)]'
                          }`} style={{
                            textShadow: item.performance === 'excellent' 
                              ? '0 0 6px rgba(163,230,53,0.6)' 
                              : item.performance === 'good'
                              ? '0 0 6px rgba(103,232,249,0.6)'
                              : '0 0 6px rgba(252,211,77,0.6)'
                          }}>
                            {item.performance}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.time.toFixed(1)}</span>
                        <span className="text-zinc-500 text-xs">days</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className={`flex items-center space-x-1 ${
                        item.trend < 0 ? 'text-lime-400' : item.trend > 0 ? 'text-orange-400' : 'text-zinc-400'
                      }`} style={{
                        color: item.trend > 0 ? '#ff7f50' : undefined
                      }}>
                        {item.trend !== 0 && (
                          <svg className={`h-3 w-3 ${item.trend < 0 ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">
                          {item.trend !== 0 ? `${item.trend > 0 ? '+' : ''}${item.trend.toFixed(1)}` : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">
                          {item.approvalRate.toFixed(1)}%
                        </span>
                        <div className="w-12 bg-zinc-700/50 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-cyan-300 to-blue-300 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${item.approvalRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-zinc-400 hover:text-blue-400 transition-colors duration-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-zinc-400 hover:text-blue-400 transition-colors duration-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-700/30">
            <div className="flex items-center space-x-4">
              <span className="text-zinc-400 text-sm">
                Showing <span className="font-medium text-zinc-300">1</span> to <span className="font-medium text-zinc-300">7</span> of{' '}
                <span className="font-medium text-zinc-300">47</span> payers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, '...', 8].map((page, index) => (
                  <button
                    key={index}
                    className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      page === 1
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : page === '...'
                        ? 'text-zinc-500 cursor-default'
                        : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                    }`}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors duration-200">
                Next
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
