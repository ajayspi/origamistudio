/**
 * Paper Grain Anisotropy Engine
 * Evaluates directional torsional hinge stiffness K_theta(phi)
 * K_theta(phi) = K_parallel * cos^2(phi) + K_perp * sin^2(phi)
 * Default machine grain vector g = [0, 1] (parallel to sheet Y-axis)
 */

export interface PaperGrainConfig {
  kParallel: number; // Stiffness along grain (N*m/rad)
  kPerp: number;     // Stiffness perpendicular to grain (N*m/rad)
  grainVector: [number, number]; // Unit vector of paper machine grain
}

export const DEFAULT_WASHI_GRAIN: PaperGrainConfig = {
  kParallel: 2.5e-3,
  kPerp: 1.0e-3,
  grainVector: [0, 1]
};

export function calculateDirectionalStiffness(
  creaseVector: [number, number],
  config = DEFAULT_WASHI_GRAIN
): { stiffness: number; alignmentAngleDeg: number; isCrossGrain: boolean } {
  const len = Math.hypot(creaseVector[0], creaseVector[1]) || 1;
  const ux = creaseVector[0] / len;
  const uy = creaseVector[1] / len;

  const [gx, gy] = config.grainVector;
  const dot = Math.abs(ux * gx + uy * gy);
  const cos2 = dot * dot;
  const sin2 = Math.max(0, 1 - cos2);

  const stiffness = config.kParallel * cos2 + config.kPerp * sin2;
  const alignmentAngleDeg = (Math.acos(Math.min(1, dot)) * 180) / Math.PI;
  const isCrossGrain = alignmentAngleDeg > 45;

  return {
    stiffness,
    alignmentAngleDeg,
    isCrossGrain
  };
}
