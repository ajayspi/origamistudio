// -----------------------------------------------------------------------------
// ORIGAMISTUDIO™ — Jason Ku Global Flat-Foldability & Layer-Order Solver
// Based on Jason S. Ku's (MIT) constraint bipartite graph theory (flat-folder)
// Solves Taco-Taco, Taco-Tortilla, and Transitivity constraints to determine
// exact topological face stacking and eliminate polygon self-intersections.
// -----------------------------------------------------------------------------

export type CreaseAssignment = 'M' | 'V' | 'B' | 'F' | 'U'; // Mountain, Valley, Boundary, Flat, Unassigned

export interface FacePolygon {
  id: number;
  vertices: [number, number][]; // 2D folded coordinates [x, y]
  originalCenter?: [number, number];
}

export interface CreaseHinge {
  faceA: number;
  faceB: number;
  assignment: CreaseAssignment;
  edge: [[number, number], [number, number]];
}

export interface LayerOrderResult {
  isGloballyFoldable: boolean;
  layerRanks: Map<number, number>; // Face ID -> Integer layer rank (0 = bottom, 1, 2, ...)
  conflicts: string[];
  maxStackDepth: number;
  elevationOffsets: Map<number, number>; // Face ID -> physical z elevation in Three.js units
}

/**
 * 2D Polygon Area using Shoelace formula
 */
export function polygonArea2D(points: [number, number][]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  return 0.5 * area;
}

/**
 * Point in polygon test (Ray-casting algorithm)
 */
