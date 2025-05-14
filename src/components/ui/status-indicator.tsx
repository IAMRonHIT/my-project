'use client';

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'processing';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
  labelPosition?: 'left' | 'right';
}

export function StatusIndicator({
  status,
  label,
  size = 'md',
  animate = true,
  className,
  labelPosition = 'right',
}: StatusIndicatorProps) {
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-zinc-400',
    warning: 'bg-warning',
    error: 'bg-error',
    processing: 'bg-ai-blue',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const containerClasses = clsx(
    'flex items-center', 
    labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
    className
  );

  const indicatorClasses = clsx(
    'rounded-full',
    statusColors[status],
    dotSizes[size]
  );

  const labelClasses = clsx(
    labelSizes[size],
    'text-zinc-300',
    labelPosition === 'left' ? 'mr-2' : 'ml-2'
  );

  const renderDot = () => {
    if (animate) {
      return (
        <motion.div
          className={clsx(indicatorClasses, 'relative')}
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {status === 'processing' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-ai-blue"
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </motion.div>
      );
    }

    return <div className={indicatorClasses} />;
  };

  return (
    <div className={containerClasses}>
      {renderDot()}
      {label && <span className={labelClasses}>{label}</span>}
    </div>
  );
}
