import React, { useMemo } from 'react';
import type { OrigamiKit } from '../types/origami';
import { synthesizeKitStepGeometry } from '../utils/origamiGeometry';
import { generatePrintablePaperSheetData } from '../utils/origamiDiagramRenderer';

export interface FacetData {
  points: string;
  depth: number;
  shade: number;
  isUnderside?: boolean;
}

// In-memory caches to guarantee 60fps scrolling and 0 lag across 1,000s of kits
const figureCache = new Map<string, FacetData[]>();
const creaseCache = new Map<string, any>();

export function getKitFigureFacets(kitId: string, totalSteps: number, size = 110): FacetData[] {
  const cacheKey = `${kitId}_${size}`;
  const cached = figureCache.get(cacheKey);
  if (cached) return cached;

  const effectiveSteps = Math.max(1, totalSteps);
  const geo = synthesizeKitStepGeometry(kitId, effectiveSteps - 1, effectiveSteps, 1.0);
  const pos = geo.getAttribute('position');

  if (!pos || pos.count === 0) {
    return [];
  }

  const vCount = pos.count;
  const arr = pos.array as Float32Array;

  // View angle: 30° yaw, 35° pitch (isometric desk perspective)
  const cosYaw = Math.cos(0.52);
  const sinYaw = Math.sin(0.52);
  const cosPitch = Math.cos(0.61);
  const sinPitch = Math.sin(0.61);

  // Light vector for crisp paper fold highlights
  const lx = -0.35;
  const ly = 0.75;
  const lz = 0.55;
  const lLen = Math.hypot(lx, ly, lz);
  const nLx = lx / lLen;
  const nLy = ly / lLen;
  const nLz = lz / lLen;

    interface ProjectedTri {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      depth: number;
      shade: number;
      isUnderside: boolean;
    }

    const tris: ProjectedTri[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < vCount; i += 3) {
      const ax = arr[i * 3];
      const ay = arr[i * 3 + 1];
      const az = arr[i * 3 + 2];
      const bx = arr[(i + 1) * 3];
      const by = arr[(i + 1) * 3 + 1];
      const bz = arr[(i + 1) * 3 + 2];
      const cx = arr[(i + 2) * 3];
      const cy = arr[(i + 2) * 3 + 1];
      const cz = arr[(i + 2) * 3 + 2];

      // Face normal in 3D
      const ux = bx - ax;
      const uy = by - ay;
      const uz = bz - az;
      const vx = cx - ax;
      const vy = cy - ay;
      const vz = cz - az;
      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
      const nLen = Math.hypot(nx, ny, nz);

      const shade =
        nLen > 0.0001
          ? Math.max(0.15, Math.min(1.0, 0.45 + 0.55 * Math.max(0, (nx * nLx + ny * nLy + nz * nLz) / nLen)))
          : 0.6;

      // Project 3 vertices
      const project = (x: number, y: number, z: number) => {
        const rx = x * cosYaw + z * sinYaw;
        const ry = y;
        const rz = -x * sinYaw + z * cosYaw;

        const px = rx;
        const py = -(ry * cosPitch - rz * sinPitch);
        const pz = ry * sinPitch + rz * cosPitch;
        return { px, py, pz };
      };

      const p0 = project(ax, ay, az);
      const p1 = project(bx, by, bz);
      const p2 = project(cx, cy, cz);

      minX = Math.min(minX, p0.px, p1.px, p2.px);
      maxX = Math.max(maxX, p0.px, p1.px, p2.px);
      minY = Math.min(minY, p0.py, p1.py, p2.py);
      maxY = Math.max(maxY, p0.py, p1.py, p2.py);

      const avgDepth = (p0.pz + p1.pz + p2.pz) / 3;
      const isUnderside = nz < -0.15;

      tris.push({
        x0: p0.px,
        y0: p0.py,
        x1: p1.px,
        y1: p1.py,
        x2: p2.px,
        y2: p2.py,
        depth: avgDepth,
        shade,
        isUnderside
      });
    }

    // Normalize and scale with tight padding so geometry fills the card completely
    const pad = Math.max(2, size * 0.025);
    const boundW = Math.max(0.001, maxX - minX);
    const boundH = Math.max(0.001, maxY - minY);
    const scale = (size - pad * 2) / Math.max(boundW, boundH);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const targetMid = size / 2;

    // Painter's algorithm: sort by depth back-to-front
    tris.sort((a, b) => a.depth - b.depth);

    const facets: FacetData[] = tris.map((t) => {
      const toScreenX = (x: number) => targetMid + (x - midX) * scale;
      const toScreenY = (y: number) => targetMid + (y - midY) * scale;

      const pt0 = `${toScreenX(t.x0).toFixed(1)},${toScreenY(t.y0).toFixed(1)}`;
      const pt1 = `${toScreenX(t.x1).toFixed(1)},${toScreenY(t.y1).toFixed(1)}`;
      const pt2 = `${toScreenX(t.x2).toFixed(1)},${toScreenY(t.y2).toFixed(1)}`;

      return {
        points: `${pt0} ${pt1} ${pt2}`,
        depth: t.depth,
        shade: t.shade,
        isUnderside: t.isUnderside
      };
    });

  figureCache.set(cacheKey, facets);
  return facets;
}

