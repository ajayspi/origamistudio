import React, { useState } from 'react';
import { Compass, ChevronDown, ChevronUp } from 'lucide-react';

interface DeskRadarProps {
  isDiamond: boolean;
  accentColor?: string;
  stepNumber: number;
  foldFactor: number;
  creaseLine?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  foldCategory?: string;
}

export const DeskRadar: React.FC<DeskRadarProps> = ({
  isDiamond,
  accentColor = '#f59e0b',
  stepNumber,
  foldFactor,
  foldCategory = 'valley'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white/95 dark:bg-[#0a0d18]/90 backdrop-blur-md border border-stone-200 dark:border-white/15 rounded-xl shadow-xl p-3 w-48 font-mono select-none transition-all duration-300 text-stone-900 dark:text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-cyan-700 dark:text-cyan-300 font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-spin-slow" />
          <span>DESK RADAR • S{stepNumber}</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          title={isCollapsed ? "Expand Desk Radar" : "Collapse Desk Radar"}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="pt-2 space-y-2.5">
          {/* Top-Down Desk Visualizer Grid */}
          <div className="relative w-full h-32 bg-stone-100 dark:bg-[#05070f] rounded-lg border border-stone-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
            {/* Desk Mat Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="deskGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0284c7" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#deskGrid)" />
            </svg>

            {/* Paper Shape on Desk */}
            <div
              className="relative transition-transform duration-500 ease-out"
              style={{
                transform: `rotate(${isDiamond ? 45 : 0}deg)`,
                width: '60px',
                height: '60px'
              }}
            >
              {/* Paper Square */}
              <div
                className="w-full h-full rounded-[3px] shadow-lg border border-white/60 dark:border-white/40 flex items-center justify-center transition-colors duration-300"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 16px ${accentColor}40`
                }}
              >
                {/* Crease Line Indicator on Mini-Map */}
                <div
                  className="absolute w-full h-[2px] border-b-2 border-dashed border-white"
                  style={{
                    top: '50%',
                    left: 0,
                    transform: isDiamond ? 'rotate(-45deg)' : 'none'
                  }}
                />
                
                {/* Underside White Exposure Hint during fold */}
                {foldFactor > 0.1 && (
                  <div
                    className="absolute bg-white/95 rounded-[2px] transition-all duration-300 pointer-events-none"
                    style={{
                      width: isDiamond ? '60%' : '100%',
                      height: `${foldFactor * 45}%`,
                      top: 0,
                      opacity: 0.9
                    }}
                  />
                )}
              </div>

              {/* Point of alignment dot (the vertex facing the student) */}
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-cyan-500 border border-white shadow-md -translate-x-1/2 -translate-y-1/2 animate-ping"
                style={{
                  bottom: '-6px',
                  left: '50%'
                }}
              />
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-cyan-500 border border-white shadow-md -translate-x-1/2 -translate-y-1/2"
                style={{
                  bottom: '-6px',
                  left: '50%'
                }}
              />

              {/* Step 3 Special Belly Button Anchor Landmark */}
              {stepNumber === 3 && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-amber-500 text-stone-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-lg animate-pulse"
                >
                  ⬇️ OPEN LEGS
                </div>
              )}
            </div>

            {/* "YOU" Vantage Point Marker at the bottom */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-black/75 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-white/10 text-[11px] text-cyan-800 dark:text-cyan-300 font-bold tracking-wider shadow-sm">
              <span>👤</span>
              <span>YOU (CHEST)</span>
            </div>
          </div>

          {/* Alignment Direction Landmark Banner */}
          <div className="bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 p-2 rounded-lg text-center space-y-1">
            {stepNumber === 3 ? (
              <>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                  <span>⚠️ OPEN FLAPS → CHEST</span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-slate-300 leading-snug">
                  Point split open legs to your belly button; closed tip faces away
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 block uppercase mt-0.5 font-bold">(Anchor landmark)</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                  <span>{isDiamond ? '♢' : '□'}</span>
                  <span>{isDiamond ? 'CORNER → CHEST' : 'FLAT EDGE → CHEST'}</span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-slate-300 leading-snug">
                  {isDiamond
                    ? 'Point corner directly towards your body'
                    : 'Keep bottom flat edge parallel to desk'}
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400 block uppercase mt-0.5">({foldCategory} mode)</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
