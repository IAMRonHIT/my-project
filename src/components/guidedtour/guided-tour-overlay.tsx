'use client';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGuidedTour } from '@/context/GuidedTourContext';

export function GuidedTourOverlay() {
  const { step, next, steps } = useGuidedTour();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      containerRef.current = el;
    }
  }, []);

  if (step === 0 || !containerRef.current) return null;

  const current = steps[step - 1];
  const target = current.targetSelector
    ? document.querySelector(current.targetSelector)
    : null;

  const style: React.CSSProperties = target
    ? {
        position: 'absolute',
        top: target.getBoundingClientRect().bottom + window.scrollY + 8,
        left: target.getBoundingClientRect().left + window.scrollX,
      }
    : {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
      };

  return createPortal(
    <div style={style} className="bg-ai-blue text-white p-4 rounded shadow-lg z-50">
      <p className="mb-2">{current.message}</p>
      <button onClick={next} className="bg-white text-ai-blue px-3 py-1 rounded">
        Next Demo Step
      </button>
    </div>,
    containerRef.current
  );
}
