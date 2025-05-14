'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskCard, TaskData } from './task-card';
import { GlassCard, GlassCardHeader, GlassCardBody } from '@/components/ui/glass-card';
import { AnimatedMetric } from '@/components/ui/animated-metric';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/button';

// Demo data
const DEMO_TASKS: TaskData[] = [
  {
    id: '1',
    title: 'Review Prior Authorization for Patient #12345',
    description: 'Patient requires urgent approval for specialized treatment. Documentation has been submitted and needs review.',
    priority: 'critical',
    dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    status: 'pending',
    category: 'auth',
  },
  {
    id: '2',
    title: 'Process Claim Rejection for Insurance Provider',
    description: 'Claim #RF-45231 was rejected due to missing documentation. Review and resubmit with corrected information.',
    priority: 'high',
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    status: 'in_progress',
    assignee: {
      name: 'Sarah Johnson',
    },
    category: 'claim',
  },
  {
    id: '3',
    title: 'Update Patient Medical Records',
    description: 'New lab results and specialist notes need to be added to patient record for upcoming appointment.',
    priority: 'medium',
    dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    status: 'pending',
    category: 'patient',
  },
  {
    id: '4',
    title: 'Verify Provider Credentials',
    description: 'New provider application requires credential verification and network submission.',
    priority: 'low',
    dueDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    status: 'blocked',
    assignee: {
      name: 'Michael Chen',
    },
    category: 'provider',
  },
];

interface ActiveTasksPanelProps {
  className?: string;
  limit?: number;
  showFilters?: boolean;
  onViewAllClick?: () => void;
}

export function ActiveTasksPanel({
  className,
  limit = 4,
  showFilters = true,
  onViewAllClick,
}: ActiveTasksPanelProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'pending'>('all');
  const [tasks, setTasks] = useState<TaskData[]>(DEMO_TASKS);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [showNewTaskAnimation, setShowNewTaskAnimation] = useState<boolean>(false);
  
  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'critical') return task.priority === 'critical';
    if (filter === 'pending') return task.status === 'pending';
    return true;
  });
  
  // Get the limited number of tasks to display
  const displayTasks = filteredTasks.slice(0, limit);
  
  const handleTaskAction = (action: 'start' | 'complete' | 'reassign', taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => {
        if (task.id === taskId) {
          if (action === 'start') {
            return { ...task, status: 'in_progress' as const };
          }
          if (action === 'complete') {
            setCompletedCount(prev => prev + 1);
            // In a real app, you might remove the task or move it to a completed list
            return { ...task, status: 'pending' as const };
          }
          if (action === 'reassign') {
            return { ...task, status: 'pending' as const, assignee: undefined };
          }
        }
        return task;
      })
    );
  };
  
  const handleDemoAddNewTask = () => {
    const newTask: TaskData = {
      id: `new-${Date.now()}`,
      title: 'Urgent: Review new referral',
      description: 'New patient referral from Dr. Williams needs immediate review for specialist appointment.',
      priority: 'critical',
      dueDate: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
      status: 'pending',
      category: 'patient',
    };
    
    setTasks(prev => [newTask, ...prev]);
    setShowNewTaskAnimation(true);
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      setShowNewTaskAnimation(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <GlassCard className={className} glow="blue">
      <GlassCardHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Active Tasks</h2>
          <div className="text-xs text-zinc-400 flex items-center gap-2 mt-1">
            <AnimatedMetric 
              value={tasks.length} 
              prefix="Total: "
              className="text-zinc-200"
              size="sm"
            />
            <span className="text-zinc-500">|</span>
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-3.5 h-3.5 text-success" />
              <AnimatedMetric 
                value={completedCount} 
                className="text-success"
                size="sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showFilters && (
            <div className="flex rounded-lg overflow-hidden border border-zinc-800">
              <button 
                className={`px-3 py-1.5 text-xs ${filter === 'all' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1.5 text-xs ${filter === 'critical' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400'}`}
                onClick={() => setFilter('critical')}
              >
                Critical
              </button>
              <button 
                className={`px-3 py-1.5 text-xs ${filter === 'pending' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400'}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
            </div>
          )}
          
          <Button plain onClick={handleDemoAddNewTask}>
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Demo</span>
          </Button>
        </div>
      </GlassCardHeader>
      
      <GlassCardBody>
        {displayTasks.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-zinc-500">
            No tasks matching your filters
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayTasks.map((task, index) => (
              <TaskCard 
                key={task.id}
                task={task}
                isNew={showNewTaskAnimation && index === 0}
                onClick={() => console.log('Task clicked', task.id)}
                onAction={handleTaskAction}
              />
            ))}
          </motion.div>
        )}
        
        {filteredTasks.length > limit && onViewAllClick && (
          <div className="mt-4 text-center">
            <Button 
              onClick={onViewAllClick}
              color="light"
              className="w-full"
            >
              View All Tasks ({filteredTasks.length})
            </Button>
          </div>
        )}
      </GlassCardBody>
    </GlassCard>
  );
}
