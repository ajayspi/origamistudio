// -----------------------------------------------------------------------------
// ORIGAMISTUDIO™ — Yoshizawa-Randlett Universal Illustrated Diagram Engine
// Generates 100% text-free, purely pictorial step diagrams & printable paper sheets
// compliant with International Origami Diagramming Standards (Akira Yoshizawa & OrigamiUSA).
// -----------------------------------------------------------------------------

import { calculateStepPlanMetrics, type StepPlanMetrics } from './origamiKinematics';
import type { OrigamiKit } from '../types/origami';

export interface DiagramOptions {
  size?: number;
  frontColor?: string;
  backColor?: string;
  isMonochrome?: boolean;
  isDark?: boolean;
}

// Cultural & Model Front Palette Lookups
export const getKitThemeColor = (kitId: string, defaultColor = '#ff6b35'): string => {
  const id = (kitId || '').toLowerCase();
  if (id.includes('japanese')) return '#f43f5e'; // Sakura Pink / Crimson
  if (id.includes('indian')) return '#06b6d4'; // Peacock Turquoise
  if (id.includes('chinese')) return '#e11d48'; // Imperial Vermillion
  if (id.includes('american')) return '#d97706'; // Golden Eagle / Bison Kraft
  if (id.includes('lotus')) return '#ec4899'; // Lotus Petal Rose
  if (id.includes('butterfly')) return '#8b5cf6'; // Iridescent Purple
  if (id.includes('geometric')) return '#10b981'; // Emerald Geometric
  if (id.includes('nativity')) return '#d4af37'; // Sacred Gold
  if (id.includes('holiday')) return '#f97316'; // Autumn Amber
  return defaultColor;
};

/**
 * Computes the 2D polygon silhouette of the paper at a given step.
 * Accurately models the progression from flat square to folded shapes.
 */
export function getStepBasePolygon(
  metrics: StepPlanMetrics,
  stepIdx: number,
  size: number,
  pad: number
): { x: number; y: number }[] {
  const w = size - pad * 2;
  const h = size - pad * 2;
  const midX = size / 2;
  const midY = size / 2;

  const toX = (x: number) => midX + (x / 1.5) * (w / 2);
  const toY = (y: number) => midY - (y / 1.5) * (h / 2);

  // Normalized bounds: [-1.2, 1.2]
  if (stepIdx === 0) {
    // Initial pristine square paper
    return [
      { x: toX(-1.2), y: toY(1.2) },
      { x: toX(1.2), y: toY(1.2) },
      { x: toX(1.2), y: toY(-1.2) },
      { x: toX(-1.2), y: toY(-1.2) }
    ];
  }

  if (stepIdx === 1) {
    // Folded half (diagonal triangle or bisected rectangle)
    if (metrics.creaseLine.x1 === metrics.creaseLine.y1 || Math.abs(metrics.creaseLine.x1 - (-1.2)) < 0.1) {
      // Isosceles right triangle
      return [
        { x: toX(-1.2), y: toY(-1.2) },
        { x: toX(1.2), y: toY(1.2) },
        { x: toX(1.2), y: toY(-1.2) }
      ];
    }
    // Bisected rectangle
    return [
      { x: toX(-1.2), y: toY(0.0) },
      { x: toX(1.2), y: toY(0.0) },
      { x: toX(1.2), y: toY(-1.2) },
      { x: toX(-1.2), y: toY(-1.2) }
    ];
  }

  if (stepIdx === 2) {
    // Kite or tapered diamond form
    return [
      { x: toX(0.0), y: toY(1.2) },
      { x: toX(0.9), y: toY(0.2) },
      { x: toX(0.0), y: toY(-1.2) },
      { x: toX(-0.9), y: toY(0.2) }
    ];
  }

  if (stepIdx === 3) {
    // Complex bird-base / squash polygon
    return [
      { x: toX(0.0), y: toY(1.3) },
      { x: toX(0.6), y: toY(0.3) },
      { x: toX(1.2), y: toY(-0.4) },
      { x: toX(0.0), y: toY(-1.1) },
      { x: toX(-1.2), y: toY(-0.4) },
      { x: toX(-0.6), y: toY(0.3) }
    ];
  }

  // Final / advanced form
  return [
    { x: toX(0.0), y: toY(1.1) },
    { x: toX(0.8), y: toY(0.5) },
    { x: toX(1.3), y: toY(-0.2) },
    { x: toX(0.3), y: toY(-0.9) },
    { x: toX(-0.3), y: toY(-0.9) },
    { x: toX(-1.3), y: toY(-0.2) },
    { x: toX(-0.8), y: toY(0.5) }
  ];
}

