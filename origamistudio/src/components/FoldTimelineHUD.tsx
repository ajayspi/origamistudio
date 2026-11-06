import React from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export interface FoldTimelineHUDProps {
  kitTitle?: string;
  stepIndex?: number;
  totalSteps?: number;
  foldProgress: number; // 0.0 to 1.0
  onSeek?: (progress: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onReset?: () => void;
  isCompact?: boolean;
}

interface WaveLane {
  id: string;
  label: string;
  type: 'clock' | 'actuation' | 'strain' | 'yield';
  segments: {
    start: number; // 0..1
    end: number;   // 0..1
    state: 'idle' | 'rotating' | 'folded' | 'springback';
    valueText?: string;
  }[];
}

export const FoldTimelineHUD: React.FC<FoldTimelineHUDProps> = ({
  kitTitle = 'Traditional Crane',
  stepIndex = 1,
  totalSteps = 6,
  foldProgress,
  onSeek,
  isPlaying = false,
  onTogglePlay,
  onReset,
  isCompact = false,
}) => {
  // Timeline lanes modeling the multi-stage kinematic fold sequence
  const lanes: WaveLane[] = [
    {
      id: 'clk',
      label: 'ACTUATOR CLK',
      type: 'clock',
      segments: Array.from({ length: 10 }).map((_, i) => ({
        start: i * 0.1,
        end: (i + 1) * 0.1,
        state: i % 2 === 0 ? 'idle' : 'rotating',
      })),
    },
    {
      id: 'hinge_primary',
      label: 'PRIMARY HINGE θ₁',
      type: 'actuation',
      segments: [
        { start: 0.0, end: 0.15, state: 'idle', valueText: '0°' },
        { start: 0.15, end: 0.75, state: 'rotating', valueText: '0° ➔ 180°' },
        { start: 0.75, end: 1.0, state: 'folded', valueText: '180° Flat' },
      ],
    },
    {
      id: 'hinge_tuck',
      label: 'REVERSE SQUASH θ₂',
      type: 'actuation',
      segments: [
        { start: 0.0, end: 0.45, state: 'idle', valueText: '0° Rest' },
        { start: 0.45, end: 0.85, state: 'rotating', valueText: 'Tuck 90°' },
        { start: 0.85, end: 1.0, state: 'folded', valueText: 'Locked' },
      ],
    },
    {
      id: 'strain_xpbd',
      label: 'DIHEDRAL STRAIN',
      type: 'strain',
      segments: [
        { start: 0.0, end: 0.2, state: 'idle', valueText: '0.0 N·m' },
        { start: 0.2, end: 0.75, state: 'rotating', valueText: 'Peak 4.2 N·m' },
        { start: 0.75, end: 0.9, state: 'folded', valueText: 'Plastic Flow' },
        { start: 0.9, end: 1.0, state: 'springback', valueText: 'Res. 0.3 N·m' },
      ],
    },
    {
      id: 'plastic_yield',
      label: 'PLASTIC YIELD / SET',
      type: 'yield',
      segments: [
        { start: 0.0, end: 0.7, state: 'idle', valueText: 'Elastic [0]' },
        { start: 0.7, end: 0.92, state: 'folded', valueText: 'Yield [1]' },
        { start: 0.92, end: 1.0, state: 'springback', valueText: 'Springback -4°' },
      ],
    },
  ];

  // Width & Layout metrics for WaveJSON SVG diagram
  const svgWidth = 600;
  const laneHeight = isCompact ? 24 : 32;
  const headerHeight = 24;
  const totalSvgHeight = headerHeight + lanes.length * laneHeight + 16;
  const labelWidth = 140;
  const waveAreaWidth = svgWidth - labelWidth - 20;

  // Compute X coordinate for progress in [0, 1]
  const progressToX = (p: number) => labelWidth + Math.max(0, Math.min(1, p)) * waveAreaWidth;

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const relativeX = (clickX / rect.width) * svgWidth;
    if (relativeX >= labelWidth && relativeX <= labelWidth + waveAreaWidth) {
      const p = (relativeX - labelWidth) / waveAreaWidth;
      onSeek(Math.max(0, Math.min(1, p)));
    }
  };

  // Active angle estimate
  const currentAngleDeg = Math.round(foldProgress * 180);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 font-sans shadow-lg select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
            WAVEDROM KINEMATIC TIMELINE HUD
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            STEP {stepIndex} / {totalSteps} • {kitTitle}
          </span>
        </div>

        {/* Playback Controls & Progress Readout */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs tabular-nums text-zinc-300 flex items-center gap-2">
            <span className="text-zinc-500">t:</span>
            <span className="font-bold text-cyan-400">{(foldProgress * 100).toFixed(1)}%</span>
            <span className="text-zinc-500">θ:</span>
            <span className="font-bold text-amber-400">{currentAngleDeg}°</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            {onTogglePlay && (
              <button
                onClick={onTogglePlay}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Animation' : 'Play Kinematic Fold'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Fold to 0%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* WaveDrom Vector Diagram */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
          className="w-full min-w-[500px] h-auto cursor-crosshair"
          onClick={handleSvgClick}
        >
          <defs>
            <linearGradient id="activeHingeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="strainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Time Division Grid & Header Ticks */}
          <g>
            {Array.from({ length: 11 }).map((_, i) => {
              const tickX = labelWidth + (i / 10) * waveAreaWidth;
              return (
                <g key={i}>
                  <line
                    x1={tickX}
                    y1={headerHeight - 4}
                    x2={tickX}
                    y2={totalSvgHeight - 6}
                    stroke="#27272a"
                    strokeWidth="1"
                    strokeDasharray={i === 0 || i === 10 ? 'none' : '2,2'}
                  />
                  <text
                    x={tickX}
                    y={headerHeight - 8}
                    fill="#71717a"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {(i * 0.1).toFixed(1)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Render Wave Lanes */}
          {lanes.map((lane, laneIdx) => {
            const laneY = headerHeight + laneIdx * laneHeight;
            const midY = laneY + laneHeight / 2;
            const topY = laneY + 5;
            const bottomY = laneY + laneHeight - 5;

            return (
              <g key={lane.id}>
                {/* Lane Divider & Background */}
                <line
                  x1={10}
                  y1={laneY + laneHeight}
                  x2={svgWidth - 10}
                  y2={laneY + laneHeight}
                  stroke="#18181b"
                  strokeWidth="1"
                />

                {/* Lane Label */}
                <text
                  x={12}
                  y={midY + 3.5}
                  fill="#a1a1aa"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {lane.label}
                </text>

                {/* Wave Signals */}
                {lane.type === 'clock' && (
                  <path
                    d={lane.segments
                      .map((seg, sIdx) => {
                        const x1 = progressToX(seg.start);
                        const x2 = progressToX(seg.end);
                        const y = sIdx % 2 === 0 ? bottomY : topY;
                        const nextY = sIdx % 2 === 0 ? topY : bottomY;
                        return `M ${x1} ${y} L ${x2} ${y} L ${x2} ${nextY}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.2"
                  />
                )}

                {lane.type === 'actuation' &&
                  lane.segments.map((seg, sIdx) => {
                    const x1 = progressToX(seg.start);
                    const x2 = progressToX(seg.end);
                    const isRotating = seg.state === 'rotating';
                    const isFolded = seg.state === 'folded';

                    return (
                      <g key={sIdx}>
                        {isRotating ? (
                          <>
                            {/* Bus Transition / Polygon Hatch */}
                            <polygon
                              points={`${x1},${bottomY} ${x2},${topY} ${x2},${bottomY} ${x1},${bottomY}`}
                              fill="url(#activeHingeGrad)"
                            />
                            <line x1={x1} y1={bottomY} x2={x2} y2={topY} stroke="#06b6d4" strokeWidth="1.8" />
                            <line x1={x1} y1={bottomY} x2={x2} y2={bottomY} stroke="#06b6d4" strokeWidth="1.8" />
                          </>
                        ) : (
                          <line
                            x1={x1}
                            y1={isFolded ? topY : bottomY}
                            x2={x2}
                            y2={isFolded ? topY : bottomY}
                            stroke={isFolded ? '#10b981' : '#52525b'}
                            strokeWidth="1.8"
                          />
                        )}

                        {/* Segment State Text Label */}
                        {seg.valueText && (
                          <text
                            x={(x1 + x2) / 2}
                            y={midY + 3}
                            fill="#d4d4d8"
                            fontSize="8.5"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {seg.valueText}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {lane.type === 'strain' &&
                  lane.segments.map((seg, sIdx) => {
                    const x1 = progressToX(seg.start);
                    const x2 = progressToX(seg.end);
                    return (
                      <g key={sIdx}>
                        <rect
                          x={x1}
                          y={topY + 3}
                          width={Math.max(0, x2 - x1)}
                          height={laneHeight - 16}
                          fill={seg.state === 'rotating' ? 'url(#strainGrad)' : '#27272a'}
                          rx="2"
                        />
                        {seg.valueText && (
                          <text
                            x={(x1 + x2) / 2}
                            y={midY + 3}
                            fill="#fafafa"
                            fontSize="8.5"
                            fontFamily="monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {seg.valueText}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {lane.type === 'yield' &&
                  lane.segments.map((seg, sIdx) => {
                    const x1 = progressToX(seg.start);
                    const x2 = progressToX(seg.end);
                    const isYield = seg.state === 'folded';
                    const isSpringback = seg.state === 'springback';

                    return (
                      <g key={sIdx}>
                        <rect
                          x={x1}
                          y={topY + 3}
                          width={Math.max(0, x2 - x1)}
                          height={laneHeight - 16}
                          fill={isYield ? '#b91c1c' : isSpringback ? '#4338ca' : '#18181b'}
                          stroke={isYield ? '#ef4444' : isSpringback ? '#6366f1' : '#3f3f46'}
                          strokeWidth="1"
                          rx="2"
                        />
                        {seg.valueText && (
                          <text
                            x={(x1 + x2) / 2}
                            y={midY + 3}
                            fill="#ffffff"
                            fontSize="8"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {seg.valueText}
                          </text>
                        )}
                      </g>
                    );
                  })}
              </g>
            );
          })}

          {/* Interactive Scrubbing Playhead (Current Fold Progress) */}
          <g>
            <line
              x1={progressToX(foldProgress)}
              y1={headerHeight - 12}
              x2={progressToX(foldProgress)}
              y2={totalSvgHeight - 4}
              stroke="#f59e0b"
              strokeWidth="2"
            />
            {/* Playhead Diamond Marker */}
            <polygon
              points={`${progressToX(foldProgress)},${headerHeight - 2} ${progressToX(foldProgress) - 5},${headerHeight - 12} ${progressToX(foldProgress) + 5},${headerHeight - 12}`}
              fill="#f59e0b"
            />
          </g>
        </svg>
      </div>

      {/* Scrubbing Helper Footnote */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2 px-1">
        <span>Click or drag anywhere on the timeline to scrub fold progression</span>
        <span className="text-zinc-400">XPBD Dihedral Angle Integration</span>
      </div>
    </div>
  );
};