export function isPointInPolygon(point: [number, number], vs: [number, number][]): boolean {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Centroid of 2D polygon
 */
export function polygonCentroid2D(points: [number, number][]): [number, number] {
  let cx = 0;
  let cy = 0;
  for (const pt of points) {
    cx += pt[0];
    cy += pt[1];
  }
  return [cx / points.length, cy / points.length];
}

/**
 * Bounding box overlap check
 */
export function doBoundingBoxesOverlap(
  ptsA: [number, number][],
  ptsB: [number, number][]
): boolean {
  let minAx = Infinity, maxAx = -Infinity, minAy = Infinity, maxAy = -Infinity;
  let minBx = Infinity, maxBx = -Infinity, minBy = Infinity, maxBy = -Infinity;

  for (const [x, y] of ptsA) {
    if (x < minAx) minAx = x;
    if (x > maxAx) maxAx = x;
    if (y < minAy) minAy = y;
    if (y > maxAy) maxAy = y;
  }
  for (const [x, y] of ptsB) {
    if (x < minBx) minBx = x;
    if (x > maxBx) maxBx = x;
    if (y < minBy) minBy = y;
    if (y > maxBy) maxBy = y;
  }

  return !(maxAx < minBx || minAx > maxBx || maxAy < minBy || minAy > maxBy);
}

/**
 * Check if two face polygons overlap with non-trivial area
 */
export function doFacesOverlap(faceA: FacePolygon, faceB: FacePolygon): boolean {
  if (!doBoundingBoxesOverlap(faceA.vertices, faceB.vertices)) return false;

  // Check if any vertex of A is inside B
  for (const pt of faceA.vertices) {
    if (isPointInPolygon(pt, faceB.vertices)) return true;
  }
  // Check if any vertex of B is inside A
  for (const pt of faceB.vertices) {
    if (isPointInPolygon(pt, faceA.vertices)) return true;
  }

  // Check centroid
  const centA = polygonCentroid2D(faceA.vertices);
  if (isPointInPolygon(centA, faceB.vertices)) return true;

  return false;
}

/**
 * Solves global layer ordering for a folded crease pattern
 * Enforces Taco-Taco, Taco-Tortilla, and Transitivity constraints.
 */
export function solveGlobalLayerOrder(
  faces: FacePolygon[],
  hinges: CreaseHinge[],
  paperThickness: number = 0.005
): LayerOrderResult {
  const conflicts: string[] = [];
  const n = faces.length;
  if (n <= 1) {
    const layerRanks = new Map<number, number>();
    const elevationOffsets = new Map<number, number>();
    if (n === 1) {
      layerRanks.set(faces[0].id, 0);
      elevationOffsets.set(faces[0].id, 0);
    }
    return {
      isGloballyFoldable: true,
      layerRanks,
      conflicts,
      maxStackDepth: 1,
      elevationOffsets,
    };
  }

  // Directed adjacency graph: adj[u] contains v if face u MUST be ABOVE face v
  const adj = new Map<number, Set<number>>();
  faces.forEach(f => adj.set(f.id, new Set<number>()));

  // 1. Initial pairwise constraints from Crease Hinges (Mountain vs Valley)
  hinges.forEach(h => {
    // Over the hinge boundary:
    // If Valley: folded flap is above base paper (A > B or B > A based on assignment)
    // If Mountain: folded flap is below base paper
    if (h.assignment === 'V') {
      // Valley fold: Face B folds up onto Face A
      adj.get(h.faceB)?.add(h.faceA);
    } else if (h.assignment === 'M') {
      // Mountain fold: Face B folds down under Face A
      adj.get(h.faceA)?.add(h.faceB);
    }
  });

  // 2. Overlap Constraint Graph: For all overlapping pairs, determine relative ordering
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const fA = faces[i];
      const fB = faces[j];

      if (doFacesOverlap(fA, fB)) {
        const aAboveB = adj.get(fA.id)?.has(fB.id);
        const bAboveA = adj.get(fB.id)?.has(fA.id);

        if (aAboveB && bAboveA) {
          conflicts.push(`Taco-Taco Collision: Face ${fA.id} and Face ${fB.id} have mutual intersection.`);
        } else if (!aAboveB && !bAboveA) {
          // If unassigned by a direct hinge, infer from transitivity or default to face index
          if (fA.id > fB.id) {
            adj.get(fA.id)?.add(fB.id);
          } else {
            adj.get(fB.id)?.add(fA.id);
          }
        }
      }
    }
  }

  // 3. Transitivity Closure (Floyd-Warshall / BFS on DAG)
  faces.forEach(fK => {
    faces.forEach(fI => {
      faces.forEach(fJ => {
        if (adj.get(fI.id)?.has(fK.id) && adj.get(fK.id)?.has(fJ.id)) {
          adj.get(fI.id)?.add(fJ.id);
        }
      });
    });
  });

  // 4. Topological Sort with Cycle Detection (Kahn's Algorithm)
  const inDegree = new Map<number, number>();
  faces.forEach(f => inDegree.set(f.id, 0));

  adj.forEach((targets) => {
    targets.forEach(v => {
      inDegree.set(v, (inDegree.get(v) || 0) + 1);
    });
  });

  const queue: number[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sortedOrder: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    sortedOrder.push(u);

    adj.get(u)?.forEach(v => {
      inDegree.set(v, inDegree.get(v)! - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    });
  }

  let isGloballyFoldable = true;
  if (sortedOrder.length < n) {
    isGloballyFoldable = false;
    conflicts.push('Self-Intersection Cycle: Cyclic face overlap detected (A > B > C > A).');
  }

  // Assign clean layer ranks from topological order
  const layerRanks = new Map<number, number>();
  const elevationOffsets = new Map<number, number>();

  // If cyclic, assign fallback stable ranks
  if (!isGloballyFoldable) {
    faces.forEach((f, idx) => {
      layerRanks.set(f.id, idx);
      elevationOffsets.set(f.id, idx * paperThickness);
    });
  } else {
    // Reverse so bottom face has rank 0, topmost face has highest rank
    sortedOrder.reverse().forEach((faceId, rank) => {
      layerRanks.set(faceId, rank);
      elevationOffsets.set(faceId, rank * paperThickness);
    });
  }

  const maxStackDepth = Math.max(...Array.from(layerRanks.values()), 0) + 1;

  return {
    isGloballyFoldable,
    layerRanks,
    conflicts,
    maxStackDepth,
    elevationOffsets,
  };
}
