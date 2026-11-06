/**
 * -----------------------------------------------------------------------------
 * ORIGAMISTUDIO™ — Analytical Huzita-Hatori Origami Axioms Engine (Axioms 1 - 7)
 * Implements the complete geometric foundation of computational origami.
 * Formulated by Humiaki Huzita (1989), Koshiro Hatori (2001), and Robert J. Lang.
 * -----------------------------------------------------------------------------
 */

export type Point2D = [number, number];

export interface Line2D {
  a: number; // Normalized x coefficient
  b: number; // Normalized y coefficient
  c: number; // Constant term: a*x + b*y + c = 0 with a^2 + b^2 = 1
}

const EPSILON = 1e-9;

/**
 * Normalizes line coefficients such that a^2 + b^2 = 1.
 */
export function normalizeLine(a: number, b: number, c: number): Line2D {
  const norm = Math.hypot(a, b);
  if (norm < EPSILON) {
    return { a: 1, b: 0, c: 0 };
  }
  let na = a / norm;
  let nb = b / norm;
  let nc = c / norm;

  // Canonical orientation: ensure a > 0, or if a == 0, b > 0
  if (na < -EPSILON || (Math.abs(na) <= EPSILON && nb < 0)) {
    na = -na;
    nb = -nb;
    nc = -nc;
  }

  return { a: na, b: nb, c: nc };
}

/**
 * Constructs a normalized 2D line passing through two distinct points.
 */
export function makeLine(p1: Point2D, p2: Point2D): Line2D {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const a = -dy;
  const b = dx;
  const c = -(a * p1[0] + b * p1[1]);
  return normalizeLine(a, b, c);
}

/**
 * Computes the perpendicular distance from point P to line L.
 */
export function distancePointToLine(p: Point2D, l: Line2D): number {
  return Math.abs(l.a * p[0] + l.b * p[1] + l.c);
}

/**
 * Computes the intersection point of two lines, or null if parallel.
 */
export function intersectLines(l1: Line2D, l2: Line2D): Point2D | null {
  const det = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(det) < EPSILON) {
    return null; // Lines are parallel
  }
  const x = (l1.b * l2.c - l2.b * l1.c) / det;
  const y = (l2.a * l1.c - l1.a * l2.c) / det;
  return [x, y];
}

/**
 * Reflects a point P across line L.
 */
export function reflectPointAcrossLine(p: Point2D, l: Line2D): Point2D {
  const signedDist = l.a * p[0] + l.b * p[1] + l.c;
  return [
    p[0] - 2 * l.a * signedDist,
    p[1] - 2 * l.b * signedDist
  ];
}

/**
 * Axiom 1 (O1): Given two points P1 and P2, fold a crease passing through both.
 */
export function solveAxiom1(p1: Point2D, p2: Point2D): Line2D | null {
  const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  if (dist < EPSILON) return null;
  return makeLine(p1, p2);
}

/**
 * Axiom 2 (O2): Given two points P1 and P2, fold P1 onto P2 (Perpendicular bisector).
 */
export function solveAxiom2(p1: Point2D, p2: Point2D): Line2D | null {
  const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  if (dist < EPSILON) return null;

  const midX = (p1[0] + p2[0]) / 2;
  const midY = (p1[1] + p2[1]) / 2;
  const normalX = p2[0] - p1[0];
  const normalY = p2[1] - p1[1];
  const c = -(normalX * midX + normalY * midY);

  return normalizeLine(normalX, normalY, c);
}

/**
 * Axiom 3 (O3): Given two lines L1 and L2, fold L1 onto L2 (Angle bisectors).
 */
export function solveAxiom3(l1: Line2D, l2: Line2D): Line2D[] {
  // Bisector 1: (a1 + a2)x + (b1 + b2)y + (c1 + c2) = 0
  // Bisector 2: (a1 - a2)x + (b1 - b2)y + (c1 - c2) = 0
  const results: Line2D[] = [];

  const b1 = normalizeLine(l1.a + l2.a, l1.b + l2.b, l1.c + l2.c);
  if (Math.hypot(l1.a + l2.a, l1.b + l2.b) > EPSILON) {
    results.push(b1);
  }

  const b2 = normalizeLine(l1.a - l2.a, l1.b - l2.b, l1.c - l2.c);
  if (Math.hypot(l1.a - l2.a, l1.b - l2.b) > EPSILON) {
    results.push(b2);
  }

  return results;
}

/**
 * Axiom 4 (O4): Given a point P and line L, fold a crease perpendicular to L through P.
 */
export function solveAxiom4(p: Point2D, l: Line2D): Line2D | null {
  const aPerp = -l.b;
  const bPerp = l.a;
  const cPerp = -(aPerp * p[0] + bPerp * p[1]);
  return normalizeLine(aPerp, bPerp, cPerp);
}

/**
 * Axiom 5 (O5): Given two points P1 and P2 and a line L, fold P1 onto L passing through P2.
 */
