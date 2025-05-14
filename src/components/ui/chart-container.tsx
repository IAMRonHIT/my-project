'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { GlassCard, GlassCardBody, GlassCardHeader } from './glass-card';

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  height?: number;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  animate?: boolean;
}

export function ChartContainer({
  title,
  subtitle,
  children,
  className,
  loading = false,
  error,
  height = 300,
  toolbar,
  footer,
  animate = true,
}: ChartContainerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure animation plays after render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-error text-center">
            <div className="text-lg font-medium mb-2">Error</div>
            <div className="text-sm text-zinc-400">{error}</div>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block w-6 h-6 border-2 border-t-ai-blue border-r-ai-blue/50 border-b-ai-blue/30 border-l-ai-blue/10 border-solid rounded-full animate-spin"></div>
            <div className="mt-3 text-sm text-zinc-400">Loading data...</div>
          </div>
        </div>
      );
    }

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full"
          style={{ minHeight: height }}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div className={`h-full min-h-[${height}]`}>
        {children}
      </div>
    );
  };

  return (
    <GlassCard className={clsx('overflow-hidden', className)}>
      {(title || toolbar) && (
        <GlassCardHeader className="flex items-center justify-between">
          <div>
            {title && <h3 className="font-medium text-zinc-200">{title}</h3>}
            {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
          </div>
          {toolbar && <div>{toolbar}</div>}
        </GlassCardHeader>
      )}
      <GlassCardBody className="p-0">
        <div className="p-4">{renderContent()}</div>
      </GlassCardBody>
      {footer && (
        <div className="px-4 py-3 border-t border-zinc-800/20 text-xs text-zinc-400">
          {footer}
        </div>
      )}
    </GlassCard>
  );
}
