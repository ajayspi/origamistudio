import * as THREE from 'three';

// -----------------------------------------------------------------------------
// ORIGAMISTUDIO™ — 62-Kit Computational Origami 3D Geometry Engine
// Supports both progressive step-by-step 3D folding transformations
// and fully sculpted final masterwork synthesis.
// -----------------------------------------------------------------------------

export function addTri(arr: number[], p1: number[], p2: number[], p3: number[]) {
  arr.push(p1[0], p1[1], p1[2]);
  arr.push(p2[0], p2[1], p2[2]);
  arr.push(p3[0], p3[1], p3[2]);
}

export function addQuad(arr: number[], p1: number[], p2: number[], p3: number[], p4: number[]) {
  addTri(arr, p1, p2, p3);
  addTri(arr, p1, p3, p4);
}

export function addBox(arr: number[], x1: number, x2: number, y1: number, y2: number, z1: number, z2: number) {
  // Front & Back
  addQuad(arr, [x1, y1, z2], [x2, y1, z2], [x2, y2, z2], [x1, y2, z2]);
  addQuad(arr, [x2, y1, z1], [x1, y1, z1], [x1, y2, z1], [x2, y2, z1]);
  // Top & Bottom
  addQuad(arr, [x1, y2, z2], [x2, y2, z2], [x2, y2, z1], [x1, y2, z1]);
  addQuad(arr, [x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]);
  // Left & Right
  addQuad(arr, [x1, y1, z1], [x1, y1, z2], [x1, y2, z2], [x1, y2, z1]);
  addQuad(arr, [x2, y1, z2], [x2, y1, z1], [x2, y2, z1], [x2, y2, z2]);
}

export function addCone(arr: number[], apex: number[], baseCenter: number[], radius: number, segments: number) {
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;
    const p1 = [baseCenter[0] + Math.cos(a1) * radius, baseCenter[1], baseCenter[2] + Math.sin(a1) * radius];
    const p2 = [baseCenter[0] + Math.cos(a2) * radius, baseCenter[1], baseCenter[2] + Math.sin(a2) * radius];
    addTri(arr, p1, p2, apex);
    addTri(arr, baseCenter, p2, p1);
  }
}

export function addCylinder(arr: number[], y1: number, y2: number, r1: number, r2: number, segments: number) {
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;
    const p1 = [Math.cos(a1) * r1, y1, Math.sin(a1) * r1];
    const p2 = [Math.cos(a2) * r1, y1, Math.sin(a2) * r1];
    const p3 = [Math.cos(a2) * r2, y2, Math.sin(a2) * r2];
    const p4 = [Math.cos(a1) * r2, y2, Math.sin(a1) * r2];
    addQuad(arr, p1, p2, p3, p4);
  }
}

