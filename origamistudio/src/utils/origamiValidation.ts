/**
 * ORIGAMISTUDIO™ — Flat-Foldability Mathematical Validation Engine
 * 
 * Rigorously validates computational origami crease patterns against fundamental
 * flat-foldability theorems:
 * 1. Kawasaki's Theorem (Kawasaki-Justin): Alternating sum of sector angles around degree-2n interior vertex = 180° (π rad).
 * 2. Maekawa's Theorem (Maekawa-Justin): Parity difference between mountain and valley folds |M - V| = 2.
 * 3. Big-Little-Big Angle Theorem: Any sector strictly smaller than both neighbors must be bounded by opposite crease assignments.
 */

export type CreaseAssignment = 'M' | 'V' | 'B' | 'F' | 'U';

export interface IncidentCrease {
  edgeId?: string;
  assignment: CreaseAssignment;
  angle?: number;
  targetVertexId?: string;
}

export interface CreaseVertex {
  id: string;
  coords?: [number, number];
  isInterior?: boolean;
  sectorAngles?: number[];
  incidentCreases?: IncidentCrease[];
  assignments?: CreaseAssignment[];
}

export interface CreaseEdge {
  id?: string;
  source: string;
  target: string;
  assignment: CreaseAssignment;
  foldAngle?: number;
}

export interface CreasePatternGraph {
  vertices: CreaseVertex[] | Record<string, CreaseVertex>;
  edges?: CreaseEdge[];
  vertices_coords?: number[][];
  edges_vertices?: number[][];
  edges_assignment?: CreaseAssignment[];
}

export interface ValidationResult {
  isValid: boolean;
  theorem?: 'kawasaki' | 'maekawa' | 'big-little-big' | 'general' | string;
  message: string;
  oddSum?: number;
  evenSum?: number;
  alternatingSum?: number;
  mountains?: number;
  valleys?: number;
  parityDifference?: number;
  littleAngleIndices?: number[];
  violatingIndices?: number[];
  details?: Record<string, unknown>;
}

export interface VertexValidationReport {
  vertexId: string;
  isValid: boolean;
  kawasaki: ValidationResult;
  maekawa: ValidationResult;
  bigLittleBig?: ValidationResult;
  errors: string[];
}

export interface PatternValidationSummary {
  isValid: boolean;
  totalVertices: number;
  validVertices: number;
  invalidVertices: number;
  offendingVertexIds: string[];
  diagnostics: Array<{
    vertexId: string;
    message: string;
    theorem?: string;
  }>;
  vertexReports?: Record<string, VertexValidationReport>;
}

export const EPSILON = 1e-4;

/**
 * Normalizes an angle into [0, 2π) radians.
 */
export function normalizeAngleRad(angle: number): number {
  const twoPi = 2 * Math.PI;
  let normalized = angle % twoPi;
  if (normalized < 0) {
    normalized += twoPi;
  }
  return normalized;
}

/**
 * Normalizes an angle into [0, 360) degrees.
 */
