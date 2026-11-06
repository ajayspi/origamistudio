import { describe, it, expect } from 'vitest';
import { solveGlobalLayerOrder } from './origamiLayerSolver';
import { solveArbitraryReferencePoint, solveOrigamiReference, approximateRational } from './referenceFinder';
import { calculateStepPlanMetrics, calculateSpringDampedProgress } from './origamiKinematics';
import { synthesizeKitStepGeometry } from './origamiGeometry';
import { calculateGussetClearance } from './thickPanelGusset';
import { calculateDirectionalStiffness } from './paperGrain';

describe('Origami Computational Solvers Suite', () => {
  describe('Jason Ku MIT Layer-Order 2-SAT Solver', () => {
    it('solves global layer ordering for overlapping flaps without collisions', () => {
      const faces = [
        { id: 0, vertices: [[0, 0], [2, 0], [2, 2], [0, 2]] as [number, number][] },
        { id: 1, vertices: [[0.5, 0.5], [1.5, 0.5], [1.0, 1.8]] as [number, number][] },
        { id: 2, vertices: [[0.8, 0.8], [1.8, 0.8], [1.3, 1.9]] as [number, number][] }
      ];

      const hinges = [
        { faceA: 0, faceB: 1, assignment: 'V' as const, edge: [[0, 0], [2, 0]] as [[number, number], [number, number]] },
        { faceA: 1, faceB: 2, assignment: 'V' as const, edge: [[0.5, 0.5], [1.5, 0.5]] as [[number, number], [number, number]] }
      ];

      const result = solveGlobalLayerOrder(faces, hinges, 0.005);
      expect(result.isGloballyFoldable).toBe(true);
      expect(result.maxStackDepth).toBeGreaterThanOrEqual(1);
      expect(result.conflicts).toHaveLength(0);
      expect(result.elevationOffsets.get(0)).toBe(0);
      expect(result.elevationOffsets.get(1)).toBeGreaterThan(0);
    });
  });

  describe('Robert Lang Reference Finder (Huzita Axioms)', () => {
    it('approximates rational coordinates accurately', () => {
      const approx = approximateRational(0.333333, 16);
      expect(approx.p).toBe(1);
      expect(approx.q).toBe(3);
      expect(approx.error).toBeLessThan(0.001);
    });

    it('solves golden ratio landmark with sub-millimeter precision', () => {
      const sol = solveArbitraryReferencePoint({ x: 0.382, y: 0.618 });
      expect(sol.totalSteps).toBeGreaterThan(0);
      expect(sol.maxErrorMm).toBeLessThan(0.5);
      expect(sol.steps.length).toBe(sol.totalSteps);
    });

    it('solves preset origami reference points', () => {
      const sol = solveOrigamiReference('silver-ratio');
      expect(sol.totalSteps).toBeGreaterThan(0);
      expect(sol.steps[0]).toHaveProperty('axiomName');
    });
  });

  describe('Compliant Kinematics & Spring-Damper', () => {
    it('evaluates spring-damped progress continuously from 0 to 1', () => {
      expect(calculateSpringDampedProgress(0)).toBe(0);
      expect(calculateSpringDampedProgress(1)).toBe(1);
      const mid = calculateSpringDampedProgress(0.5);
      expect(mid).toBeGreaterThan(0);
      expect(mid).toBeLessThan(1);
    });

    it('computes valid step plan metrics', () => {
      const metrics = calculateStepPlanMetrics('japanese-01', 0, 7, 0.5);
      expect(metrics).toHaveProperty('stepIndex', 0);
      expect(metrics).toHaveProperty('foldCategory');
      expect(metrics).toHaveProperty('creaseLine');
      expect(metrics.foldAngleTarget).toBeGreaterThan(0);
      expect(metrics.foldAngleCurrent).toBe(metrics.foldAngleTarget * 0.5);
    });
  });

  describe('3D Procedural Origami Geometry Synthesis', () => {
    it('synthesizes valid buffer geometry for master sculpture step', () => {
      const geo = synthesizeKitStepGeometry('japanese-01', 0, 7, 0.5);
      expect(geo).toBeDefined();
      expect(geo.getAttribute('position')).toBeDefined();
      expect(geo.getAttribute('normal')).toBeDefined();
      expect(geo.getAttribute('position').count).toBeGreaterThan(0);
    });
  });

  describe('Thick-Panel Gusset Clearance Engine', () => {
    it('evaluates zero clearance at 0 rad and positive clearance at pi rad', () => {
      const atZero = calculateGussetClearance(0, 0.1);
      expect(atZero.clearanceWidthMm).toBe(0);
      expect(atZero.offsetMm).toBe(0);

      const atPi = calculateGussetClearance(Math.PI, 0.1);
      expect(atPi.clearanceWidthMm).toBeGreaterThan(0);
      expect(atPi.offsetMm).toBe(atPi.clearanceWidthMm * 0.5);
    });

    it('remains finite and monotonically increasing with fold angle', () => {
      const deg30 = calculateGussetClearance((30 * Math.PI) / 180, 0.1);
      const deg90 = calculateGussetClearance((90 * Math.PI) / 180, 0.1);
      const deg180 = calculateGussetClearance(Math.PI, 0.1);

      expect(deg30.clearanceWidthMm).toBeLessThan(deg90.clearanceWidthMm);
      expect(deg90.clearanceWidthMm).toBeLessThan(deg180.clearanceWidthMm);
      expect(Number.isFinite(deg30.clearanceWidthMm)).toBe(true);
    });
  });

  describe('Paper Grain Anisotropy Engine', () => {
    it('calculates higher stiffness along machine grain than cross-grain', () => {
      // Parallel to grain [0, 1]
      const parallel = calculateDirectionalStiffness([0, 1]);
      // Perpendicular to grain [1, 0]
      const perp = calculateDirectionalStiffness([1, 0]);

      expect(parallel.stiffness).toBeGreaterThan(perp.stiffness);
      expect(parallel.isCrossGrain).toBe(false);
      expect(perp.isCrossGrain).toBe(true);
      expect(parallel.alignmentAngleDeg).toBeCloseTo(0, 1);
      expect(perp.alignmentAngleDeg).toBeCloseTo(90, 1);
    });
  });

  describe('Origami Figure 2D Isometric Projection Engine', () => {
    it('projects completed kit 3D geometry into non-empty 2D shaded facets', async () => {
      const { getKitFigureFacets } = await import('../components/OrigamiFigure');
      const facets = getKitFigureFacets('japanese-01', 7, 110);
      expect(facets.length).toBeGreaterThan(0);
      expect(facets[0].points).toMatch(/^[\d.-]+,[\d.-]+\s+[\d.-]+,[\d.-]+\s+[\d.-]+,[\d.-]+$/);
      expect(facets[0].shade).toBeGreaterThanOrEqual(0.15);
      expect(facets[0].shade).toBeLessThanOrEqual(1.0);
    });

    it('generates flat crease pattern blueprint with mountain and valley creases', async () => {
      const { getKitCreaseSheet } = await import('../components/OrigamiFigure');
      const { getKitById } = await import('../data/kits');
      const kit = getKitById('japanese-01')!;
      const sheet = getKitCreaseSheet(kit, 110);
      expect(sheet).toBeDefined();
      expect(sheet.allCreases.length).toBeGreaterThan(0);
      expect(sheet.allCreases[0]).toHaveProperty('isMountain');
    });
  });
});
