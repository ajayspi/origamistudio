import React, { useState, useEffect, useMemo } from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, Compass,
  Hand, Volume2, VolumeX, Sparkles, CheckSquare, GraduationCap,
  Baby, Compass as CompassIcon, Cpu
} from 'lucide-react';
import { getSchoolStepProfile, schoolVoice } from '../utils/schoolOrigami';
import { generateStepIllustrationData, generateStepAfterIllustrationData } from '../utils/origamiDiagramRenderer';

export const StepGuidance: React.FC = () => {
  const {
    activeKitId,
    currentStepIdx,
    setCurrentStepIdx,
    completedStepIndices,
    toggleStepCompleted,
    markKitCompleted,
    setFoldFactor,
    ageTrack,
    setAgeTrack,
    isSpeaking,
    setIsSpeaking,
  } = useOrigamiStore();

  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;
  const { playCrease, playStepClick, playChime } = useOrigamiAudio();

  const totalSteps = kit.steps ? kit.steps.length : 1;
  const step = kit.steps[currentStepIdx] || {
    stepNumber: 1,
    title: 'Preliminary Fold',
    instruction: 'Fold according to sequence.',
    foldType: 'Valley Fold'
  };

  const isStepDone = completedStepIndices.includes(currentStepIdx);
  const schoolProfile = getSchoolStepProfile(currentStepIdx, step.title, totalSteps);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const diagBefore = generateStepIllustrationData(kit.id, currentStepIdx, totalSteps, {
    size: 200,
    frontColor: kit.accent || '#f43f5e',
    isDark: isDarkMode
  });

  const diagAfter = generateStepAfterIllustrationData(kit.id, currentStepIdx, totalSteps, {
    size: 200,
    frontColor: kit.accent || '#f43f5e',
    isDark: isDarkMode
  });

  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false]);
  const [isStepMatched, setIsStepMatched] = useState<boolean>(false);

  // Table Orientation (Diamond ♢ vs Square □)
  const isDiamond = useMemo(() => {
    const title = (step.title || '').toLowerCase();
    const inst = (step.instruction || '').toLowerCase();
    const foldType = (step.foldType || '').toLowerCase();
    return (
      title.includes('taco') ||
      title.includes('diagonal') ||
      title.includes('shawl') ||
      title.includes('kite') ||
      inst.includes('diagonal') ||
      inst.includes('diamond') ||
      foldType.includes('diagonal')
    );
  }, [step]);

  // Reset checklist & matched state on step change
  useEffect(() => {
    setCheckedItems([false, false, false]);
    setIsStepMatched(completedStepIndices.includes(currentStepIdx));
    schoolVoice.stop();
    setIsSpeaking(false);
  }, [currentStepIdx, setIsSpeaking, completedStepIndices]);

  const handleConfirmMatch = () => {
    playChime();
    setIsStepMatched(true);
    if (!isStepDone) {
      toggleStepCompleted(currentStepIdx);
    }
  };

  const toggleCheck = (idx: number) => {
    playStepClick();
    setCheckedItems((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      schoolVoice.stop();
      setIsSpeaking(false);
    } else {
      let speechText = '';
      if (ageTrack === 'junior') {
        speechText = `${schoolProfile.juniorTitle}. ${schoolProfile.juniorInstruction} ${schoolProfile.juniorMetaphor}`;
      } else if (ageTrack === 'explorer') {
        speechText = `Step ${currentStepIdx + 1}: ${step.title}. ${step.instruction} Align corner 1 with target 2, and crease firmly with your thumb.`;
      } else {
        speechText = `Step ${currentStepIdx + 1}: ${step.title}. ${step.instruction} ${schoolProfile.stemConcept}. ${schoolProfile.stemTheorem}`;
      }

      schoolVoice.speak(
        speechText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        ageTrack === 'junior' ? 1.15 : 1.0,
        ageTrack === 'junior' ? 0.88 : 0.95
      );
    }
  };

  const handlePrev = () => {
    schoolVoice.stop();
    setIsSpeaking(false);
    if (currentStepIdx > 0) {
      playCrease();
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleNext = () => {
    schoolVoice.stop();
    setIsSpeaking(false);
    if (currentStepIdx < totalSteps - 1) {
      playCrease();
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      markKitCompleted(kit.id);
    }
  };

  const handleToggleComplete = () => {
    playStepClick();
    toggleStepCompleted(currentStepIdx);
    if (!isStepDone && currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else if (!isStepDone && currentStepIdx === totalSteps - 1) {
      markKitCompleted(kit.id);
    }
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 text-stone-900 dark:text-white">
      {/* Age Track Switcher (School-Oriented 5-18 Years) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-xs font-mono font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider">
            Learning Mode:
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-200/70 dark:bg-black/40 p-1 rounded-xl border border-stone-300 dark:border-white/10">
          <button
            onClick={() => { setAgeTrack('junior'); schoolVoice.stop(); setIsSpeaking(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer min-h-[40px] ${
              ageTrack === 'junior'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            title="Junior Sprouts (Ages 5-8): Big visuals, fun food/animal metaphors, audio voice reader"
          >
            <Baby className="w-3.5 h-3.5" />
            <span>🐣 Junior (5-8)</span>
          </button>

          <button
            onClick={() => { setAgeTrack('explorer'); schoolVoice.stop(); setIsSpeaking(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer min-h-[40px] ${
              ageTrack === 'explorer'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 text-white shadow-md shadow-cyan-500/25'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            title="Origami Explorer (Ages 9-13): Numbered ❶ ➔ ❷ visual guides, thumb crease technique"
          >
            <CompassIcon className="w-3.5 h-3.5" />
            <span>⭐ Explorer (9-13)</span>
          </button>

          <button
            onClick={() => { setAgeTrack('stem'); schoolVoice.stop(); setIsSpeaking(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer min-h-[40px] ${
              ageTrack === 'stem'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white shadow-md shadow-purple-500/25'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            title="STEM & High School (Ages 14-18): Dihedral angles, Huzita axioms, Kawasaki parity"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>🔬 STEM (14-18)</span>
          </button>
        </div>
      </div>

      {/* Step Header with Read-Aloud Voice Button & Endowed Progress */}
      <div className="border-b border-stone-200 dark:border-white/10 pb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-[#00f0ff] font-semibold tracking-wider">
              <span>STEP {step.stepNumber || currentStepIdx + 1} OF {totalSteps}</span>
              <span>•</span>
              <span className="text-amber-700 dark:text-[#d4af37] font-bold">
                🥋 Level {Math.min(5, Math.floor(currentStepIdx / 2) + 1)}: {
                  currentStepIdx === totalSteps - 1
                    ? 'Master Gold Belt 🏆'
                    : currentStepIdx >= 2
                    ? 'Brown Belt (Advancing Creaser)'
                    : 'White Belt (Starter Momentum - 18%)'
                }
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-stone-900 dark:text-white mt-1">
              {ageTrack === 'junior' ? schoolProfile.juniorTitle : step.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Web Speech API "Read to Me" Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shadow-md min-h-[44px] ${
                isSpeaking
                  ? 'bg-amber-500/25 border-amber-500/50 text-amber-900 dark:text-amber-300 animate-pulse'
                  : 'bg-stone-100 dark:bg-white/5 border-stone-300 dark:border-white/15 text-stone-800 dark:text-slate-200 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10'
              }`}
              title="Listen to this step spoken aloud (hands-free folding)"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>⏹️ Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>🔊 Read to Me</span>
                </>
              )}
            </button>

            {/* Fold Type Badge with Visual Crease Marker & Arrow */}
            <span className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm min-h-[44px] ${
              (step.foldType || '').toLowerCase().includes('mountain') || (step.foldType || '').toLowerCase().includes('reverse')
                ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30'
                : 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30'
            }`}>
              <span className="font-bold tracking-tighter">
                {(step.foldType || '').toLowerCase().includes('mountain') ? '— · —' : '— — —'}
              </span>
              <span>{step.foldType || 'Valley Fold'}</span>
              <span className="text-amber-500 dark:text-amber-400 font-bold">⤹</span>
            </span>
          </div>
        </div>

        {/* HFI Endowed Progress Bar (Never 0% - Always Endowed Starter Momentum) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
            <span>Progress: {Math.round(18 + (currentStepIdx / Math.max(1, totalSteps - 1)) * 82)}%</span>
            <span>{currentStepIdx + 1} of {totalSteps} Folds Locked</span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${Math.round(18 + (currentStepIdx / Math.max(1, totalSteps - 1)) * 82)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Before & After Paper States Visual Guidance Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-cyan-300">
              Folding Sequence: Before & After Paper States
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-500 dark:text-slate-400 hidden sm:inline">
            Compare your paper with both states
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. BEFORE STATE (START OF STEP) */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#0c1228] dark:to-[#050714] border border-cyan-600/30 dark:border-cyan-500/35 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center transition-colors">
            <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-cyan-600/20 dark:border-cyan-500/20 text-xs font-mono">
              <span className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                <span>◀ BEFORE (START)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-[10px] font-semibold">
                Initial Shape
              </span>
            </div>

            <div className="relative w-44 h-44 sm:w-48 sm:h-48 bg-stone-100 dark:bg-[#030612] border border-stone-200 dark:border-white/10 rounded-xl p-2 flex items-center justify-center shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]" />

              <svg viewBox={`0 0 ${diagBefore.size} ${diagBefore.size}`} className="w-full h-full relative z-10">
                <defs>
                  <marker
                    id={`guidance-arrow-before-${currentStepIdx}`}
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f59e0b" />
                  </marker>
                  <marker
                    id={`guidance-arrow-cyan-${currentStepIdx}`}
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#06b6d4" />
                  </marker>
                </defs>

                <polygon
                  points={diagBefore.polyPointsStr}
                  fill={diagBefore.paperFill}
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  className="drop-shadow-lg"
                />

                {/* Primary Crease Line */}
                <line
                  x1={diagBefore.cX1}
                  y1={diagBefore.cY1}
                  x2={diagBefore.cX2}
                  y2={diagBefore.cY2}
                  stroke={diagBefore.isMountain ? '#f43f5e' : '#00f0ff'}
                  strokeWidth="3.2"
                  strokeDasharray={diagBefore.isMountain ? '8,3,2,3' : '6,3'}
                  strokeLinecap="round"
                />

                {/* Compound Secondary Crease Line (if multiple flaps present) */}
                {diagBefore.mobileFlaps2D && diagBefore.mobileFlaps2D.length > 1 && (
                  <line
                    x1={diagBefore.mobileFlaps2D[1].crease.x1}
                    y1={diagBefore.mobileFlaps2D[1].crease.y1}
                    x2={diagBefore.mobileFlaps2D[1].crease.x2}
                    y2={diagBefore.mobileFlaps2D[1].crease.y2}
                    stroke={diagBefore.isMountain ? '#f43f5e' : '#00f0ff'}
                    strokeWidth="3.2"
                    strokeDasharray={diagBefore.isMountain ? '8,3,2,3' : '6,3'}
                    strokeLinecap="round"
                  />
                )}

                {/* Motion Trajectory Arrows & Action Landmark Badges */}
                {diagBefore.mobileFlaps2D && diagBefore.mobileFlaps2D.length > 1 ? (
                  diagBefore.mobileFlaps2D.map((f, i) => (
                    <g key={f.id}>
                      <path
                        d={f.arrowPath}
                        fill="none"
                        stroke={f.color}
                        strokeWidth="3"
                        strokeDasharray="5,2"
                        markerEnd={`url(#guidance-arrow-${i === 0 ? 'before' : 'cyan'}-${currentStepIdx})`}
                      />
                      <circle cx={f.ptA.x} cy={f.ptA.y} r="10" fill={i === 0 ? '#0284c7' : '#0e7490'} />
                      <circle cx={f.ptA.x} cy={f.ptA.y} r="14" fill="none" stroke={i === 0 ? '#38bdf8' : '#22d3ee'} strokeWidth="1.5" strokeDasharray="3,2" />
                      <text x={f.ptA.x} y={f.ptA.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{f.startBadge}</text>

                      <circle cx={f.ptB.x} cy={f.ptB.y} r="10" fill={i === 0 ? '#d97706' : '#0891b2'} />
                      <circle cx={f.ptB.x} cy={f.ptB.y} r="14" fill="none" stroke={i === 0 ? '#fbbf24' : '#67e8f9'} strokeWidth="1.5" />
                      <text x={f.ptB.x} y={f.ptB.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{f.targetBadge}</text>
                    </g>
                  ))
                ) : (
                  <>
                    <path
                      d={diagBefore.arrowPath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="5,2"
                      markerEnd={`url(#guidance-arrow-before-${currentStepIdx})`}
                    />

                    <circle cx={diagBefore.ptA.x} cy={diagBefore.ptA.y} r="10" fill="#0284c7" />
                    <circle cx={diagBefore.ptA.x} cy={diagBefore.ptA.y} r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
                    <text x={diagBefore.ptA.x} y={diagBefore.ptA.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">❶</text>

                    <circle cx={diagBefore.ptB.x} cy={diagBefore.ptB.y} r="10" fill="#d97706" />
                    <circle cx={diagBefore.ptB.x} cy={diagBefore.ptB.y} r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                    <text x={diagBefore.ptB.x} y={diagBefore.ptB.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">❷</text>
                  </>
                )}
              </svg>
            </div>

            <div className="w-full mt-3 text-xs space-y-1.5">
              {diagBefore.mobileFlaps2D && diagBefore.mobileFlaps2D.length > 1 ? (
                <>
                  <div className="flex items-center gap-1.5 text-amber-300 font-mono font-semibold">
                    <span>❶ Right Flap: Lift ❶ along golden arrow to ❷</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-semibold">
                    <span>❸ Left Flap: Lift ❸ along cyan arrow to ❹</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-300 font-mono font-semibold">
                  <span>❶ Lift corner ❶ along golden arrow to ❷</span>
                </div>
              )}
              <p className="text-[11px] text-stone-600 dark:text-slate-300 font-sans leading-relaxed">
                Start with this shape flat on your desk. Crease line is <span className="text-cyan-700 dark:text-cyan-400 font-mono">{diagBefore.isMountain ? '— · —' : '— — —'}</span>.
              </p>
            </div>
          </div>

          {/* 2. AFTER STATE (TARGET RESULT) */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#0c241b] dark:to-[#04140c] border border-emerald-600/30 dark:border-emerald-500/35 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center transition-colors">
            <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-emerald-600/20 dark:border-emerald-500/20 text-xs font-mono">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span>▶ AFTER (TARGET RESULT)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                {diagAfter.isFinalStep ? 'Final Masterpiece' : 'Folded Shape'}
              </span>
            </div>

            <div className="relative w-44 h-44 sm:w-48 sm:h-48 bg-stone-100 dark:bg-[#030612] border border-stone-200 dark:border-white/10 rounded-xl p-2 flex items-center justify-center shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]" />

              <svg viewBox={`0 0 ${diagAfter.size} ${diagAfter.size}`} className="w-full h-full relative z-10">
                <polygon
                  points={diagAfter.polyPointsStr}
                  fill={diagAfter.paperFill}
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  className="drop-shadow-lg"
                />

                {/* Pressed Solid Crease Line */}
                <line
                  x1={diagAfter.cX1}
                  y1={diagAfter.cY1}
                  x2={diagAfter.cX2}
                  y2={diagAfter.cY2}
                  stroke={diagAfter.seamColor}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* Docked Point ❷ / ❹ with Green Checkmark */}
                {diagAfter.mobileFlapsAfter2D && diagAfter.mobileFlapsAfter2D.length > 1 ? (
                  diagAfter.mobileFlapsAfter2D.map((f) => (
                    <g key={f.id}>
                      <circle cx={f.x} cy={f.y} r="11" fill={f.color} />
                      <circle cx={f.x} cy={f.y} r="15" fill="none" stroke="#34d399" strokeWidth="1.5" />
                      <text x={f.x} y={f.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">✓</text>
                    </g>
                  ))
                ) : (
                  <>
                    <circle cx={diagAfter.ptDocked.x} cy={diagAfter.ptDocked.y} r="11" fill="#059669" />
                    <circle cx={diagAfter.ptDocked.x} cy={diagAfter.ptDocked.y} r="15" fill="none" stroke="#34d399" strokeWidth="1.5" />
                    <text x={diagAfter.ptDocked.x} y={diagAfter.ptDocked.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">✓</text>
                  </>
                )}
              </svg>
            </div>

            <div className="w-full mt-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                <span>✓ {diagAfter.mobileFlapsAfter2D && diagAfter.mobileFlapsAfter2D.length > 1 ? 'Both flaps docked & creases pressed' : 'Flap docked & crease pressed'}</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-slate-300 font-sans leading-relaxed">
                Confirm your paper matches this result before advancing to the next step.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 (s === 2) Desk Orientation & Belly Button Anchor Landmark Warning */}
        {currentStepIdx === 2 && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 text-stone-900 dark:text-amber-100 text-xs shadow-xl animate-pulse">
            <span className="text-2xl shrink-0 mt-0.5">🧭</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong className="text-amber-800 dark:text-amber-300 font-mono uppercase tracking-wide">
                  Critical Desk Landmark (Step 3 Bird Base Check)
                </strong>
                <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-900 dark:text-amber-200 text-[10px] font-mono font-bold">
                  Belly Button Anchor
                </span>
              </div>
              <p className="leading-relaxed font-sans text-stone-800 dark:text-slate-200 text-xs sm:text-sm">
                Point the <strong>OPEN SPLIT LEGS</strong> directly towards your chest/belly button! The <strong>CLOSED SOLID CORNER</strong> must point AWAY from you before folding. Do NOT fold from the closed point!
              </p>
            </div>
          </div>
        )}

        {/* Table Orientation & Duo-Kami Paper Guidance */}
        <div className="flex items-center justify-between text-xs font-mono bg-stone-100 dark:bg-white/[0.04] border border-stone-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isDiamond ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-500'}`}>
              {isDiamond ? '♢' : '□'}
            </span>
            <span className="text-stone-700 dark:text-slate-200">
              Desk Orientation: <strong className={isDiamond ? 'text-amber-800 dark:text-amber-300' : 'text-cyan-800 dark:text-cyan-300'}>
                {isDiamond ? 'Diamond (Corner facing your chest)' : 'Square (Flat edge facing your chest)'}
              </strong>
            </span>
          </div>
          <span className="text-[10px] text-stone-500 dark:text-slate-400 font-semibold hidden sm:inline">
            Dual-Sided Kami Paper
          </span>
        </div>
      </div>

      {/* "Does Yours Match?" Milestone Validation Card (Encouraging Self-Check) */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl space-y-3 ${
        isStepMatched || isStepDone
          ? 'bg-emerald-500/10 border-emerald-500/40 text-stone-900 dark:text-white'
          : 'bg-stone-50 dark:bg-black/40 border-stone-200 dark:border-white/15 text-stone-900 dark:text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isStepMatched || isStepDone ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              {isStepMatched || isStepDone ? 'Step Verified! Perfect Match! 🎉' : 'Milestone Check: Does your paper match?'}
            </span>
          </div>
          {(isStepMatched || isStepDone) && (
            <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>MATCHED</span>
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-200 font-sans leading-relaxed">
          {isStepMatched || isStepDone
            ? 'Super job! Your paper shape, folded flap, and crisp crease match the diagram. You are ready to move to the next fold!'
            : 'Compare your folded paper with the 3D diagram above. Did corner ❶ land neatly on target ❷? Is your crease pressed flat?'}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleConfirmMatch}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-md min-h-[44px] ${
              isStepMatched || isStepDone
                ? 'bg-emerald-500/25 border border-emerald-500/50 text-emerald-900 dark:text-emerald-300'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isStepMatched || isStepDone ? '✓ Yes, Matches Perfectly!' : '✓ Yes, Mine Matches the Picture!'}</span>
          </button>

          <button
            onClick={() => {
              setFoldFactor(0.0);
              playCrease();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white border border-stone-300 dark:border-white/10 font-mono text-xs transition-all cursor-pointer min-h-[44px]"
            title="Rewind fold animation to beginning so you can fold along"
          >
            <span>🔄 Rewind Fold (0%)</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content by Age Track */}
      {ageTrack === 'junior' && (
        <div className="space-y-4">
          {/* Fun Metaphor Banner */}
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
            <span className="text-3xl shrink-0 mt-0.5">🌮</span>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Kid-Friendly Metaphor (Ages 5-8)
              </span>
              <p className="text-base text-amber-950 dark:text-amber-100 font-sans font-medium leading-relaxed">
                "{schoolProfile.juniorMetaphor}"
              </p>
            </div>
          </div>

          {/* Simple Instruction */}
          <div className="bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 p-5 rounded-2xl">
            <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Easy Step-By-Step Instruction:</span>
            </div>
            <p className="text-lg sm:text-xl text-stone-900 dark:text-white font-sans font-semibold leading-relaxed">
              {schoolProfile.juniorInstruction}
            </p>
          </div>
        </div>
      )}

      {ageTrack === 'explorer' && (
        <div className="space-y-4">
          <p className="text-stone-800 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-sans font-medium">
            {step.instruction}
          </p>

          {/* Self-Assessment Fold Checklist */}
          <div className="bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
              <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Paper Check (Before Moving Forward):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {schoolProfile.checkQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 min-h-[44px] ${
                    checkedItems[idx]
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
                      : 'bg-stone-100 dark:bg-black/20 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:border-stone-400 dark:hover:border-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center ${
                    checkedItems[idx] ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-stone-400 dark:border-white/30'
                  }`}>
                    {checkedItems[idx] && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="leading-tight">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {ageTrack === 'stem' && (
        <div className="space-y-4">
          <p className="text-stone-800 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-sans font-medium">
            {step.instruction}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-purple-500/10 border border-purple-500/30 p-3.5 rounded-xl space-y-1">
              <div className="text-purple-800 dark:text-purple-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Geometric Concept</span>
              </div>
              <p className="text-stone-700 dark:text-slate-200 text-xs font-sans leading-relaxed">
                {schoolProfile.stemConcept}
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-3.5 rounded-xl space-y-1">
              <div className="text-cyan-800 dark:text-cyan-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Mathematical Theorem</span>
              </div>
              <p className="text-stone-700 dark:text-slate-200 text-xs font-sans leading-relaxed">
                {schoolProfile.stemTheorem}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Human "In Your Hands" 3-Step Action Guide */}
      <div className="bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-800 dark:text-cyan-300 font-bold uppercase tracking-wider">
          <Hand className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Hands-On Folding Action (In Your Hands)</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 font-mono font-bold text-[11px] uppercase">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px]">1</span>
              <span>Find Points</span>
            </div>
            <p className="text-stone-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
              Locate corner <strong className="text-cyan-700 dark:text-cyan-300">❶ Lift Here</strong> on your sheet. Match it with target destination <strong className="text-amber-700 dark:text-amber-300">❷ Bring Here</strong>.
            </p>
          </div>

          <div className="bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono font-bold text-[11px] uppercase">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">2</span>
              <span>Smooth Arc Fold</span>
            </div>
            <p className="text-stone-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
              Gently lift corner ❶ along the golden motion arrow and align it squarely onto target ❷.
            </p>
          </div>

          <div className="bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] uppercase">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px]">3</span>
              <span>Press Crease</span>
            </div>
            <p className="text-stone-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
              Slide your thumbnail or bone folder firmly along the glowing crease line from center outward.
            </p>
          </div>
        </div>
      </div>

      {/* Landmark Reference if present */}
      {step.landmark && (
        <div className="flex items-start gap-2 text-xs font-mono text-cyan-800 dark:text-[#00f0ff] bg-cyan-500/10 dark:bg-[#00f0ff]/5 border border-cyan-500/20 dark:border-[#00f0ff]/20 p-2.5 rounded-lg">
          <Compass className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600 dark:text-[#00f0ff]" />
          <span><strong>Landmark:</strong> {step.landmark}</span>
        </div>
      )}

      {/* Master Pro-Tip Box */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-xl text-xs text-stone-700 dark:text-slate-300">
        <Lightbulb className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="block text-amber-800 dark:text-amber-400 font-mono uppercase tracking-wide">
            {ageTrack === 'junior' ? 'Kid Origami Secret 💡' : 'Master Pro-Tip'}
          </strong>
          <p className="leading-relaxed">
            {step.tip || 'Maintain crisp creases with steady, continuous thumb pressure.'}
          </p>
        </div>
      </div>

      {/* HFI Trust Marker: Safe Sandbox Guarantee */}
      <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-800 dark:text-cyan-300">
        <span className="flex items-center gap-1.5 font-bold">
          <span>🛡️</span>
          <span>Safe Folding Sandbox:</span>
        </span>
        <span className="text-[11px] text-stone-600 dark:text-stone-300">
          You can never tear paper in 3D. Tap Undo anytime!
        </span>
      </div>

      {/* Navigation Buttons Row (Fitts's Law >= 44px + Von Restorff Isolation CTA) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 active:scale-[0.97] active:shadow-inner focus-visible:ring-2 focus-visible:ring-stone-400 border border-stone-300 dark:border-white/10 text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-mono text-xs font-bold transition-all cursor-pointer min-h-[48px]"
          title="Safe Undo: Step back to previous fold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>↺ Undo Fold (Safe)</span>
        </button>

        <button
          onClick={handleToggleComplete}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-md active:scale-[0.97] active:shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[48px] ${
            isStepDone
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isStepDone ? 'Marked Complete ✓' : 'Mark Step Complete'}</span>
        </button>

        {/* Von Restorff Primary CTA: Aggressively pops with Amber Gold */}
        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38927] hover:from-[#dfba48] hover:to-[#be9332] active:scale-[0.97] active:shadow-inner focus-visible:ring-2 focus-visible:ring-amber-500 text-stone-950 font-mono text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-[#d4af37]/25 min-h-[48px]"
        >
          <span>{currentStepIdx === totalSteps - 1 ? 'Finish Model 🎉' : 'Next Fold ➔'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
