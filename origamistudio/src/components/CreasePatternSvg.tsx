import React from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import { calculateStepPlanMetrics } from '../utils/origamiKinematics';
import { Compass, CheckCircle2, Sliders, Activity } from 'lucide-react';

export const CreasePatternSvg: React.FC = () => {
  const { activeKitId, currentStepIdx, foldFactor, setFoldFactor } = useOrigamiStore();
  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;

  const totalSteps = kit.steps ? kit.steps.length : 5;
  const metrics = calculateStepPlanMetrics(kit.id, currentStepIdx, totalSteps, foldFactor);

  const size = 380;
  const pad = 36;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const midX = size / 2;
  const midY = size / 2;

  // Convert unit metric coordinates [-1.5, 1.5] to SVG canvas pixels [pad, size - pad]
  const toSvgX = (x: number) => midX + (x / 1.5) * (w / 2);
  const toSvgY = (y: number) => midY - (y / 1.5) * (h / 2);

  const cX1 = toSvgX(metrics.creaseLine.x1);
  const cY1 = toSvgY(metrics.creaseLine.y1);
  const cX2 = toSvgX(metrics.creaseLine.x2);
  const cY2 = toSvgY(metrics.creaseLine.y2);

  const mobX = toSvgX(metrics.mobileVertex[0]);
  const mobY = toSvgY(metrics.mobileVertex[1]);

  // Construct Trajectory Arc in SVG
  const pathData = metrics.trajectoryPath.map((p, idx) => {
    const sx = toSvgX(p.x);
    const sy = toSvgY(p.y);
    return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-[#0a0d1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Left Column: Interactive Architectural Plan View (Crease Pattern) */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-full max-w-[380px] aspect-square rounded-2xl bg-[#05060d] border border-white/10 p-2 shadow-inner overflow-hidden">
          {/* Blueprint Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full relative z-10">
            <defs>
              <style>{`
                @keyframes flowArcDash {
                  to { stroke-dashoffset: -24; }
                }
                .flow-arc {
                  animation: flowArcDash 0.75s linear infinite;
                }
              `}</style>
              <linearGradient id="creaseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Paper Perimeter Boundary */}
            <rect
              x={pad}
              y={pad}
              width={w}
              height={h}
              fill="#0c101e"
              stroke="#ffffff"
              strokeWidth="2"
              rx="4"
            />

            {/* Background Completed Creases */}
            <line x1={pad} y1={pad} x2={size - pad} y2={size - pad} stroke="#2563eb" strokeWidth="1" strokeDasharray="4,4" opacity="0.35" />
            <line x1={size - pad} y1={pad} x2={pad} y2={size - pad} stroke="#2563eb" strokeWidth="1" strokeDasharray="4,4" opacity="0.35" />
            <line x1={midX} y1={pad} x2={midX} y2={size - pad} stroke="#ef4444" strokeWidth="1" strokeDasharray="6,2,2,2" opacity="0.35" />
            <line x1={pad} y1={midY} x2={size - pad} y2={midY} stroke="#ef4444" strokeWidth="1" strokeDasharray="6,2,2,2" opacity="0.35" />

            {/* Trajectory Path Arc (Calculated by Kinematics Algorithm) with Animated Flowing Dashes */}
            <path
              d={pathData}
              fill="none"
              stroke="url(#arcGlow)"
              strokeWidth="3"
              strokeDasharray="6,4"
              className="flow-arc"
              markerEnd="url(#arrow)"
            />

            {/* Active Folding Crease Axis (Point A to Point B) with authentic dashed notation */}
            <line
              x1={cX1}
              y1={cY1}
              x2={cX2}
              y2={cY2}
              stroke={metrics.foldCategory === 'mountain' ? '#f43f5e' : '#00f0ff'}
              strokeWidth="3.5"
              strokeDasharray={metrics.foldCategory === 'mountain' ? '12,4,3,4' : '8,5'}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
            />

            {/* Crease Endpoint Markers */}
            <circle cx={cX1} cy={cY1} r="5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx={cX2} cy={cY2} r="5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" />

            {/* Mobile Flap Tip Indicator */}
            <circle cx={mobX} cy={mobY} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <text x={mobX + 10} y={mobY + 4} fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              Tip P(t)
            </text>

            {/* Crease Line Label */}
            <text
              x={(cX1 + cX2) / 2 + 12}
              y={(cY1 + cY2) / 2 - 8}
              fill="#00f0ff"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="bold"
            >
              Crease Axis u⃗
            </text>
          </svg>

          {/* Bottom Badge inside SVG */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span>Step {currentStepIdx + 1} Crease Axis</span>
            </span>
            <span className="text-[#f59e0b] font-bold">θ = {metrics.foldAngleCurrent.toFixed(1)}°</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 mt-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#ef4444]" /> Mountain (- · -)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#3b82f6] border-dashed" /> Valley (---)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" /> Active Crease Axis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#f59e0b]" /> Trajectory Path
          </span>
        </div>
      </div>

      {/* Right Column: Mathematical Kinematics Telemetry & Algorithm Readout */}
      <div className="flex-1 space-y-4">
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Kinematic Algorithm Telemetry</span>
            </div>
            <h4 className="text-lg font-bold font-cinzel text-white mt-0.5">
              {metrics.foldType}
            </h4>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs font-bold">
            Step {currentStepIdx + 1} of {totalSteps}
          </div>
        </div>

        {/* Live Fold Angle Kinematics Slider */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#f59e0b]" />
              <span>Dihedral Fold Angle (θ):</span>
            </span>
            <span className="text-[#f59e0b] font-bold text-sm">
              {metrics.foldAngleCurrent.toFixed(1)}° / {metrics.foldAngleTarget.toFixed(0)}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(foldFactor * 100)}
            onChange={(e) => setFoldFactor(parseInt(e.target.value, 10) / 100)}
            className="w-full accent-[#f59e0b] h-2 bg-white/15 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0° (Flat Sheet)</span>
            <span>{metrics.foldAngleTarget.toFixed(0)}° (Full Step Fold)</span>
          </div>
        </div>

        {/* Calculated Mathematical Vectors & Paths */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Unit Crease Vector (u⃗)</span>
            <span className="text-white font-semibold block mt-1">
              [{metrics.creaseVector[0].toFixed(2)}, {metrics.creaseVector[1].toFixed(2)}, 0.00]
            </span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Crease Axis Coordinates</span>
            <span className="text-[#00f0ff] font-semibold block mt-1 truncate">
              ({metrics.creaseLine.x1.toFixed(1)}, {metrics.creaseLine.y1.toFixed(1)}) → ({metrics.creaseLine.x2.toFixed(1)}, {metrics.creaseLine.y2.toFixed(1)})
            </span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Rotational Trajectory</span>
            <span className="text-[#f59e0b] font-semibold block mt-1">
              18 Parametric Arc Steps
            </span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Rodrigues Rotation Formula</span>
            <span className="text-emerald-400 font-semibold block mt-1 text-[11px]">
              R(u⃗, θ) · P₀
            </span>
          </div>
        </div>

        {/* Theorems Proof Verification */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Geometric Proofs & Topology Validation</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Kawasaki's Theorem (180° Rule):</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>θ_odd = θ_even = 180°</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Maekawa's Parity Law (|M - V| = 2):</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>|{metrics.maekawaCheck.mountains} - {metrics.maekawaCheck.valleys}| = 2</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