/**
 * Generates an SVG string or object for a single illustrated step diagram.
 * Standard Yoshizawa-Randlett notation:
 * - Solid border
 * - Dashed valley fold (blue/dark)
 * - Dash-dot-dot mountain fold (red/dark)
 * - Curved arrow with arrowhead
 * - Landmark ❶ beacon and Target ❷ bullseye
 * - Circled step number ①
 * - ZERO written paragraphs / text!
 */
export function generateStepIllustrationData(
  kitId: string,
  stepIdx: number,
  totalSteps: number,
  options: DiagramOptions = {}
) {
  const size = options.size || 220;
  const pad = 24;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const midX = size / 2;
  const midY = size / 2;

  const toX = (x: number) => midX + (x / 1.5) * (w / 2);
  const toY = (y: number) => midY - (y / 1.5) * (h / 2);

  const metrics = calculateStepPlanMetrics(kitId, stepIdx, totalSteps, 1.0);
  const polygon = getStepBasePolygon(metrics, stepIdx, size, pad);

  const polyPointsStr = polygon.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Active Crease Line
  const cX1 = toX(metrics.creaseLine.x1);
  const cY1 = toY(metrics.creaseLine.y1);
  const cX2 = toX(metrics.creaseLine.x2);
  const cY2 = toY(metrics.creaseLine.y2);

  // Moving Landmark ❶
  const ptA = {
    x: toX(metrics.mobileVertex[0]),
    y: toY(metrics.mobileVertex[1])
  };

  // Destination Target ❷
  const lastTraj = metrics.trajectoryPath[metrics.trajectoryPath.length - 1];
  const ptB = lastTraj
    ? { x: toX(lastTraj.x), y: toY(lastTraj.y) }
    : { x: midX, y: midY };

  // Motion Arrow Arc (Quadratic / Cubic Bezier)
  const ctrlX = (ptA.x + ptB.x) / 2 + (ptA.y - ptB.y) * 0.35;
  const ctrlY = (ptA.y + ptB.y) / 2 + (ptB.x - ptA.x) * 0.35;
  const arrowPath = `M ${ptA.x.toFixed(1)} ${ptA.y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${ptB.x.toFixed(1)} ${ptB.y.toFixed(1)}`;

  // Multi-Flap 2D Projections for Compound Folds (e.g. Step 2 Squash / Petal Folds)
  const mobileFlaps2D = metrics.mobileFlaps.map((flap, idx) => {
    const fPtA = {
      x: toX(flap.start[0]),
      y: toY(flap.start[1])
    };
    const fPtB = {
      x: toX(flap.target[0]),
      y: toY(flap.target[1])
    };
    const curveMult = idx % 2 === 0 ? 0.35 : -0.35;
    const fCtrlX = (fPtA.x + fPtB.x) / 2 + (fPtA.y - fPtB.y) * curveMult;
    const fCtrlY = (fPtA.y + fPtB.y) / 2 + (fPtB.x - fPtA.x) * curveMult;
    const fArrowPath = `M ${fPtA.x.toFixed(1)} ${fPtA.y.toFixed(1)} Q ${fCtrlX.toFixed(1)} ${fCtrlY.toFixed(1)} ${fPtB.x.toFixed(1)} ${fPtB.y.toFixed(1)}`;
    const fCrease = {
      x1: toX(flap.creaseLine.x1),
      y1: toY(flap.creaseLine.y1),
      x2: toX(flap.creaseLine.x2),
      y2: toY(flap.creaseLine.y2),
    };
    const startBadge = idx === 0 ? '❶' : '❸';
    const targetBadge = idx === 0 ? '❷' : '❹';
    const color = idx === 0 ? '#f59e0b' : '#06b6d4';
    return {
      id: flap.id,
      ptA: fPtA,
      ptB: fPtB,
      arrowPath: fArrowPath,
      crease: fCrease,
      startBadge,
      targetBadge,
      color,
      badgeColor: flap.badgeColor || (idx === 0 ? 'amber' : 'cyan')
    };
  });

  const isMountain = metrics.foldCategory === 'mountain' || metrics.foldCategory === 'reverse';

  // Front & Back Facet Color Coding
  const frontColor = options.frontColor || getKitThemeColor(kitId);
  const backColor = options.backColor || '#f8fafc'; // White reverse side of Kami paper

  const isDark = options.isDark ?? false;
  const isMonochrome = options.isMonochrome ?? false;

  const paperFill = isMonochrome ? '#ffffff' : (stepIdx % 2 === 0 ? frontColor : backColor);
  const paperStroke = isDark ? '#ffffff' : '#0f172a';
  const valleyColor = isMonochrome ? '#0f172a' : '#2563eb';
  const mountainColor = isMonochrome ? '#0f172a' : '#dc2626';

  return {
    stepNumber: stepIdx + 1,
    size,
    pad,
    polyPointsStr,
    cX1,
    cY1,
    cX2,
    cY2,
    ptA,
    ptB,
    arrowPath,
    mobileFlaps2D,
    isMountain,
    paperFill,
    paperStroke,
    valleyColor,
    mountainColor,
    isDark,
    isMonochrome
  };
}