export function normalizeAngleDeg(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Validates Kawasaki's Theorem for an interior vertex:
 * For any flat-foldable interior vertex of degree 2n:
 * θ_0 + θ_2 + ... + θ_{2n-2} = 180° (π rad)
 * θ_1 + θ_3 + ... + θ_{2n-1} = 180° (π rad)
 */
export function validateKawasakiTheorem(vertex: CreaseVertex): ValidationResult {
  if (vertex.isInterior === false) {
    return {
      isValid: true,
      theorem: 'kawasaki',
      message: `Boundary vertex ${vertex.id} skipped for Kawasaki theorem.`
    };
  }

  const angles = vertex.sectorAngles ?? [];

  if (angles.length === 0) {
    return {
      isValid: true,
      theorem: 'kawasaki',
      message: `Vertex ${vertex.id} has no sector angles defined.`
    };
  }

  // Degree must be even (2n)
  if (angles.length % 2 !== 0) {
    return {
      isValid: false,
      theorem: 'kawasaki',
      message: `Kawasaki theorem violated: Interior vertex ${vertex.id} has odd degree (${angles.length}); flat-foldable interior vertices must have degree-2n (even degree).`,
      details: { degree: angles.length }
    };
  }

  // Detect radians vs degrees based on total sum
  const totalAngle = angles.reduce((sum, a) => sum + a, 0);
  const isRadians = Math.abs(totalAngle - 2 * Math.PI) < 0.2 || (totalAngle <= 2 * Math.PI + 0.1 && Math.abs(totalAngle - 360) > 10);
  const targetHalf = isRadians ? Math.PI : 180.0;

  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < angles.length; i++) {
    if (i % 2 === 0) {
      oddSum += angles[i];
    } else {
      evenSum += angles[i];
    }
  }

  const alternatingSum = oddSum - evenSum;
  const isOddValid = Math.abs(oddSum - targetHalf) < EPSILON;
  const isEvenValid = Math.abs(evenSum - targetHalf) < EPSILON;
  const isAlternatingValid = Math.abs(alternatingSum) < EPSILON;

  const isValid = isOddValid && isEvenValid && isAlternatingValid;

  if (isValid) {
    return {
      isValid: true,
      theorem: 'kawasaki',
      oddSum,
      evenSum,
      alternatingSum,
      message: `Kawasaki theorem satisfied at vertex ${vertex.id}: alternating sector angle sum equals ${targetHalf}${isRadians ? ' rad' : '°'}.`
    };
  }

  return {
    isValid: false,
    theorem: 'kawasaki',
    oddSum,
    evenSum,
    alternatingSum,
    message: `Kawasaki theorem violated at vertex ${vertex.id}: alternating sector sums are ${oddSum.toFixed(2)}${isRadians ? ' rad' : '°'} and ${evenSum.toFixed(2)}${isRadians ? ' rad' : '°'}, expected ${targetHalf}${isRadians ? ' rad' : '°'}.`
  };
}

/**
 * Validates Maekawa's Theorem for an interior vertex:
 * For any flat-foldable interior vertex:
 * |M - V| = 2 (where M = Mountain count, V = Valley count).
 */
export function validateMaekawaTheorem(vertex: CreaseVertex): ValidationResult {
  if (vertex.isInterior === false) {
    return {
      isValid: true,
      theorem: 'maekawa',
      message: `Boundary vertex ${vertex.id} skipped for Maekawa theorem.`
    };
  }

  let folds: CreaseAssignment[] = [];
  if (vertex.assignments) {
    folds = vertex.assignments;
  } else if (vertex.incidentCreases) {
    folds = vertex.incidentCreases.map(c => c.assignment);
  }

  const mountains = folds.filter(f => f === 'M').length;
  const valleys = folds.filter(f => f === 'V').length;
  const parityDifference = Math.abs(mountains - valleys);

  const isValid = parityDifference === 2;

  if (isValid) {
    return {
      isValid: true,
      theorem: 'maekawa',
      mountains,
      valleys,
      parityDifference,
      message: `Maekawa theorem satisfied at vertex ${vertex.id}: |M - V| = |${mountains} - ${valleys}| = 2.`
    };
  }

  return {
    isValid: false,
    theorem: 'maekawa',
    mountains,
    valleys,
    parityDifference,
    message: `Maekawa theorem violated at vertex ${vertex.id}: |M - V| = |${mountains} - ${valleys}| = ${parityDifference}, expected ±2.`
  };
}

/**
 * Validates the Big-Little-Big Theorem:
 * When an incident sector angle is strictly smaller than both adjacent neighbors,
 * the two bounding folds must have opposite parity (one Mountain, one Valley).
 */
