'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoltIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Demo insights for the rotating display
const DEMO_INSIGHTS = [
  {
    text: "Prior authorizations for Aetna have increased approval rate by 8% this week.",
    type: "trend",
  },
  {
    text: "Patient John Doe's authorization is pending review for 2+ days. Recommended: Escalate priority.",
    type: "alert",
  },
  {
    text: "Claims rejection rate dropped 5.2% after implementing the new documentation protocol.",
    type: "success",
  },
  {
    text: "Based on historical data, expect 15% increase in cardiology referrals next month.",
    type: "prediction",
  },
  {
    text: "Humana prior authorizations taking 2.3 days longer than other payers. Recommended: Review submission process.",
    type: "insight",
  }
];

interface AIInsightsBarProps {
  className?: string;
}

export function AIInsightsBar({ className }: AIInsightsBarProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Rotate through insights
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentInsightIndex((prevIndex) => 
          prevIndex === DEMO_INSIGHTS.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 500); // Wait for exit animation before changing the text
      
    }, 7000); // Change insight every 7 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  const currentInsight = DEMO_INSIGHTS[currentInsightIndex];
  
  // Determine icon and color based on insight type
  const getInsightStyle = (type: string) => {
    switch(type) {
      case 'alert':
        return { icon: LightBulbIcon, color: 'text-warning' };
      case 'success':
        return { icon: LightBulbIcon, color: 'text-success' };
      case 'prediction':
        return { icon: LightBulbIcon, color: 'text-purple-400' };
      case 'trend':
        return { icon: LightBulbIcon, color: 'text-ai-blue' };
      case 'insight':
      default:
        return { icon: LightBulbIcon, color: 'text-ai-blue' };
    }
  };
  
  const { icon: Icon, color } = getInsightStyle(currentInsight.type);
  
  return (
    <div 
      className={clsx(
        "bg-black/30 backdrop-blur-sm border-b border-zinc-800 p-3",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center px-2">
        <div className="flex items-center gap-2">
          <BoltIcon className="h-5 w-5 text-ai-blue" />
          <span className="text-sm text-ai-blue font-medium">Ron AI</span>
          <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
            Insights
          </span>
        </div>
        
        <div className="h-4 mx-4 w-px bg-zinc-800" />
        
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentInsightIndex}
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Icon className={clsx("h-4 w-4 mr-2", color)} />
                <span className="text-sm text-zinc-300">{currentInsight.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="ml-4 flex items-center gap-1">
          {DEMO_INSIGHTS.map((_, index) => (
            <button
              key={index}
              aria-label={`Show insight ${index + 1}`}
              className={clsx(
                "w-1.5 h-1.5 rounded-full transition-colors",
                index === currentInsightIndex ? "bg-ai-blue" : "bg-zinc-700"
              )}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentInsightIndex(index);
                  setIsVisible(true);
                }, 300);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
