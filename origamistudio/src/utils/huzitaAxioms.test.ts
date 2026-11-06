import { describe, it, expect } from 'vitest';
import {
  type Point2D,
  makeLine,
  intersectLines,
  reflectPointAcrossLine,
  distancePointToLine,
  solveAxiom1,
  solveAxiom2,
  solveAxiom3,
  solveAxiom4,
  solveAxiom5,
  solveAxiom6,
  solveAxiom7
} from './huzitaAxioms';

describe('Huzita-Hatori Origami Axioms Engine (Axioms 1 - 7)', () => {
  const EPSILON = 1e-4;

  describe('Core Geometry Utilities', () => {
    it('creates normalized line equations ax + by + c = 0', () => {
      const line = makeLine([0, 0], [1, 1]);
      // Line through (0,0) and (1,1) is x - y = 0
      expect(Math.hypot(line.a, line.b)).toBeCloseTo(1.0, 4);
      expect(distancePointToLine([2, 2], line)).toBeCloseTo(0.0, 4);
      expect(distancePointToLine([0, 1], line)).toBeGreaterThan(0.5);
    });

    it('computes line-line intersections correctly', () => {
      const horizontal = makeLine([0, 0.5], [1, 0.5]);
      const vertical = makeLine([0.5, 0], [0.5, 1]);
      const pt = intersectLines(horizontal, vertical);
      expect(pt).not.toBeNull();
      expect(pt![0]).toBeCloseTo(0.5, 4);
      expect(pt![1]).toBeCloseTo(0.5, 4);
    });

    it('reflects a point across a crease line accurately', () => {
      const spine = makeLine([0.5, 0], [0.5, 1]); // vertical line x = 0.5
      const reflected = reflectPointAcrossLine([0.2, 0.3], spine);
      expect(reflected[0]).toBeCloseTo(0.8, 4);
      expect(reflected[1]).toBeCloseTo(0.3, 4);
    });
  });

  describe('Axiom 1 (Line through 2 points)', () => {
    it('constructs the crease connecting two points', () => {
      const p1: Point2D = [0, 0];
      const p2: Point2D = [1, 1];
      const line = solveAxiom1(p1, p2);
      expect(line).not.toBeNull();
      expect(distancePointToLine(p1, line!)).toBeCloseTo(0.0, 4);
      expect(distancePointToLine(p2, line!)).toBeCloseTo(0.0, 4);
    });
  });

  describe('Axiom 2 (Fold P1 onto P2 - Perpendicular Bisector)', () => {
    it('constructs perpendicular bisector folding P1 onto P2', () => {
      const p1: Point2D = [0, 0];
      const p2: Point2D = [1, 0];
      const bisector = solveAxiom2(p1, p2);
      expect(bisector).not.toBeNull();
      // Reflected P1 across bisector must equal P2
      const p1Reflected = reflectPointAcrossLine(p1, bisector!);
      expect(p1Reflected[0]).toBeCloseTo(p2[0], 4);
      expect(p1Reflected[1]).toBeCloseTo(p2[1], 4);
    });
  });

  describe('Axiom 3 (Fold Line L1 onto Line L2 - Angle Bisector)', () => {
    it('finds angle bisector lines folding L1 onto L2', () => {
      const l1 = makeLine([0, 0], [1, 0]); // y = 0
      const l2 = makeLine([0, 0], [0, 1]); // x = 0
      const bisectors = solveAxiom3(l1, l2);
      expect(bisectors.length).toBeGreaterThanOrEqual(1);

      // Point (1, 0) on L1 reflected across diagonal bisector should land on L2
      const diag = bisectors.find(b => Math.abs(Math.abs(b.a) - Math.abs(b.b)) < EPSILON);
      expect(diag).toBeDefined();
      const pReflected = reflectPointAcrossLine([1, 0], diag!);
      expect(distancePointToLine(pReflected, l2)).toBeCloseTo(0.0, 4);
    });
  });

  describe('Axiom 4 (Perpendicular to L through P)', () => {
    it('constructs a crease perpendicular to line L passing through point P', () => {
      const line = makeLine([0, 0], [1, 0]); // y = 0
      const pt: Point2D = [0.3, 0.7];
      const perp = solveAxiom4(pt, line);
      expect(perp).not.toBeNull();
      expect(distancePointToLine(pt, perp!)).toBeCloseTo(0.0, 4);
      // Dot product of normal vectors must be zero
      expect(line.a * perp!.a + line.b * perp!.b).toBeCloseTo(0.0, 4);
    });
  });

  describe('Axiom 5 (Fold P1 onto Line L passing through P2)', () => {
    it('constructs creases through P2 that place P1 onto line L', () => {
      const p1: Point2D = [0, 0];
      const p2: Point2D = [1, 1];
      const lineL = makeLine([0, 0.5], [1, 0.5]); // y = 0.5

      const solutions = solveAxiom5(p1, p2, lineL);
      expect(solutions.length).toBeGreaterThan(0);

      for (const crease of solutions) {
        expect(distancePointToLine(p2, crease)).toBeCloseTo(0.0, 4);
        const p1Reflected = reflectPointAcrossLine(p1, crease);
        expect(distancePointToLine(p1Reflected, lineL)).toBeCloseTo(0.0, 4);
      }
    });
  });

  describe('Axiom 6 (Beloch Fold: P1 onto L1 and P2 onto L2 simultaneously)', () => {
    it('solves cubic simultaneous reflections of 2 points onto 2 lines', () => {
      const p1: Point2D = [0.2, 0.8];
      const p2: Point2D = [0.7, 0.9];
      const l1 = makeLine([0, 0], [1, 0]); // y = 0
      const l2 = makeLine([0, 0], [0, 1]); // x = 0

      const solutions = solveAxiom6(p1, p2, l1, l2);
      expect(solutions.length).toBeGreaterThan(0);

      const validCrease = solutions[0];
      const p1Ref = reflectPointAcrossLine(p1, validCrease);
      const p2Ref = reflectPointAcrossLine(p2, validCrease);

      expect(distancePointToLine(p1Ref, l1)).toBeCloseTo(0.0, 3);
      expect(distancePointToLine(p2Ref, l2)).toBeCloseTo(0.0, 3);
    });
  });

  describe('Axiom 7 (Fold P onto Line L1 perpendicular to Line L2)', () => {
    it('constructs crease perpendicular to L2 placing P onto L1', () => {
      const p: Point2D = [0.2, 0.6];
      const l1 = makeLine([0, 0.4], [1, 0.4]); // y = 0.4
      const l2 = makeLine([0, 0], [0, 1]);     // x = 0 (vertical)

      const solutions = solveAxiom7(p, l1, l2);
      expect(solutions.length).toBeGreaterThan(0);

      const crease = solutions[0];
      // Must be perpendicular to l2 -> dot product of normals == 0
      expect(crease.a * l2.a + crease.b * l2.b).toBeCloseTo(0.0, 4);
      // P reflected across crease must land on l1
      const pRef = reflectPointAcrossLine(p, crease);
      expect(distancePointToLine(pRef, l1)).toBeCloseTo(0.0, 4);
    });
  });
});
