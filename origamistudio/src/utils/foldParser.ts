import * as THREE from 'three';

/**
 * Standard FOLD v1.2 Specification Parser and Three.js Triangulator
 * Implements the open FOLD specification (v1.1 / v1.2) created by Erik Demaine & Jason Ku (MIT CSAIL)
 * Reference: https://github.com/edemaine/fold
 */

export interface FoldFile {
  file_spec?: number;
  file_creator?: string;
  file_author?: string;
  file_title?: string;
  file_description?: string;
  file_classes?: string[];
  frame_title?: string;
  frame_classes?: string[];
  frame_attributes?: string[];
  vertices_coords: number[][];
  vertices_vertices?: number[][];
  vertices_faces?: number[][];
  edges_vertices: number[][];
  edges_faces?: number[][];
  edges_assignment: ('B' | 'M' | 'V' | 'F' | 'U' | 'C' | string)[];
  edges_foldAngle?: number[];
  edges_length?: number[];
  faces_vertices?: number[][];
  faces_edges?: number[][];
  file_frames?: unknown[];
}

export interface FoldEdge {
  vertices: [number, number];
  assignment: 'B' | 'M' | 'V' | 'F' | 'U' | 'C' | string;
  foldAngle?: number;
  length?: number;
}

export interface FoldFace {
  vertices: number[];
  edges?: number[];
  triangles?: [number, number, number][];
}

export interface FoldCounts {
  totalVertices: number;
  mountainCreases: number;
  valleyCreases: number;
  boundaryEdges: number;
  flatCreases: number;
  cutEdges: number;
  unassignedEdges: number;
  totalEdges: number;
  totalFaces: number;
  // Aliases for developer convenience
  vertices: number;
  mountain: number;
  valley: number;
  boundary: number;
  flat: number;
  cut: number;
}

export interface FoldModel {
  file_spec: number;
  file_creator?: string;
  file_author?: string;
  file_title?: string;
  file_description?: string;
  file_classes?: string[];
  vertices_coords: number[][]; // Normalized 3D coordinates [x, y, z]
  edges_vertices: number[][];
  edges_assignment: string[];
  edges_foldAngle?: number[];
  faces_vertices: number[][];
  edges: FoldEdge[];
  faces: FoldFace[];
  counts: FoldCounts;
  totalVertices: number;
  mountainCreases: number;
  valleyCreases: number;
  boundaryEdges: number;
  raw: FoldFile;
}

/**
 * Parses a FOLD v1.2 file from JSON string or object into a strongly-typed FoldModel.
 */
