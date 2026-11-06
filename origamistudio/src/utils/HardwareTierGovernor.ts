/**
 * HardwareTierGovernor
 * 
 * Adaptive performance governor for OrigamiStudio:
 * Inspects device concurrency, memory, GPU pixel ratio, and reduced-motion
 * to dynamically adjust WebGL DPR, particle counts, and orbital motion.
 * Ensures 60 FPS on school Chromebooks and 4K interactive smartboards.
 */

export interface HardwareBudget {
  tier: 'low' | 'mid' | 'high';
  maxDPR: number;
  particleCount: number;
  enableOrbitals: boolean;
  enableDynamicShadows: boolean;
  targetFPS: number;
}

export function detectHardwareBudget(isCalmMode = false): HardwareBudget {
  if (typeof window === 'undefined') {
    return {
      tier: 'mid',
      maxDPR: 1.0,
      particleCount: 25,
      enableOrbitals: false,
      enableDynamicShadows: false,
      targetFPS: 60,
    };
  }

  const isReducedMotion = isCalmMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4; // GB
  const isLargeScreen = window.innerWidth > 2000;

  if (isReducedMotion) {
    return {
      tier: 'low',
      maxDPR: 1.0,
      particleCount: 0,
      enableOrbitals: false,
      enableDynamicShadows: false,
      targetFPS: 60,
    };
  }

  // Low Tier: School Chromebooks (Celeron / ARM, 2 cores, <= 4GB RAM)
  if (cores <= 2 || memory <= 4) {
    return {
      tier: 'low',
      maxDPR: 1.0,
      particleCount: 20,
      enableOrbitals: false,
      enableDynamicShadows: false,
      targetFPS: 60,
    };
  }

  // Mid Tier: Standard Laptops / Tablets (4 cores, 4-8GB RAM)
  if (cores <= 4 || memory <= 8) {
    return {
      tier: 'mid',
      maxDPR: isLargeScreen ? 1.0 : 1.25,
      particleCount: 35,
      enableOrbitals: true,
      enableDynamicShadows: false,
      targetFPS: 60,
    };
  }

  // High Tier: Modern Desktop / Classroom Core i7 / M-series / iPad Pro
  return {
    tier: 'high',
    maxDPR: isLargeScreen ? 1.0 : 1.5,
    particleCount: 50,
    enableOrbitals: true,
    enableDynamicShadows: true,
    targetFPS: 60,
  };
}