/**
 * Generates the "After" (Target Result) illustration data for a step.
 * Shows the paper state after the fold has completed:
 * - Resulting folded polygon (polygon of stepIdx + 1 or final sculpture)
 * - Pressed crease line (solid seam indicating fold has been pressed)
 * - Docked flap with dual-color Kami paper contrast (white reverse side exposed if valley folded)
 * - Destination ❷ highlighted with a green checkmark
 */
export function generateStepAfterIllustrationData(
  kitId: string,
  stepIdx: number,
  totalSteps: number,
  options: DiagramOptions = {}
) {
  const size = options.size || 220;
  const pad = 24;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const midX = size / 2;
  const midY = size / 2;

  const toX = (x: number) => midX + (x / 1.5) * (w / 2);
  const toY = (y: number) => midY - (y / 1.5) * (h / 2);

  const nextStepIdx = Math.min(totalSteps - 1, stepIdx + 1);
  const nextMetrics = calculateStepPlanMetrics(kitId, nextStepIdx, totalSteps, 1.0);
  const polygon = getStepBasePolygon(nextMetrics, nextStepIdx, size, pad);
  const polyPointsStr = polygon.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const currMetrics = calculateStepPlanMetrics(kitId, stepIdx, totalSteps, 1.0);
  // Pressed Crease Line (solid seam)
  const cX1 = toX(currMetrics.creaseLine.x1);
  const cY1 = toY(currMetrics.creaseLine.y1);
  const cX2 = toX(currMetrics.creaseLine.x2);
  const cY2 = toY(currMetrics.creaseLine.y2);

  // Arrived Destination Point ❷ (Primary & Compound Flaps)
  const lastTraj = currMetrics.trajectoryPath[currMetrics.trajectoryPath.length - 1];
  const ptDocked = lastTraj
    ? { x: toX(lastTraj.x), y: toY(lastTraj.y) }
    : { x: midX, y: midY };

  const mobileFlapsAfter2D = currMetrics.mobileFlaps.map((flap, idx) => {
    return {
      id: flap.id,
      x: toX(flap.target[0]),
      y: toY(flap.target[1]),
      badgeNumber: (idx + 1) * 2,
      color: idx === 0 ? '#059669' : '#0891b2'
    };
  });

  const frontColor = options.frontColor || getKitThemeColor(kitId);
  const backColor = options.backColor || '#f8fafc';
  const isDark = options.isDark ?? false;
  const isMonochrome = options.isMonochrome ?? false;

  // After fold, the folded facet exposes the opposite side (Kami dual-color effect)
  const paperFill = isMonochrome ? '#f1f5f9' : (stepIdx % 2 === 0 ? backColor : frontColor);
  const paperStroke = isDark ? '#ffffff' : '#0f172a';
  const seamColor = isDark ? '#38bdf8' : '#0284c7';

  return {
    stepNumber: stepIdx + 1,
    size,
    pad,
    polyPointsStr,
    cX1,
    cY1,
    cX2,
    cY2,
    ptDocked,
    mobileFlapsAfter2D,
    paperFill,
    paperStroke,
    seamColor,
    isFinalStep: stepIdx === totalSteps - 1,
    isDark,
    isMonochrome
  };
}

