import { describe, it, expect } from 'vitest';
import {
  type PosetFace,
  type PosetCrease,
  buildOverlapPoset,
  computeLayerElevation,
  generatePosetDropShadows,
  hasCyclicOverlap
} from './overlapPoset';

describe('Senbazuru Overlap Poset & Layer-Stacking Engine', () => {
  it('constructs a directed acyclic overlap poset for overlapping flaps', () => {
    // Face 0: Base paper [0,0] to [2,2]
    // Face 1: Flap folded over Face 0 via Valley crease
    // Face 2: Second flap folded over Face 1 via Valley crease
    const faces: PosetFace[] = [
      { id: 0, polygon: [[0, 0], [2, 0], [2, 2], [0, 2]] },
      { id: 1, polygon: [[0, 0], [1, 0], [1, 2], [0, 2]] },
      { id: 2, polygon: [[0, 0], [0.5, 0], [0.5, 2], [0, 2]] }
    ];

    const creases: PosetCrease[] = [
      { faceA: 0, faceB: 1, assignment: 'V' }, // Face 1 folds over Face 0
      { faceA: 1, faceB: 2, assignment: 'V' }  // Face 2 folds over Face 1
    ];

    const poset = buildOverlapPoset(faces, creases);

    expect(poset.isAcyclic).toBe(true);
    expect(poset.layerRanks.get(0)).toBe(0); // Base paper at bottom
    expect(poset.layerRanks.get(1)).toBe(1); // Middle flap
    expect(poset.layerRanks.get(2)).toBe(2); // Top flap
    expect(poset.maxDepth).toBe(3);
  });

  it('computes micro-elevation offsets to eliminate 3D Z-fighting', () => {
    const faces: PosetFace[] = [
      { id: 0, polygon: [[0, 0], [1, 0], [1, 1], [0, 1]] },
      { id: 1, polygon: [[0, 0], [1, 0], [1, 1], [0, 1]] }
    ];
    const creases: PosetCrease[] = [
      { faceA: 0, faceB: 1, assignment: 'V' }
    ];

    const paperThickness = 0.004; // 400 microns in Three.js scale
    const poset = buildOverlapPoset(faces, creases);
    const elevations = computeLayerElevation(poset, paperThickness);

    expect(elevations.get(0)).toBeCloseTo(0.0, 5);
    expect(elevations.get(1)).toBeCloseTo(0.004, 5);
  });

  it('detects cyclic topological conflicts (impossible self-intersections)', () => {
    // Cyclic triangle of overlaps: 0 above 1, 1 above 2, 2 above 0
    const cyclicAdjacency = new Map<number, Set<number>>([
      [0, new Set([1])],
      [1, new Set([2])],
      [2, new Set([0])]
    ]);

    expect(hasCyclicOverlap(cyclicAdjacency)).toBe(true);
  });

  it('generates authentic publication-grade SVG drop shadows for elevated flaps', () => {
    const faces: PosetFace[] = [
      { id: 0, polygon: [[0, 0], [4, 0], [4, 4], [0, 4]] },
      { id: 1, polygon: [[1, 1], [3, 1], [3, 3], [1, 3]] }
    ];
    const creases: PosetCrease[] = [
      { faceA: 0, faceB: 1, assignment: 'V' }
    ];

    const poset = buildOverlapPoset(faces, creases);
    const shadows = generatePosetDropShadows(poset, faces, {
      lightAngleRad: Math.PI / 4, // 45° standard technical diagram lighting
      shadowSpread: 0.08,
      baseOpacity: 0.25
    });

    // Elevated face 1 must cast a shadow onto face 0
    expect(shadows.length).toBeGreaterThan(0);
    const shadowForFlap = shadows.find(s => s.sourceFaceId === 1);
    expect(shadowForFlap).toBeDefined();
    expect(shadowForFlap!.shadowPolygon.length).toBe(4);
    expect(shadowForFlap!.opacity).toBeGreaterThan(0);
  });
});