export function validateBigLittleBig(
  anglesOrVertex: number[] | CreaseVertex,
  assignments?: CreaseAssignment[]
): ValidationResult & { littleAngleIndices: number[]; violatingIndices: number[] } {
  let angles: number[] = [];
  let folds: CreaseAssignment[] = assignments ?? [];

  if (Array.isArray(anglesOrVertex)) {
    angles = anglesOrVertex;
  } else {
    angles = anglesOrVertex.sectorAngles ?? [];
    if (folds.length === 0) {
      if (anglesOrVertex.assignments) {
        folds = anglesOrVertex.assignments;
      } else if (anglesOrVertex.incidentCreases) {
        folds = anglesOrVertex.incidentCreases.map(c => c.assignment);
      }
    }
  }

  const n = angles.length;
  const littleAngleIndices: number[] = [];
  const violatingIndices: number[] = [];

  if (n < 3) {
    return {
      isValid: true,
      theorem: 'big-little-big',
      message: 'Insufficient sectors for Big-Little-Big evaluation.',
      littleAngleIndices,
      violatingIndices
    };
  }

  for (let i = 0; i < n; i++) {
    const prev = (i - 1 + n) % n;
    const next = (i + 1) % n;

    const isStrictlySmaller = angles[i] < angles[prev] - EPSILON && angles[i] < angles[next] - EPSILON;
    if (isStrictlySmaller) {
      littleAngleIndices.push(i);

      if (folds.length >= n) {
        const fold1 = folds[i];
        const fold2 = folds[next];

        // Creases bounding a strictly minimal angle must have opposite assignments (one M, one V)
        const isSameParity = (fold1 === 'M' && fold2 === 'M') || (fold1 === 'V' && fold2 === 'V');
        if (isSameParity) {
          violatingIndices.push(i);
        }
      }
    }
  }

  if (violatingIndices.length > 0) {
    return {
      isValid: false,
      theorem: 'big-little-big',
      littleAngleIndices,
      violatingIndices,
      message: `Big-Little-Big violation: sector(s) at index [${violatingIndices.join(', ')}] strictly smaller than neighbors but bounded by folds of identical parity.`
    };
  }

  return {
    isValid: true,
    theorem: 'big-little-big',
    littleAngleIndices,
    violatingIndices,
    message: littleAngleIndices.length > 0
      ? 'Big-Little-Big theorem satisfied: all minimal sectors have opposite bounding fold parity.'
      : 'Big-Little-Big theorem satisfied: no strictly minimal angles detected.'
  };
}

/**
 * Validates an entire crease pattern graph against flat-foldability theorems.
 */
export function validateCreasePattern(pattern: CreasePatternGraph): PatternValidationSummary {
  const verticesList: CreaseVertex[] = Array.isArray(pattern.vertices)
    ? pattern.vertices
    : Object.values(pattern.vertices);

  const diagnostics: Array<{ vertexId: string; message: string; theorem?: string }> = [];
  const offendingVertexIds: string[] = [];
  const vertexReports: Record<string, VertexValidationReport> = {};

  let validVertices = 0;
  let invalidVertices = 0;

  for (const vertex of verticesList) {
    const isInterior = vertex.isInterior !== false;
    if (!isInterior) {
      validVertices++;
      continue;
    }

    const kawasaki = validateKawasakiTheorem(vertex);
    const maekawa = validateMaekawaTheorem(vertex);
    const blb = validateBigLittleBig(vertex);

    const errors: string[] = [];
    if (!kawasaki.isValid) {
      errors.push(kawasaki.message);
      diagnostics.push({ vertexId: vertex.id, message: kawasaki.message, theorem: 'kawasaki' });
    }
    if (!maekawa.isValid) {
      errors.push(maekawa.message);
      diagnostics.push({ vertexId: vertex.id, message: maekawa.message, theorem: 'maekawa' });
    }
    if (!blb.isValid) {
      errors.push(blb.message);
      diagnostics.push({ vertexId: vertex.id, message: blb.message, theorem: 'big-little-big' });
    }

    const isVertexValid = errors.length === 0;
    if (isVertexValid) {
      validVertices++;
    } else {
      invalidVertices++;
      offendingVertexIds.push(vertex.id);
    }

    vertexReports[vertex.id] = {
      vertexId: vertex.id,
      isValid: isVertexValid,
      kawasaki,
      maekawa,
      bigLittleBig: blb,
      errors
    };
  }

  return {
    isValid: invalidVertices === 0,
    totalVertices: verticesList.length,
    validVertices,
    invalidVertices,
    offendingVertexIds,
    diagnostics,
    vertexReports
  };
}