export function parseFoldData(input: string | object): FoldModel {
  let raw: FoldFile;

  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input) as FoldFile;
    } catch (err) {
      throw new Error(`Failed to parse FOLD JSON: ${(err as Error).message}`);
    }
  } else if (typeof input === 'object' && input !== null) {
    raw = input as FoldFile;
  } else {
    throw new Error('Invalid input: parseFoldData expects a JSON string or object');
  }

  const file_spec = typeof raw.file_spec === 'number' ? raw.file_spec : 1.2;
  const rawCoords = Array.isArray(raw.vertices_coords) ? raw.vertices_coords : [];

  // Normalize 2D [x, y] coordinates into 3D [x, y, 0]
  const vertices_coords = rawCoords.map((coord) => [
    coord[0] ?? 0,
    coord[1] ?? 0,
    coord[2] ?? 0,
  ]);

  const edges_vertices = Array.isArray(raw.edges_vertices) ? raw.edges_vertices : [];
  const edges_assignment = Array.isArray(raw.edges_assignment)
    ? raw.edges_assignment.map((a) => String(a).toUpperCase())
    : edges_vertices.map(() => 'U');

  const faces_vertices = Array.isArray(raw.faces_vertices) ? raw.faces_vertices : [];

  // Edge assignments counts: B (Boundary), M (Mountain), V (Valley), F (Flat), C (Cut), U (Unassigned)
  let boundaryEdges = 0;
  let mountainCreases = 0;
  let valleyCreases = 0;
  let flatCreases = 0;
  let cutEdges = 0;
  let unassignedEdges = 0;

  for (const assign of edges_assignment) {
    switch (assign) {
      case 'B':
        boundaryEdges++;
        break;
      case 'M':
        mountainCreases++;
        break;
      case 'V':
        valleyCreases++;
        break;
      case 'F':
        flatCreases++;
        break;
      case 'C':
        cutEdges++;
        break;
      default:
        unassignedEdges++;
        break;
    }
  }

  const totalVertices = vertices_coords.length;
  const totalEdges = edges_vertices.length;
  const totalFaces = faces_vertices.length;

  const counts: FoldCounts = {
    totalVertices,
    mountainCreases,
    valleyCreases,
    boundaryEdges,
    flatCreases,
    cutEdges,
    unassignedEdges,
    totalEdges,
    totalFaces,
    vertices: totalVertices,
    mountain: mountainCreases,
    valley: valleyCreases,
    boundary: boundaryEdges,
    flat: flatCreases,
    cut: cutEdges,
  };

  const edges: FoldEdge[] = edges_vertices.map((v, i) => ({
    vertices: [v[0], v[1]],
    assignment: edges_assignment[i] || 'U',
    foldAngle: raw.edges_foldAngle ? raw.edges_foldAngle[i] : undefined,
    length: raw.edges_length ? raw.edges_length[i] : undefined,
  }));

  const faces: FoldFace[] = faces_vertices.map((f, i) => ({
    vertices: [...f],
    edges: raw.faces_edges ? raw.faces_edges[i] : undefined,
  }));

  return {
    file_spec,
    file_creator: raw.file_creator,
    file_author: raw.file_author,
    file_title: raw.file_title,
    file_description: raw.file_description,
    file_classes: raw.file_classes,
    vertices_coords,
    edges_vertices,
    edges_assignment,
    edges_foldAngle: raw.edges_foldAngle,
    faces_vertices,
    edges,
    faces,
    counts,
    totalVertices,
    mountainCreases,
    valleyCreases,
    boundaryEdges,
    raw,
  };
}

/**
 * Projects a 3D polygon onto a 2D plane using Newell's method for normal estimation.
 */
function projectPolygonTo2D(poly: number[], vertices: number[][]): { u: number; v: number }[] {
  let nx = 0;
  let ny = 0;
  let nz = 0;
  const n = poly.length;

  for (let i = 0; i < n; i++) {
    const v1 = vertices[poly[i]] || [0, 0, 0];
    const v2 = vertices[poly[(i + 1) % n]] || [0, 0, 0];
    const x1 = v1[0] ?? 0, y1 = v1[1] ?? 0, z1 = v1[2] ?? 0;
    const x2 = v2[0] ?? 0, y2 = v2[1] ?? 0, z2 = v2[2] ?? 0;
    nx += (y1 - y2) * (z1 + z2);
    ny += (z1 - z2) * (x1 + x2);
    nz += (x1 - x2) * (y1 + y2);
  }

  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const az = Math.abs(nz);

  let axis = 2; // Default to Z-projection (XY plane)
  if (ax > ay && ax > az) {
    axis = 0; // X dominant -> project to YZ
  } else if (ay > ax && ay > az) {
    axis = 1; // Y dominant -> project to XZ
  }

  return poly.map((idx) => {
    const v = vertices[idx] || [0, 0, 0];
    const x = v[0] ?? 0, y = v[1] ?? 0, z = v[2] ?? 0;
    if (axis === 0) {
      return { u: y, v: z };
    }
    if (axis === 1) {
      return { u: x, v: z };
    }
    return { u: x, v: y };
  });
}

/**
 * Checks whether point p lies inside or on the boundary of triangle ABC.
 */
function isPointInTriangle(
  p: { u: number; v: number },
  a: { u: number; v: number },
  b: { u: number; v: number },
  c: { u: number; v: number },
  ccw: boolean
): boolean {
  const cp1 = (b.u - a.u) * (p.v - a.v) - (b.v - a.v) * (p.u - a.u);
  const cp2 = (c.u - b.u) * (p.v - b.v) - (c.v - b.v) * (p.u - b.u);
  const cp3 = (a.u - c.u) * (p.v - c.v) - (a.v - c.v) * (p.u - c.u);

  const eps = 1e-9;
  if (ccw) {
    return cp1 >= -eps && cp2 >= -eps && cp3 >= -eps;
  }
  return cp1 <= eps && cp2 <= eps && cp3 <= eps;
}

