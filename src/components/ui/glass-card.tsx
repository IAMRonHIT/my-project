'use client';

import { motion } from 'framer-motion';
import React from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'success' | 'warning' | 'error' | 'none';
  border?: boolean;
}

function createCardContent(children: React.ReactNode) {
  return (
    <>
      {/* Glassmorphic highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0096FF]/5 to-transparent pointer-events-none" />
      
      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </>
  );
}

function getGlowClass(glow: 'blue' | 'success' | 'warning' | 'error' | 'none') {
  const glowClasses = {
    'none': '',
    'blue': 'glow-blue',
    'success': 'glow-success',
    'warning': 'glow-warning',
    'error': 'glow-error',
  };
  
  return glowClasses[glow];
}

export function GlassCard({ 
  children, 
  className, 
  glow = 'none',
  border = true, 
  ...props 
}: GlassCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const wrapperClasses = clsx(
    'glass-card',
    border ? 'border border-zinc-800/50' : '',
    glow !== 'none' ? getGlowClass(glow) : '',
    className
  );

  return (
    <div className={wrapperClasses} {...props}>
      {createCardContent(children)}
    </div>
  );
}

export function AnimatedGlassCard({ 
  children, 
  className, 
  glow = 'none',
  border = true, 
  ...props 
}: GlassCardProps & Omit<React.ComponentProps<typeof motion.div>, keyof GlassCardProps>) {
  const wrapperClasses = clsx(
    'glass-card',
    border ? 'border border-zinc-800/50' : '',
    glow !== 'none' ? getGlowClass(glow) : '',
    className
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={wrapperClasses}
      {...props}
    >
      {createCardContent(children)}
    </motion.div>
  );
}

export function GlassCardHeader({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={clsx('p-4 border-b border-zinc-800/20', className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardBody({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={clsx('p-4', className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardFooter({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={clsx('p-4 border-t border-zinc-800/20', className)} 
      {...props}
    >
      {children}
    </div>
  );
}
