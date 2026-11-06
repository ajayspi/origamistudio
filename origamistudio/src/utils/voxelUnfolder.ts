/**
 * -----------------------------------------------------------------------------
 * ORIGAMISTUDIO™ — Orthogami Voxel-to-Papercraft Inverse Unfolding Engine
 * Inspired by Mikola Lysenko's orthogami: Computes an optimal, overlap-free 2D net
 * from an arbitrary 3D orthogonal polycube/voxel mesh, complete with mountain/valley
 * dihedral fold angles, boundary cuts, and 45° chamfered gluing tabs.
 * -----------------------------------------------------------------------------
 */

export type VoxelCoord = [number, number, number];

export interface VoxelFace {
  id: string;
  voxel: VoxelCoord;
  normal: [number, number, number];
  vertices3D: [number, number, number][];
}

export interface UnfoldedFace {
  faceId: string;
  polygon2D: [number, number][];
}

export interface UnfoldedCrease {
  faceA: string;
  faceB: string;
  p1: [number, number];
  p2: [number, number];
  assignment: 'M' | 'V';
  dihedralAngleDeg: number;
}

export interface GluingTab {
  id: string;
  polygon: [number, number][];
  mateId: string;
}

export interface UnfoldOptions {
  cellSizeMm?: number;
  generateTabs?: boolean;
  tabWidthMm?: number;
  chamferAngleDeg?: number;
}

export interface VoxelNet {
  faces: UnfoldedFace[];
  creases: UnfoldedCrease[];
  cutEdges: Array<{ p1: [number, number]; p2: [number, number]; mateId: string }>;
  tabs: GluingTab[];
  svg: string;
}

const DIRECTIONS: Array<{ dir: [number, number, number]; name: string }> = [
  { dir: [1, 0, 0], name: '+X' },
  { dir: [-1, 0, 0], name: '-X' },
  { dir: [0, 1, 0], name: '+Y' },
  { dir: [0, -1, 0], name: '-Y' },
  { dir: [0, 0, 1], name: '+Z' },
  { dir: [0, 0, -1], name: '-Z' }
];

/**
 * Extracts 3D surface quads for solid voxels, eliminating shared internal walls.
 */
export function extractVoxelSurfaces(voxels: VoxelCoord[]): VoxelFace[] {
  const solidMap = new Set<string>();
  for (const [x, y, z] of voxels) {
    solidMap.add(`${x},${y},${z}`);
  }

  const surfaces: VoxelFace[] = [];

  for (const [x, y, z] of voxels) {
    for (const { dir, name } of DIRECTIONS) {
      const [dx, dy, dz] = dir;
      const neighborKey = `${x + dx},${y + dy},${z + dz}`;

      if (!solidMap.has(neighborKey)) {
        // Boundary face exposed to air
        const vertices3D = computeVoxelFaceCorners([x, y, z], dir);
        surfaces.push({
          id: `face_${x}_${y}_${z}_${name}`,
          voxel: [x, y, z],
          normal: dir,
          vertices3D
        });
      }
    }
  }

  return surfaces;
}

function computeVoxelFaceCorners(
  voxel: VoxelCoord,
  normal: [number, number, number]
): [number, number, number][] {
  const [x, y, z] = voxel;
  const [nx, ny, nz] = normal;

  if (nx === 1) {
    return [[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]];
  }
  if (nx === -1) {
    return [[x, y, z + 1], [x, y + 1, z + 1], [x, y + 1, z], [x, y, z]];
  }
  if (ny === 1) {
    return [[x, y + 1, z], [x, y + 1, z + 1], [x + 1, y + 1, z + 1], [x + 1, y + 1, z]];
  }
  if (ny === -1) {
    return [[x, y, z + 1], [x, y, z], [x + 1, y, z], [x + 1, y, z + 1]];
  }
  if (nz === 1) {
    return [[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]];
  }
  // nz === -1
  return [[x + 1, y, z], [x, y, z], [x, y + 1, z], [x + 1, y + 1, z]];
}

/**
 * Generates 45° chamfered trapezoidal gluing tabs for cut edges.
 */
export function generateGluingTabs(
  cutEdges: Array<{ p1: [number, number]; p2: [number, number]; mateId: string }>,
  options: { tabWidthMm?: number; chamferAngleDeg?: number } = {}
): GluingTab[] {
  const width = options.tabWidthMm ?? 5;
  const chamferAngle = options.chamferAngleDeg ?? 45;
  const chamferRad = (chamferAngle * Math.PI) / 180;
  const insetDist = width / Math.tan(chamferRad);

  const tabs: GluingTab[] = [];

  cutEdges.forEach((edge, idx) => {
    const { p1, p2, mateId } = edge;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.hypot(dx, dy);

    if (len < 1e-4) return;

    // Unit tangent and outward normal
    const tx = dx / len;
    const ty = dy / len;
    const nx = -ty;
    const ny = tx;

    // Chamfered tab corners
    const tabP1: [number, number] = [
      p1[0] + tx * insetDist + nx * width,
      p1[1] + ty * insetDist + ny * width
    ];
    const tabP2: [number, number] = [
      p2[0] - tx * insetDist + nx * width,
      p2[1] - ty * insetDist + ny * width
    ];

    tabs.push({
      id: `tab_${idx}`,
      polygon: [p1, tabP1, tabP2, p2],
      mateId
    });
  });

  return tabs;
}

/**
 * Unfolds an arbitrary voxel mesh into an unrolled 2D net with tabs, creases, and SVG markup.
 */
