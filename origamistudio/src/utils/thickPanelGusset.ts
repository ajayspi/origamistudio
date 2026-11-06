/**
 * Thick-Panel Gusset Clearance Engine
 * Evaluates continuous C^inf regularized smoothstep gusset clearance
 * w_gusset(theta, t) = 2 * t * S(theta/pi) * (theta/2) / sqrt(sin^2(theta/2) + eps^2)
 */

export interface GussetClearanceResult {
  creaseAngleRad: number;
  thicknessMm: number;
  clearanceWidthMm: number;
  offsetMm: number;
}

export function calculateGussetClearance(
  creaseAngleRad: number,
  thicknessMm = 0.1,
  eps = 0.05
): GussetClearanceResult {
  const theta = Math.max(0, Math.min(Math.PI, Math.abs(creaseAngleRad)));
  const u = theta / Math.PI;
  // Smoothstep S(u) = 3*u^2 - 2*u^3
  const smooth = 3 * u * u - 2 * u * u * u;
  const halfTheta = theta * 0.5;
  const denominator = Math.sqrt(Math.sin(halfTheta) ** 2 + eps * eps);
  const regularizedCsc = halfTheta / denominator;

  const clearanceWidthMm = 2 * thicknessMm * smooth * regularizedCsc;
  const offsetMm = clearanceWidthMm * 0.5;

  return {
    creaseAngleRad: theta,
    thicknessMm,
    clearanceWidthMm,
    offsetMm
  };
}
