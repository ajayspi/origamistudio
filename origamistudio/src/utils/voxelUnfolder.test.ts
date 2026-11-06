import { describe, it, expect } from 'vitest';
import {
  type VoxelCoord,
  extractVoxelSurfaces,
  unfoldVoxelMesh,
  generateGluingTabs
} from './voxelUnfolder';

describe('Orthogami Voxel-to-Papercraft Inverse Unfolding Engine', () => {
  it('extracts all 6 boundary faces for a single isolated voxel cube', () => {
    const voxels: VoxelCoord[] = [[0, 0, 0]];
    const surfaces = extractVoxelSurfaces(voxels);
    expect(surfaces.length).toBe(6);

    // One face in each principal axis (+X, -X, +Y, -Y, +Z, -Z)
    const normals = surfaces.map(s => s.normal.join(','));
    expect(normals).toContain('1,0,0');
    expect(normals).toContain('-1,0,0');
    expect(normals).toContain('0,1,0');
    expect(normals).toContain('0,-1,0');
    expect(normals).toContain('0,0,1');
    expect(normals).toContain('0,0,-1');
  });

  it('cancels out shared internal faces between adjacent voxels', () => {
    // 2 adjacent voxels: 2 * 6 - 2 shared = 10 surface faces
    const voxels: VoxelCoord[] = [[0, 0, 0], [1, 0, 0]];
    const surfaces = extractVoxelSurfaces(voxels);
    expect(surfaces.length).toBe(10);
  });

  it('unfolds an isolated cube into a planar 2D net with 5 crease hinges', () => {
    const voxels: VoxelCoord[] = [[0, 0, 0]];
    const cellSizeMm = 20; // 20mm cubes
    const net = unfoldVoxelMesh(voxels, { cellSizeMm });

    expect(net.faces.length).toBe(6);
    // Tree edges = faces - 1 = 5 internal crease lines
    expect(net.creases.length).toBe(5);
    // All cube folds are convex (Mountain / 90° dihedral)
    for (const crease of net.creases) {
      expect(crease.assignment).toBe('M');
      expect(crease.dihedralAngleDeg).toBe(90);
    }
  });

  it('generates 45° chamfered trapezoidal gluing tabs on cut edges', () => {
    const cutEdges: Array<{ p1: [number, number]; p2: [number, number]; mateId: string }> = [
      { p1: [0, 0], p2: [20, 0], mateId: 'edge-right' }
    ];
    const tabWidthMm = 5;
    const tabs = generateGluingTabs(cutEdges, { tabWidthMm, chamferAngleDeg: 45 });

    expect(tabs.length).toBe(1);
    const tab = tabs[0];
    // Trapezoid must have 4 vertices: base P1, tab corner 1, tab corner 2, base P2
    expect(tab.polygon.length).toBe(4);
    expect(tab.polygon[0]).toEqual([0, 0]);
    expect(tab.polygon[3]).toEqual([20, 0]);

    // Corners must be chamfered inward by tabWidth (5mm at 45°)
    expect(tab.polygon[1][0]).toBeCloseTo(5, 1);
    expect(tab.polygon[2][0]).toBeCloseTo(15, 1);
  });

  it('renders valid printable SVG string with tabs, cuts, and mountain creases', () => {
    const voxels: VoxelCoord[] = [[0, 0, 0]];
    const net = unfoldVoxelMesh(voxels, { cellSizeMm: 25, generateTabs: true });
    const svg = net.svg;

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('stroke="#ef4444"'); // Mountain crease red stroke
    expect(svg).toContain('stroke="#10b981"'); // Gluing tab green stroke
    expect(svg).toContain('stroke="#18181b"'); // Boundary cut stroke
  });
});
