'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassCardHeader, GlassCardBody } from '@/components/ui/glass-card';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { StatusIndicator, StatusType } from '@/components/ui/status-indicator';
import { ClockIcon, ServerIcon, BoltIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Demo data for agent statuses
const DEMO_AGENTS = [
  { 
    id: 1,
    name: 'Prior Auth Agent',
    status: 'online' as StatusType,
    processingRate: 87,
    responseTime: 1.2,
    tasks: {
      queued: 5,
      inProgress: 2,
      completed: 42
    },
    cpuUsage: 24,
    memoryUsage: 37,
  },
  { 
    id: 2,
    name: 'Claim Processing Agent',
    status: 'processing' as StatusType,
    processingRate: 94,
    responseTime: 0.8,
    tasks: {
      queued: 12,
      inProgress: 4,
      completed: 89
    },
    cpuUsage: 63,
    memoryUsage: 52,
  },
  { 
    id: 3,
    name: 'Patient Outreach Agent',
    status: 'online' as StatusType,
    processingRate: 79,
    responseTime: 2.4,
    tasks: {
      queued: 8,
      inProgress: 1,
      completed: 31
    },
    cpuUsage: 18,
    memoryUsage: 29,
  },
  { 
    id: 4,
    name: 'Data Synchronization Agent',
    status: 'warning' as StatusType,
    processingRate: 65,
    responseTime: 3.7,
    tasks: {
      queued: 22,
      inProgress: 3,
      completed: 58
    },
    cpuUsage: 81,
    memoryUsage: 72,
  }
];

interface AgentStatusPanelProps {
  className?: string;
}

export function AgentStatusPanel({ className }: AgentStatusPanelProps) {
  // Calculate total stats
  const totalActive = DEMO_AGENTS.filter(agent => agent.status === 'online' || agent.status === 'processing').length;
  const avgProcessingRate = Math.round(DEMO_AGENTS.reduce((sum, agent) => sum + agent.processingRate, 0) / DEMO_AGENTS.length);
  const totalCompleted = DEMO_AGENTS.reduce((sum, agent) => sum + agent.tasks.completed, 0);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper for resource usage indicator
  const getResourceColor = (percentage: number) => {
    if (percentage < 40) return 'bg-green-500';
    if (percentage < 70) return 'bg-warning';
    return 'bg-error';
  };
  
  return (
    <GlassCard className={className} glow="blue">
      <GlassCardHeader>
        <h2 className="text-lg font-medium text-white">Agent Monitoring</h2>
        <div className="flex items-center gap-6 mt-1">
          <div className="flex items-center gap-1">
            <StatusIndicator status="online" size="sm" />
            <span className="text-xs text-zinc-400">{totalActive}/{DEMO_AGENTS.length} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <BoltIcon className="h-4 w-4 text-ai-blue" />
            <span className="text-xs text-zinc-400">Efficiency:</span>
            <AnimatedMetric
              value={avgProcessingRate}
              suffix="%"
              size="sm"
              className="text-zinc-200"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-400">Tasks completed:</span>
            <AnimatedMetric
              value={totalCompleted}
              size="sm"
              className="text-zinc-200"
            />
          </div>
        </div>
      </GlassCardHeader>
      
      <GlassCardBody>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {DEMO_AGENTS.map(agent => (
            <motion.div
              key={agent.id}
              className="p-4 bg-black/20 rounded-lg border border-zinc-800"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-white">{agent.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusIndicator status={agent.status} label={agent.status === 'online' ? 'Active' : agent.status === 'processing' ? 'Processing' : 'Degraded'} />
                    <div className="flex items-center text-xs text-zinc-400">
                      <ClockIcon className="w-3.5 h-3.5 mr-1" />
                      <span>{agent.responseTime}s</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500">Efficiency</div>
                  <div className="text-lg font-bold text-white">{agent.processingRate}%</div>
                </div>
              </div>
              
              {/* Task status */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-black/20 rounded">
                  <div className="text-xs text-zinc-500">Queued</div>
                  <div className="text-sm font-medium text-zinc-300">{agent.tasks.queued}</div>
                </div>
                <div className="text-center p-2 bg-black/20 rounded">
                  <div className="text-xs text-zinc-500">In Progress</div>
                  <div className="text-sm font-medium text-zinc-300">{agent.tasks.inProgress}</div>
                </div>
                <div className="text-center p-2 bg-black/20 rounded">
                  <div className="text-xs text-zinc-500">Completed</div>
                  <div className="text-sm font-medium text-zinc-300">{agent.tasks.completed}</div>
                </div>
              </div>
              
              {/* Resource usage */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-zinc-500 flex items-center">
                      <ServerIcon className="w-3 h-3 mr-1" /> CPU
                    </span>
                    <span className="text-xs text-zinc-400">{agent.cpuUsage}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={clsx(
                      "h-full rounded-full",
                      getResourceColor(agent.cpuUsage),
                      `w-[${agent.cpuUsage}%]`
                    )} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-zinc-500">Memory</span>
                    <span className="text-xs text-zinc-400">{agent.memoryUsage}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={clsx(
                      "h-full rounded-full",
                      getResourceColor(agent.memoryUsage),
                      `w-[${agent.memoryUsage}%]`
                    )} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCardBody>
    </GlassCard>
  );
}
