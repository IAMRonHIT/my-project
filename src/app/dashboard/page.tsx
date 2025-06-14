'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ActiveTasksPanel } from '@/components/dashboard/active-tasks/active-tasks-panel';
import { PriorAuthMetrics } from '@/components/dashboard/prior-auth/prior-auth-metrics';
import { ClaimsMetricsPanel } from '@/components/dashboard/claims-management/claims-metrics-panel';
import { AgentStatusPanel } from '@/components/dashboard/agent-monitoring/agent-status-panel';
import { AppealsMetricsPanel } from '@/components/dashboard/appeals/appeals-metrics-panel';
import { CareJourneysMetricsPanel } from '@/components/dashboard/care-journeys/care-journeys-metrics-panel';
import { AppointmentsMetricsPanel } from '@/components/dashboard/appointments/appointments-metrics-panel';

export default function DashboardPage() {
  // Page fade-in animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabs = [
    { id: 'prior', label: 'Prior Authorizations' },
    { id: 'claims', label: 'Claims' },
    { id: 'appeals', label: 'Appeals' },
    { id: 'care', label: 'Care Journeys' },
    { id: 'agents', label: 'Agent Monitoring' },
    { id: 'appointments', label: 'Appointments' },
  ];

  const [activeTab, setActiveTab] = useState<string>('prior');

  return (
    <motion.div
      className="pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">
          Welcome to the Ron AI Healthcare Administrative Dashboard
        </p>
      </motion.div>

      {/* Active Tasks Panel */}
      <motion.div variants={itemVariants} className="mb-8">
        <ActiveTasksPanel />
      </motion.div>

      {/* Dashboard Tabs */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === t.id ? 'text-white' : 'text-zinc-400'}`}
              animate={activeTab === t.id ? { rotate: [0, 360, 0], backgroundColor: '#4f46e5', boxShadow: '0 0 8px #6366f1' } : { backgroundColor: 'transparent', boxShadow: 'none' }}
              transition={{ duration: 0.6 }}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Panels */}
      <motion.div variants={itemVariants} className="space-y-8">
        {activeTab === 'prior' && <PriorAuthMetrics />}
        {activeTab === 'claims' && <ClaimsMetricsPanel />}
        {activeTab === 'appeals' && <AppealsMetricsPanel />}
        {activeTab === 'care' && <CareJourneysMetricsPanel />}
        {activeTab === 'agents' && <AgentStatusPanel />}
        {activeTab === 'appointments' && <AppointmentsMetricsPanel />}
      </motion.div>
    </motion.div>
  );
}