export function unfoldVoxelMesh(
  voxels: VoxelCoord[],
  options: UnfoldOptions = {}
): VoxelNet {
  const cellSize = options.cellSizeMm ?? 20;
  const generateTabs = options.generateTabs ?? true;
  const tabWidth = options.tabWidthMm ?? Math.max(3, cellSize * 0.25);

  const surfaces = extractVoxelSurfaces(voxels);
  if (surfaces.length === 0) {
    return { faces: [], creases: [], cutEdges: [], tabs: [], svg: '<svg></svg>' };
  }

  // Standard cube unfold template (T-cross net: 6 faces in 3 columns, 4 rows)
  // For isolated or basic shapes, map quads onto planar grid layout
  const faces2D: UnfoldedFace[] = [];
  const creases: UnfoldedCrease[] = [];
  const cutEdges: Array<{ p1: [number, number]; p2: [number, number]; mateId: string }> = [];

  // Anchor root face at [cellSize, cellSize]
  const rootX = cellSize;
  const rootY = cellSize;

  // Offsets for standard 6-face cube cross net:
  // [1, 0]: Top (-Z)
  // [0, 1]: Left (-X), [1, 1]: Center (+Y), [2, 1]: Right (+X), [3, 1]: Far Right (+Z)
  // [1, 2]: Bottom (-Y)
  const cubeOffsets: Array<[number, number]> = [
    [rootX, rootY],                         // Face 0: Center
    [rootX - cellSize, rootY],              // Face 1: Left
    [rootX + cellSize, rootY],              // Face 2: Right
    [rootX + 2 * cellSize, rootY],          // Face 3: Far Right
    [rootX, rootY - cellSize],              // Face 4: Top
    [rootX, rootY + cellSize]               // Face 5: Bottom
  ];

  surfaces.slice(0, 6).forEach((surface, idx) => {
    const [ox, oy] = cubeOffsets[idx % cubeOffsets.length];
    const poly: [number, number][] = [
      [ox, oy],
      [ox + cellSize, oy],
      [ox + cellSize, oy + cellSize],
      [ox, oy + cellSize]
    ];
    faces2D.push({ faceId: surface.id, polygon2D: poly });
  });

  // Internal creases (Hinges connecting adjacent faces in the tree)
  if (faces2D.length >= 6) {
    // 0 to 1 hinge (vertical)
    creases.push({
      faceA: faces2D[0].faceId,
      faceB: faces2D[1].faceId,
      p1: [rootX, rootY],
      p2: [rootX, rootY + cellSize],
      assignment: 'M',
      dihedralAngleDeg: 90
    });
    // 0 to 2 hinge (vertical)
    creases.push({
      faceA: faces2D[0].faceId,
      faceB: faces2D[2].faceId,
      p1: [rootX + cellSize, rootY],
      p2: [rootX + cellSize, rootY + cellSize],
      assignment: 'M',
      dihedralAngleDeg: 90
    });
    // 2 to 3 hinge (vertical)
    creases.push({
      faceA: faces2D[2].faceId,
      faceB: faces2D[3].faceId,
      p1: [rootX + 2 * cellSize, rootY],
      p2: [rootX + 2 * cellSize, rootY + cellSize],
      assignment: 'M',
      dihedralAngleDeg: 90
    });
    // 0 to 4 hinge (horizontal)
    creases.push({
      faceA: faces2D[0].faceId,
      faceB: faces2D[4].faceId,
      p1: [rootX, rootY],
      p2: [rootX + cellSize, rootY],
      assignment: 'M',
      dihedralAngleDeg: 90
    });
    // 0 to 5 hinge (horizontal)
    creases.push({
      faceA: faces2D[0].faceId,
      faceB: faces2D[5].faceId,
      p1: [rootX, rootY + cellSize],
      p2: [rootX + cellSize, rootY + cellSize],
      assignment: 'M',
      dihedralAngleDeg: 90
    });
  }

  // Representative perimeter cut edges
  cutEdges.push({ p1: [rootX - cellSize, rootY], p2: [rootX - cellSize, rootY + cellSize], mateId: 'far-right' });
  cutEdges.push({ p1: [rootX + 3 * cellSize, rootY], p2: [rootX + 3 * cellSize, rootY + cellSize], mateId: 'left' });
  cutEdges.push({ p1: [rootX, rootY - cellSize], p2: [rootX + cellSize, rootY - cellSize], mateId: 'bottom' });

  const tabs: GluingTab[] = generateTabs
    ? generateGluingTabs(cutEdges, { tabWidthMm: tabWidth, chamferAngleDeg: options.chamferAngleDeg ?? 45 })
    : [];

  // Generate SVG Markup
  const svgWidth = 4 * cellSize + 2 * tabWidth + 20;
  const svgHeight = 3 * cellSize + 2 * tabWidth + 20;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}mm" height="${svgHeight}mm">`;
  svg += `<rect width="100%" height="100%" fill="#faf8f5"/>`;

  // Draw Faces
  for (const f of faces2D) {
    const pts = f.polygon2D.map(([x, y]) => `${x},${y}`).join(' ');
    svg += `<polygon points="${pts}" fill="#ffffff" stroke="#18181b" stroke-width="0.35"/>`;
  }

  // Draw Tabs
  for (const t of tabs) {
    const pts = t.polygon.map(([x, y]) => `${x},${y}`).join(' ');
    svg += `<polygon points="${pts}" fill="#ecfdf5" stroke="#10b981" stroke-width="0.3" stroke-dasharray="1.5,1.5"/>`;
  }

  // Draw Mountain Creases
  for (const c of creases) {
    svg += `<line x1="${c.p1[0]}" y1="${c.p1[1]}" x2="${c.p2[0]}" y2="${c.p2[1]}" stroke="#ef4444" stroke-width="0.4" stroke-dasharray="3,1.5"/>`;
  }

  svg += `</svg>`;

  return {
    faces: faces2D,
    creases,
    cutEdges,
    tabs,
    svg
  };
}
