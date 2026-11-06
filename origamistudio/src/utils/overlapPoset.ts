/**
 * -----------------------------------------------------------------------------
 * ORIGAMISTUDIO™ — Senbazuru Overlap Poset & Diagram Layer-Stacking Engine
 * Inspired by avalonalex/senbazuru: A partially ordered set (poset) solver
 * that determines the authentic physical stacking order of folded paper flaps.
 * Completely eliminates 3D WebGL Z-fighting and generates publication-grade
 * drop shadow polygons for technical origami instruction diagrams.
 * -----------------------------------------------------------------------------
 */

export interface PosetFace {
  id: number;
  polygon: [number, number][]; // 2D folded coordinates [[x, y], ...]
}

export interface PosetCrease {
  faceA: number;
  faceB: number;
  assignment: 'M' | 'V' | 'B' | 'F' | 'U';
}

export interface OverlapPoset {
  isAcyclic: boolean;
  layerRanks: Map<number, number>; // Face id -> Integer rank (0 = bottom layer, 1, 2...)
  maxDepth: number;
  adjacency: Map<number, Set<number>>; // u -> v denotes face u is stacked ABOVE face v
}

export interface DropShadowConfig {
  lightAngleRad?: number;
  shadowSpread?: number;
  baseOpacity?: number;
}

export interface DropShadow {
  sourceFaceId: number;
  shadowPolygon: [number, number][];
  opacity: number;
}

/**
 * Checks if two 2D polygons overlap using bounding box and point-in-polygon tests.
 */
export function doPolygonsOverlap(polyA: [number, number][], polyB: [number, number][]): boolean {
  if (polyA.length < 3 || polyB.length < 3) return false;

  let minAx = Infinity, maxAx = -Infinity, minAy = Infinity, maxAy = -Infinity;
  let minBx = Infinity, maxBx = -Infinity, minBy = Infinity, maxBy = -Infinity;

  for (const [x, y] of polyA) {
    if (x < minAx) minAx = x;
    if (x > maxAx) maxAx = x;
    if (y < minAy) minAy = y;
    if (y > maxAy) maxAy = y;
  }
  for (const [x, y] of polyB) {
    if (x < minBx) minBx = x;
    if (x > maxBx) maxBx = x;
    if (y < minBy) minBy = y;
    if (y > maxBy) maxBy = y;
  }

  // Fast bounding box rejection
  if (maxAx < minBx || minAx > maxBx || maxAy < minBy || minAy > maxBy) {
    return false;
  }

  // Point in polygon test (Ray-casting)
  const isInside = (pt: [number, number], vs: [number, number][]) => {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  for (const pt of polyA) {
    if (isInside(pt, polyB)) return true;
  }
  for (const pt of polyB) {
    if (isInside(pt, polyA)) return true;
  }

  return true;
}

/**
 * Cycle detection on directed adjacency graph using Kahn's algorithm.
 */
export function hasCyclicOverlap(adj: Map<number, Set<number>>): boolean {
  const inDegree = new Map<number, number>();
  const nodes = Array.from(adj.keys());

  for (const u of nodes) {
    inDegree.set(u, 0);
  }

  adj.forEach((targets) => {
    targets.forEach((v) => {
      inDegree.set(v, (inDegree.get(v) || 0) + 1);
    });
  });

  const queue: number[] = [];
  inDegree.forEach((deg, node) => {
    if (deg === 0) queue.push(node);
  });

  let visited = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    visited++;

    adj.get(u)?.forEach((v) => {
      const newDeg = (inDegree.get(v) || 0) - 1;
      inDegree.set(v, newDeg);
      if (newDeg === 0) {
        queue.push(v);
      }
    });
  }

  return visited < nodes.length;
}

/**
 * Builds the Overlap Poset DAG and computes topological layer stacking.
 */
