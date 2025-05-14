'use client';

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

interface PriorityIndicatorProps {
  priority: TaskPriority;
  animate?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function PriorityIndicator({
  priority,
  animate = true,
  className,
  showLabel = false,
}: PriorityIndicatorProps) {
  const priorityColors = {
    critical: 'bg-error',
    high: 'bg-warning',
    medium: 'bg-ai-blue',
    low: 'bg-zinc-400',
  };

  const priorityLabels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  const containerClasses = clsx(
    'flex items-center gap-2',
    className
  );

  const indicatorClasses = clsx(
    'h-2.5 rounded-full',
    priorityColors[priority],
    {
      'w-6': priority === 'critical',
      'w-4': priority === 'high',
      'w-3': priority === 'medium',
      'w-2': priority === 'low',
    }
  );

  const renderIndicator = () => {
    if (animate && priority === 'critical') {
      return (
        <motion.div
          className={indicatorClasses}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
    }

    return <div className={indicatorClasses} />;
  };

  return (
    <div className={containerClasses}>
      {renderIndicator()}
      {showLabel && (
        <span className="text-xs text-zinc-300">
          {priorityLabels[priority]}
        </span>
      )}
    </div>
  );
}