/**
 * Ear-clipping triangulation for arbitrary simple polygons (convex or concave).
 */
function triangulatePolygonEarClipping(poly: number[], vertices: number[][]): number[][] {
  const n = poly.length;
  if (n < 3) return [];
  if (n === 3) return [[poly[0], poly[1], poly[2]]];

  const pts = projectPolygonTo2D(poly, vertices);

  // Calculate signed area to identify winding direction
  let signedArea = 0;
  for (let i = 0; i < n; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    signedArea += (p1.u * p2.v - p2.u * p1.v);
  }
  const isCCW = signedArea > 0;

  const indices: number[] = poly.map((_, i) => i);
  const triangles: number[][] = [];

  let iterations = 0;
  const maxIterations = indices.length * indices.length * 2;

  while (indices.length > 3 && iterations < maxIterations) {
    iterations++;
    let earFound = false;
    const len = indices.length;

    for (let i = 0; i < len; i++) {
      const prevIdx = indices[(i - 1 + len) % len];
      const currIdx = indices[i];
      const nextIdx = indices[(i + 1) % len];

      const pA = pts[prevIdx];
      const pB = pts[currIdx];
      const pC = pts[nextIdx];

      // Cross product (pB - pA) x (pC - pB)
      const cp = (pB.u - pA.u) * (pC.v - pB.v) - (pB.v - pA.v) * (pC.u - pB.u);
      const isConvex = isCCW ? cp > 1e-9 : cp < -1e-9;

      if (!isConvex) continue;

      let hasVertexInside = false;
      for (let j = 0; j < len; j++) {
        const testIdx = indices[j];
        if (testIdx === prevIdx || testIdx === currIdx || testIdx === nextIdx) continue;
        const pM = pts[testIdx];
        if (isPointInTriangle(pM, pA, pB, pC, isCCW)) {
          hasVertexInside = true;
          break;
        }
      }

      if (!hasVertexInside) {
        triangles.push([poly[prevIdx], poly[currIdx], poly[nextIdx]]);
        indices.splice(i, 1);
        earFound = true;
        break;
      }
    }

    if (!earFound) {
      break;
    }
  }

  if (indices.length === 3) {
    triangles.push([poly[indices[0]], poly[indices[1]], poly[indices[2]]]);
  } else if (indices.length > 3) {
    // Robust fallback: fan triangulation of remaining vertices
    const root = indices[0];
    for (let i = 1; i < indices.length - 1; i++) {
      triangles.push([poly[root], poly[indices[i]], poly[indices[i + 1]]]);
    }
  }

  return triangles;
}

/**
 * Triangulates all faces of a FOLD model. Handles triangles, quads, and n-gons.
 */
export function triangulateFoldFaces(faces: number[][], vertices: number[][]): number[][] {
  const result: number[][] = [];

  for (const face of faces) {
    if (!face || face.length < 3) continue;

    if (face.length === 3) {
      result.push([face[0], face[1], face[2]]);
      continue;
    }

    const tris = triangulatePolygonEarClipping(face, vertices);
    for (const tri of tris) {
      result.push(tri);
    }
  }

  return result;
}

/**
 * Converts a parsed FoldModel into a Three.js BufferGeometry with outward-pointing normals.
 */
export function foldToBufferGeometry(fold: FoldModel): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  const faces = fold.faces_vertices || [];
  const coords = fold.vertices_coords || [];

  const triangles = triangulateFoldFaces(faces, coords);

  if (triangles.length === 0) {
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute([], 3));
    return geometry;
  }

  const positions: number[] = [];
  for (const tri of triangles) {
    for (const vIdx of tri) {
      const v = coords[vIdx] || [0, 0, 0];
      positions.push(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  return geometry;
}
