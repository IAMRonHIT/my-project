'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ActiveTasksPanel } from '@/components/dashboard/active-tasks/active-tasks-panel';
import { PriorAuthMetrics } from '@/components/dashboard/prior-auth/prior-auth-metrics';
import { ClaimsMetricsPanel } from '@/components/dashboard/claims-management/claims-metrics-panel';
import { AgentStatusPanel } from '@/components/dashboard/agent-monitoring/agent-status-panel';

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

      {/* Prior Auth Metrics */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Prior Authorization</h2>
        <PriorAuthMetrics />
      </motion.div>

      {/* Claims Management */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Claims Management</h2>
        <ClaimsMetricsPanel />
      </motion.div>
      
      {/* Agent Monitoring */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-white mb-4">Agent Monitoring</h2>
        <AgentStatusPanel />
      </motion.div>
    </motion.div>
  );
}