// -----------------------------------------------------------------------------
// PROGRESSIVE INTERMEDIATE STEP GENERATORS
// Renders the authentic mathematical origami fold at steps 0, 1, 2, 3
// -----------------------------------------------------------------------------
function buildStepBaseGeometry(vertices: number[], id: string, stepIdx: number, f: number) {
  // ---------------------------------------------------------------------------
  // 1. SPECIFIC STEP SCULPTORS FOR SIGNATURE KITS
  // ---------------------------------------------------------------------------

  // festival-02: Halloween Vampire Bat
  if (id === 'festival-02') {
    const w = 1.6;
    if (stepIdx === 0) {
      // Step 1: Diagonal Triangle & Forward Head Crimp
      addTri(vertices, [-w, -0.4, 0], [w, -0.4, 0], [0, 0.9, 0.1]);
      addTri(vertices, [-w, -0.4, -0.04], [0, 0.9, 0.06], [w, -0.4, -0.04]);
      addTri(vertices, [-w, -0.4, 0], [0, 0.9, 0.1], [-w * 0.5, 0.2, 0.05]);
      addTri(vertices, [w, -0.4, 0], [w * 0.5, 0.2, 0.05], [0, 0.9, 0.1]);
      const snoutY = 0.9 - 0.55 * f;
      const snoutZ = 0.1 + 0.45 * f;
      addTri(vertices, [-0.28, 0.85, 0.1], [0.28, 0.85, 0.1], [0, snoutY, snoutZ]);
      addTri(vertices, [-0.28, 0.85, 0.1], [0, snoutY, snoutZ], [-0.15, snoutY + 0.1, snoutZ - 0.15]);
      addTri(vertices, [0.28, 0.85, 0.1], [0.15, snoutY + 0.1, snoutZ - 0.15], [0, snoutY, snoutZ]);
      return;
    } else if (stepIdx === 1) {
      // Step 2: Pointed Ear Reverse Folds
      addTri(vertices, [-w, -0.35, 0], [w, -0.35, 0], [0, 0.75, 0.15]);
      addTri(vertices, [-w, -0.35, -0.04], [0, 0.75, 0.11], [w, -0.35, -0.04]);
      addTri(vertices, [-0.25, 0.75, 0.15], [0.25, 0.75, 0.15], [0, 0.35, 0.55]);
      const earH = 0.75 + 0.65 * f;
      addTri(vertices, [-0.28, 0.65, 0.15], [-0.08, 0.75, 0.22], [-0.38 * f, earH, 0.15]);
      addTri(vertices, [-0.28, 0.65, 0.15], [-0.38 * f, earH, 0.15], [-0.42 * f, 0.65, 0.08]);
      addTri(vertices, [0.08, 0.75, 0.22], [0.28, 0.65, 0.15], [0.38 * f, earH, 0.15]);
      addTri(vertices, [0.28, 0.65, 0.15], [0.42 * f, 0.65, 0.08], [0.38 * f, earH, 0.15]);
      addTri(vertices, [-w, -0.35, -0.15 * f], [0, -0.35, 0], [0, 0.75, 0.15]);
      addTri(vertices, [w, -0.35, -0.15 * f], [0, 0.75, 0.15], [0, -0.35, 0]);
      return;
    } else if (stepIdx === 2) {
      // Step 3: Wing Strut Accordion Pleats (3 finger bones)
      addTri(vertices, [-0.25, 0.65, 0.15], [0.25, 0.65, 0.15], [0, 0.3, 0.55]);
      addTri(vertices, [-0.25, 0.65, 0.15], [-0.35, 1.35, 0.15], [-0.08, 0.72, 0.2]);
      addTri(vertices, [0.08, 0.72, 0.2], [0.35, 1.35, 0.15], [0.25, 0.65, 0.15]);
      const pleatDepth = 0.25 * f;
      const b1L = [-0.75, 0.75 * f, pleatDepth];
      const tr1L = [-0.85, 0.45 * f, -pleatDepth * 0.5];
      const b2L = [-1.45 * f, 0.45 * f, pleatDepth * 1.2];
      const tr2L = [-1.25 * f, -0.15 * f, -pleatDepth * 0.5];
      const b3L = [-1.65 * f, -0.45 * f, pleatDepth * 0.8];
      const rootL = [-0.2, 0.4, 0.1];
      const baseL = [0, -0.4, 0];

      addTri(vertices, rootL, b1L, tr1L);
      addTri(vertices, rootL, tr1L, b2L);
      addTri(vertices, tr1L, b2L, tr2L);
      addTri(vertices, tr1L, tr2L, b3L);
      addTri(vertices, baseL, rootL, tr2L);
      addTri(vertices, baseL, tr2L, b3L);

      const b1R = [0.75, 0.75 * f, pleatDepth];
      const tr1R = [0.85, 0.45 * f, -pleatDepth * 0.5];
      const b2R = [1.45 * f, 0.45 * f, pleatDepth * 1.2];
      const tr2R = [1.25 * f, -0.15 * f, -pleatDepth * 0.5];
      const b3R = [1.65 * f, -0.45 * f, pleatDepth * 0.8];
      const rootR = [0.2, 0.4, 0.1];

      addTri(vertices, rootR, tr1R, b1R);
      addTri(vertices, rootR, b2R, tr1R);
      addTri(vertices, tr1R, tr2R, b2R);
      addTri(vertices, tr1R, b3R, tr2R);
      addTri(vertices, baseL, tr2R, rootR);
      addTri(vertices, baseL, b3R, tr2R);
      return;
    } else if (stepIdx === 3) {
      // Step 4: Scalloped Wing Trailing Edge & Thumb Claws
      addTri(vertices, [-0.25, 0.65, 0.15], [0.25, 0.65, 0.15], [0, 0.3, 0.55]);
      addTri(vertices, [-0.25, 0.65, 0.15], [-0.35, 1.35, 0.15], [-0.08, 0.72, 0.2]);
      addTri(vertices, [0.08, 0.72, 0.2], [0.35, 1.35, 0.15], [0.25, 0.65, 0.15]);
      addTri(vertices, [-0.75, 0.75, 0.25], [-0.9, 0.95 * f, 0.35 * f], [-0.65, 0.8, 0.2]);
      addTri(vertices, [0.65, 0.8, 0.2], [0.9, 0.95 * f, 0.35 * f], [0.75, 0.75, 0.25]);

      const b1L = [-0.75, 0.75, 0.25], b2L = [-1.45, 0.45, 0.3], b3L = [-1.65, -0.45, 0.2];
      const s1L = [-1.15, 0.25 - 0.2 * f, 0.05];
      const s2L = [-1.45, -0.15 - 0.25 * f, 0.05];
      const rootL = [-0.2, 0.4, 0.1], baseC = [0, -0.45, 0];

      addTri(vertices, rootL, b1L, s1L);
      addTri(vertices, rootL, s1L, b2L);
      addTri(vertices, s1L, b2L, s2L);
      addTri(vertices, s2L, b2L, b3L);
      addTri(vertices, baseC, rootL, s2L);
      addTri(vertices, baseC, s2L, b3L);

      const b1R = [0.75, 0.75, 0.25], b2R = [1.45, 0.45, 0.3], b3R = [1.65, -0.45, 0.2];
      const s1R = [1.15, 0.25 - 0.2 * f, 0.05];
      const s2R = [1.45, -0.15 - 0.25 * f, 0.05];
      const rootR = [0.2, 0.4, 0.1];

      addTri(vertices, rootR, s1R, b1R);
      addTri(vertices, rootR, b2R, s1R);
      addTri(vertices, s1R, s2R, b2R);
      addTri(vertices, s2R, b3R, b2R);
      addTri(vertices, baseC, s2R, rootR);
      addTri(vertices, baseC, b3R, s2R);
      return;
    }
  }

  // indian-01: Mayura — Imperial Indian Peacock
  if (id === 'indian-01') {
    if (stepIdx === 0) {
      // Step 1: Elongated Bird Base Diamond with 4 independent flaps
      const w = 0.85, h = 1.45, lift = 0.5 * f;
      addTri(vertices, [0, -h, 0], [w, 0, lift], [0, 0, lift * 1.3]);
      addTri(vertices, [0, -h, 0], [0, 0, lift * 1.3], [-w, 0, lift]);
      addTri(vertices, [0, h, 0], [-w, 0, lift], [0, 0, lift * 1.3]);
      addTri(vertices, [0, h, 0], [0, 0, lift * 1.3], [w, 0, lift]);
      addTri(vertices, [0, -h, -0.06], [-w, 0, -lift * 0.5], [0, 0, -lift]);
      addTri(vertices, [0, -h, -0.06], [0, 0, -lift], [w, 0, -lift * 0.5]);
      addTri(vertices, [0, h, -0.06], [0, 0, -lift], [-w, 0, -lift * 0.5]);
      addTri(vertices, [0, h, -0.06], [w, 0, -lift * 0.5], [0, 0, -lift]);
      return;
    } else if (stepIdx === 1) {
      // Step 2: Articulated S-Curve Neck & Head (Double Inside Reverse Fold)
      const w = 0.7, h = 1.2;
      addTri(vertices, [0, -h, 0], [w, 0, 0.2], [0, 0, 0.3]);
      addTri(vertices, [0, -h, 0], [0, 0, 0.3], [-w, 0, 0.2]);
      const neckY = 0.5 + 0.85 * f, neckZ = 0.3 + 0.65 * f;
      addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
      const headY = neckY + 0.25 * f, headZ = neckZ + 0.45 * f;
      addTri(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, headY, headZ]);
      addTri(vertices, [-0.08, neckY + 0.05, neckZ], [0.08, neckY + 0.05, neckZ], [0, headY - 0.15, headZ + 0.2 * f]);
      return;
    } else if (stepIdx === 2) {
      // Step 3: Crown Kalgi Crest Squash
      const w = 0.7, h = 1.2, neckY = 1.35, neckZ = 0.95;
      addTri(vertices, [0, -h, 0], [w, 0, 0.2], [0, 0, 0.3]);
      addTri(vertices, [0, -h, 0], [0, 0, 0.3], [-w, 0, 0.2]);
      addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
      addTri(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, neckY + 0.25, neckZ + 0.45]);
      const kH = 0.45 * f;
      addTri(vertices, [0, neckY + 0.25, neckZ + 0.45], [-0.25 * f, neckY + 0.25 + kH, neckZ + 0.4], [-0.08, neckY + 0.2, neckZ + 0.45]);
      addTri(vertices, [0, neckY + 0.25, neckZ + 0.45], [0, neckY + 0.25 + kH * 1.2, neckZ + 0.45], [0.05, neckY + 0.2, neckZ + 0.45]);
      addTri(vertices, [0, neckY + 0.25, neckZ + 0.45], [0.25 * f, neckY + 0.25 + kH, neckZ + 0.4], [0.08, neckY + 0.2, neckZ + 0.45]);
      return;
    } else if (stepIdx === 3) {
      // Step 4: Radiant 18-Pleat Fan Tail
      const neckY = 1.35, neckZ = 0.95;
      addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
      addTri(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, neckY + 0.25, neckZ + 0.45]);
      const fanRadius = 1.65 * f;
      const pleats = 18;
      for (let p = 0; p < pleats; p++) {
        const a1 = -Math.PI * 0.75 + (p / pleats) * Math.PI * 1.5;
        const a2 = -Math.PI * 0.75 + ((p + 1) / pleats) * Math.PI * 1.5;
        const r1 = (p % 2 === 0 ? fanRadius : fanRadius * 0.88);
        const r2 = ((p + 1) % 2 === 0 ? fanRadius : fanRadius * 0.88);
        const zOff = (p % 2 === 0 ? 0.12 : -0.12) * f;
        addTri(vertices, [0, -0.2, -0.1], [Math.cos(a1) * r1, Math.sin(a1) * r1 + 0.4, zOff], [Math.cos(a2) * r2, Math.sin(a2) * r2 + 0.4, -zOff]);
      }
      return;
    } else if (stepIdx === 4) {
      // Step 5: Chandrika Eyelet Concavities
      const neckY = 1.35, neckZ = 0.95;
      addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
      addTri(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, neckY + 0.25, neckZ + 0.45]);
      const fanRadius = 1.75;
      const pleats = 18;
      for (let p = 0; p < pleats; p++) {
        const a1 = -Math.PI * 0.75 + (p / pleats) * Math.PI * 1.5;
        const a2 = -Math.PI * 0.75 + ((p + 1) / pleats) * Math.PI * 1.5;
        const aMid = (a1 + a2) / 2;
        const r1 = (p % 2 === 0 ? fanRadius : fanRadius * 0.88);
        const r2 = ((p + 1) % 2 === 0 ? fanRadius : fanRadius * 0.88);
        addTri(vertices, [0, -0.2, -0.1], [Math.cos(a1) * r1, Math.sin(a1) * r1 + 0.4, 0.05], [Math.cos(a2) * r2, Math.sin(a2) * r2 + 0.4, -0.05]);
        addTri(vertices, [Math.cos(a1) * r1, Math.sin(a1) * r1 + 0.4, 0.05], [Math.cos(aMid) * (r1 + 0.25 * f), Math.sin(aMid) * (r1 + 0.25 * f) + 0.4, 0.25 * f], [Math.cos(a2) * r2, Math.sin(a2) * r2 + 0.4, -0.05]);
      }
      return;
    }
  }

  // japanese-01: Orizuru — Classical Peace Crane
  if (id === 'japanese-01') {
    if (stepIdx === 0) {
      // Step 1: Diagonal Foundation (The Giant Taco Fold)
      // Flat square paper sheet where the top-left triangle physically rotates over the diagonal crease onto the bottom-right triangle!
      const w = 1.2;
      const angle = Math.PI * f;
      const pTL_rot: [number, number, number] = [
        -w * Math.cos(angle),
        w * Math.cos(angle),
        w * Math.SQRT2 * Math.sin(angle) + 0.012 * f
      ];
      // Stationary Bottom-Right triangle
      addTri(vertices, [-w, -w, 0], [w, -w, 0], [w, w, 0]);
      // Folding Top-Left triangle rotating around diagonal axis (-w, -w) to (w, w)
      addTri(vertices, [-w, -w, 0], [w, w, 0], pTL_rot);
      return;
    } else if (stepIdx === 1) {
      // Step 2: Preliminary Square Base Collapse
      // The triangle collapses into the 4-flap diamond preliminary base
      const s = 1.1;
      const angle = Math.PI * f;
      const lift = Math.sin(f * Math.PI * 0.5) * 0.45;
      addTri(vertices, [-s, 0, 0], [0, -s, 0], [0, 0, lift]);
      addTri(vertices, [0, -s, 0], [s, 0, 0], [0, 0, lift]);
      const flapL: [number, number, number] = [-s * Math.cos(angle * 0.5), 0, Math.sin(angle * 0.5) * s * 0.6];
      const flapR: [number, number, number] = [s * Math.cos(angle * 0.5), 0, Math.sin(angle * 0.5) * s * 0.6];
      addTri(vertices, [-s, 0, 0], flapL, [0, s, 0]);
      addTri(vertices, [s, 0, 0], [0, s, 0], flapR);
      addTri(vertices, flapL, [0, s, 0], [0, 0, lift]);
      addTri(vertices, flapR, [0, 0, lift], [0, s, 0]);
      return;
    } else if (stepIdx === 2) {
      // Step 3: Bilateral Petal Folds into Bird Base
      const pLen = 1.45;
      const sideW = 0.65 * (1 - f * 0.3);
      addTri(vertices, [-sideW, 0, 0.05], [sideW, 0, 0.05], [0, pLen * f, 0.35 * f]);
      addTri(vertices, [-sideW, 0, -0.05], [0, -pLen * f, -0.35 * f], [sideW, 0, -0.05]);
      addTri(vertices, [-sideW, 0, 0], [0, pLen * 0.6, 0.4 * f], [0, 0, 0.3 * f]);
      addTri(vertices, [sideW, 0, 0], [0, 0, 0.3 * f], [0, pLen * 0.6, 0.4 * f]);
      return;
    } else if (stepIdx === 3) {
      // Step 4: Slender Leg Inversion & Axial Narrowing
      const chest = 0.35 * f;
      addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.3, chest], [-0.15, 0.3, chest]);
      addTri(vertices, [-0.15, 0.3, chest], [0.15, 0.3, chest], [0, 0.3 + 0.9 * f, chest + 0.7 * f]);
      addTri(vertices, [-0.15, -0.5, 0], [0.15, -0.5, 0], [0, -0.5 - 0.9 * f, -0.3 * f]);
      addTri(vertices, [-0.15, 0.3, chest], [-0.9 * (1 - f * 0.2), 0.1, -0.1], [-0.2, -0.5, 0]);
      addTri(vertices, [0.15, 0.3, chest], [0.2, -0.5, 0], [0.9 * (1 - f * 0.2), 0.1, -0.1]);
      return;
    } else if (stepIdx === 4 || stepIdx === 5) {
      // Step 5 & 6: Neck & Tail Reverse Folds, Beak Crimp & Wing Flaring
      const chest = 0.45;
      addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.3, chest], [-0.15, 0.3, chest]);
      addTri(vertices, [-0.12, 0.3, chest], [0.12, 0.3, chest], [0, 1.1, chest + 0.8]);
      addTri(vertices, [-0.08, 1.1, chest + 0.8], [0.08, 1.1, chest + 0.8], [0, 1.25 - 0.25 * f, chest + 0.8 + 0.35 * f]);
      const wingFlare = 1.35 * f;
      addTri(vertices, [-0.15, 0.3, chest], [-1.45 * f, 0.2 + wingFlare * 0.4, -0.1], [-0.2, -0.5, 0]);
      addTri(vertices, [0.15, 0.3, chest], [0.2, -0.5, 0], [1.45 * f, 0.2 + wingFlare * 0.4, -0.1]);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. GENERAL ORIGAMI LINEAGES (High-Dimensional Multi-Flap Bases)
  // ---------------------------------------------------------------------------
  const isBird = id.includes('crane') || id.includes('peacock') || id.includes('japanese-01') || id.includes('indian-01') || id.includes('american-01') || id.includes('chinese-04') || id.includes('nativity-03');
  const isHelmet = id.includes('kabuto') || id.includes('japanese-02') || id.includes('crown') || id.includes('indian-06') || id.includes('calavera') || id.includes('festival-04');
  const isQuadruped = id.includes('elephant') || id.includes('indian-02') || id.includes('tiger') || id.includes('indian-03') || id.includes('bison') || id.includes('american-02') || id.includes('donkey') || id.includes('nativity-09') || id.includes('rabbit') || id.includes('chinese-05');
  const isKinetic = id.includes('frog') || id.includes('american-03') || id.includes('beetle') || id.includes('american-04') || id.includes('bat') || id.includes('festival-02');
  const isBotanical = id.includes('lotus') || id.includes('sakura') || id.includes('japanese-03') || id.includes('flower') || id.includes('indian-04') || id.includes('butterfly');

  if (stepIdx === 0) {
    // -------------------------------------------------------------------------
    // STEP 1: FOUNDATIONAL BASES
    // -------------------------------------------------------------------------
    if (isBird) {
      // Step 1: True Diagonal Sheet Fold (Giant Taco Fold)
      const w = 1.2;
      const angle = Math.PI * f;
      const pTL_rot: [number, number, number] = [
        -w * Math.cos(angle),
        w * Math.cos(angle),
        w * Math.SQRT2 * Math.sin(angle) + 0.012 * f
      ];
      addTri(vertices, [-w, -w, 0], [w, -w, 0], [w, w, 0]);
      addTri(vertices, [-w, -w, 0], [w, w, 0], pTL_rot);
    } else if (isHelmet) {
      // Diagonal Triangle & Blintz Corner Folds
      const span = 1.45;
      const drop = -0.85 * f;
      addTri(vertices, [-span, 0.4, 0], [span, 0.4, 0], [0, drop, 0.2 * f]);
      addTri(vertices, [-span, 0.4, 0], [0, drop, 0.2 * f], [-span * 0.5 * (1 - f * 0.5), drop * 0.5, 0.3 * f]);
      addTri(vertices, [span, 0.4, 0], [span * 0.5 * (1 - f * 0.5), drop * 0.5, 0.3 * f], [0, drop, 0.2 * f]);
    } else if (isQuadruped) {
      // Blintz Square Foundation: 4 corners folded to center
      const s = 1.0;
      const c = 0.55 * f;
      addTri(vertices, [-s, -s, 0], [0, -c, 0.1 * f], [-s, s, 0]);
      addTri(vertices, [-s, s, 0], [-c, 0, 0.1 * f], [s, s, 0]);
      addTri(vertices, [s, s, 0], [0, c, 0.1 * f], [s, -s, 0]);
      addTri(vertices, [s, -s, 0], [c, 0, 0.1 * f], [-s, -s, 0]);
    } else if (isKinetic) {
      // Waterbomb Triangle Collapse Base
      const w = 1.35;
      const h = 0.85;
      const foldZ = 0.55 * f;
      addTri(vertices, [-w, -0.4, 0], [w, -0.4, 0], [0, h * f, foldZ]);
      addTri(vertices, [-w * 0.5, -0.4, -foldZ], [w * 0.5, -0.4, -foldZ], [0, h * f, foldZ]);
    } else if (isBotanical) {
      // Radial Octagonal Pre-Creased Calyx Disc
      const rad = 1.35;
      for (let i = 0; i < 8; i++) {
        const a1 = (i / 8) * Math.PI * 2;
        const a2 = ((i + 1) / 8) * Math.PI * 2;
        const dip = (i % 2 === 0 ? 0.3 : -0.2) * f;
        addTri(vertices, [0, 0, dip], [Math.cos(a1) * rad, Math.sin(a1) * rad, 0], [Math.cos(a2) * rad, Math.sin(a2) * rad, 0]);
      }
    } else {
      // Architectural Platform Base
      const bW = 1.35;
      addBox(vertices, -bW, bW, -0.2, 0.1 * f, -0.9, 0.9);
      addTri(vertices, [-bW, 0.1 * f, -0.9], [bW, 0.1 * f, -0.9], [0, 0.8 * f, 0]);
    }
  } else if (stepIdx === 1) {
    // -------------------------------------------------------------------------
    // STEP 2: PETAL FOLDS, SQUASHES & APEX ELEVATIONS
    // -------------------------------------------------------------------------
    if (isBird) {
      // Bilateral Petal Fold into Elongated Bird Base Diamond
      const pLen = 1.55 * (0.5 + 0.5 * f);
      const sideW = 0.55 * (1 - f * 0.35);
      addTri(vertices, [-sideW, 0, 0], [sideW, 0, 0], [0, pLen, 0.2 * f]);
      addTri(vertices, [-sideW, 0, 0], [0, -pLen, -0.2 * f], [sideW, 0, 0]);
      addTri(vertices, [-sideW, 0, 0], [0, pLen * 0.6, 0.4 * f], [0, 0, 0.3 * f]);
      addTri(vertices, [sideW, 0, 0], [0, 0, 0.3 * f], [0, pLen * 0.6, 0.4 * f]);
    } else if (isHelmet) {
      // Apex Elevation Fold
      const r = 0.95;
      const h = 0.65 * f;
      addTri(vertices, [-r, -0.2, 0], [r, -0.2, 0], [0, h, 0.3 * f]);
      addTri(vertices, [-r * 0.6, -0.2, 0.2], [-r * 0.9, h * 0.8, 0.4 * f], [0, 0, 0.2]);
      addTri(vertices, [r * 0.6, -0.2, 0.2], [0, 0, 0.2], [r * 0.9, h * 0.8, 0.4 * f]);
    } else if (isQuadruped) {
      // 4-Leg Flap Squash Separation
      const w = 0.75;
      addBox(vertices, -w, w, -0.3, 0.3 * f, -w, w);
      addTri(vertices, [-w, -0.3, w], [-w * 1.3 * f, -0.6 * f, w * 1.3 * f], [-w * 0.5, -0.3, w]);
      addTri(vertices, [w, -0.3, w], [w * 0.5, -0.3, w], [w * 1.3 * f, -0.6 * f, w * 1.3 * f]);
    } else if (isKinetic) {
      // Front Leg Flaring
      const bW = 0.85;
      addQuad(vertices, [-bW, -0.2, -0.6], [bW, -0.2, -0.6], [bW * 0.7, 0.2, 0.4], [-bW * 0.7, 0.2, 0.4]);
      addTri(vertices, [-bW * 0.7, 0.2, 0.4], [-bW * 1.4 * f, 0.3 * f, 0.7 * f], [-bW * 0.2, 0.2, 0.4]);
      addTri(vertices, [bW * 0.2, 0.2, 0.4], [bW * 1.4 * f, 0.3 * f, 0.7 * f], [bW * 0.7, 0.2, 0.4]);
    } else if (isBotanical) {
      // Calyx Pocket Collapse into 8-Petal Rosette
      const rad = 1.25;
      for (let i = 0; i < 8; i++) {
        const a1 = (i / 8) * Math.PI * 2;
        const a2 = ((i + 1) / 8) * Math.PI * 2;
        const aMid = (a1 + a2) / 2;
        addTri(vertices, [0, -0.2, 0], [Math.cos(a1) * rad * 0.5, -0.2, Math.sin(a1) * rad * 0.5], [Math.cos(aMid) * rad, 0.2 * f, Math.sin(aMid) * rad]);
        addTri(vertices, [0, -0.2, 0], [Math.cos(aMid) * rad, 0.2 * f, Math.sin(aMid) * rad], [Math.cos(a2) * rad * 0.5, -0.2, Math.sin(a2) * rad * 0.5]);
      }
    } else {
      // Angled Wall Elevation
      const span = 1.25;
      const wallH = 0.85 * f;
      addQuad(vertices, [-span, 0, -0.6], [span, 0, -0.6], [span, wallH, -0.6], [-span, wallH, -0.6]);
      addQuad(vertices, [-span, 0, -0.6], [-span, wallH, -0.6], [-span * 0.6, wallH, 0.6], [-span * 0.6, 0, 0.6]);
      addQuad(vertices, [span, 0, -0.6], [span * 0.6, 0, 0.6], [span * 0.6, wallH, 0.6], [span, wallH, -0.6]);
    }
  } else if (stepIdx === 2) {
    // -------------------------------------------------------------------------
    // STEP 3: TAPERING, HORN FLARES & TORSO BOX FORMATION
    // -------------------------------------------------------------------------
    if (isBird) {
      // Slender Leg & Neck Shaft Tapering
      const pLen = 1.65;
      const chest = 0.35 * f;
      addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.3, chest], [-0.15, 0.3, chest]);
      addQuad(vertices, [-0.15, 0.3, chest], [-0.8 * (1 - f * 0.3), 0.1, -0.1], [-0.5, -0.3, -0.1], [-0.2, -0.5, 0]);
      addQuad(vertices, [0.15, 0.3, chest], [0.2, -0.5, 0], [0.5, -0.3, -0.1], [0.8 * (1 - f * 0.3), 0.1, -0.1]);
      addTri(vertices, [-0.1, 0.3, chest], [0.1, 0.3, chest], [0, pLen * 0.7 * f, 0.3]);
      addTri(vertices, [-0.1, -0.5, 0], [0.1, -0.5, 0], [0, -pLen * 0.7 * f, -0.2]);
    } else if (isHelmet) {
      // Kuwagata Crest Horns Flaring Outward
      const r = 0.95;
      const h = 0.75 * f;
      addCone(vertices, [0, h, 0], [0, -0.2, 0], r * 0.9, 8);
      addTri(vertices, [-0.2, 0.2, r * 0.7], [-0.1, 0.2, r * 0.7], [-0.75 * f, 0.4 + 0.9 * f, r * 0.4]);
      addTri(vertices, [0.1, 0.2, r * 0.7], [0.2, 0.2, r * 0.7], [0.75 * f, 0.4 + 0.9 * f, r * 0.4]);
    } else if (isQuadruped) {
      // Torso Box Formation with 4 Downward Legs
      const w = 0.5, h = 0.4, l = 0.75;
      const legDrop = -0.55 * f;
      addBox(vertices, -w, w, -h, h, -l, l);
      addBox(vertices, -w, -w * 0.5, -h + legDrop, -h, l * 0.4, l * 0.8);
      addBox(vertices, w * 0.5, w, -h + legDrop, -h, l * 0.4, l * 0.8);
      addBox(vertices, -w, -w * 0.5, -h + legDrop, -h, -l * 0.8, -l * 0.4);
      addBox(vertices, w * 0.5, w, -h + legDrop, -h, -l * 0.8, -l * 0.4);
    } else if (isKinetic) {
      // Rear Haunch Tapering & Elytra Wing Covers
      const bW = 0.75, bL = 0.85;
      addBox(vertices, -bW * 0.8, bW * 0.8, -0.2, 0.2, -bL * 0.8, bL * 0.4);
      addTri(vertices, [-bW, -0.2, -bL], [-bW * 0.8, 0.2, bL * 0.4], [-bW * 1.3 * f, 0.1, 0]);
      addTri(vertices, [bW, -0.2, -bL], [bW * 1.3 * f, 0.1, 0], [bW * 0.8, 0.2, bL * 0.4]);
    } else if (isBotanical) {
      // Tier 1 Blooming Sepal Extrusions
      for (let p = 0; p < 8; p++) {
        const a1 = (p / 8) * Math.PI * 2;
        const a2 = ((p + 1) / 8) * Math.PI * 2;
        const aMid = (a1 + a2) / 2;
        const pR = 1.35 * (0.6 + 0.4 * f);
        addTri(vertices, [0, -0.2, 0], [Math.cos(a1) * pR * 0.4, -0.2, Math.sin(a1) * pR * 0.4], [Math.cos(aMid) * pR, 0.3 * f, Math.sin(aMid) * pR]);
        addTri(vertices, [0, -0.2, 0], [Math.cos(aMid) * pR, 0.3 * f, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.4, -0.2, Math.sin(a2) * pR * 0.4]);
      }
    } else {
      // Gabled Roof Slopes
      const roofSpan = 1.3;
      const roofH = 1.05 * f;
      addQuad(vertices, [-roofSpan, 0, -0.7], [0, roofH, -0.7], [0, roofH, 0.7], [-roofSpan, 0, 0.7]);
      addQuad(vertices, [0, roofH, -0.7], [roofSpan, 0, -0.7], [roofSpan, 0, 0.7], [0, roofH, 0.7]);
    }
  } else if (stepIdx === 3) {
    // -------------------------------------------------------------------------
    // STEP 4: REVERSE FOLDS, ARTICULATION & PLEATS
    // -------------------------------------------------------------------------
    if (isBird) {
      // Neck and Tail Reverse Folds
      const chestPuff = 0.5 * f;
      const neckAngle = 1.15 * f;
      const S = 1.45;
      addQuad(vertices, [-0.2, -0.6, 0], [0.2, -0.6, 0], [0.15, 0.4, chestPuff], [-0.15, 0.4, chestPuff]);
      addQuad(vertices, [-0.15, 0.4, chestPuff], [-S * 0.8, 0.2, -0.1], [-S * 0.6, -0.3, -0.1], [-0.2, -0.6, 0]);
      addQuad(vertices, [0.15, 0.4, chestPuff], [0.2, -0.6, 0], [S * 0.6, -0.3, -0.1], [S * 0.8, 0.2, -0.1]);
      // Arched inverted neck & tail
      addQuad(vertices, [-0.1, 0.4, chestPuff], [0.1, 0.4, chestPuff], [0.05, 0.9 + f * 0.3, chestPuff + neckAngle], [-0.05, 0.9 + f * 0.3, chestPuff + neckAngle]);
      addQuad(vertices, [-0.15, -0.6, 0], [0.15, -0.6, 0], [0.08, -1.1 - f * 0.2, -0.2], [-0.08, -1.1 - f * 0.2, -0.2]);
    } else if (isHelmet) {
      // Brow Rim & Layered Shikoro Neck Guards
      const r = 0.95;
      const h = 0.85 * f;
      addCone(vertices, [0, h, 0], [0, -0.25, 0], r, 10);
      addTri(vertices, [-0.2, 0.2, r * 0.8], [-0.1, 0.2, r * 0.8], [-0.75 * f, 0.4 + 1.2 * f, r * 0.5]);
      addTri(vertices, [0.1, 0.2, r * 0.8], [0.2, 0.2, r * 0.8], [0.75 * f, 0.4 + 1.2 * f, r * 0.5]);
      addQuad(vertices, [-r * 0.9, -0.25, 0], [-r * 1.25 * f, -0.6 * f, 0.3], [-r * 1.05 * f, -0.6 * f, -0.3], [-r * 0.9, -0.25, -0.3]);
      addQuad(vertices, [r * 0.9, -0.25, -0.3], [r * 1.05 * f, -0.6 * f, -0.3], [r * 1.25 * f, -0.6 * f, 0.3], [r * 0.9, -0.25, 0]);
    } else if (isQuadruped) {
      // Limb Articulation & Trunk / Head Reverse Fold
      const w = 0.55, h = 0.48, l = 0.8;
      const legDrop = -0.62 * f;
      addBox(vertices, -w, w, -h, h, -l, l);
      addBox(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, l * 0.3, l * 0.8);
      addBox(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, l * 0.3, l * 0.8);
      addBox(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, -l * 0.8, -l * 0.3);
      addBox(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, -l * 0.8, -l * 0.3);
      addQuad(vertices, [-0.2, h, l], [0.2, h, l], [0.15, h + 0.3 * f, l + 0.45 * f], [-0.15, h + 0.3 * f, l + 0.45 * f]);
    } else if (isKinetic) {
      // Elastic Spring Z-Pleat Bellows
      const bW = 0.75 * f, bL = 0.9 * f;
      addQuad(vertices, [-bW, -0.15, -bL], [bW, -0.15, -bL], [bW * 0.6, 0.25, bL * 0.4], [-bW * 0.6, 0.25, bL * 0.4]);
      const zExt = 0.75 * f;
      addQuad(vertices, [-bW, -0.15, -bL], [-bW * 0.5, -0.15, -bL], [-bW * 1.3 * f, -0.35, -bL - zExt], [-bW * 1.6 * f, -0.35, -bL - zExt]);
      addQuad(vertices, [bW * 0.5, -0.15, -bL], [bW, -0.15, -bL], [bW * 1.6 * f, -0.35, -bL - zExt], [bW * 1.3 * f, -0.35, -bL - zExt]);
    } else if (isBotanical) {
      // Tier 2 Petal Bloom & Golden Stamen
      for (let t = 0; t < 2; t++) {
        const petals = 8, pR = (1.3 - t * 0.3) * f, pH = (0.2 + t * 0.3) * f;
        for (let p = 0; p < petals; p++) {
          const a1 = (p / petals) * Math.PI * 2;
          const a2 = ((p + 1) / petals) * Math.PI * 2;
          const aMid = (a1 + a2) / 2;
          addTri(vertices, [0, -0.25, 0], [Math.cos(a1) * pR * 0.35, -0.25, Math.sin(a1) * pR * 0.35], [Math.cos(aMid) * pR, -0.25 + pH, Math.sin(aMid) * pR]);
          addTri(vertices, [0, -0.25, 0], [Math.cos(aMid) * pR, -0.25 + pH, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.35, -0.25, Math.sin(a2) * pR * 0.35]);
        }
      }
    } else {
      // Thatch Roof Layers & Alcove
      const roofSpan = 1.35;
      const roofH = 1.25 * f;
      addQuad(vertices, [-roofSpan, 0, -0.8], [0, roofH, -0.8], [0, roofH, 0.8], [-roofSpan, 0, 0.8]);
      addQuad(vertices, [0, roofH, -0.8], [roofSpan, 0, -0.8], [roofSpan, 0, 0.8], [0, roofH, 0.8]);
      addQuad(vertices, [-roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, 0, -0.75], [-roofSpan * 0.9, 0, -0.75]);
    }
  } else if (stepIdx === 4) {
    // -------------------------------------------------------------------------
    // STEP 5: SECONDARY ACCORDION PLEATING & FEATHER/LIMB SCULPTING
    // -------------------------------------------------------------------------
    if (isBird) {
      // Full Fan Wing Flutes & Tail Fan
      const span = 1.6 * f;
      const pleats = 6;
      for (let p = 0; p < pleats; p++) {
        const xA = -span + (p / pleats) * (span * 2);
        const xB = -span + ((p + 1) / pleats) * (span * 2);
        const zP = (p % 2 === 0 ? 0.25 : -0.25) * f;
        addTri(vertices, [0, 0.3, 0.5], [xA, -0.3 + 0.5 * f, zP], [xB, -0.3 + 0.5 * f, -zP]);
      }
      addTri(vertices, [-0.1, 0.4, 0.5], [0.1, 0.4, 0.5], [0, 1.3 * f, 0.8 * f]);
    } else if (isQuadruped) {
      // Paws, Claws & Back Arch
      const w = 0.55, h = 0.52, l = 0.85;
      addBox(vertices, -w, w, -h, h * 1.1, -l, l);
      // Paws
      addBox(vertices, -w * 0.9, -w * 0.4, -h - 0.75 * f, -h, l * 0.4, l * 0.85);
      addBox(vertices, w * 0.4, w * 0.9, -h - 0.75 * f, -h, l * 0.4, l * 0.85);
      addBox(vertices, -w * 0.9, -w * 0.4, -h - 0.75 * f, -h, -l * 0.85, -l * 0.4);
      addBox(vertices, w * 0.4, w * 0.9, -h - 0.75 * f, -h, -l * 0.85, -l * 0.4);
    } else if (isBotanical) {
      // 3-Tier Layered Petals
      for (let t = 0; t < 3; t++) {
        const petals = 8, pR = (1.4 - t * 0.25) * f, pH = (0.3 + t * 0.35) * f;
        for (let p = 0; p < petals; p++) {
          const a1 = (p / petals) * Math.PI * 2;
          const a2 = ((p + 1) / petals) * Math.PI * 2;
          const aMid = (a1 + a2) / 2;
          addTri(vertices, [0, -0.2, 0], [Math.cos(a1) * pR * 0.3, -0.2, Math.sin(a1) * pR * 0.3], [Math.cos(aMid) * pR, -0.2 + pH, Math.sin(aMid) * pR]);
          addTri(vertices, [0, -0.2, 0], [Math.cos(aMid) * pR, -0.2 + pH, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.3, -0.2, Math.sin(a2) * pR * 0.3]);
        }
      }
    } else {
      const w = 1.2 * f;
      addBox(vertices, -w * 0.8, w * 0.8, -0.5, 0.6, -w * 0.6, w * 0.6);
      addTri(vertices, [-w, 0, 0], [w, 0, 0], [0, 1.2 * f, 0.3 * f]);
    }
  } else {
    // -------------------------------------------------------------------------
    // STEP 6+: VOLUMETRIC 3D LOCK, CHEST PUFF & DIHEDRAL LOCK
    // -------------------------------------------------------------------------
    if (isBird) {
      const wingLift = Math.sin(f * Math.PI * 0.5) * 1.25;
      const chestPuff = f * 0.6;
      const S = 1.55;
      addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.4, chestPuff], [-0.15, 0.4, chestPuff]);
      addQuad(vertices, [-0.15, 0.4, chestPuff], [-S, 0.2 + wingLift, -0.2], [-S * 0.8, -0.4 + wingLift, -0.1], [-0.2, -0.5, 0]);
      addQuad(vertices, [0.15, 0.4, chestPuff], [0.2, -0.5, 0], [S * 0.8, -0.4 + wingLift, -0.1], [S, 0.2 + wingLift, -0.2]);
      addTri(vertices, [-0.1, 0.4, chestPuff], [0.1, 0.4, chestPuff], [0, 1.15 + f * 0.2, chestPuff + 0.8]);
      addTri(vertices, [-0.15, -0.5, 0], [0.15, -0.5, 0], [0, -1.2, -0.3]);
    } else if (isQuadruped) {
      const w = 0.6, h = 0.55, l = 0.95;
      addBox(vertices, -w, w, -h, h * 1.2, -l, l);
      addBox(vertices, -w * 0.9, -w * 0.35, -h - 0.85 * f, -h, l * 0.5, l * 0.9);
      addBox(vertices, w * 0.35, w * 0.9, -h - 0.85 * f, -h, l * 0.5, l * 0.9);
      addBox(vertices, -w * 0.9, -w * 0.35, -h - 0.85 * f, -h, -l * 0.9, -l * 0.5);
      addBox(vertices, w * 0.35, w * 0.9, -h - 0.85 * f, -h, -l * 0.9, -l * 0.5);
      addTri(vertices, [-0.25, h, l], [0.25, h, l], [0, h + 0.45 * f, l + 0.6 * f]);
    } else {
      const w = 1.35 * f;
      addBox(vertices, -w * 0.85, w * 0.85, -0.6, 0.7 * f, -w * 0.7, w * 0.7);
      addTri(vertices, [-w, 0.2, 0], [w, 0.2, 0], [0, 1.35 * f, 0.4 * f]);
    }
  }
}

