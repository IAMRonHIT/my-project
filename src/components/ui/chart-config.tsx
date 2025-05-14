'use client';

/**
 * Chart Theme Configuration
 * 
 * This file contains color palettes and helper functions for charts.
 */

// Color palette that matches our brand
export const chartColors = {
  // Primary colors
  blue: 'rgba(0, 150, 255, 0.8)',
  blueLight: 'rgba(51, 173, 255, 0.8)',
  blueDark: 'rgba(0, 120, 204, 0.8)',
  green: 'rgba(0, 200, 83, 0.8)',
  yellow: 'rgba(255, 171, 0, 0.8)',
  red: 'rgba(255, 61, 0, 0.8)',
  purple: 'rgba(139, 92, 246, 0.8)',
  gray: 'rgba(156, 163, 175, 0.8)',
  
  // Semi-transparent versions for backgrounds
  blueAlpha: 'rgba(0, 150, 255, 0.2)',
  greenAlpha: 'rgba(0, 200, 83, 0.2)',
  yellowAlpha: 'rgba(255, 171, 0, 0.2)',
  redAlpha: 'rgba(255, 61, 0, 0.2)',
  purpleAlpha: 'rgba(139, 92, 246, 0.2)',
  
  // Arrays for datasets
  statusColors: [
    'rgba(0, 200, 83, 0.8)',   // success (green)
    'rgba(255, 171, 0, 0.8)',  // warning (yellow)
    'rgba(255, 61, 0, 0.8)',   // error (red)
    'rgba(0, 150, 255, 0.8)',  // processing (blue)
  ],
  
  statusColorsAlpha: [
    'rgba(0, 200, 83, 0.2)',   // success (green)
    'rgba(255, 171, 0, 0.2)',  // warning (yellow)
    'rgba(255, 61, 0, 0.2)',   // error (red)
    'rgba(0, 150, 255, 0.2)',  // processing (blue)
  ]
};

// Theme properties for consistent styling
export const chartTheme = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontColor: '#ededed',
  backgroundColor: 'rgba(26, 26, 26, 0.7)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  gridColor: 'rgba(255, 255, 255, 0.05)',
};

// Default gradient for area charts
export function createGradient(ctx: CanvasRenderingContext2D, color: string, alphaColor: string) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, alphaColor);
  return gradient;
}

// Common chart options builder functions will be used directly in components