/**
 * Generates the full Printable Origami Folding Sheet (A square with cutting marks,
 * fold guide dashes, landmark registration corners, and ZERO text).
 */
export function generatePrintablePaperSheetData(
  kit: OrigamiKit,
  options: DiagramOptions = {}
) {
  const size = options.size || 500;
  const pad = 40;
  const sheetSize = size - pad * 2;
  const midX = size / 2;
  const midY = size / 2;

  const frontColor = options.frontColor || getKitThemeColor(kit.id);
  const isMonochrome = options.isMonochrome ?? false;

  // Key fold lines across all steps
  const totalSteps = kit.steps ? kit.steps.length : 5;
  const allCreases = [];

  for (let s = 0; s < totalSteps; s++) {
    const m = calculateStepPlanMetrics(kit.id, s, totalSteps, 1.0);
    const toX = (x: number) => midX + (x / 1.5) * (sheetSize / 2);
    const toY = (y: number) => midY - (y / 1.5) * (sheetSize / 2);

    allCreases.push({
      x1: toX(m.creaseLine.x1),
      y1: toY(m.creaseLine.y1),
      x2: toX(m.creaseLine.x2),
      y2: toY(m.creaseLine.y2),
      isMountain: m.foldCategory === 'mountain' || m.foldCategory === 'reverse',
      stepNumber: s + 1
    });
  }

  return {
    size,
    pad,
    sheetSize,
    midX,
    midY,
    frontColor: isMonochrome ? '#ffffff' : frontColor,
    isMonochrome,
    allCreases,
    corners: [
      { label: '❶', x: pad + 18, y: pad + 18 },
      { label: '❷', x: size - pad - 18, y: pad + 18 },
      { label: '❸', x: size - pad - 18, y: size - pad - 18 },
      { label: '❹', x: pad + 18, y: size - pad - 18 }
    ],
    registrationMarks: [
      { x1: pad - 10, y1: pad, x2: pad + 10, y2: pad }, // Top-Left Crosshair
      { x1: pad, y1: pad - 10, x2: pad, y2: pad + 10 },
      { x1: size - pad - 10, y1: pad, x2: size - pad + 10, y2: pad }, // Top-Right Crosshair
      { x1: size - pad, y1: pad - 10, x2: size - pad, y2: pad + 10 },
      { x1: size - pad - 10, y1: size - pad, x2: size - pad + 10, y2: size - pad }, // Bottom-Right
      { x1: size - pad, y1: size - pad - 10, x2: size - pad, y2: size - pad + 10 },
      { x1: pad - 10, y1: size - pad, x2: pad + 10, y2: size - pad }, // Bottom-Left
      { x1: pad, y1: size - pad - 10, x2: pad, y2: size - pad + 10 }
    ]
  };
}