export function getKitCreaseSheet(kit: OrigamiKit, size = 110) {
  const cacheKey = `${kit.id}_${size}`;
  const cached = creaseCache.get(cacheKey);
  if (cached) return cached;

  const data = generatePrintablePaperSheetData(kit, { size });
  creaseCache.set(cacheKey, data);
  return data;
}

export interface OrigamiFigureProps {
  kit: OrigamiKit;
  size?: number;
  variant?: 'sculpture' | 'crease';
  animated?: boolean;
  className?: string;
}

export const OrigamiFigure: React.FC<OrigamiFigureProps> = ({
  kit,
  size = 110,
  variant = 'sculpture',
  animated = true,
  className = ''
}) => {
  const totalSteps = kit.steps?.length || 7;
  const baseAccent = kit.accent || '#d4af37';

  // 1. Version A: 3D Folded Sculpture (Isometric Shaded Facets)
  const facets = useMemo(() => getKitFigureFacets(kit.id, totalSteps, size), [kit.id, totalSteps, size]);

  // 2. Version B: Crease Pattern Blueprint (Flat Unfolded Geometric Paper)
  const creaseSheet = useMemo(() => getKitCreaseSheet(kit, size), [kit, size]);

  if (variant === 'crease') {
    const pad = creaseSheet.pad;
    const sheetW = size - pad * 2;

    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className={`shrink-0 drop-shadow-md select-none transition-transform duration-300 ${className}`}
        aria-label={`${kit.title} flat crease pattern blueprint`}
      >
        <defs>
          <style>{`
            @keyframes creaseDash {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 24; }
            }
            .crease-line-anim {
              animation: creaseDash 8s linear infinite;
            }
          `}</style>
          <filter id={`crease-shadow-${kit.id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Square Uncut Sheet Outline */}
        <rect
          x={pad}
          y={pad}
          width={sheetW}
          height={sheetW}
          rx={4}
          fill="rgba(248, 250, 252, 0.95)"
          stroke={baseAccent}
          strokeWidth="1.5"
          filter={`url(#crease-shadow-${kit.id})`}
        />

        {/* Subtle Sheet Background Radial Shading */}
        <rect
          x={pad + 2}
          y={pad + 2}
          width={sheetW - 4}
          height={sheetW - 4}
          fill={baseAccent}
          fillOpacity="0.08"
        />

        {/* Mountain & Valley Fold Lines */}
        {creaseSheet.allCreases.map((c: any, idx: number) => {
          const isMountain = c.isMountain;
          return (
            <line
              key={idx}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={isMountain ? '#ef4444' : '#06b6d4'}
              strokeWidth={size > 60 ? '1.5' : '1'}
              strokeDasharray={isMountain ? '6 2 2 2' : '4 3'}
              strokeLinecap="round"
              className={animated ? 'crease-line-anim' : ''}
              opacity={0.85}
            />
          );
        })}

        {/* Corner registration beacons */}
        <circle cx={pad + 8} cy={pad + 8} r="3" fill="#f59e0b" />
        <circle cx={size - pad - 8} cy={size - pad - 8} r="3" fill="#06b6d4" />
      </svg>
    );
  }

  // Version A: 3D Sculpture Mode
  if (!facets || facets.length === 0) {
    return <span className="text-3xl">❖</span>;
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full h-full max-w-full max-h-full shrink-0 drop-shadow-md select-none transition-transform duration-300 ${className}`}
      aria-label={`${kit.title} completed origami sculpture`}
    >
      <defs>
        <radialGradient id={`glow-${kit.id}-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={baseAccent} stopOpacity="0.35" />
          <stop offset="60%" stopColor={baseAccent} stopOpacity="0.08" />
          <stop offset="100%" stopColor={baseAccent} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`seam-light-${kit.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor={baseAccent} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>

        <style>{`
          @keyframes pulseFoldAxis {
            0%, 100% { opacity: 0.3; stroke-dashoffset: 0; }
            50% { opacity: 0.85; stroke-dashoffset: 12; }
          }
          .fold-beam-anim {
            animation: pulseFoldAxis 4s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Atmospheric Ambient Glow behind figure */}
      <circle cx={size / 2} cy={size / 2} r={size * 0.48} fill={`url(#glow-${kit.id}-${size})`} />

      {/* Folded Paper Facets with Dual-Sided Realism & Crisp Crease Definition */}
      {facets.map((f, i) => {
        const isBack = f.isUnderside;
        return (
          <polygon
            key={i}
            points={f.points}
            fill={isBack ? '#fdfbf7' : baseAccent}
            fillOpacity={isBack ? 0.92 + 0.08 * f.shade : 0.68 + 0.32 * f.shade}
            stroke={isBack ? 'rgba(0, 0, 0, 0.20)' : 'rgba(255, 255, 255, 0.70)'}
            strokeWidth={size > 60 ? '1.1' : '0.6'}
            strokeLinejoin="round"
          />
        );
      })}

      {/* Animated Paper Crease Axis Line */}
      {animated && size >= 60 && (
        <line
          x1={size * 0.12}
          y1={size * 0.88}
          x2={size * 0.88}
          y2={size * 0.12}
          stroke={`url(#seam-light-${kit.id})`}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          className="fold-beam-anim pointer-events-none"
        />
      )}
    </svg>
  );
};

export default OrigamiFigure;
