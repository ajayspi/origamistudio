import { describe, it, expect } from 'vitest';
import {
  validateKawasakiTheorem,
  validateMaekawaTheorem,
  validateBigLittleBig,
  validateCreasePattern,
  type CreaseVertex,
  type CreasePatternGraph,
  type ValidationResult,
  type PatternValidationSummary,
} from './origamiValidation';

describe('Origami Flat-Foldability Mathematical Validation Engine', () => {
  describe('Kawasaki Theorem Validation (validateKawasakiTheorem)', () => {
    it('validates a valid 4-sector degree-4 vertex (45°, 45°, 135°, 135°)', () => {
      const vertex: CreaseVertex = {
        id: 'v-valid-45',
        sectorAngles: [45, 45, 135, 135],
        isInterior: true
      };

      const result: ValidationResult = validateKawasakiTheorem(vertex);
      expect(result.isValid).toBe(true);
      expect(result.oddSum).toBeCloseTo(180, 4);
      expect(result.evenSum).toBeCloseTo(180, 4);
      expect(result.alternatingSum).toBeCloseTo(0, 4);
      expect(result.message).toContain('Kawasaki theorem satisfied');
    });

    it('rejects an invalid 4-sector vertex (30°, 60°, 120°, 150°)', () => {
      const vertex: CreaseVertex = {
        id: 'v-invalid-kawasaki',
        sectorAngles: [30, 60, 120, 150],
        isInterior: true
      };

      const result: ValidationResult = validateKawasakiTheorem(vertex);
      expect(result.isValid).toBe(false);
      expect(result.oddSum).toBeCloseTo(150, 4);
      expect(result.evenSum).toBeCloseTo(210, 4);
      expect(Math.abs(result.alternatingSum!)).toBeCloseTo(60, 4);
      expect(result.message).toMatch(/Kawasaki theorem violated/i);
    });

    it('validates degree-2n vertices specified in radians with [0, 2π) normalization', () => {
      const pi = Math.PI;
      const vertex: CreaseVertex = {
        id: 'v-rad-valid',
        sectorAngles: [pi / 4, pi / 4, (3 * pi) / 4, (3 * pi) / 4],
        isInterior: true
      };

      const result = validateKawasakiTheorem(vertex);
      expect(result.isValid).toBe(true);
      expect(result.oddSum).toBeCloseTo(pi, 4);
      expect(result.evenSum).toBeCloseTo(pi, 4);
      expect(result.alternatingSum).toBeCloseTo(0, 4);
    });

    it('rejects an interior vertex with odd degree (not 2n)', () => {
      const vertex: CreaseVertex = {
        id: 'v-odd-degree',
        sectorAngles: [120, 120, 120],
        isInterior: true
      };

      const result = validateKawasakiTheorem(vertex);
      expect(result.isValid).toBe(false);
      expect(result.message).toMatch(/degree-2n|even degree/i);
    });

    it('skips validation or treats non-interior boundary vertices as valid', () => {
      const vertex: CreaseVertex = {
        id: 'v-boundary',
        sectorAngles: [45, 90],
        isInterior: false
      };

      const result = validateKawasakiTheorem(vertex);
      expect(result.isValid).toBe(true);
      expect(result.message).toMatch(/boundary/i);
    });
  });

  describe('Maekawa-Justin Theorem Validation (validateMaekawaTheorem)', () => {
    it('validates a vertex with 3 Mountains and 1 Valley (|M - V| = 2)', () => {
      const vertex: CreaseVertex = {
        id: 'v-maekawa-valid-3m1v',
        assignments: ['M', 'M', 'M', 'V'],
        isInterior: true
      };

      const result: ValidationResult = validateMaekawaTheorem(vertex);
      expect(result.isValid).toBe(true);
      expect(result.mountains).toBe(3);
      expect(result.valleys).toBe(1);
      expect(result.parityDifference).toBe(2);
      expect(result.message).toContain('Maekawa theorem satisfied');
    });

    it('validates a vertex with 1 Mountain and 3 Valleys (|M - V| = 2)', () => {
      const vertex: CreaseVertex = {
        id: 'v-maekawa-valid-1m3v',
        assignments: ['M', 'V', 'V', 'V'],
        isInterior: true
      };

      const result: ValidationResult = validateMaekawaTheorem(vertex);
      expect(result.isValid).toBe(true);
      expect(result.mountains).toBe(1);
      expect(result.valleys).toBe(3);
      expect(result.parityDifference).toBe(2);
    });

    it('rejects an invalid vertex with 2 Mountains and 2 Valleys (|M - V| = 0)', () => {
      const vertex: CreaseVertex = {
        id: 'v-maekawa-invalid-2m2v',
        assignments: ['M', 'M', 'V', 'V'],
        isInterior: true
      };

      const result: ValidationResult = validateMaekawaTheorem(vertex);
      expect(result.isValid).toBe(false);
      expect(result.mountains).toBe(2);
      expect(result.valleys).toBe(2);
      expect(result.parityDifference).toBe(0);
      expect(result.message).toMatch(/Maekawa theorem violated/i);
    });

    it('supports incidentCreases format as well as assignments', () => {
      const vertex: CreaseVertex = {
        id: 'v-creases-format',
        incidentCreases: [
          { assignment: 'M' },
          { assignment: 'M' },
          { assignment: 'M' },
          { assignment: 'M' },
          { assignment: 'V' },
          { assignment: 'V' }
        ],
        isInterior: true
      };

      const result = validateMaekawaTheorem(vertex);
      expect(result.isValid).toBe(true);
      expect(result.mountains).toBe(4);
      expect(result.valleys).toBe(2);
      expect(result.parityDifference).toBe(2);
    });
  });

  describe('Big-Little-Big Theorem Validation (validateBigLittleBig)', () => {
    it('detects little angles strictly smaller than both adjacent neighbors in angles array', () => {
      // In [30, 90, 60, 180]:
      // 30 is flanked by 180 and 90 -> 30 < 180 and 30 < 90 (little angle at index 0)
      // 60 is flanked by 90 and 180 -> 60 < 90 and 60 < 180 (little angle at index 2)
      const angles = [30, 90, 60, 180];
      const result = validateBigLittleBig(angles);

      expect(result.littleAngleIndices).toEqual([0, 2]);
      expect(result.isValid).toBe(true);
    });

    it('validates when little angle has bounding folds of opposite parity (M and V)', () => {
      // Sector 0 is 30° (smaller than 180° and 90°).
      // Crease 0 is 'M', crease 1 is 'V' -> opposite parity!
      const angles = [30, 90, 60, 180];
      const assignments = ['M', 'V', 'M', 'V'] as const;

      const result = validateBigLittleBig(angles, assignments as any);
      expect(result.isValid).toBe(true);
      expect(result.violatingIndices).toEqual([]);
      expect(result.message).toContain('Big-Little-Big theorem satisfied');
    });

    it('flags a violation when little angle has bounding folds of identical parity (M and M)', () => {
      // Sector 0 is 30° (strictly smaller than neighbors).
      // Bounding folds are crease 0 ('M') and crease 1 ('M') -> SAME parity violation!
      const angles = [30, 90, 60, 180];
      const assignments = ['M', 'M', 'V', 'V'] as const;

      const result = validateBigLittleBig(angles, assignments as any);
      expect(result.isValid).toBe(false);
      expect(result.violatingIndices).toContain(0);
      expect(result.message).toMatch(/Big-Little-Big violation/i);
    });

    it('validates when passed as a CreaseVertex object', () => {
      const vertex: CreaseVertex = {
        id: 'v-blb-vertex',
        sectorAngles: [40, 100, 80, 140],
        assignments: ['V', 'M', 'V', 'M'],
        isInterior: true
      };

      const result = validateBigLittleBig(vertex);
      expect(result.isValid).toBe(true);
      expect(result.littleAngleIndices).toContain(0);
      expect(result.violatingIndices).toHaveLength(0);
    });
  });

  describe('Full Crease Pattern Graph Validation (validateCreasePattern)', () => {
    it('evaluates a valid crease pattern graph returning overall isValid: true', () => {
      const pattern: CreasePatternGraph = {
        vertices: [
          {
            id: 'v-center',
            sectorAngles: [90, 90, 90, 90],
            assignments: ['M', 'M', 'M', 'V'],
            isInterior: true
          },
          {
            id: 'v-corner-1',
            sectorAngles: [90],
            assignments: ['M'],
            isInterior: false
          }
        ]
      };

      const summary: PatternValidationSummary = validateCreasePattern(pattern);
      expect(summary.isValid).toBe(true);
      expect(summary.totalVertices).toBe(2);
      expect(summary.invalidVertices).toBe(0);
      expect(summary.offendingVertexIds).toEqual([]);
      expect(summary.diagnostics).toHaveLength(0);
    });

    it('evaluates an invalid pattern, returning offending vertex IDs and diagnostic messages', () => {
      const pattern: CreasePatternGraph = {
        vertices: [
          {
            id: 'v-good',
            sectorAngles: [45, 45, 135, 135],
            assignments: ['M', 'M', 'M', 'V'],
            isInterior: true
          },
          {
            id: 'v-bad-kawasaki-and-maekawa',
            sectorAngles: [30, 60, 120, 150],
            assignments: ['M', 'M', 'V', 'V'],
            isInterior: true
          }
        ]
      };

      const summary: PatternValidationSummary = validateCreasePattern(pattern);
      expect(summary.isValid).toBe(false);
      expect(summary.totalVertices).toBe(2);
      expect(summary.validVertices).toBe(1);
      expect(summary.invalidVertices).toBe(1);
      expect(summary.offendingVertexIds).toContain('v-bad-kawasaki-and-maekawa');
      expect(summary.diagnostics.length).toBeGreaterThan(0);
      expect(summary.diagnostics.some(d => d.vertexId === 'v-bad-kawasaki-and-maekawa')).toBe(true);
    });

    it('correctly handles graph representation with Record/Map-like vertices object', () => {
      const pattern: CreasePatternGraph = {
        vertices: {
          v1: {
            id: 'v1',
            sectorAngles: [90, 90, 90, 90],
            assignments: ['M', 'M', 'M', 'V'],
            isInterior: true
          }
        }
      };

      const summary = validateCreasePattern(pattern);
      expect(summary.isValid).toBe(true);
      expect(summary.validVertices).toBe(1);
    });
  });
});
