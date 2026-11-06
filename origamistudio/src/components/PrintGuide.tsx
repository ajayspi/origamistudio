import React, { useState } from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import {
  generateStepIllustrationData,
  generatePrintablePaperSheetData,
  getKitThemeColor
} from '../utils/origamiDiagramRenderer';
import { ArrowLeft, Printer, Scissors, Compass, Palette, FileText } from 'lucide-react';

type PrintMode = 'illustrated-steps' | 'printable-sheet' | 'full-companion';

export const PrintGuide: React.FC = () => {
  const { activeKitId, setView } = useOrigamiStore();
  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;

  const [printMode, setPrintMode] = useState<PrintMode>('full-companion');
  const [isMonochrome, setIsMonochrome] = useState<boolean>(true); // Diagram-Design default: Ink-saver monochrome

  const totalSteps = kit.steps ? kit.steps.length : 5;
  const themeColor = getKitThemeColor(kit.id);

  const handlePrint = () => {
    window.print();
  };

  const sheetData = generatePrintablePaperSheetData(kit, {
    size: 520,
    frontColor: themeColor,
    isMonochrome
  });

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto font-sans">
      {/* Screen Controls Header (Hidden during printing) */}
      <div className="print:hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm mb-8 space-y-4 text-zinc-900 dark:text-zinc-100 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <button
            onClick={() => setView('studio', kit.id)}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to 3D Studio</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-semibold tracking-wider">
              CAT: OS-{String(kit.kitNumber || '01').padStart(2, '0')} • {kit.title.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-xs font-bold py-2.5 px-6 rounded-lg border border-zinc-900 dark:border-white shadow-sm cursor-pointer transition-all min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT A4 VECTOR GUIDE</span>
          </button>
        </div>

        {/* Workflow Toolbar: Print Modes & Diagram-Design Styling */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setPrintMode('full-companion')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer min-h-[36px] ${
                printMode === 'full-companion'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-300 dark:border-zinc-700 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Companion</span>
            </button>

            <button
              onClick={() => setPrintMode('illustrated-steps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer min-h-[36px] ${
                printMode === 'illustrated-steps'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-300 dark:border-zinc-700 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Illustrated Steps Only</span>
            </button>

            <button
              onClick={() => setPrintMode('printable-sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer min-h-[36px] ${
                printMode === 'printable-sheet'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-300 dark:border-zinc-700 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Folding Paper Sheet</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMonochrome(!isMonochrome)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer min-h-[36px] ${
                isMonochrome
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 font-bold'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700'
              }`}
              title="Toggle Ink-Saver 1px Hairline Mode for School/Library Printers"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{isMonochrome ? 'Ink-Saver: 100% Monochrome' : 'Theme Color Fill'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Document Container (Diagram-Design Editorial Grid & 1px Hairline Styling) */}
      <div className="bg-white text-zinc-950 border border-zinc-200 rounded-none sm:rounded-xl p-6 sm:p-10 shadow-none space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
        
        {/* Editorial Spec Metadata Header */}
        <div className="border-b border-zinc-900 pb-3 flex flex-wrap items-center justify-between text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
          <span>ORIGAMISTUDIO™ EDITORIAL COMPANION</span>
          <span>ISO 216 / A4 STANDARD • ZERO CLOUD TELEMETRY</span>
          <span>DIAGRAM-DESIGN 4PX SPEC</span>
        </div>

        {/* Classroom Student Handout Verification Header */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border border-zinc-900 p-3 font-mono text-[11px] text-zinc-900">
          <div className="border-b sm:border-b-0 sm:border-r border-zinc-300 pb-1 sm:pb-0 sm:pr-2">
            <span className="font-bold block text-zinc-500 text-[9px] uppercase">Student Name</span>
            <span className="text-zinc-800">________________________</span>
          </div>
          <div className="border-b sm:border-b-0 sm:border-r border-zinc-300 pb-1 sm:pb-0 sm:pr-2">
            <span className="font-bold block text-zinc-500 text-[9px] uppercase">Grade / Section</span>
            <span className="text-zinc-800">________________________</span>
          </div>
          <div className="border-b sm:border-b-0 sm:border-r border-zinc-300 pb-1 sm:pb-0 sm:pr-2">
            <span className="font-bold block text-zinc-500 text-[9px] uppercase">Date / Table</span>
            <span className="text-zinc-800">________________________</span>
          </div>
          <div>
            <span className="font-bold block text-zinc-500 text-[9px] uppercase">Fold Accuracy</span>
            <span className="text-zinc-800 font-semibold">[  ] Pass  [  ] Precision</span>
          </div>
        </div>
        
        {/* Editorial Title Block */}
        <div className="border-b border-zinc-900 pb-4 flex items-end justify-between">
          <div className="space-y-1">
            <div className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase font-bold flex items-center gap-1.5">
              <span>YOSHIZAWA-RANDLETT STANDARD</span>
              <span>•</span>
              <span>INDEPENDENT PICTORIAL NOTATION</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-normal text-zinc-950 tracking-tight">
              {kit.title}
            </h1>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="font-bold text-base text-zinc-950 tabular-nums">
              KIT {String(kit.kitNumber || '01').padStart(2, '0')}
            </div>
            <div className="text-zinc-500 text-[11px]">{totalSteps} Illustrated Steps</div>
          </div>
        </div>

        {/* 1. PRINTABLE FOLDING PAPER SHEET */}
        {(printMode === 'printable-sheet' || printMode === 'full-companion') && (
          <div className="space-y-3 page-break-after">
            <div className="flex items-center justify-between border-b border-zinc-300 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
                <Scissors className="w-3.5 h-3.5 text-zinc-900" />
                <span>1. Cut-Out Origami Paper (180mm × 180mm Square)</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                1px Hairline Cut Border
              </span>
            </div>

            <div className="flex justify-center p-3 bg-zinc-50 print:bg-white rounded-none border border-zinc-200 print:border-none">
              <svg
                viewBox={`0 0 ${sheetData.size} ${sheetData.size}`}
                className="w-full max-w-[460px] aspect-square"
              >
                <defs>
                  {/* Subtle Monochrome or Theme Tint */}
                  <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={sheetData.frontColor} stopOpacity={isMonochrome ? '0' : '0.10'} />
                    <stop offset="100%" stopColor={sheetData.frontColor} stopOpacity={isMonochrome ? '0' : '0.03'} />
                  </linearGradient>
                </defs>

                {/* Outer Perimeter Cutting Guide with Diagram-Design 1px Dashed Scissors Line */}
                <rect
                  x={sheetData.pad}
                  y={sheetData.pad}
                  width={sheetData.sheetSize}
                  height={sheetData.sheetSize}
                  fill="url(#sheetGrad)"
                  stroke="#18181b"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                />

                {/* Corner Hairline Registration Crosshairs (+) */}
                {sheetData.registrationMarks.map((m, idx) => (
                  <line
                    key={idx}
                    x1={m.x1}
                    y1={m.y1}
                    x2={m.x2}
                    y2={m.y2}
                    stroke="#18181b"
                    strokeWidth="1"
                  />
                ))}

                {/* Diagonal & Center Crease Guide Marks */}
                <line
                  x1={sheetData.pad}
                  y1={sheetData.pad}
                  x2={sheetData.size - sheetData.pad}
                  y2={sheetData.size - sheetData.pad}
                  stroke={isMonochrome ? '#18181b' : '#2563eb'}
                  strokeWidth="1"
                  strokeDasharray="5,4"
                  opacity={isMonochrome ? '0.45' : '0.65'}
                />
                <line
                  x1={sheetData.size - sheetData.pad}
                  y1={sheetData.pad}
                  x2={sheetData.pad}
                  y2={sheetData.size - sheetData.pad}
                  stroke={isMonochrome ? '#18181b' : '#2563eb'}
                  strokeWidth="1"
                  strokeDasharray="5,4"
                  opacity={isMonochrome ? '0.45' : '0.65'}
                />
                <line
                  x1={sheetData.midX}
                  y1={sheetData.pad}
                  x2={sheetData.midX}
                  y2={sheetData.size - sheetData.pad}
                  stroke={isMonochrome ? '#18181b' : '#dc2626'}
                  strokeWidth="1"
                  strokeDasharray="7,3,2,3"
                  opacity={isMonochrome ? '0.45' : '0.65'}
                />
                <line
                  x1={sheetData.pad}
                  y1={sheetData.midY}
                  x2={sheetData.size - sheetData.pad}
                  y2={sheetData.midY}
                  stroke={isMonochrome ? '#18181b' : '#dc2626'}
                  strokeWidth="1"
                  strokeDasharray="7,3,2,3"
                  opacity={isMonochrome ? '0.45' : '0.65'}
                />

                {/* Model Specific Pre-Marked Creases */}
                {sheetData.allCreases.map((c, idx) => (
                  <line
                    key={idx}
                    x1={c.x1}
                    y1={c.y1}
                    x2={c.x2}
                    y2={c.y2}
                    stroke={isMonochrome ? '#18181b' : c.isMountain ? '#dc2626' : '#2563eb'}
                    strokeWidth="1.2"
                    strokeDasharray={c.isMountain ? '8,2,2,2,2,2' : '6,3'}
                  />
                ))}

                {/* Center Registration Target Bullseye */}
                <circle cx={sheetData.midX} cy={sheetData.midY} r="8" fill="none" stroke="#18181b" strokeWidth="1" />
                <line x1={sheetData.midX - 12} y1={sheetData.midY} x2={sheetData.midX + 12} y2={sheetData.midY} stroke="#18181b" strokeWidth="0.8" />
                <line x1={sheetData.midX} y1={sheetData.midY - 12} x2={sheetData.midX} y2={sheetData.midY + 12} stroke="#18181b" strokeWidth="0.8" />
                <circle cx={sheetData.midX} cy={sheetData.midY} r="2" fill="#18181b" />

                {/* Corner Alignment Landmark Beacons: ❶ ❷ ❸ ❹ */}
                {sheetData.corners.map((c, idx) => (
                  <g key={idx}>
                    <circle cx={c.x} cy={c.y} r="8" fill="#18181b" />
                    <text
                      x={c.x}
                      y={c.y + 3}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>
                  </g>
                ))}

                {/* Edge Cut Indicator Scissors Icon */}
                <text x={sheetData.pad + 12} y={sheetData.pad - 6} fontSize="12" fill="#18181b">✂</text>
                <text x={sheetData.size - sheetData.pad - 22} y={sheetData.size - sheetData.pad + 14} fontSize="12" fill="#18181b">✂</text>
              </svg>
            </div>
          </div>
        )}

        {/* 2. ALL STEPS IN ILLUSTRATED MANNER */}
        {(printMode === 'illustrated-steps' || printMode === 'full-companion') && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-300 pb-2 gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-zinc-900" />
                <span>2. Illustrated Folding Sequence (Yoshizawa-Randlett Standards)</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0 border-t-2 border-dashed border-zinc-900 inline-block" />
                  <span>Valley (- - -)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0 border-t-2 border-dotted border-zinc-900 inline-block" />
                  <span>Mountain (- · · -)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[8px] font-bold">1</span>
                  <span>Point 1 ➔ 2</span>
                </span>
              </div>
            </div>

            {/* Illustrated Steps Grid (Diagram-Design 4px Spacing & 1px Hairlines) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: totalSteps }).map((_, stepIdx) => {
                const diag = generateStepIllustrationData(kit.id, stepIdx, totalSteps, {
                  size: 240,
                  frontColor: themeColor,
                  isMonochrome
                });

                return (
                  <div
                    key={stepIdx}
                    className="bg-white border border-zinc-300 print:border-zinc-900 p-3 flex flex-col justify-between relative shadow-none"
                  >
                    {/* Top Step Metadata Pill */}
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-sm bg-zinc-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                          {stepIdx + 1}
                        </span>
                        <span className="font-mono text-[9px] uppercase font-semibold text-zinc-600">
                          Step {String(stepIdx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div>
                        {diag.isMountain ? (
                          <span className="px-1.5 py-0.5 border border-zinc-400 font-mono text-[8px] uppercase font-bold text-zinc-800">
                            MTN - · · -
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 border border-zinc-400 font-mono text-[8px] uppercase font-bold text-zinc-800">
                            VLY - - -
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vector Illustrated Step Drawing */}
                    <div className="flex justify-center py-1">
                      <svg
                        viewBox={`0 0 ${diag.size} ${diag.size}`}
                        className="w-full max-w-[200px] aspect-square"
                      >
                        <defs>
                          <marker
                            id={`arrow-${stepIdx}`}
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                          >
                            <path d="M 0 2 L 8 5 L 0 8 z" fill="#18181b" />
                          </marker>
                        </defs>

                        {/* Paper Base Polygon Silhouette */}
                        <polygon
                          points={diag.polyPointsStr}
                          fill={isMonochrome ? '#ffffff' : diag.paperFill}
                          stroke="#18181b"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />

                        {/* Background Crease Lines */}
                        <line
                          x1={diag.pad}
                          y1={diag.size / 2}
                          x2={diag.size - diag.pad}
                          y2={diag.size / 2}
                          stroke="#a1a1aa"
                          strokeWidth="0.8"
                          strokeDasharray="3,3"
                        />

                        {/* Active Fold Crease Line (Yoshizawa-Randlett Standard) */}
                        <line
                          x1={diag.cX1}
                          y1={diag.cY1}
                          x2={diag.cX2}
                          y2={diag.cY2}
                          stroke="#18181b"
                          strokeWidth="2"
                          strokeDasharray={diag.isMountain ? '8,2,2,2,2,2' : '6,3'}
                          strokeLinecap="round"
                        />

                        {/* Yoshizawa-Randlett Curved Motion Arrow (Arc from Point ❶ to Target ❷) */}
                        <path
                          d={diag.arrowPath}
                          fill="none"
                          stroke="#18181b"
                          strokeWidth="1.8"
                          strokeDasharray="4,2"
                          markerEnd={`url(#arrow-${stepIdx})`}
                        />

                        {/* Landmark ❶ Lift Corner Beacon */}
                        <circle cx={diag.ptA.x} cy={diag.ptA.y} r="6.5" fill="#18181b" />
                        <text
                          x={diag.ptA.x}
                          y={diag.ptA.y + 2.8}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          1
                        </text>

                        {/* Destination Target ❷ Bullseye */}
                        <circle cx={diag.ptB.x} cy={diag.ptB.y} r="7" fill="none" stroke="#18181b" strokeWidth="1" strokeDasharray="2,2" />
                        <circle cx={diag.ptB.x} cy={diag.ptB.y} r="3" fill="#18181b" />
                        <text
                          x={diag.ptB.x + 10}
                          y={diag.ptB.y + 3}
                          fill="#18181b"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          2
                        </text>
                      </svg>
                    </div>

                    {/* Diagram-Design Spec Callout Margin */}
                    <div className="border-t border-zinc-200 pt-1.5 mt-1 font-mono text-[9px] text-zinc-600 flex items-center justify-between">
                      <span>Pt 1 ➔ Pt 2</span>
                      <span className="text-zinc-500">Axiom O1/O2</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Diagram-Design Editorial Verification Footer */}
        <div className="border-t border-zinc-900 pt-3 text-[10px] font-mono text-zinc-600 flex flex-wrap items-center justify-between gap-2">
          <span>ORIGAMISTUDIO™ UNIVERSAL PICTORIAL GUIDE</span>
          <span>COMPUTATIONAL RIGID ORIGAMI PROTOCOL</span>
          <span>NO INTERNET CONNECTION REQUIRED</span>
        </div>
      </div>
    </div>
  );
};
