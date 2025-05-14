'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AnimatedMetricProps {
  value: number;
  previousValue?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  trend?: 'up' | 'down' | 'neutral';
  precision?: number;
  formatter?: (value: number) => string;
}

export function AnimatedMetric({
  value,
  previousValue,
  prefix = '',
  suffix = '',
  duration = 0.8,
  className,
  size = 'md',
  trend = 'neutral',
  precision = 0,
  formatter,
}: AnimatedMetricProps) {
  const [displayValue, setDisplayValue] = useState(previousValue !== undefined ? previousValue : value);
  
  useEffect(() => {
    // Animate from previous value if provided, otherwise start from current
    const startValue = previousValue !== undefined ? previousValue : value;
    const endValue = value;
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const updateValue = () => {
      const now = Date.now();
      
      if (now >= endTime) {
        setDisplayValue(endValue);
        return;
      }
      
      const progress = (now - startTime) / (endTime - startTime);
      const easedProgress = easeOutCubic(progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(currentValue);
      
      requestAnimationFrame(updateValue);
    };
    
    requestAnimationFrame(updateValue);
  }, [value, previousValue, duration]);

  // Formatting the value with the specified precision
  const formattedValue = formatter 
    ? formatter(displayValue) 
    : displayValue.toFixed(precision);

  // Trend indicator arrow
  const renderTrendIndicator = () => {
    if (trend === 'neutral') return null;
    
    const color = trend === 'up' ? 'text-success' : 'text-error';
    const arrowDirection = trend === 'up' ? '↑' : '↓';
    
    return (
      <span className={clsx('ml-1 text-sm inline-flex items-center', color)}>
        {arrowDirection}
      </span>
    );
  };

  const sizeClasses = {
    sm: 'text-xl font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
    xl: 'text-4xl font-extrabold',
  };
  
  return (
    <div className={clsx('flex items-baseline', className)}>
      <div className={sizeClasses[size]}>
        {prefix && <span className="mr-0.5">{prefix}</span>}
        <motion.span
          key={value} // Force animation to restart when value changes
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formattedValue}
        </motion.span>
        {suffix && <span className="ml-0.5">{suffix}</span>}
      </div>
      {renderTrendIndicator()}
    </div>
  );
}

// Easing function for smooth animation
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

// Currency formatter helper
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Percentage formatter helper
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Time duration formatter (converts seconds to readable format)
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(0)}s`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${remainingMinutes}m`;
}
