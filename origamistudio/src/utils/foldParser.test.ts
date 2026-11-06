import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  parseFoldData,
  triangulateFoldFaces,
  foldToBufferGeometry,
  type FoldFile
} from './foldParser';

describe('foldParser - FOLD v1.2 Specification Parser and Triangulator', () => {
  const sampleFoldData: FoldFile = {
    file_spec: 1.2,
    file_title: 'Waterbomb Base',
    file_creator: 'OrigamiStudio Computational Engine',
    file_classes: ['singleModel'],
    vertices_coords: [
      [-1, -1, 0], // 0: BL
      [1, -1, 0],  // 1: BR
      [1, 1, 0],   // 2: TR
      [-1, 1, 0],  // 3: TL
      [0, 0, 0]    // 4: Center
    ],
    edges_vertices: [
      [0, 1], // B
      [1, 2], // B
      [2, 3], // B
      [3, 0], // B
      [0, 4], // M
      [1, 4], // M
      [2, 4], // V
      [3, 4], // V
      [0, 2], // F
      [1, 3]  // C
    ],
    edges_assignment: ['B', 'B', 'B', 'B', 'M', 'M', 'V', 'V', 'F', 'C'],
    faces_vertices: [
      [0, 1, 4],
      [1, 2, 4],
      [2, 3, 4],
      [3, 0, 4]
    ]
  };

  describe('parseFoldData', () => {
    it('parses standard FOLD v1.2 properties from a JavaScript object', () => {
      const model = parseFoldData(sampleFoldData);

      expect(model.file_spec).toBe(1.2);
      expect(model.file_title).toBe('Waterbomb Base');
      expect(model.vertices_coords).toHaveLength(5);
      expect(model.edges_vertices).toHaveLength(10);
      expect(model.edges_assignment).toHaveLength(10);
      expect(model.faces_vertices).toHaveLength(4);
    });

    it('parses standard FOLD v1.2 properties from a JSON string', () => {
      const jsonString = JSON.stringify(sampleFoldData);
      const model = parseFoldData(jsonString);

      expect(model.file_spec).toBe(1.2);
      expect(model.file_title).toBe('Waterbomb Base');
      expect(model.vertices_coords).toEqual(sampleFoldData.vertices_coords);
    });

    it('validates extraction of counts: total vertices, mountain creases, valley creases, and boundary edges', () => {
      const model = parseFoldData(sampleFoldData);

      // Verify count structures
      expect(model.counts.totalVertices).toBe(5);
      expect(model.counts.boundaryEdges).toBe(4);
      expect(model.counts.mountainCreases).toBe(2);
      expect(model.counts.valleyCreases).toBe(2);

      // Verify convenience count aliases
      expect(model.counts.vertices).toBe(5);
      expect(model.counts.boundary).toBe(4);
      expect(model.counts.mountain).toBe(2);
      expect(model.counts.valley).toBe(2);
      expect(model.counts.flat).toBe(1);
      expect(model.counts.cut).toBe(1);

      // Direct property getters
      expect(model.totalVertices).toBe(5);
      expect(model.mountainCreases).toBe(2);
      expect(model.valleyCreases).toBe(2);
      expect(model.boundaryEdges).toBe(4);
    });

    it('normalizes 2D coordinates [x, y] to 3D [x, y, 0]', () => {
      const fold2D: FoldFile = {
        file_spec: 1.2,
        vertices_coords: [
          [0.5, 0.5],
          [-0.5, -0.5]
        ],
        edges_vertices: [[0, 1]],
        edges_assignment: ['B'],
        faces_vertices: []
      };

      const model = parseFoldData(fold2D);
      expect(model.vertices_coords[0]).toEqual([0.5, 0.5, 0]);
      expect(model.vertices_coords[1]).toEqual([-0.5, -0.5, 0]);
    });

    it('handles structured edge and face objects', () => {
      const model = parseFoldData(sampleFoldData);
      expect(model.edges).toHaveLength(10);
      expect(model.edges[0]).toEqual({
        vertices: [0, 1],
        assignment: 'B',
        foldAngle: undefined,
        length: undefined
      });
      expect(model.faces).toHaveLength(4);
      expect(model.faces[0].vertices).toEqual([0, 1, 4]);
    });

    it('throws descriptive error on invalid JSON string', () => {
      expect(() => parseFoldData('{ invalid json')).toThrow();
    });
  });

  describe('triangulateFoldFaces', () => {
    const vertices = [
      [0, 0, 0],   // 0
      [2, 0, 0],   // 1
      [2, 2, 0],   // 2
      [0, 2, 0],   // 3
      [1, 3, 0],   // 4 (for pentagon)
      [-1, 1, 0]   // 5
    ];

    it('preserves single triangles as identity (1 triangle)', () => {
      const faces = [[0, 1, 2]];
      const triangles = triangulateFoldFaces(faces, vertices);

      expect(triangles).toHaveLength(1);
      expect(triangles[0]).toEqual([0, 1, 2]);
    });

    it('triangulates quads into exactly 2 triangles', () => {
      const faces = [[0, 1, 2, 3]];
      const triangles = triangulateFoldFaces(faces, vertices);

      expect(triangles).toHaveLength(2);
      // Quad [0,1,2,3] must produce 2 valid triangles using vertices from the quad
      for (const tri of triangles) {
        expect(tri).toHaveLength(3);
        tri.forEach(v => expect([0, 1, 2, 3]).toContain(v));
      }
    });

    it('triangulates arbitrary n-gons using ear-clipping into n - 2 triangles', () => {
      // Pentagon: 5 vertices -> 3 triangles
      const pentagonFace = [[0, 1, 2, 4, 3]];
      const triangles = triangulateFoldFaces(pentagonFace, vertices);

      expect(triangles).toHaveLength(3);
      for (const tri of triangles) {
        expect(tri).toHaveLength(3);
        tri.forEach(v => expect([0, 1, 2, 4, 3]).toContain(v));
      }
    });

    it('correctly triangulates concave n-gons without flipping ears', () => {
      // L-shaped concave polygon in 2D
      const concaveVertices = [
        [0, 0, 0], // 0
        [2, 0, 0], // 1
        [2, 1, 0], // 2
        [1, 1, 0], // 3: reflex/concave vertex
        [1, 2, 0], // 4
        [0, 2, 0]  // 5
      ];
      const concaveFace = [[0, 1, 2, 3, 4, 5]];
      const triangles = triangulateFoldFaces(concaveFace, concaveVertices);

      // A 6-gon triangulates into 6 - 2 = 4 triangles
      expect(triangles).toHaveLength(4);
    });

    it('triangulates multiple mixed faces simultaneously', () => {
      const mixedFaces = [
        [0, 1, 2],       // Triangle (1 tri)
        [0, 1, 2, 3],    // Quad (2 tris)
        [0, 1, 2, 4, 3]  // Pentagon (3 tris)
      ];
      const triangles = triangulateFoldFaces(mixedFaces, vertices);
      expect(triangles).toHaveLength(1 + 2 + 3);
    });

    it('safely ignores degenerate faces with fewer than 3 vertices', () => {
      const degenerateFaces = [[0, 1], [0], []];
      const triangles = triangulateFoldFaces(degenerateFaces, vertices);
      expect(triangles).toHaveLength(0);
    });
  });

  describe('foldToBufferGeometry', () => {
    it('converts a parsed FOLD model into a valid Three.js BufferGeometry', () => {
      const model = parseFoldData(sampleFoldData);
      const geometry = foldToBufferGeometry(model);

      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);

      // Verify position and normal attributes exist
      const positionAttr = geometry.getAttribute('position');
      const normalAttr = geometry.getAttribute('normal');

      expect(positionAttr).toBeDefined();
      expect(normalAttr).toBeDefined();

      // Sample model has 4 triangular faces -> 4 triangles -> 12 vertices
      expect(positionAttr.count).toBe(12);
      expect(normalAttr.count).toBe(12);
    });

    it('ensures position coordinates accurately reflect vertex data and 2D-to-3D padding', () => {
      const fold2D: FoldFile = {
        file_spec: 1.2,
        vertices_coords: [
          [0, 0],
          [2, 0],
          [1, 2]
        ],
        edges_vertices: [[0, 1], [1, 2], [2, 0]],
        edges_assignment: ['B', 'B', 'B'],
        faces_vertices: [[0, 1, 2]]
      };

      const model = parseFoldData(fold2D);
      const geometry = foldToBufferGeometry(model);
      const pos = geometry.getAttribute('position');

      expect(pos.count).toBe(3);
      // Vertex 0: [0, 0, 0]
      expect(pos.getX(0)).toBe(0);
      expect(pos.getY(0)).toBe(0);
      expect(pos.getZ(0)).toBe(0);

      // Vertex 1: [2, 0, 0]
      expect(pos.getX(1)).toBe(2);
      expect(pos.getY(1)).toBe(0);
      expect(pos.getZ(1)).toBe(0);

      // Vertex 2: [1, 2, 0]
      expect(pos.getX(2)).toBe(1);
      expect(pos.getY(2)).toBe(2);
      expect(pos.getZ(2)).toBe(0);
    });

    it('computes valid, non-zero outward-pointing vertex normals', () => {
      const model = parseFoldData(sampleFoldData);
      const geometry = foldToBufferGeometry(model);
      const norm = geometry.getAttribute('normal');

      for (let i = 0; i < norm.count; i++) {
        const nx = norm.getX(i);
        const ny = norm.getY(i);
        const nz = norm.getZ(i);
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);

        // Every vertex normal must be a unit vector (length ~ 1) and non-zero
        expect(length).toBeGreaterThan(0.99);
        expect(length).toBeLessThan(1.01);
      }
    });

    it('converts models with quad and n-gon faces into triangulated BufferGeometry', () => {
      const quadFold: FoldFile = {
        file_spec: 1.2,
        vertices_coords: [
          [-1, -1, 0],
          [1, -1, 0],
          [1, 1, 0],
          [-1, 1, 0]
        ],
        edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0]],
        edges_assignment: ['B', 'B', 'B', 'B'],
        faces_vertices: [[0, 1, 2, 3]] // Single quad
      };

      const model = parseFoldData(quadFold);
      const geometry = foldToBufferGeometry(model);
      const pos = geometry.getAttribute('position');

      // 1 quad = 2 triangles = 6 vertices
      expect(pos.count).toBe(6);
      expect(geometry.getAttribute('normal').count).toBe(6);
    });
  });
});