// -----------------------------------------------------------------------------
// MAIN ENTRY: SYNTHESIZE KIT GEOMETRY FOR ANY STEP & FOLD PROGRESS
// -----------------------------------------------------------------------------
export function synthesizeKitStepGeometry(
  kitId: string,
  stepIdx: number,
  totalSteps: number,
  foldProgress: number
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const f = Math.max(0.01, Math.min(1.0, foldProgress));
  const id = (kitId || '').toLowerCase().trim();

  // If viewing an intermediate step (step 0 to totalSteps - 2), render the progressive intermediate folded state!
  if (stepIdx < totalSteps - 1) {
    buildStepBaseGeometry(vertices, id, stepIdx, f);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.center(); // Center at (0, 0, 0) so all intermediate steps align on the plinth
    geo.computeBoundingSphere();
    const radius = geo.boundingSphere ? geo.boundingSphere.radius : 1.0;
    if (radius > 0.05) {
      const targetRadius = 1.35;
      const s = Math.min(1.6, Math.max(0.7, targetRadius / radius));
      geo.scale(s, s, s);
    }
    return geo;
  }

  // ---------------------------------------------------------------------------
  // FINAL STEP (stepIdx === totalSteps - 1): COMPLETE 3D SCULPTURE FOR ALL 62 KITS
  // ---------------------------------------------------------------------------
  if (id === 'japanese-01') {
    // ORIZURU: Classical Japanese Peace Crane (Authentic 24-Facet Sculpted Geometry)
    // Matches physical red origami crane photography with central dorsal pyramid,
    // cambered downward-creased wings, reverse-folded crimped neck & head,
    // upward-tapered tail, and 4 hollow underbelly standing pleats for contact self-shadows.
    const wingSpan = 1.85 * f;
    const wingDroop = -0.18 * f;
    const wingLift = Math.sin(f * Math.PI * 0.5) * 0.45;
    const chestH = 0.38 * f;

    // 1. Central Dorsal Pyramid (Back peak between wings)
    const apex: [number, number, number] = [0, chestH + 0.16, 0.05 * f];
    const dorsalFront: [number, number, number] = [0, chestH - 0.06, 0.34 * f];
    const dorsalRear: [number, number, number] = [0, chestH - 0.08, -0.34 * f];
    const hingeL: [number, number, number] = [-0.32 * f, chestH - 0.04, 0];
    const hingeR: [number, number, number] = [0.32 * f, chestH - 0.04, 0];

    // 4 facets for central pyramid back
    addTri(vertices, apex, dorsalFront, hingeL);
    addTri(vertices, apex, hingeR, dorsalFront);
    addTri(vertices, apex, hingeL, dorsalRear);
    addTri(vertices, apex, dorsalRear, hingeR);

    // 2. Left Wing (Cambered 2-quad / 4-triangle fold)
    const tipL: [number, number, number] = [-wingSpan, 0.22 + wingLift, -0.12 * f];
    const leadL: [number, number, number] = [-wingSpan * 0.52, 0.28 + wingLift * 0.8, 0.18 * f];
    const trailL: [number, number, number] = [-wingSpan * 0.48, 0.08 + wingLift * 0.5 + wingDroop, -0.26 * f];
    addTri(vertices, hingeL, leadL, tipL);
    addTri(vertices, hingeL, tipL, trailL);
    addTri(vertices, dorsalFront, leadL, hingeL);
    addTri(vertices, hingeL, trailL, dorsalRear);

    // 3. Right Wing (Symmetrical cambered fold)
    const tipR: [number, number, number] = [wingSpan, 0.22 + wingLift, -0.12 * f];
    const leadR: [number, number, number] = [wingSpan * 0.52, 0.28 + wingLift * 0.8, 0.18 * f];
    const trailR: [number, number, number] = [wingSpan * 0.48, 0.08 + wingLift * 0.5 + wingDroop, -0.26 * f];
    addTri(vertices, hingeR, tipR, leadR);
    addTri(vertices, hingeR, trailR, tipR);
    addTri(vertices, dorsalFront, hingeR, leadR);
    addTri(vertices, hingeR, dorsalRear, trailR);

    // 4. Volumetric Neck & Reverse-Folded Head / Beak
    const neckBaseW = 0.06 * f;
    const neckMidL: [number, number, number] = [-neckBaseW * 0.7, 0.75 * f, 0.62 * f];
    const neckMidR: [number, number, number] = [neckBaseW * 0.7, 0.75 * f, 0.62 * f];
    const neckTopL: [number, number, number] = [-neckBaseW * 0.5, 1.25 * f, 0.82 * f];
    const neckTopR: [number, number, number] = [neckBaseW * 0.5, 1.25 * f, 0.82 * f];
    addQuad(vertices, [-neckBaseW, chestH - 0.1, 0.32 * f], neckMidL, neckMidR, [neckBaseW, chestH - 0.1, 0.32 * f]);
    addQuad(vertices, neckMidL, neckTopL, neckTopR, neckMidR);
    const beakTip: [number, number, number] = [0, 1.08 * f, 1.12 * f];
    const headCrown: [number, number, number] = [0, 1.34 * f, 0.88 * f];
    addTri(vertices, neckTopL, headCrown, beakTip);
    addTri(vertices, neckTopR, beakTip, headCrown);

    // 5. Upward Slender Tail (Tapering from dorsal rear)
    const tailBaseW = 0.06 * f;
    const tailMidL: [number, number, number] = [-tailBaseW * 0.7, 0.65 * f, -0.65 * f];
    const tailMidR: [number, number, number] = [tailBaseW * 0.7, 0.65 * f, -0.65 * f];
    const tailTip: [number, number, number] = [0, 1.35 * f, -0.98 * f];
    addQuad(vertices, [-tailBaseW, chestH - 0.12, -0.32 * f], tailMidL, tailMidR, [tailBaseW, chestH - 0.12, -0.32 * f]);
    addTri(vertices, tailMidL, tailTip, tailMidR);

    // 6. Hollow Pleated Underbelly & 4 Tabletop Standing Feet
    const footFL: [number, number, number] = [-0.22 * f, -0.42 * f, 0.18 * f];
    const footFR: [number, number, number] = [0.22 * f, -0.42 * f, 0.18 * f];
    const footRL: [number, number, number] = [-0.18 * f, -0.38 * f, -0.18 * f];
    const footRR: [number, number, number] = [0.18 * f, -0.38 * f, -0.18 * f];
    const bellyKeel: [number, number, number] = [0, -0.22 * f, 0];

    addTri(vertices, dorsalFront, footFL, bellyKeel);
    addTri(vertices, dorsalFront, bellyKeel, footFR);
    addTri(vertices, dorsalRear, bellyKeel, footRL);
    addTri(vertices, dorsalRear, footRR, bellyKeel);
    addTri(vertices, hingeL, footRL, footFL);
    addTri(vertices, hingeR, footFR, footRR);
  }
  else if (id === 'japanese-02') {
    // KABUTO: Samurai Warlord Helmet
    const r = 0.95;
    const h = 0.85 * f;
    const hornL = 1.35 * f;
    const facets = 12;
    for (let i = 0; i < facets; i++) {
      const a1 = (i / facets) * Math.PI * 2;
      const a2 = ((i + 1) / facets) * Math.PI * 2;
      addTri(vertices, [Math.cos(a1) * r, -0.3, Math.sin(a1) * r], [Math.cos(a2) * r, -0.3, Math.sin(a2) * r], [0, h, 0]);
    }
    addTri(vertices, [-0.2, 0.2, r * 0.8], [-0.1, 0.2, r * 0.8], [-0.75 * f, 0.4 + hornL, r * 0.5]);
    addTri(vertices, [0.1, 0.2, r * 0.8], [0.2, 0.2, r * 0.8], [0.75 * f, 0.4 + hornL, r * 0.5]);
    addQuad(vertices, [-r * 0.9, -0.3, 0], [-r * 1.35 * f, -0.7 * f, 0.3], [-r * 1.1 * f, -0.7 * f, -0.3], [-r * 0.9, -0.3, -0.4]);
    addQuad(vertices, [r * 0.9, -0.3, -0.4], [r * 1.1 * f, -0.7 * f, -0.3], [r * 1.35 * f, -0.7 * f, 0.3], [r * 0.9, -0.3, 0]);
  }
  else if (id === 'japanese-03') {
    // SAKURA: 5-Petal Cherry Blossom
    const petals = 5;
    const pLen = 1.35 * f;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
      const aLeft = angle - 0.35;
      const aRight = angle + 0.35;
      const center = [0, -0.15 * f, 0];
      const tipL = [Math.cos(aLeft) * pLen, 0.2 * Math.sin(f * Math.PI), Math.sin(aLeft) * pLen];
      const tipR = [Math.cos(aRight) * pLen, 0.2 * Math.sin(f * Math.PI), Math.sin(aRight) * pLen];
      const notch = [Math.cos(angle) * (pLen * 0.82), 0.1 * f, Math.sin(angle) * (pLen * 0.82)];
      addTri(vertices, center, tipL, notch);
      addTri(vertices, center, notch, tipR);
    }
  }
  else if (id === 'japanese-04') {
    // MINOGAME: Sacred Longevity Tortoise
    const cRadius = 0.95;
    const cHeight = 0.45 * f;
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      addTri(vertices, [Math.cos(a1) * cRadius, -0.2, Math.sin(a1) * cRadius], [Math.cos(a2) * cRadius, -0.2, Math.sin(a2) * cRadius], [0, cHeight, 0]);
    }
    addTri(vertices, [-0.2, -0.1, cRadius], [0.2, -0.1, cRadius], [0, 0.2 * f, cRadius + 0.55 * f]);
    addTri(vertices, [-cRadius * 0.8, -0.2, cRadius * 0.5], [-cRadius * 1.4 * f, -0.3, cRadius * 0.7 * f], [-cRadius * 0.9, -0.2, 0]);
    addTri(vertices, [cRadius * 0.9, -0.2, 0], [cRadius * 1.4 * f, -0.3, cRadius * 0.7 * f], [cRadius * 0.8, -0.2, cRadius * 0.5]);
    for (let k = 0; k < 7; k++) {
      const aT = ((k - 3) / 3) * 0.5;
      const len = 1.4 * f;
      addTri(vertices, [-0.2, -0.2, -cRadius], [0.2, -0.2, -cRadius], [Math.sin(aT) * len, -0.4 * f, -cRadius - len]);
    }
  }
  else if (id === 'japanese-05') {
    // KOINOBORI: Children's Day Flying Carp
    const segments = 8;
    const bodyL = 2.0 * f;
    const rBody = 0.55;
    for (let s = 0; s < segments; s++) {
      const z1 = 0.9 - (s / segments) * bodyL;
      const z2 = 0.9 - ((s + 1) / segments) * bodyL;
      const t1 = 1 - (s / segments) * 0.45;
      const t2 = 1 - ((s + 1) / segments) * 0.45;
      for (let h = 0; h < 8; h++) {
        const a1 = (h / 8) * Math.PI * 2;
        const a2 = ((h + 1) / 8) * Math.PI * 2;
        addQuad(vertices, [Math.cos(a1) * rBody * t1, Math.sin(a1) * rBody * t1, z1], [Math.cos(a2) * rBody * t1, Math.sin(a2) * rBody * t1, z1], [Math.cos(a2) * rBody * t2, Math.sin(a2) * rBody * t2, z2], [Math.cos(a1) * rBody * t2, Math.sin(a1) * rBody * t2, z2]);
      }
    }
    const tailZ = 0.9 - bodyL;
    addTri(vertices, [0, 0, tailZ], [-0.6 * f, 0.4 * f, tailZ - 0.7 * f], [0, 0.1, tailZ - 0.4 * f]);
    addTri(vertices, [0, 0, tailZ], [0, -0.1, tailZ - 0.4 * f], [-0.6 * f, -0.4 * f, tailZ - 0.7 * f]);
  }
  else if (id === 'japanese-06') {
    // NIHON-RYU: Imperial Japanese Rising Dragon
    const coils = 12;
    const spineR = 0.28;
    for (let i = 0; i < coils; i++) {
      const t1 = i / coils;
      const t2 = (i + 1) / coils;
      const z1 = (t1 - 0.5) * 2.4;
      const z2 = (t2 - 0.5) * 2.4;
      const x1 = Math.sin(t1 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const x2 = Math.sin(t2 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const y1 = Math.cos(t1 * Math.PI * 2) * 0.45 * f;
      const y2 = Math.cos(t2 * Math.PI * 2) * 0.45 * f;
      addQuad(vertices, [x1 - spineR, y1, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1 - spineR, y1, z1], [x1, y1 + spineR * 1.5, z1], [x2, y2 + spineR * 1.5, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1, y1 + spineR * 1.5, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2, y2 + spineR * 1.5, z2]);
    }
  }
  else if (id === 'indian-01') {
    // MAYURA: Imperial Indian Peacock
    const chestPuff = f * 0.65;
    const neckAngle = f * 1.25;
    addQuad(vertices, [-0.2, -0.6, 0], [0.2, -0.6, 0], [0.15, 0.4, chestPuff], [-0.15, 0.4, chestPuff]);
    addQuad(vertices, [-0.1, 0.4, chestPuff], [0.1, 0.4, chestPuff], [0.06, 1.1 + f * 0.3, chestPuff + neckAngle], [-0.06, 1.1 + f * 0.3, chestPuff + neckAngle]);
    addTri(vertices, [-0.06, 1.1 + f * 0.3, chestPuff + neckAngle], [0.06, 1.1 + f * 0.3, chestPuff + neckAngle], [0, 1.35 + f * 0.2, chestPuff + neckAngle - 0.15]);
    const fans = 18;
    const tailR = 1.65 * (0.4 + 0.6 * f);
    for (let k = 0; k < fans; k++) {
      const a = ((k - (fans - 1) / 2) / (fans / 2)) * (Math.PI * 0.48) * f;
      const tx = Math.sin(a) * tailR;
      const ty = -0.5 + Math.cos(a) * tailR * 0.9;
      const tz = -0.35 * f - Math.abs(Math.sin(a)) * 0.3;
      addTri(vertices, [-0.15, -0.6, -0.1], [0.15, -0.6, -0.1], [tx, ty, tz]);
    }
  }
  else if (id === 'indian-02') {
    // GAJENDRA: Royal Mysore Elephant
    const w = 0.55, h = 0.5, l = 0.85;
    const legDrop = -0.65 * f;
    addBox(vertices, -w, w, -h, h, -l, l);
    addBox(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, l * 0.3, l * 0.8);
    addBox(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, l * 0.3, l * 0.8);
    addBox(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, -l * 0.8, -l * 0.3);
    addBox(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, -l * 0.8, -l * 0.3);
    const trunkH = h + 0.3 * f;
    addQuad(vertices, [-0.2, h, l], [0.2, h, l], [0.15, trunkH, l + 0.45 * f], [-0.15, trunkH, l + 0.45 * f]);
    addTri(vertices, [-0.1, trunkH + 0.5 * f, l + 0.7 * f], [0.1, trunkH + 0.5 * f, l + 0.7 * f], [0, trunkH + 0.85 * f, l + 0.55 * f]);
    addTri(vertices, [-0.2, h, l], [-0.75 * f, h + 0.25 * f, l - 0.2], [-0.2, h - 0.4 * f, l]);
    addTri(vertices, [0.2, h, l], [0.2, h - 0.4 * f, l], [0.75 * f, h + 0.25 * f, l - 0.2]);
    addBox(vertices, -w * 0.7, w * 0.7, h, h + 0.45 * f, -l * 0.4, l * 0.4);
    addCone(vertices, [0, h + 0.85 * f, 0], [0, h + 0.45 * f, 0], w * 0.75, 4);
  }
  else if (id === 'indian-03') {
    // ROYAL BENGAL TIGER
    const tW = 0.4, tH = 0.38, tL = 0.95;
    const crouch = -0.55 * f;
    addBox(vertices, -tW, tW, -tH, tH, -tL, tL);
    addBox(vertices, -tW * 1.1, -tW * 0.6, -tH + crouch, -tH, tL * 0.4, tL * 0.8);
    addBox(vertices, tW * 0.6, tW * 1.1, -tH + crouch, -tH, tL * 0.4, tL * 0.8);
    addBox(vertices, -tW * 1.1, -tW * 0.6, -tH + crouch, -tH, -tL * 0.8, -tL * 0.4);
    addBox(vertices, tW * 0.6, tW * 1.1, -tH + crouch, -tH, -tL * 0.8, -tL * 0.4);
    addBox(vertices, -0.22, 0.22, -0.1, 0.35 * f, tL, tL + 0.5 * f);
    addTri(vertices, [-0.2, 0.35 * f, tL + 0.2], [-0.35 * f, 0.6 * f, tL + 0.1], [-0.1, 0.35 * f, tL + 0.1]);
    addTri(vertices, [0.1, 0.35 * f, tL + 0.1], [0.35 * f, 0.6 * f, tL + 0.1], [0.2, 0.35 * f, tL + 0.2]);
    addQuad(vertices, [-0.08, 0, -tL], [0.08, 0, -tL], [0.06, 0.5 * f, -tL - 0.7 * f], [-0.06, 0.5 * f, -tL - 0.7 * f]);
  }
  else if (id === 'indian-04') {
    // GENDA PHOOL: Marigold Garland
    const count = 3;
    for (let c = 0; c < count; c++) {
      const cx = (c - 1) * 1.05 * f;
      const cy = -Math.sin((c / 2) * Math.PI) * 0.35 * f;
      const cz = 0;
      for (let ring = 0; ring < 3; ring++) {
        const pCount = 10;
        const rad = (0.55 - ring * 0.12) * f;
        for (let p = 0; p < pCount; p++) {
          const a1 = (p / pCount) * Math.PI * 2;
          const a2 = ((p + 1) / pCount) * Math.PI * 2;
          addTri(vertices, [cx, cy, cz], [cx + Math.cos(a1) * rad, cy + (ring * 0.15) * f, cz + Math.sin(a1) * rad], [cx + Math.cos(a2) * rad, cy + (ring * 0.15) * f, cz + Math.sin(a2) * rad]);
        }
      }
    }
  }
  else if (id === 'indian-05') {
    // DEEPAVALI DIYA: Terracotta Oil Well & 3D Flame
    const bowlSides = 8;
    const rOuter = 1.05;
    const bHeight = 0.45 * f;
    for (let i = 0; i < bowlSides; i++) {
      const a1 = (i / bowlSides) * Math.PI * 2;
      const a2 = ((i + 1) / bowlSides) * Math.PI * 2;
      addQuad(vertices, [Math.cos(a1) * rOuter, -bHeight, Math.sin(a1) * rOuter], [Math.cos(a2) * rOuter, -bHeight, Math.sin(a2) * rOuter], [Math.cos(a2) * rOuter * 1.15, 0, Math.sin(a2) * rOuter * 1.15], [Math.cos(a1) * rOuter * 1.15, 0, Math.sin(a1) * rOuter * 1.15]);
    }
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      addTri(vertices, [Math.cos(a1) * 0.38 * f, 0.05, Math.sin(a1) * 0.38 * f], [Math.cos(a2) * 0.38 * f, 0.05, Math.sin(a2) * 0.38 * f], [0, 1.35 * f, 0]);
    }
  }
  else if (id === 'indian-06') {
    // KATHAKALI ROYAL CROWN
    const haloR = 1.35 * f;
    for (let i = 0; i < 16; i++) {
      const a1 = (i / 16) * Math.PI * 2;
      const a2 = ((i + 1) / 16) * Math.PI * 2;
      addTri(vertices, [0, 0.4, -0.15], [Math.cos(a1) * haloR, 0.4 + Math.sin(a1) * haloR, -0.2], [Math.cos(a2) * haloR, 0.4 + Math.sin(a2) * haloR, -0.2]);
    }
    addCylinder(vertices, -0.4, 0.2 * f, 0.75, 0.55 * f, 10);
    addCylinder(vertices, 0.2 * f, 0.8 * f, 0.55 * f, 0.35 * f, 8);
    addCone(vertices, [0, 1.45 * f, 0], [0, 0.8 * f, 0], 0.35 * f, 8);
  }
  else if (id === 'indian-07') {
    // SACRED KAMALAM TEMPLE LOTUS
    addCylinder(vertices, -0.4, -0.25, 1.4 * f, 1.5 * f, 8);
    for (let tier = 0; tier < 3; tier++) {
      const count = 8;
      const rad = (1.25 - tier * 0.3) * f;
      const h = (-0.25 + tier * 0.35) * f;
      for (let p = 0; p < count; p++) {
        const a1 = (p / count) * Math.PI * 2 + (tier * 0.3);
        const a2 = ((p + 1) / count) * Math.PI * 2 + (tier * 0.3);
        const aMid = (a1 + a2) / 2;
        addTri(vertices, [0, h - 0.1, 0], [Math.cos(a1) * rad * 0.4, h, Math.sin(a1) * rad * 0.4], [Math.cos(aMid) * rad, h + 0.45 * f, Math.sin(aMid) * rad]);
        addTri(vertices, [0, h - 0.1, 0], [Math.cos(aMid) * rad, h + 0.45 * f, Math.sin(aMid) * rad], [Math.cos(a2) * rad * 0.4, h, Math.sin(a2) * rad * 0.4]);
      }
    }
  }
  else if (id === 'indian-08') {
    // THE ROYAL DURBAR
    addBox(vertices, -1.2, -0.9, -0.5, 1.35 * f, -0.2, 0.2);
    addBox(vertices, 0.9, 1.2, -0.5, 1.35 * f, -0.2, 0.2);
    addBox(vertices, -1.3, 1.3, 1.15 * f, 1.45 * f, -0.3, 0.3);
    addBox(vertices, -0.6, 0.6, -0.5, 0.1 * f, -0.5, 0.5);
    addBox(vertices, -0.5, 0.5, 0.1 * f, 0.8 * f, -0.5, -0.2);
    addCone(vertices, [0, 1.85 * f, 0], [0, 1.5 * f, 0], 0.7 * f, 8);
  }
  else if (id === 'chinese-01') {
    // YUANBAO: Golden Wealth Ingot
    const l = 1.35 * f, w = 0.75 * f, h = 0.55 * f;
    addQuad(vertices, [-l, h * 0.8, -w * 0.3], [l, h * 0.8, -w * 0.3], [l * 0.7, -h * 0.5, -w], [-l * 0.7, -h * 0.5, -w]);
    addQuad(vertices, [l, h * 0.8, w * 0.3], [-l, h * 0.8, w * 0.3], [-l * 0.7, -h * 0.5, w], [l * 0.7, -h * 0.5, w]);
    addTri(vertices, [-l, h * 0.8, -w * 0.3], [-l, h * 0.8, w * 0.3], [-l * 1.25, h * 1.2, 0]);
    addTri(vertices, [l, h * 0.8, w * 0.3], [l, h * 0.8, -w * 0.3], [l * 1.25, h * 1.2, 0]);
    for (let k = 0; k < 8; k++) {
      const a1 = (k / 8) * Math.PI * 2;
      const a2 = ((k + 1) / 8) * Math.PI * 2;
      addTri(vertices, [Math.cos(a1) * 0.45 * f, h * 0.5, Math.sin(a1) * 0.35 * f], [Math.cos(a2) * 0.45 * f, h * 0.5, Math.sin(a2) * 0.35 * f], [0, h * 1.25, 0]);
    }
  }
  else if (id === 'chinese-02') {
    // DENGLONG: Royal Palace Red Lantern
    const rL = 0.95 * f;
    const hL = 1.15 * f;
    for (let i = 0; i < 12; i++) {
      const a1 = (i / 12) * Math.PI * 2;
      const a2 = ((i + 1) / 12) * Math.PI * 2;
      addTri(vertices, [0, hL * 0.5, 0], [Math.cos(a1) * rL, 0, Math.sin(a1) * rL], [Math.cos(a2) * rL, 0, Math.sin(a2) * rL]);
      addTri(vertices, [0, -hL * 0.5, 0], [Math.cos(a2) * rL, 0, Math.sin(a2) * rL], [Math.cos(a1) * rL, 0, Math.sin(a1) * rL]);
    }
    addCylinder(vertices, hL * 0.5, hL * 0.65, 0.45 * f, 0.35 * f, 6);
    addCylinder(vertices, -hL * 0.65, -hL * 0.5, 0.35 * f, 0.45 * f, 6);
    addCone(vertices, [0, -hL * 1.25, 0], [0, -hL * 0.65, 0], 0.25 * f, 6);
  }
  else if (id === 'chinese-03') {
    // LOONG: Celestial Dragon
    const coils = 12;
    const spineR = 0.28;
    for (let i = 0; i < coils; i++) {
      const t1 = i / coils;
      const t2 = (i + 1) / coils;
      const z1 = (t1 - 0.5) * 2.4;
      const z2 = (t2 - 0.5) * 2.4;
      const x1 = Math.sin(t1 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const x2 = Math.sin(t2 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const y1 = Math.cos(t1 * Math.PI * 2) * 0.45 * f;
      const y2 = Math.cos(t2 * Math.PI * 2) * 0.45 * f;
      addQuad(vertices, [x1 - spineR, y1, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1 - spineR, y1, z1], [x1, y1 + spineR * 1.6, z1], [x2, y2 + spineR * 1.6, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1, y1 + spineR * 1.6, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2, y2 + spineR * 1.6, z2]);
    }
  }
  else if (id === 'chinese-04') {
    // FENGHUANG: Empress Phoenix
    const bodyH = 0.8 * f;
    addBox(vertices, -0.2, 0.2, -0.3, bodyH, -0.3, 0.3);
    const wSpan = 1.75 * f;
    addTri(vertices, [-0.2, bodyH * 0.8, 0], [-wSpan, bodyH * 1.2, 0.4], [-wSpan * 0.6, 0, -0.2]);
    addTri(vertices, [0.2, bodyH * 0.8, 0], [wSpan * 0.6, 0, -0.2], [wSpan, bodyH * 1.2, 0.4]);
    addTri(vertices, [-0.1, bodyH, 0.2], [0.1, bodyH, 0.2], [0, bodyH + 0.55 * f, 0.4]);
    for (let t = 0; t < 5; t++) {
      const a = ((t - 2) / 2) * 0.4;
      const len = 1.8 * f;
      addTri(vertices, [-0.1, -0.3, -0.2], [0.1, -0.3, -0.2], [Math.sin(a) * len, -1.2 * f, -0.2 - Math.cos(a) * len * 0.5]);
    }
  }
  else if (id === 'chinese-05') {
    // JADE RABBIT
    addBox(vertices, -0.4, 0.4, -0.4, 0.3 * f, -0.5, 0.4);
    addBox(vertices, -0.3, 0.3, 0.3 * f, 0.75 * f, -0.1, 0.45);
    addTri(vertices, [-0.25, 0.75 * f, 0.2], [-0.1, 0.75 * f, 0.2], [-0.2, 1.45 * f, 0.1]);
    addTri(vertices, [0.1, 0.75 * f, 0.2], [0.25, 0.75 * f, 0.2], [0.2, 1.45 * f, 0.1]);
    addBox(vertices, -0.15, 0.15, -0.2, 0.1, -0.65 * f, -0.5);
  }
  else if (id === 'chinese-06') {
    // FU CHUAN: Chinese Junk Ship
    const hL = 1.6, hW = 0.55, hD = 0.45 * f;
    addQuad(vertices, [-hL * 0.8, hD, -hW], [hL * 0.8, hD, -hW * 0.7], [hL * 0.6, -hD, -hW * 0.5], [-hL * 0.6, -hD, -hW * 0.7]);
    addQuad(vertices, [hL * 0.8, hD, hW * 0.7], [-hL * 0.8, hD, hW], [-hL * 0.6, -hD, hW * 0.7], [hL * 0.6, -hD, hW * 0.5]);
    const masts = [-0.6, 0.0, 0.6];
    const sHeights = [1.2, 1.55, 1.0];
    masts.forEach((mx, idx) => {
      const sh = sHeights[idx] * f;
      addQuad(vertices, [mx - 0.05, hD, 0], [mx + 0.35, hD, 0.1], [mx + 0.3, hD + sh, 0.1], [mx - 0.05, hD + sh, 0]);
    });
  }
  else if (id === 'american-01') {
    // BALD EAGLE
    const wingSpan = 1.85 * f;
    addQuad(vertices, [-0.25, -0.4, 0], [0.25, -0.4, 0], [0.2, 0.4, 0.2], [-0.2, 0.4, 0.2]);
    addQuad(vertices, [-0.2, 0.4, 0.2], [-wingSpan, 0.6 * f, 0], [-wingSpan * 0.8, -0.2 * f, 0], [-0.25, -0.4, 0]);
    addQuad(vertices, [0.2, 0.4, 0.2], [0.25, -0.4, 0], [wingSpan * 0.8, -0.2 * f, 0], [wingSpan, 0.6 * f, 0]);
    addTri(vertices, [-0.15, 0.4, 0.2], [0.15, 0.4, 0.2], [0, 0.85 * f, 0.5 * f]);
  }
  else if (id === 'american-02') {
    // PRAIRIE BISON
    const bW = 0.55, bH = 0.5, bL = 0.85;
    addBox(vertices, -bW, bW, -bH, bH, -bL, bL);
    addTri(vertices, [-bW * 0.9, bH, -bL * 0.2], [bW * 0.9, bH, -bL * 0.2], [0, bH + 0.65 * f, bL * 0.3]);
    addBox(vertices, -0.3, 0.3, -bH * 0.5, bH * 0.4, bL, bL + 0.45 * f);
    addTri(vertices, [-0.3, bH * 0.2, bL + 0.2], [-0.65 * f, bH * 0.6 * f, bL + 0.1], [-0.15, bH * 0.2, bL + 0.1]);
    addTri(vertices, [0.15, bH * 0.2, bL + 0.1], [0.65 * f, bH * 0.6 * f, bL + 0.1], [0.3, bH * 0.2, bL + 0.2]);
  }
  else if (id === 'american-03') {
    // JUMPING FROG
    const bW = 0.75 * f, bL = 0.9 * f;
    addQuad(vertices, [-bW, -0.15, -bL], [bW, -0.15, -bL], [bW * 0.6, 0.25, bL * 0.4], [-bW * 0.6, 0.25, bL * 0.4]);
    addTri(vertices, [-bW * 0.5, 0.25, bL * 0.4], [-bW * 0.2, 0.25, bL * 0.4], [-bW * 0.35, 0.45 * f, bL * 0.5]);
    addTri(vertices, [bW * 0.2, 0.25, bL * 0.4], [bW * 0.5, 0.25, bL * 0.4], [bW * 0.35, 0.45 * f, bL * 0.5]);
    const zExt = 0.75 * f;
    addQuad(vertices, [-bW, -0.15, -bL], [-bW * 0.5, -0.15, -bL], [-bW * 1.3 * f, -0.35, -bL - zExt], [-bW * 1.6 * f, -0.35, -bL - zExt]);
    addQuad(vertices, [bW * 0.5, -0.15, -bL], [bW, -0.15, -bL], [bW * 1.6 * f, -0.35, -bL - zExt], [bW * 1.3 * f, -0.35, -bL - zExt]);
  }
  else if (id === 'american-04') {
    // HERCULES BEETLE
    const bW = 0.6, bL = 0.85;
    addBox(vertices, -bW, bW, -0.3, 0.25, -bL, bL * 0.5);
    addTri(vertices, [-0.15, 0.2, bL * 0.5], [0.15, 0.2, bL * 0.5], [0, 0.85 * f, bL * 0.5 + 1.45 * f]);
    addTri(vertices, [-0.1, 0.0, bL * 0.5], [0.1, 0.0, bL * 0.5], [0, 0.2 * f, bL * 0.5 + 1.1 * f]);
    addTri(vertices, [-bW, -0.2, -bL], [-bW * 0.8, 0.2, bL * 0.5], [-bW * (1.2 + 0.4 * f), 0.1, 0]);
    addTri(vertices, [bW, -0.2, -bL], [bW * (1.2 + 0.4 * f), 0.1, 0], [bW * 0.8, 0.2, bL * 0.5]);
  }
  else if (id === 'american-05') {
    // 4TH OF JULY STARBURST
    for (let r = 0; r < 12; r++) {
      const a = (r / 12) * Math.PI * 2;
      const len = (r % 2 === 0 ? 1.55 : 0.85) * f;
      addTri(vertices, [Math.cos(a - 0.25) * 0.25, Math.sin(a - 0.25) * 0.25, 0], [Math.cos(a + 0.25) * 0.25, Math.sin(a + 0.25) * 0.25, 0], [Math.cos(a) * len, Math.sin(a) * len, 0.2 * (r % 2 === 0 ? 1 : -1) * f]);
    }
  }
  else if (id === 'american-06') {
    // GOLDEN GATE BRIDGE
    const towerH = 1.65 * f, spanL = 1.45;
    addBox(vertices, -spanL * 0.6, -spanL * 0.45, -0.6, towerH, -0.15, 0.15);
    addBox(vertices, spanL * 0.45, spanL * 0.6, -0.6, towerH, -0.15, 0.15);
    addBox(vertices, -spanL * 1.2, spanL * 1.2, -0.1, 0.05, -0.3, 0.3);
    addTri(vertices, [-spanL * 0.525, towerH, 0], [0, 0.05, 0], [spanL * 0.525, towerH, 0]);
  }
  else if (id === 'nativity-01') {
    // ARCHITECTURAL STABLE
    const roofSpan = 1.35;
    const roofH = 1.25 * f;
    addQuad(vertices, [-roofSpan, 0, -0.8], [0, roofH, -0.8], [0, roofH, 0.8], [-roofSpan, 0, 0.8]);
    addQuad(vertices, [0, roofH, -0.8], [roofSpan, 0, -0.8], [roofSpan, 0, 0.8], [0, roofH, 0.8]);
    addQuad(vertices, [-roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, 0, -0.75], [-roofSpan * 0.9, 0, -0.75]);
  }
  else if (id === 'nativity-02') {
    // HOLY FAMILY
    addCone(vertices, [-0.45, 1.25 * f, 0], [-0.45, -0.6, 0], 0.45 * f, 8);
    addCone(vertices, [0.45, 0.75 * f, 0], [0.45, -0.6, 0], 0.5 * f, 8);
    addBox(vertices, -0.25, 0.25, -0.6, -0.25 * f, -0.3, 0.3);
    addCone(vertices, [0, -0.1, 0], [0, -0.25 * f, 0], 0.18 * f, 6);
  }
  else if (id === 'nativity-03') {
    // NATIVITY ANGEL
    const bodyH = 1.2 * f;
    addCone(vertices, [0, bodyH, 0], [0, -0.6, 0], 0.65 * f, 8);
    addTri(vertices, [-0.25, bodyH + 0.35, -0.1], [0.25, bodyH + 0.35, -0.1], [0, bodyH + 0.45, -0.1]);
    addTri(vertices, [-0.1, bodyH * 0.7, -0.1], [-1.35 * f, bodyH * 1.15, -0.3], [-0.85 * f, bodyH * 0.4, -0.2]);
    addTri(vertices, [0.1, bodyH * 0.7, -0.1], [0.85 * f, bodyH * 0.4, -0.2], [1.35 * f, bodyH * 1.15, -0.3]);
  }
  else if (id === 'nativity-04') {
    // STAR OF BETHLEHEM
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const isLong = (p === 6);
      const rayL = (isLong ? 1.65 : (p % 2 === 0 ? 0.95 : 0.45)) * f;
      addTri(vertices, [Math.cos(a - 0.2) * 0.25, Math.sin(a - 0.2) * 0.25, 0], [Math.cos(a + 0.2) * 0.25, Math.sin(a + 0.2) * 0.25, 0], [Math.cos(a) * rayL, Math.sin(a) * rayL, 0.15 * f]);
    }
  }
  else if (id === 'nativity-05') {
    // SHEPHERD & SHEEP
    addCone(vertices, [-0.4, 1.2 * f, 0], [-0.4, -0.6, 0], 0.45 * f, 8);
    addBox(vertices, -0.75, -0.7, -0.6, 1.45 * f, 0.1, 0.15);
    addBox(vertices, 0.2, 0.8, -0.6, -0.15, -0.2, 0.2);
    addCone(vertices, [0.85, 0.15 * f, 0], [0.75, -0.15, 0], 0.2 * f, 6);
  }
  else if (id === 'nativity-06') {
    // MELCHIOR
    addCone(vertices, [0, 1.35 * f, 0], [0, -0.6, 0], 0.55 * f, 8);
    addCone(vertices, [0, 1.65 * f, 0], [0, 1.35 * f, 0], 0.25 * f, 6);
    addBox(vertices, -0.2, 0.2, 0.2 * f, 0.5 * f, 0.4, 0.7);
  }
  else if (id === 'nativity-07') {
    // BALTHAZAR
    addCone(vertices, [0, 1.35 * f, 0], [0, -0.6, 0], 0.55 * f, 8);
    addCylinder(vertices, 1.35 * f, 1.55 * f, 0.28 * f, 0.15 * f, 8);
    addCone(vertices, [0, 0.65 * f, 0.5], [0, 0.25 * f, 0.5], 0.22 * f, 6);
  }
  else if (id === 'nativity-08') {
    // GASPAR
    addCone(vertices, [0, 0.95 * f, 0], [0, -0.6, 0], 0.65 * f, 8);
    addCylinder(vertices, 0.1 * f, 0.45 * f, 0.1 * f, 0.25 * f, 6);
  }
  else if (id === 'nativity-09') {
    // DONKEY & OX
    addBox(vertices, -1.0, -0.4, -0.6, 0.1 * f, -0.3, 0.3);
    addCone(vertices, [-0.4, 0.55 * f, 0], [-0.5, 0.1 * f, 0], 0.25 * f, 6);
    addTri(vertices, [-0.5, 0.55 * f, 0], [-0.65 * f, 0.95 * f, 0], [-0.45, 0.55 * f, 0]);
    addBox(vertices, 0.3, 1.0, -0.6, 0.05 * f, -0.4, 0.4);
    addCone(vertices, [1.05, 0.35 * f, 0], [0.95, 0.05 * f, 0], 0.3 * f, 6);
    addTri(vertices, [1.0, 0.35 * f, -0.2], [1.35 * f, 0.55 * f, -0.2], [1.0, 0.2 * f, -0.2]);
  }
  else if (id === 'nativity-10') {
    // COMPLETE SCENE ASSEMBLY
    const roofSpan = 1.45;
    const roofH = 1.45 * f;
    addQuad(vertices, [-roofSpan, 0, -0.9], [0, roofH, -0.9], [0, roofH, 0.9], [-roofSpan, 0, 0.9]);
    addQuad(vertices, [0, roofH, -0.9], [roofSpan, 0, -0.9], [roofSpan, 0, 0.9], [0, roofH, 0.9]);
    addCone(vertices, [-0.4, 0.8 * f, 0], [-0.4, -0.6, 0], 0.35 * f, 6);
    addCone(vertices, [0.4, 0.6 * f, 0], [0.4, -0.6, 0], 0.35 * f, 6);
    addBox(vertices, -0.2, 0.2, -0.6, -0.3 * f, -0.2, 0.2);
    addTri(vertices, [-0.2, roofH + 0.1, 0.9], [0.2, roofH + 0.1, 0.9], [0, roofH + 0.6 * f, 0.9]);
  }
  else if (id === 'lotus-01') {
    // LOTUS BASE & CALYX
    const sepals = 8;
    const rSep = 1.45 * f;
    for (let i = 0; i < sepals; i++) {
      const a1 = (i / sepals) * Math.PI * 2;
      const a2 = ((i + 1) / sepals) * Math.PI * 2;
      const aMid = (a1 + a2) / 2;
      addTri(vertices, [0, -0.4, 0], [Math.cos(a1) * rSep * 0.5, -0.4, Math.sin(a1) * rSep * 0.5], [Math.cos(aMid) * rSep, -0.2 * f, Math.sin(aMid) * rSep]);
      addTri(vertices, [0, -0.4, 0], [Math.cos(aMid) * rSep, -0.2 * f, Math.sin(aMid) * rSep], [Math.cos(a2) * rSep * 0.5, -0.4, Math.sin(a2) * rSep * 0.5]);
    }
  }
  else if (id === 'lotus-02') {
    // BLOOMING LOTUS BLOSSOM
    for (let t = 0; t < 3; t++) {
      const petals = 8, pR = (1.4 - t * 0.35) * f, pH = (0.2 + t * 0.35) * f;
      for (let p = 0; p < petals; p++) {
        const a1 = (p / petals) * Math.PI * 2;
        const a2 = ((p + 1) / petals) * Math.PI * 2;
        const aMid = (a1 + a2) / 2;
        addTri(vertices, [0, -0.3, 0], [Math.cos(a1) * pR * 0.3, -0.3, Math.sin(a1) * pR * 0.3], [Math.cos(aMid) * pR, -0.3 + pH, Math.sin(aMid) * pR]);
        addTri(vertices, [0, -0.3, 0], [Math.cos(aMid) * pR, -0.3 + pH, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.3, -0.3, Math.sin(a2) * pR * 0.3]);
      }
    }
  }
  else if (id === 'lotus-03') {
    // INNER LOTUS CORE
    addCylinder(vertices, -0.2, 0.4 * f, 0.5 * f, 0.4 * f, 8);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      addTri(vertices, [Math.cos(a) * 0.45 * f, 0.4 * f, Math.sin(a) * 0.45 * f], [Math.cos(a) * 0.85 * f, 0.7 * f, Math.sin(a) * 0.85 * f], [Math.cos(a + 0.1) * 0.45 * f, 0.4 * f, Math.sin(a + 0.1) * 0.45 * f]);
    }
  }
  else if (id === 'lotus-04') {
    // LILY PADS
    for (let c = 0; c < 3; c++) {
      const px = (c - 1) * 0.85 * f;
      const pz = (c % 2 === 0 ? 0.4 : -0.4) * f;
      const rad = 0.95 * f;
      for (let i = 0; i < 10; i++) {
        const a1 = (i / 12) * Math.PI * 2 + 0.4;
        const a2 = ((i + 1) / 12) * Math.PI * 2 + 0.4;
        addTri(vertices, [px, -0.4 + c * 0.08, pz], [px + Math.cos(a1) * rad, -0.4 + c * 0.08, pz + Math.sin(a1) * rad], [px + Math.cos(a2) * rad, -0.4 + c * 0.08, pz + Math.sin(a2) * rad]);
      }
    }
  }
  else if (id === 'lotus-05') {
    // 3D KOI FISH
    const segments = 10;
    const bodyL = 2.2 * f;
    const rBody = 0.48;
    for (let s = 0; s < segments; s++) {
      const t1 = s / segments;
      const t2 = (s + 1) / segments;
      const z1 = 1.0 - t1 * bodyL;
      const z2 = 1.0 - t2 * bodyL;
      const x1 = Math.sin(t1 * Math.PI * 1.8) * 0.45 * f;
      const x2 = Math.sin(t2 * Math.PI * 1.8) * 0.45 * f;
      const w1 = Math.sin(t1 * Math.PI) * rBody;
      const w2 = Math.sin(t2 * Math.PI) * rBody;
      for (let h = 0; h < 6; h++) {
        const a1 = (h / 6) * Math.PI * 2;
        const a2 = ((h + 1) / 6) * Math.PI * 2;
        addQuad(vertices, [x1 + Math.cos(a1) * w1, Math.sin(a1) * w1, z1], [x1 + Math.cos(a2) * w1, Math.sin(a2) * w1, z1], [x2 + Math.cos(a2) * w2, Math.sin(a2) * w2, z2], [x2 + Math.cos(a1) * w2, Math.sin(a1) * w2, z2]);
      }
    }
    addTri(vertices, [-0.3, 0, 0.4], [-1.2 * f, 0.2 * f, 0.1], [-0.3, 0, -0.2]);
    addTri(vertices, [0.3, 0, 0.4], [0.3, 0, -0.2], [1.2 * f, 0.2 * f, 0.1]);
    const tailZ = 1.0 - bodyL;
    addTri(vertices, [0, 0, tailZ], [-0.75 * f, 0.5 * f, tailZ - 0.7 * f], [0.75 * f, -0.5 * f, tailZ - 0.7 * f]);
  }
  else if (id === 'lotus-06') {
    // AQUATIC GARDEN
    addCylinder(vertices, -0.5, -0.4, 1.6 * f, 1.7 * f, 16);
    addCone(vertices, [-0.6 * f, -0.2, 0.4 * f], [-0.6 * f, -0.4, 0.4 * f], 0.35 * f, 6);
    addCone(vertices, [0.5 * f, -0.25, -0.4 * f], [0.5 * f, -0.4, -0.4 * f], 0.28 * f, 6);
    addCone(vertices, [0, 0.25 * f, 0], [0, -0.4, 0], 0.65 * f, 8);
  }
  else if (id === 'geometric-01') {
    // TRI-FACETED SONOBE BASE
    const side = 1.25 * f;
    const h = side * 0.866;
    addTri(vertices, [-side * 0.5, -0.3, -h * 0.33], [side * 0.5, -0.3, -h * 0.33], [0, 0.5 * f, h * 0.66]);
    addTri(vertices, [-side * 0.5, -0.3, -h * 0.33], [0, 0.5 * f, h * 0.66], [-side * 0.8 * f, 0.1, 0]);
    addTri(vertices, [side * 0.5, -0.3, -h * 0.33], [side * 0.8 * f, 0.1, 0], [0, 0.5 * f, h * 0.66]);
    addTri(vertices, [-side * 0.5, -0.3, -h * 0.33], [0, -0.6 * f, -h * 0.8], [side * 0.5, -0.3, -h * 0.33]);
  }
  else if (id === 'geometric-02') {
    // DIAMOND HONEYCOMB MODULE
    const r = 1.15 * f;
    const h = 0.85 * f;
    for (let d = 0; d < 6; d++) {
      const a1 = (d / 6) * Math.PI * 2;
      const a2 = ((d + 1) / 6) * Math.PI * 2;
      addTri(vertices, [0, h, 0], [Math.cos(a1) * r, 0, Math.sin(a1) * r], [Math.cos(a2) * r, 0, Math.sin(a2) * r]);
      addTri(vertices, [0, -h, 0], [Math.cos(a2) * r, 0, Math.sin(a2) * r], [Math.cos(a1) * r, 0, Math.sin(a1) * r]);
    }
  }
  else if (id === 'geometric-03') {
    // FLUTED NECK COLLAR
    const h = 1.35 * f;
    for (let i = 0; i < 12; i++) {
      const a1 = (i / 12) * Math.PI * 2;
      const a2 = ((i + 1) / 12) * Math.PI * 2;
      const rTop = (i % 2 === 0 ? 1.25 : 0.85) * f;
      const rBot = 0.45 * f;
      addTri(vertices, [Math.cos(a1) * rBot, -h * 0.5, Math.sin(a1) * rBot], [Math.cos(a2) * rBot, -h * 0.5, Math.sin(a2) * rBot], [Math.cos(a1) * rTop, h * 0.5, Math.sin(a1) * rTop]);
      addTri(vertices, [Math.cos(a2) * rBot, -h * 0.5, Math.sin(a2) * rBot], [Math.cos(a2) * rTop, h * 0.5, Math.sin(a2) * rTop], [Math.cos(a1) * rTop, h * 0.5, Math.sin(a1) * rTop]);
    }
  }
  else if (id === 'geometric-04') {
    // HEXAGONAL WAIST
    addCylinder(vertices, -0.4 * f, 0.4 * f, 1.25 * f, 1.25 * f, 6);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      addTri(vertices, [Math.cos(a - 0.2) * 1.25 * f, 0, Math.sin(a - 0.2) * 1.25 * f], [Math.cos(a + 0.2) * 1.25 * f, 0, Math.sin(a + 0.2) * 1.25 * f], [Math.cos(a) * 1.55 * f, 0, Math.sin(a) * 1.55 * f]);
    }
  }
  else if (id === 'geometric-05') {
    // METALLIC CORNER BRACKETS
    for (let c = 0; c < 8; c++) {
      const sx = (c & 1 ? 1 : -1) * 0.8 * f;
      const sy = (c & 2 ? 1 : -1) * 0.8 * f;
      const sz = (c & 4 ? 1 : -1) * 0.8 * f;
      addTri(vertices, [sx, sy, sz], [sx * 1.3, sy * 0.7, sz * 0.7], [sx * 0.7, sy * 1.3, sz * 0.7]);
      addTri(vertices, [sx, sy, sz], [sx * 0.7, sy * 1.3, sz * 0.7], [sx * 0.7, sy * 0.7, sz * 1.3]);
    }
  }
  else if (id === 'geometric-06') {
    // SPIRAL PLEAT EXTERIOR SKIN
    for (let r = 0; r < 8; r++) {
      const y1 = (r / 8) * 2.0 - 1.0;
      const y2 = ((r + 1) / 8) * 2.0 - 1.0;
      const twist1 = (r / 8) * Math.PI * 1.2 * f;
      const twist2 = ((r + 1) / 8) * Math.PI * 1.2 * f;
      for (let s = 0; s < 8; s++) {
        const a1 = (s / 8) * Math.PI * 2;
        const a2 = ((s + 1) / 8) * Math.PI * 2;
        const rad = 0.95 * f;
        addQuad(vertices, [Math.cos(a1 + twist1) * rad, y1, Math.sin(a1 + twist1) * rad], [Math.cos(a2 + twist1) * rad, y1, Math.sin(a2 + twist1) * rad], [Math.cos(a2 + twist2) * rad, y2, Math.sin(a2 + twist2) * rad], [Math.cos(a1 + twist2) * rad, y2, Math.sin(a1 + twist2) * rad]);
      }
    }
  }
  else if (id === 'geometric-07') {
    // WEIGHTED PLINTH
    addBox(vertices, -1.3 * f, 1.3 * f, -0.6, -0.4, -1.3 * f, 1.3 * f);
    addBox(vertices, -1.0 * f, 1.0 * f, -0.4, -0.15, -1.0 * f, 1.0 * f);
    addBox(vertices, -0.7 * f, 0.7 * f, -0.15, 0.2 * f, -0.7 * f, 0.7 * f);
  }
  else if (id === 'geometric-08') {
    // FULL MODULAR VASE
    addCylinder(vertices, -0.8, -0.2, 0.5 * f, 1.25 * f, 8);
    addCylinder(vertices, -0.2, 0.2, 1.25 * f, 0.65 * f, 6);
    addCylinder(vertices, 0.2, 0.9 * f, 0.65 * f, 1.15 * f, 8);
  }
  else if (id === 'butterfly-01') {
    // SWALLOWTAIL MONARCH
    const wingW = 1.65 * f;
    addBox(vertices, -0.08, 0.08, -0.1, 0.1, -0.5, 0.5);
    addTri(vertices, [-0.08, 0.1, 0.2], [-wingW, 0.4 * f, 1.0], [-wingW * 0.7, 0.2 * f, -0.1]);
    addTri(vertices, [0.08, 0.1, 0.2], [wingW * 0.7, 0.2 * f, -0.1], [wingW, 0.4 * f, 1.0]);
    addTri(vertices, [-0.08, 0, -0.1], [-wingW * 0.8, 0.1 * f, -0.8], [-0.15, 0, -0.9 * f]);
    addTri(vertices, [0.08, 0, -0.1], [0.15, 0, -0.9 * f], [wingW * 0.8, 0.1 * f, -0.8]);
  }
  else if (id === 'butterfly-02') {
    // EMERALD MORPHO
    const wSpan = 1.8 * f;
    const dihedral = 0.55 * Math.sin(f * Math.PI * 0.5);
    addBox(vertices, -0.09, 0.09, -0.1, 0.1, -0.4, 0.4);
    addQuad(vertices, [-0.09, 0.08, 0.3], [-wSpan, 0.08 + dihedral, 0.7], [-wSpan * 0.85, 0.08 + dihedral, -0.5], [-0.09, 0.08, -0.3]);
    addQuad(vertices, [0.09, 0.08, 0.3], [0.09, 0.08, -0.3], [wSpan * 0.85, 0.08 + dihedral, -0.5], [wSpan, 0.08 + dihedral, 0.7]);
  }
  else if (id === 'butterfly-03') {
    // GOLDEN BIRDWING
    const wSpan = 2.0 * f;
    addBox(vertices, -0.1, 0.1, -0.12, 0.12, -0.6, 0.5);
    addTri(vertices, [-0.1, 0.1, 0.3], [-wSpan, 0.6 * f, 0.6], [-wSpan * 0.5, 0.2, -0.4]);
    addTri(vertices, [0.1, 0.1, 0.3], [wSpan * 0.5, 0.2, -0.4], [wSpan, 0.6 * f, 0.6]);
  }
  else if (id === 'butterfly-04') {
    // PYGMY AZURE TRIO
    const trio = [
      { x: -0.6 * f, y: 0.3 * f, z: 0.3 * f },
      { x: 0.6 * f, y: -0.2 * f, z: -0.2 * f },
      { x: 0.0, y: 0.7 * f, z: -0.4 * f }
    ];
    trio.forEach((b) => {
      const bW = 0.55 * f;
      addBox(vertices, b.x - 0.04, b.x + 0.04, b.y - 0.04, b.y + 0.04, b.z - 0.15, b.z + 0.15);
      addTri(vertices, [b.x - 0.04, b.y, b.z], [b.x - bW, b.y + 0.2 * f, b.z + 0.2], [b.x - bW * 0.6, b.y + 0.1, b.z - 0.2]);
      addTri(vertices, [b.x + 0.04, b.y, b.z], [b.x + bW * 0.6, b.y + 0.1, b.z - 0.2], [b.x + bW, b.y + 0.2 * f, b.z + 0.2]);
    });
  }
  else if (id === 'butterfly-05') {
    // RADIAL MANDALA ARMATURE
    const rOut = 1.45 * f;
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      const aNext = ((s + 1) / 8) * Math.PI * 2;
      addTri(vertices, [0, 0, 0], [Math.cos(a) * rOut, 0, Math.sin(a) * rOut], [Math.cos((a + aNext) / 2) * (rOut * 0.5), 0.3 * f, Math.sin((a + aNext) / 2) * (rOut * 0.5)]);
    }
  }
  else if (id === 'butterfly-06') {
    // CONCENTRIC PETAL RING
    const rOuter = 1.45 * f;
    const rInner = 0.5 * f;
    for (let p = 0; p < 16; p++) {
      const a1 = (p / 16) * Math.PI * 2;
      const a2 = ((p + 1) / 16) * Math.PI * 2;
      const hP = (p % 2 === 0 ? 0.35 : -0.15) * f;
      addTri(vertices, [Math.cos(a1) * rInner, 0, Math.sin(a1) * rInner], [Math.cos(a1) * rOuter, hP, Math.sin(a1) * rOuter], [Math.cos(a2) * rOuter, hP, Math.sin(a2) * rOuter]);
      addTri(vertices, [Math.cos(a1) * rInner, 0, Math.sin(a1) * rInner], [Math.cos(a2) * rOuter, hP, Math.sin(a2) * rOuter], [Math.cos(a2) * rInner, 0, Math.sin(a2) * rInner]);
    }
  }
  else if (id === 'butterfly-07') {
    // GRAND MANDALA WALL INSTALLATION
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      addTri(vertices, [0, 0, -0.1], [Math.cos(a - 0.2) * 1.6 * f, Math.sin(a - 0.2) * 1.6 * f, -0.1], [Math.cos(a) * 1.9 * f, Math.sin(a) * 1.9 * f, 0.1 * f]);
    }
    for (let p = 0; p < 12; p++) {
      const a1 = (p / 12) * Math.PI * 2;
      const a2 = ((p + 1) / 12) * Math.PI * 2;
      addTri(vertices, [0, 0, 0.2 * f], [Math.cos(a1) * 0.9 * f, Math.sin(a1) * 0.9 * f, 0], [Math.cos(a2) * 0.9 * f, Math.sin(a2) * 0.9 * f, 0]);
    }
  }
  else if (id === 'festival-01') {
    // HALLOWEEN JACK-O'-LANTERN
    const pR = 0.95 * f, pH = 0.85 * f;
    for (let i = 0; i < 12; i++) {
      const a1 = (i / 12) * Math.PI * 2;
      const a2 = ((i + 1) / 12) * Math.PI * 2;
      const bulg = (i % 2 === 0 ? 1.15 : 0.9);
      addTri(vertices, [0, pH * 0.6, 0], [Math.cos(a1) * pR * bulg, 0, Math.sin(a1) * pR * bulg], [Math.cos(a2) * pR * bulg, 0, Math.sin(a2) * pR * bulg]);
      addTri(vertices, [Math.cos(a1) * pR * bulg, 0, Math.sin(a1) * pR * bulg], [0, -pH * 0.6, 0], [Math.cos(a2) * pR * bulg, 0, Math.sin(a2) * pR * bulg]);
    }
    addCone(vertices, [0.15, pH * 1.1, 0], [0, pH * 0.6, 0], 0.15 * f, 5);
  }
  else if (id === 'festival-02') {
    // HALLOWEEN VAMPIRE BAT — Museum-Grade 3D Gothic Origami Masterpiece
    // 3D Ribbed Torso Box & Keel
    addBox(vertices, -0.18, 0.18, -0.35, 0.35 * f, -0.22, 0.22);
    addTri(vertices, [-0.18, 0.35 * f, 0], [0.18, 0.35 * f, 0], [0, 0.5 * f, 0.28]); // Sternum keel
    addTri(vertices, [-0.18, -0.35, 0], [0, -0.5 * f, 0.22], [0.18, -0.35, 0]); // Abdominal taper

    // Furrowed Snout Head & Fangs
    addTri(vertices, [-0.15, 0.35 * f, 0.1], [0.15, 0.35 * f, 0.1], [0, 0.2 * f, 0.55]); // Snout tip
    addTri(vertices, [-0.08, 0.2 * f, 0.55], [-0.04, 0.08 * f, 0.52], [-0.02, 0.2 * f, 0.5]); // Left fang
    addTri(vertices, [0.02, 0.2 * f, 0.5], [0.04, 0.08 * f, 0.52], [0.08, 0.2 * f, 0.55]); // Right fang

    // Tall Pointed Ears with inner pink relief
    addTri(vertices, [-0.18, 0.35 * f, 0], [-0.35 * f, 0.95 * f, 0.08], [-0.06, 0.45 * f, 0.12]);
    addTri(vertices, [-0.15, 0.4 * f, 0.02], [-0.3 * f, 0.85 * f, 0.08], [-0.08, 0.48 * f, 0.1]); // Inner ear fold
    addTri(vertices, [0.06, 0.45 * f, 0.12], [0.35 * f, 0.95 * f, 0.08], [0.18, 0.35 * f, 0]);
    addTri(vertices, [0.08, 0.48 * f, 0.1], [0.3 * f, 0.85 * f, 0.08], [0.15, 0.4 * f, 0.02]); // Inner ear fold

    // Articulated Swept Wings with 3 Finger Bones & Scalloped Membrane
    // Left Wing Struts & Membrane
    const rootL = [-0.18, 0.25, 0.05];
    const thumbL = [-0.65 * f, 0.7 * f, 0.25];
    const b1L = [-1.15 * f, 0.65 * f, 0.3];
    const b2L = [-1.85 * f, 0.35 * f, 0.2];
    const b3L = [-1.55 * f, -0.45 * f, 0.08];
    const s1L = [-1.45 * f, 0.4 * f - 0.25 * f, 0.12]; // Scallop 1
    const s2L = [-1.65 * f, -0.15 * f - 0.25 * f, 0.05]; // Scallop 2
    const flankL = [-0.18, -0.3, 0];

    addTri(vertices, rootL, thumbL, b1L);
    addTri(vertices, rootL, b1L, s1L);
    addTri(vertices, rootL, s1L, b2L);
    addTri(vertices, s1L, b2L, s2L);
    addTri(vertices, s2L, b2L, b3L);
    addTri(vertices, flankL, rootL, s2L);
    addTri(vertices, flankL, s2L, b3L);

    // Right Wing Struts & Membrane (Symmetrical)
    const rootR = [0.18, 0.25, 0.05];
    const thumbR = [0.65 * f, 0.7 * f, 0.25];
    const b1R = [1.15 * f, 0.65 * f, 0.3];
    const b2R = [1.85 * f, 0.35 * f, 0.2];
    const b3R = [1.55 * f, -0.45 * f, 0.08];
    const s1R = [1.45 * f, 0.4 * f - 0.25 * f, 0.12];
    const s2R = [1.65 * f, -0.15 * f - 0.25 * f, 0.05];
    const flankR = [0.18, -0.3, 0];

    addTri(vertices, rootR, b1R, thumbR);
    addTri(vertices, rootR, s1R, b1R);
    addTri(vertices, rootR, b2R, s1R);
    addTri(vertices, s1R, s2R, b2R);
    addTri(vertices, s2R, b3R, b2R);
    addTri(vertices, flankR, s2R, rootR);
    addTri(vertices, flankR, b3R, s2R);

    // Hanging Claws (Inverted Tail Hooks)
    addTri(vertices, [-0.12, -0.45 * f, 0], [-0.18 * f, -0.8 * f, -0.15], [-0.04, -0.6 * f, 0.05]);
    addTri(vertices, [0.04, -0.6 * f, 0.05], [0.18 * f, -0.8 * f, -0.15], [0.12, -0.45 * f, 0]);
  }
  else if (id === 'festival-03') {
    // HANAMI CHOCHIN
    addCylinder(vertices, -0.8 * f, 0.8 * f, 0.75 * f, 0.75 * f, 12);
    addCylinder(vertices, 0.8 * f, 0.95 * f, 0.85 * f, 0.45 * f, 8);
    addCylinder(vertices, -0.95 * f, -0.8 * f, 0.45 * f, 0.85 * f, 8);
  }
  else if (id === 'festival-04') {
    // DÍA DE LOS MUERTOS CALAVERA
    addCone(vertices, [0, 0.8 * f, 0], [0, 0, 0], 0.75 * f, 8);
    addBox(vertices, -0.4 * f, 0.4 * f, -0.6 * f, 0.0, -0.3, 0.4);
    addTri(vertices, [-0.35 * f, 0.2 * f, 0.4], [-0.15 * f, 0.2 * f, 0.4], [-0.25 * f, 0.4 * f, 0.4]);
    addTri(vertices, [0.15 * f, 0.2 * f, 0.4], [0.35 * f, 0.2 * f, 0.4], [0.25 * f, 0.4 * f, 0.4]);
    addCone(vertices, [0, 0.7 * f, 0.45], [0, 0.55 * f, 0.35], 0.3 * f, 6);
  }
  else if (id === 'festival-05') {
    // LUNAR NEW YEAR HONGBAO ENVELOPE
    const eW = 0.85, eH = 1.35 * f;
    addBox(vertices, -eW, eW, -eH * 0.5, eH * 0.5, -0.05, 0.05);
    addTri(vertices, [-eW, eH * 0.5, 0.05], [eW, eH * 0.5, 0.05], [0, eH * 0.1, 0.12 * f]);
    addCone(vertices, [0, 0, 0.15 * f], [0, 0, 0.06], 0.25 * f, 8);
  }
  else if (id === 'aerospace-01') {
    // AEROSPACE HYPAR: Hyperbolic Paraboloid Ruled Metamaterial (Curved-Crease Buckling)
    const gridSize = 16;
    const span = 1.45;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const u1 = (i / gridSize) * 2 - 1;
        const u2 = ((i + 1) / gridSize) * 2 - 1;
        const v1 = (j / gridSize) * 2 - 1;
        const v2 = ((j + 1) / gridSize) * 2 - 1;

        // Ruled surface saddle formula: z = (u^2 - v^2) * curvature
        const saddleCurvature = 0.55 * f;
        const z11 = (u1 * u1 - v1 * v1) * saddleCurvature;
        const z21 = (u2 * u2 - v1 * v1) * saddleCurvature;
        const z22 = (u2 * u2 - v2 * v2) * saddleCurvature;
        const z12 = (u1 * u1 - v2 * v2) * saddleCurvature;

        // Concentric diamond pleat perturbation
        const r11 = Math.abs(u1) + Math.abs(v1);
        const pleatOffset11 = Math.sin(r11 * Math.PI * 4) * 0.045 * f;

        const p1: [number, number, number] = [u1 * span, z11 + pleatOffset11, v1 * span];
        const p2: [number, number, number] = [u2 * span, z21, v1 * span];
        const p3: [number, number, number] = [u2 * span, z22, v2 * span];
        const p4: [number, number, number] = [u1 * span, z12, v2 * span];

        addQuad(vertices, p1, p2, p3, p4);
      }
    }
  }
  else {
    // Polyhedral diamond
    const wRadius = 1.05 * f;
    const wHeight = 1.35 * (0.35 + 0.65 * f);
    for (let i = 0; i < 8; i++) {
      const a1 = (i / 8) * Math.PI * 2;
      const a2 = ((i + 1) / 8) * Math.PI * 2;
      addQuad(vertices, [Math.cos(a1) * wRadius, -wHeight * 0.5, Math.sin(a1) * wRadius], [Math.cos(a2) * wRadius, -wHeight * 0.5, Math.sin(a2) * wRadius], [Math.cos(a2) * (wRadius * 0.75), wHeight * 0.5, Math.sin(a2) * (wRadius * 0.75)], [Math.cos(a1) * (wRadius * 0.75), wHeight * 0.5, Math.sin(a1) * (wRadius * 0.75)]);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.center(); // Center at (0, 0, 0) to eliminate clipping
  geo.computeBoundingSphere();
  if (geo.boundingSphere && geo.boundingSphere.radius > 0.05) {
    const targetRadius = 1.35;
    const s = Math.min(1.6, Math.max(0.7, targetRadius / geo.boundingSphere.radius));
    geo.scale(s, s, s);
  }
  return geo;
}

export function synthesizeKitGeometry(kitId: string, foldProgress: number): THREE.BufferGeometry {
  return synthesizeKitStepGeometry(kitId, 999, 5, foldProgress);
}