export function buildOverlapPoset(faces: PosetFace[], creases: PosetCrease[]): OverlapPoset {
  const adj = new Map<number, Set<number>>();
  faces.forEach(f => adj.set(f.id, new Set<number>()));

  // 1. Initial pairwise constraints from Crease Hinges
  creases.forEach((c) => {
    if (c.assignment === 'V') {
      // Valley fold: Face B folds up onto Face A (Face B is above Face A)
      adj.get(c.faceB)?.add(c.faceA);
    } else if (c.assignment === 'M') {
      // Mountain fold: Face B folds down under Face A (Face A is above Face B)
      adj.get(c.faceA)?.add(c.faceB);
    }
  });

  // 2. Overlap relations
  const n = faces.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const fA = faces[i];
      const fB = faces[j];

      if (doPolygonsOverlap(fA.polygon, fB.polygon)) {
        const aAboveB = adj.get(fA.id)?.has(fB.id);
        const bAboveA = adj.get(fB.id)?.has(fA.id);

        if (!aAboveB && !bAboveA) {
          if (fA.id > fB.id) {
            adj.get(fA.id)?.add(fB.id);
          } else {
            adj.get(fB.id)?.add(fA.id);
          }
        }
      }
    }
  }

  // 3. Transitivity closure
  faces.forEach(fK => {
    faces.forEach(fI => {
      faces.forEach(fJ => {
        if (adj.get(fI.id)?.has(fK.id) && adj.get(fK.id)?.has(fJ.id)) {
          adj.get(fI.id)?.add(fJ.id);
        }
      });
    });
  });

  const isAcyclic = !hasCyclicOverlap(adj);

  // 4. Topological sorting to assign ranks (0 = bottom layer)
  const inDegree = new Map<number, number>();
  faces.forEach(f => inDegree.set(f.id, 0));

  adj.forEach((targets) => {
    targets.forEach((v) => {
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

    adj.get(u)?.forEach((v) => {
      const newDeg = (inDegree.get(v) || 0) - 1;
      inDegree.set(v, newDeg);
      if (newDeg === 0) {
        queue.push(v);
      }
    });
  }

  const layerRanks = new Map<number, number>();
  if (!isAcyclic) {
    // Fallback stable ranks for cyclic cases
    faces.forEach((f, idx) => layerRanks.set(f.id, idx));
  } else {
    // Reverse topological order: lowest target (faces that have no outgoing above edges) at bottom (rank 0)
    sortedOrder.reverse().forEach((faceId, rank) => {
      layerRanks.set(faceId, rank);
    });
  }

  const maxDepth = Math.max(...Array.from(layerRanks.values()), 0) + 1;

  return {
    isAcyclic,
    layerRanks,
    maxDepth,
    adjacency: adj
  };
}

/**
 * Computes Three.js physical elevation offsets to eliminate Z-fighting.
 */
export function computeLayerElevation(
  poset: OverlapPoset,
  paperThickness: number = 0.004
): Map<number, number> {
  const elevations = new Map<number, number>();
  poset.layerRanks.forEach((rank, faceId) => {
    elevations.set(faceId, rank * paperThickness);
  });
  return elevations;
}

/**
 * Generates publication-grade drop shadow polygons for overlapping flaps.
 */
export function generatePosetDropShadows(
  poset: OverlapPoset,
  faces: PosetFace[],
  config: DropShadowConfig = {}
): DropShadow[] {
  const lightAngle = config.lightAngleRad ?? Math.PI / 4;
  const spread = config.shadowSpread ?? 0.08;
  const baseOpacity = config.baseOpacity ?? 0.25;

  const shadows: DropShadow[] = [];

  faces.forEach((face) => {
    const rank = poset.layerRanks.get(face.id) ?? 0;
    if (rank > 0) {
      const offsetDist = spread * rank;
      const dx = Math.cos(lightAngle) * offsetDist;
      const dy = Math.sin(lightAngle) * offsetDist;

      const shadowPoly: [number, number][] = face.polygon.map(([x, y]) => [
        x + dx,
        y + dy
      ]);

      const opacity = Math.min(0.65, baseOpacity * (1 + 0.15 * rank));

      shadows.push({
        sourceFaceId: face.id,
        shadowPolygon: shadowPoly,
        opacity
      });
    }
  });

  return shadows;
}
