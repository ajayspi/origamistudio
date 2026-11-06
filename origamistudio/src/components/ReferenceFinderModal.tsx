import React, { useState } from 'react';
import {
  solveOrigamiReference,
  solveArbitraryReferencePoint,
  REFERENCE_TARGETS,
  type ReferenceSolution
} from '../utils/referenceFinder';
import { Compass, X, Check, BookOpen, Layers, Crosshair } from 'lucide-react';

interface ReferenceFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceFinderModal: React.FC<ReferenceFinderModalProps> = ({
  isOpen,
  onClose
}) => {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [selectedTarget, setSelectedTarget] = useState<string>('1/3');
  const [customCoord, setCustomCoord] = useState<{ x: number; y: number }>({ x: 0.382, y: 0.618 });

  const solution: ReferenceSolution =
    mode === 'preset'
      ? solveOrigamiReference(selectedTarget)
      : solveArbitraryReferencePoint(customCoord);

  if (!isOpen) return null;

  const handleSvgPaperClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const normX = Math.round((clickX / rect.width) * 1000) / 1000;
    // Origami y origin is bottom-left
    const normY = Math.round((1 - clickY / rect.height) * 1000) / 1000;
    setCustomCoord({
      x: Math.max(0.02, Math.min(0.98, normX)),
      y: Math.max(0.02, Math.min(0.98, normY))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-stone-900 dark:text-white flex items-center gap-1.5">
                <span>Robert Lang Reference Finder</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  Wasm / Huzita O1–O7
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Analytical Tree Search & Mathematical Axiom Solver
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Presets vs. Arbitrary Clicker) */}
        <div className="px-6 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-stone-200/70 dark:bg-stone-800/80 p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setMode('preset')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                mode === 'preset'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Preset Ratios
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 ${
                mode === 'custom'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Universal Target (Any X, Y)</span>
            </button>
          </div>

          {mode === 'preset' && (
            <div className="flex flex-wrap gap-1.5">
              {REFERENCE_TARGETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTarget(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    selectedTarget === t.id
                      ? 'bg-cyan-600 dark:bg-cyan-500 text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-cyan-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Universal Clickable Paper Canvas (Active in Custom Mode) */}
          {mode === 'custom' && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-6">
              {/* Interactive SVG Paper Square */}
              <div className="flex flex-col items-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48 bg-white dark:bg-stone-950 border-2 border-stone-800 rounded-lg cursor-crosshair shadow-inner"
                  onClick={handleSvgPaperClick}
                >
                  {/* Grid Lines */}
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#71717a" strokeWidth="0.8" strokeDasharray="2,2" />
                  <line x1="0" y1="100" x2="200" y2="100" stroke="#71717a" strokeWidth="0.8" strokeDasharray="2,2" />
                  <line x1="0" y1="200" x2="200" y2="0" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="3,3" />

                  {/* Target Crosshairs */}
                  <g>
                    <line
                      x1={customCoord.x * 200}
                      y1={0}
                      x2={customCoord.x * 200}
                      y2={200}
                      stroke="#06b6d4"
                      strokeWidth="1.2"
                      strokeDasharray="4,2"
                    />
                    <line
                      x1={0}
                      y1={(1 - customCoord.y) * 200}
                      x2={200}
                      y2={(1 - customCoord.y) * 200}
                      stroke="#06b6d4"
                      strokeWidth="1.2"
                      strokeDasharray="4,2"
                    />
                    {/* Bullseye Ring */}
                    <circle
                      cx={customCoord.x * 200}
                      cy={(1 - customCoord.y) * 200}
                      r="7"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <circle
                      cx={customCoord.x * 200}
                      cy={(1 - customCoord.y) * 200}
                      r="2.5"
                      fill="#f59e0b"
                    />
                  </g>
                </svg>
                <span className="text-[10px] font-mono text-stone-500 mt-1.5">
                  Click anywhere on paper to place target
                </span>
              </div>

              {/* Numerical Readout & Sliders */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <div className="flex justify-between text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                    <span>X Coordinate (Horizontal):</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{customCoord.x.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="98"
                    value={Math.round(customCoord.x * 100)}
                    onChange={(e) => setCustomCoord(prev => ({ ...prev, x: parseInt(e.target.value, 10) / 100 }))}
                    className="w-full accent-cyan-600 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer mt-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                    <span>Y Coordinate (Vertical):</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{customCoord.y.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="98"
                    value={Math.round(customCoord.y * 100)}
                    onChange={(e) => setCustomCoord(prev => ({ ...prev, y: parseInt(e.target.value, 10) / 100 }))}
                    className="w-full accent-cyan-600 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer mt-1"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400 flex items-center justify-between">
                  <span>Huzita Tree Depth:</span>
                  <span className="font-bold text-stone-900 dark:text-white">4 Axiom Iterations</span>
                </div>
              </div>
            </div>
          )}

          {/* Target Summary Card */}
          <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300">
                TARGET IDENTIFIED
              </span>
              <h3 className="text-lg font-bold font-mono text-stone-900 dark:text-white mt-0.5">
                {solution.targetName}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Value: <code className="font-mono text-cyan-700 dark:text-cyan-300 font-bold">{solution.targetValue.toFixed(6)}</code>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Error: {solution.maxErrorMm.toFixed(3)} mm</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {solution.totalSteps} Folding Steps
              </span>
            </div>
          </div>

          {/* Mathematical Proof */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Mathematical Proof & Theorem
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 font-sans">
              {solution.mathematicalProof}
            </p>
          </div>

          {/* Step-by-Step Huzita Axiom Folding Sequence */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h4 className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Minimal Folding Sequence ({solution.totalSteps} Steps)
              </h4>
            </div>

            <div className="space-y-3">
              {solution.steps.map((step) => (
                <div
                  key={step.step}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-xs flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">
                        {step.axiomName}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        Eq: <code className="text-stone-700 dark:text-stone-300">{step.creaseEquation}</code>
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between text-xs font-mono text-stone-500">
          <span>HUZITA-HATORI AXIOMS O1–O7</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 font-bold transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
