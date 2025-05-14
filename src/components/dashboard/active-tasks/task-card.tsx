'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PriorityIndicator, TaskPriority } from './priority-indicator';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/button';
import { StatusIndicator, StatusType } from '@/components/ui/status-indicator';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'blocked';
  assignee?: {
    name: string;
    avatar?: string;
  };
  category: 'auth' | 'claim' | 'patient' | 'provider';
}

interface TaskCardProps {
  task: TaskData;
  isNew?: boolean;
  onClick?: () => void;
  onAction?: (action: 'start' | 'complete' | 'reassign', taskId: string) => void;
  className?: string;
}

export function TaskCard({
  task,
  isNew = false,
  onClick,
  onAction,
  className,
}: TaskCardProps) {
  const statusMap = {
    pending: { status: 'offline', label: 'Pending' },
    in_progress: { status: 'processing', label: 'In Progress' },
    blocked: { status: 'error', label: 'Blocked' },
  };
  
  const categoryLabels = {
    auth: 'Authorization',
    claim: 'Claims',
    patient: 'Patient',
    provider: 'Provider',
  };
  

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const isDueSoon = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 24;
  };
  
  const isOverdue = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    return due < now;
  };

  const getActionButton = () => {
    if (!onAction) return null;
    
    if (task.status === 'pending') {
      return (
        <Button
          className="bg-ai-blue text-white hover:bg-ai-blue-dark"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('start', task.id);
          }}
        >
          Start Task
        </Button>
      );
    }
    
    if (task.status === 'in_progress') {
      return (
        <Button
          className="bg-success text-white hover:bg-green-700"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('complete', task.id);
          }}
        >
          Complete
        </Button>
      );
    }
    
    if (task.status === 'blocked') {
      return (
        <Button
          className="bg-zinc-700 text-white hover:bg-zinc-600"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('reassign', task.id);
          }}
        >
          Reassign
        </Button>
      );
    }
    
    return null;
  };

  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2">
          <PriorityIndicator priority={task.priority} />
          <div>
            <h3 className="font-medium text-white">{task.title}</h3>
            <div className="text-xs text-zinc-400 mb-1">{categoryLabels[task.category]}</div>
          </div>
        </div>
        <StatusIndicator
          status={statusMap[task.status].status as StatusType}
          label={statusMap[task.status].label}
          size="sm"
        />
      </div>
      
      <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs text-zinc-400">
            <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
            <span className={clsx({
              'text-warning': isDueSoon(),
              'text-error': isOverdue(),
            })}>
              {formatDueDate(task.dueDate)}
            </span>
          </div>
          
          {task.assignee && (
            <div className="flex items-center text-xs text-zinc-400">
              <UserIcon className="w-3.5 h-3.5 mr-1.5" />
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
        
        {getActionButton()}
      </div>
      
      {isNew && (
        <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-ai-blue text-white text-xs font-medium rounded">
          New
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        initial={isNew ? { opacity: 0, y: 10 } : false}
        animate={isNew ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <GlassCard
          className="p-4 cursor-pointer relative transition-all hover:glow-blue"
          glow={task.priority === 'critical' ? 'error' : 'none'}
          onClick={onClick}
        >
          {cardContent}
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <GlassCard
      className={clsx("p-4 relative", className)}
      glow={task.priority === 'critical' ? 'error' : 'none'}
    >
      {cardContent}
    </GlassCard>
  );
}
