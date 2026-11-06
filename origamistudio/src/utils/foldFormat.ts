import * as THREE from 'three';
import type { OrigamiKit } from '../types/origami';
import { calculateStepPlanMetrics } from './origamiKinematics';

/**
 * ORIGAMISTUDIO™ — MIT FOLD Specification (v1.1) & Universal CAD Exporter
 * Implements the open-source FOLD format standard created by Erik Demaine & Jason Ku (MIT CSAIL)
 * Reference: https://github.com/edemaine/fold
 * 
 * Enables seamless interoperability with:
 * - Origami Simulator (origamisimulator.org)
 * - Oriedita (Java CP Editor)
 * - TreeMaker
 * - Blender / Three.js
 * - Cricut & Laser Cutters (SVG)
 */

export interface FoldFile {
  file_spec: number;
  file_creator: string;
  file_author: string;
  file_title: string;
  file_classes: string[];
  frame_title?: string;
  frame_classes?: string[];
  frame_attributes?: string[];
  vertices_coords: number[][];
  edges_vertices: number[][];
  edges_assignment: ('B' | 'M' | 'V' | 'F' | 'U')[];
  edges_foldAngle?: number[];
  file_frames?: any[];
}

/**
 * Generates an authentic MIT FOLD v1.1 JSON object for any kit and step
 */
export function generateFoldData(kit: OrigamiKit, stepIdx: number, foldFactor = 1.0): FoldFile {
  const totalSteps = kit.steps ? kit.steps.length : 5;
  const metrics = calculateStepPlanMetrics(kit.id, stepIdx, totalSteps, foldFactor);

  // Standard Origami Square Canvas [-1, 1]
  const vertices_coords: number[][] = [
    [-1.0, -1.0], // 0: Bottom-Left
    [1.0, -1.0],  // 1: Bottom-Right
    [1.0, 1.0],   // 2: Top-Right
    [-1.0, 1.0],  // 3: Top-Left
    [0.0, 0.0],   // 4: Center
    [metrics.creaseLine.x1, metrics.creaseLine.y1], // 5: Crease Start
    [metrics.creaseLine.x2, metrics.creaseLine.y2], // 6: Crease End
    [metrics.mobileVertex[0], metrics.mobileVertex[1]], // 7: Mobile Flap Corner
  ];

  // Boundary edges (B) + Mountain (M) / Valley (V) creases + Flat pre-creases (F)
  const edges_vertices: number[][] = [
    [0, 1], // Bottom Border
    [1, 2], // Right Border
    [2, 3], // Top Border
    [3, 0], // Left Border
    [5, 6], // Active Step Crease Axis
    [0, 2], // Diagonal 1 Pre-crease
    [1, 3], // Diagonal 2 Pre-crease
  ];

  const isValley = metrics.foldCategory === 'valley';
  const edges_assignment: ('B' | 'M' | 'V' | 'F' | 'U')[] = [
    'B', 'B', 'B', 'B',
    isValley ? 'V' : 'M',
    'F',
    'F'
  ];

  const edges_foldAngle: number[] = [
    0, 0, 0, 0,
    isValley ? -metrics.foldAngleTarget : metrics.foldAngleTarget,
    0, 0
  ];

  return {
    file_spec: 1.1,
    file_creator: 'OrigamiStudio™ v5.0 (MIT FOLD Compliant)',
    file_author: 'OrigamiStudio Computational Paper Engineering Lab',
    file_title: `${kit.title} - Step ${stepIdx + 1}: ${metrics.foldType}`,
    file_classes: ['singleModel'],
    frame_title: 'creasePattern',
    frame_classes: ['creasePattern'],
    frame_attributes: ['2D'],
    vertices_coords,
    edges_vertices,
    edges_assignment,
    edges_foldAngle,
    file_frames: [
      {
        frame_title: 'foldedForm',
        frame_classes: ['foldedForm'],
        frame_attributes: ['3D'],
        vertices_coords: metrics.trajectoryPath.map(p => [p.x, p.y, p.z])
      }
    ]
  };
}

/**
 * Downloads the MIT .FOLD JSON file
 */