export function solveAxiom5(p1: Point2D, p2: Point2D, l: Line2D): Line2D[] {
  // Reflection of P1 onto L: distance from P2 to P1' must equal radius R = dist(P1, P2)
  const radius = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
  const distToLine = distancePointToLine(p2, l);

  if (distToLine > radius + 1e-7) {
    return []; // No intersection possible
  }

  // Projection of P2 onto line L
  const signedDist = l.a * p2[0] + l.b * p2[1] + l.c;
  const projX = p2[0] - l.a * signedDist;
  const projY = p2[1] - l.b * signedDist;

  // Tangent vector along line L
  const tx = -l.b;
  const ty = l.a;

  const halfChord = Math.sqrt(Math.max(0, radius * radius - signedDist * signedDist));
  const candidatePoints: Point2D[] = [];

  candidatePoints.push([projX + tx * halfChord, projY + ty * halfChord]);
  if (halfChord > EPSILON) {
    candidatePoints.push([projX - tx * halfChord, projY - ty * halfChord]);
  }

  const solutions: Line2D[] = [];
  for (const p1Prime of candidatePoints) {
    const crease = solveAxiom2(p1, p1Prime);
    if (crease) {
      solutions.push(crease);
    }
  }

  return solutions;
}

/**
 * Axiom 6 (O6 / Beloch Fold): Given two points P1, P2 and two lines L1, L2,
 * fold P1 onto L1 and P2 onto L2 simultaneously.
 */
export function solveAxiom6(p1: Point2D, p2: Point2D, l1: Line2D, l2: Line2D): Line2D[] {
  // Root-finding on the 1D common-tangent angle parameter theta in [0, pi)
  const v1 = l1.a * p1[0] + l1.b * p1[1] + l1.c;
  const v2 = l2.a * p2[0] + l2.b * p2[1] + l2.c;

  const evalResidual = (theta: number): number | null => {
    const nx = Math.cos(theta);
    const ny = Math.sin(theta);

    const k1 = l1.a * nx + l1.b * ny;
    const k2 = l2.a * nx + l2.b * ny;

    if (Math.abs(k1) < 1e-5 || Math.abs(k2) < 1e-5) return null;

    const rho1 = (p1[0] * nx + p1[1] * ny) - v1 / (2 * k1);
    const rho2 = (p2[0] * nx + p2[1] * ny) - v2 / (2 * k2);

    return rho1 - rho2;
  };

  const solutions: Line2D[] = [];
  const samples = 180;
  const step = Math.PI / samples;

  for (let i = 0; i < samples; i++) {
    const tA = i * step;
    const tB = (i + 1) * step;

    const rA = evalResidual(tA);
    const rB = evalResidual(tB);

    if (rA !== null && rB !== null && rA * rB <= 0) {
      // Bisect root
      let low = tA;
      let high = tB;
      for (let iter = 0; iter < 24; iter++) {
        const mid = (low + high) / 2;
        const rMid = evalResidual(mid);
        if (rMid === null || Math.abs(rMid) < 1e-8) {
          low = mid;
          break;
        }
        if (rA * rMid <= 0) {
          high = mid;
        } else {
          low = mid;
        }
      }

      const rootTheta = (low + high) / 2;
      const nx = Math.cos(rootTheta);
      const ny = Math.sin(rootTheta);
      const k1 = l1.a * nx + l1.b * ny;
      if (Math.abs(k1) > 1e-5) {
        const rho = (p1[0] * nx + p1[1] * ny) - v1 / (2 * k1);
        const candidate = normalizeLine(nx, ny, -rho);

        // Verify validity: reflects p1 to l1 and p2 to l2
        const p1Ref = reflectPointAcrossLine(p1, candidate);
        const p2Ref = reflectPointAcrossLine(p2, candidate);
        if (distancePointToLine(p1Ref, l1) < 1e-2 && distancePointToLine(p2Ref, l2) < 1e-2) {
          // Avoid duplicate lines
          const isDup = solutions.some(s => Math.abs(s.a - candidate.a) < 1e-3 && Math.abs(s.b - candidate.b) < 1e-3 && Math.abs(s.c - candidate.c) < 1e-3);
          if (!isDup) {
            solutions.push(candidate);
          }
        }
      }
    }
  }

  return solutions;
}

/**
 * Axiom 7 (O7): Given a point P and two lines L1, L2,
 * fold a crease perpendicular to L2 placing P onto L1.
 */
export function solveAxiom7(p: Point2D, l1: Line2D, l2: Line2D): Line2D[] {
  // Normal of crease must be perpendicular to normal of L2
  // Normal of L2 is (l2.a, l2.b).
  // Perpendicular direction is (-l2.b, l2.a)
  const nx = -l2.b;
  const ny = l2.a;

  const k = l1.a * nx + l1.b * ny;
  if (Math.abs(k) < EPSILON) {
    return []; // No solution: crease would be parallel to L1
  }

  const v = l1.a * p[0] + l1.b * p[1] + l1.c;
  const rho = (p[0] * nx + p[1] * ny) - v / (2 * k);

  const crease = normalizeLine(nx, ny, -rho);
  return [crease];
}