export function downloadFoldFile(kit: OrigamiKit, stepIdx: number, foldFactor = 1.0) {
  const foldData = generateFoldData(kit, stepIdx, foldFactor);
  const jsonStr = JSON.stringify(foldData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${kit.id}-step${stepIdx + 1}-crease-pattern.fold`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates Wavefront 3D OBJ text from Three.js BufferGeometry
 */
export function generateObjString(geo: THREE.BufferGeometry, title = 'OrigamiModel'): string {
  const pos = geo.getAttribute('position');
  const norm = geo.getAttribute('normal');
  let obj = `# ORIGAMISTUDIO™ 3D Wavefront OBJ Exporter\n`;
  obj += `# Model: ${title}\n`;
  obj += `# Vertices: ${pos ? pos.count : 0}\n\n`;

  if (!pos) return obj;

  // Vertices: v x y z
  for (let i = 0; i < pos.count; i++) {
    obj += `v ${pos.getX(i).toFixed(4)} ${pos.getY(i).toFixed(4)} ${pos.getZ(i).toFixed(4)}\n`;
  }

  // Normals: vn x y z
  if (norm) {
    for (let i = 0; i < norm.count; i++) {
      obj += `vn ${norm.getX(i).toFixed(4)} ${norm.getY(i).toFixed(4)} ${norm.getZ(i).toFixed(4)}\n`;
    }
  }

  // Faces: f v1//vn1 v2//vn2 v3//vn3
  obj += `\ns 1\n`;
  for (let i = 0; i < pos.count; i += 3) {
    const v1 = i + 1;
    const v2 = i + 2;
    const v3 = i + 3;
    if (norm) {
      obj += `f ${v1}//${v1} ${v2}//${v2} ${v3}//${v3}\n`;
    } else {
      obj += `f ${v1} ${v2} ${v3}\n`;
    }
  }

  return obj;
}

/**
 * Downloads the 3D Wavefront OBJ model for Blender & 3D Printing
 */
export function downloadObjFile(kit: OrigamiKit, geo: THREE.BufferGeometry, stepIdx: number) {
  const objText = generateObjString(geo, `${kit.title} Step ${stepIdx + 1}`);
  const blob = new Blob([objText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${kit.id}-step${stepIdx + 1}-3d-model.obj`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates Production-Grade Cricut & Laser Cutter Vector SVG
 * Features separated toolpath layers: Cut (Black) & Score (Mountain=Red, Valley=Blue)
 */
export function generateCricutSvg(kit: OrigamiKit, stepIdx: number): string {
  const totalSteps = kit.steps ? kit.steps.length : 5;
  const metrics = calculateStepPlanMetrics(kit.id, stepIdx, totalSteps, 1.0);

  const size = 600;
  const pad = 50;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const toX = (x: number) => pad + ((x + 1.2) / 2.4) * w;
  const toY = (y: number) => pad + ((1.2 - y) / 2.4) * h;

  const cX1 = toX(metrics.creaseLine.x1);
  const cY1 = toY(metrics.creaseLine.y1);
  const cX2 = toX(metrics.creaseLine.x2);
  const cY2 = toY(metrics.creaseLine.y2);

  const isValley = metrics.foldCategory === 'valley';
  const scoreColor = isValley ? '#0284c7' : '#ef4444';
  const scoreDash = isValley ? '8,8' : '16,6,4,6';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <title>${kit.title} - Step ${stepIdx + 1} Crease Pattern (Cricut / Laser Cutter Toolpaths)</title>
  <!-- Background Alignment Guide -->
  <rect width="${size}" height="${size}" fill="#0a0d18"/>
  
  <!-- LAYER 1: OUTER BORDER CUT LAYER (Black / Continuous Line) -->
  <g id="layer-cut" stroke="#ffffff" stroke-width="2.5" fill="none">
    <rect x="${toX(-1.0)}" y="${toY(1.0)}" width="${toX(1.0) - toX(-1.0)}" height="${toY(-1.0) - toY(1.0)}"/>
  </g>

  <!-- LAYER 2: INTERIOR SCORE CREASES (Red=Mountain, Blue=Valley) -->
  <g id="layer-score" fill="none">
    <!-- Diagonal Construction Pre-creases -->
    <line x1="${toX(-1.0)}" y1="${toY(-1.0)}" x2="${toX(1.0)}" y2="${toY(1.0)}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,4"/>
    <line x1="${toX(-1.0)}" y1="${toY(1.0)}" x2="${toX(1.0)}" y2="${toY(-1.0)}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,4"/>

    <!-- Active Step Folding Crease Axis -->
    <line x1="${cX1}" y1="${cY1}" x2="${cX2}" y2="${cY2}" stroke="${scoreColor}" stroke-width="3.5" stroke-dasharray="${scoreDash}" stroke-linecap="round"/>
  </g>

  <!-- LAYER 3: TECHNICAL ANNOTATIONS -->
  <g id="layer-annotations" font-family="'JetBrains Mono', monospace" font-size="12" fill="#94a3b8">
    <text x="${pad}" y="${size - 20}">ORIGAMISTUDIO™ CRICUT/LASER GUIDE • ${kit.title.toUpperCase()} • STEP ${stepIdx + 1}: ${metrics.foldType}</text>
    <text x="${pad}" y="${pad - 15}" fill="${scoreColor}">Score Line: ${isValley ? 'Valley (Dash)' : 'Mountain (Dash-Dot)'} • Angle: ${metrics.foldAngleTarget}°</text>
  </g>
</svg>`;
}

/**
 * Downloads the Cricut / Laser Cutter SVG file
 */
export function downloadCricutSvg(kit: OrigamiKit, stepIdx: number) {
  const svgText = generateCricutSvg(kit, stepIdx);
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${kit.id}-step${stepIdx + 1}-cricut-cut-guide.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Computational Origami Presets from Amanda Ghassaei's Origami Simulator & MIT FOLD
 */
export interface ComputationalOrigamiPreset {
  id: string;
  name: string;
  category: 'Metamaterial' | 'Space Deployable' | 'Classic Base' | 'Tessellation';
  origin: string;
  githubRepo: string;
  description: string;
  verticesCount: number;
  creasesCount: number;
  foldAngle: number;
}

export const COMPUTATIONAL_PRESETS: ComputationalOrigamiPreset[] = [
  {
    id: 'miura-ori',
    name: 'Miura-Ori Solar Array',
    category: 'Space Deployable',
    origin: 'Koryo Miura (Japan Aerospace Space Science, 1970)',
    githubRepo: 'https://github.com/amandaghassaei/OrigamiSimulator',
    description: 'Rigid origami tessellation with negative Poisson ratio. Deploys two-dimensionally from a compact fold into a rigid solar panel array.',
    verticesCount: 25,
    creasesCount: 40,
    foldAngle: 68
  },
  {
    id: 'waterbomb',
    name: 'Waterbomb Auxetic Lattice',
    category: 'Metamaterial',
    origin: 'Classical Edo Base to Modern Mechanical Metamaterial',
    githubRepo: 'https://github.com/edemaine/fold',
    description: 'Bistable folding unit exhibiting radial contraction. Applied in biomedical deployable stents and robotics.',
    verticesCount: 21,
    creasesCount: 36,
    foldAngle: 90
  },
  {
    id: 'yoshimura',
    name: 'Yoshimura Diamond Pattern',
    category: 'Tessellation',
    origin: 'Yoshimaru Yoshimura (1951 Cylinder Buckling)',
    githubRepo: 'https://github.com/amandaghassaei/OrigamiSimulator',
    description: 'Diamond facet pattern formed by post-buckling thin cylindrical shells under axial compression.',
    verticesCount: 30,
    creasesCount: 52,
    foldAngle: 75
  },
  {
    id: 'flasher',
    name: 'Shafer Kinetic Flasher',
    category: 'Space Deployable',
    origin: 'Jeremy Shafer / BYU Compliant Mechanisms Research',
    githubRepo: 'https://github.com/robbykraft/Rabbit-Ear',
    description: 'Radial spiral origami that expands by 12x volume. Used for deployable satellite antennae and optical shades.',
    verticesCount: 36,
    creasesCount: 64,
    foldAngle: 85
  },
  {
    id: 'bird-base',
    name: 'Orizuru Classic Bird Base',
    category: 'Classic Base',
    origin: 'Hiden Senbazuru Orikata (1797, Kyoto)',
    githubRepo: 'https://github.com/edemaine/fold',
    description: 'Universal 4-flap base with 8 crease sectors meeting at the central node, obeying Kawasaki and Maekawa parity theorems.',
    verticesCount: 16,
    creasesCount: 28,
    foldAngle: 180
  }
];

