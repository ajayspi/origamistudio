import React, { useEffect } from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import { schoolVoice, getSchoolStepProfile } from '../utils/schoolOrigami';
import {
  ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX,
  Sparkles, CheckCircle2
} from 'lucide-react';

export const ZenFoldingDock: React.FC = () => {
  const {
    activeKitId,
    currentStepIdx,
    setCurrentStepIdx,
    completedStepIndices,
    toggleStepCompleted,
    markKitCompleted,
    foldFactor,
    setFoldFactor,
    isPlaying,
    setIsPlaying,
    isSpeaking,
    setIsSpeaking,
    ageTrack,
    setAgeTrack,
    isPancakeFlipped,
    togglePancakeFlip,
  } = useOrigamiStore();

  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;
  const totalSteps = kit.steps ? kit.steps.length : 1;
  const step = kit.steps[currentStepIdx] || {
    stepNumber: 1,
    title: 'Preliminary Fold',
    instruction: 'Fold according to sequence.',
    foldType: 'Valley Fold'
  };

  const isStepDone = completedStepIndices.includes(currentStepIdx);
  const isFinalStep = currentStepIdx === totalSteps - 1;
  const schoolProfile = getSchoolStepProfile(currentStepIdx, step.title, totalSteps);

  const { playCrease, playChime } = useOrigamiAudio();

  // Keyboard navigation & folding controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' && currentStepIdx < totalSteps - 1) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStepIdx > 0) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        togglePancakeFlip();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleSpeech();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIdx, totalSteps, foldFactor, isPlaying]);

  const togglePlay = () => {
    if (foldFactor >= 0.98) {
      setFoldFactor(0.0);
    }
    setIsPlaying(!isPlaying);
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
    if (!isStepDone) {
      toggleStepCompleted(currentStepIdx);
    }
    if (currentStepIdx < totalSteps - 1) {
      playCrease();
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      playChime();
      markKitCompleted(kit.id);
    }
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
        speechText = `Step ${currentStepIdx + 1}: ${step.title}. ${step.instruction} Align the corner and crease firmly.`;
      } else {
        speechText = `Step ${currentStepIdx + 1}: ${step.title}. ${step.instruction} ${schoolProfile.stemConcept}. ${schoolProfile.stemTheorem}`;
      }

      schoolVoice.speak(
        speechText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        ageTrack === 'junior' ? 1.1 : 1.0,
        ageTrack === 'junior' ? 0.9 : 0.95
      );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#11131b] border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-200">
      {/* Step Monograph Placard */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800/80">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="font-bold text-amber-700 dark:text-[#d4af37] tracking-wider uppercase">
              STEP {String(currentStepIdx + 1).padStart(2, '0')} OF {String(totalSteps).padStart(2, '0')}
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-stone-500 dark:text-stone-400 font-medium">
              {step.foldType || 'Valley Fold'}
            </span>
            {isFinalStep && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                FINAL FOLD
              </span>
            )}
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {ageTrack === 'junior' ? schoolProfile.juniorTitle : step.title}
          </h3>

          <p className="text-stone-700 dark:text-stone-200 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
            {ageTrack === 'junior'
              ? schoolProfile.juniorInstruction
              : (ageTrack === 'explorer' ? step.instruction : `${step.instruction} (${schoolProfile.stemConcept})`)}
          </p>

          {/* Child Metaphor & Milestone Badge */}
          {ageTrack === 'junior' && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium font-sans">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{schoolProfile.juniorMetaphor}</span>
              </span>

              {isStepDone && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-bold font-sans">
                  <span>🎉</span>
                  <span>{schoolProfile.juniorCheer}</span>
                </span>
              )}
            </div>
          )}

          {(step.tip || step.landmark) && (
            <p className="text-xs font-mono text-amber-700 dark:text-amber-400/90 flex items-center gap-1.5 pt-0.5">
              <span>💡</span>
              <span>{step.tip || step.landmark}</span>
            </p>
          )}
        </div>

        {/* Right Action Tray: Grade Tracks & Voice Narration */}
        <div className="flex flex-col items-end gap-2.5 shrink-0">
          {/* Grade Track Selector */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono">
            <button
              onClick={() => setAgeTrack('junior')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ageTrack === 'junior'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Sprouts Track: Ages 5–8 (K–3) with kid food & animal metaphors"
            >
              🐣 Sprouts
            </button>
            <button
              onClick={() => setAgeTrack('explorer')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ageTrack === 'explorer'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Explorers Track: Grades 4–8 with step-by-step guidance"
            >
              ⭐ Explorers
            </button>
            <button
              onClick={() => setAgeTrack('stem')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ageTrack === 'stem'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="STEM Champions Track: High School Geometry & Theorems"
            >
              🚀 STEM
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Milestone Match Check */}
            <button
              onClick={() => {
                playChime();
                toggleStepCompleted(currentStepIdx);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer min-h-[40px] ${
                isStepDone
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              }`}
              title="Confirm your folded paper matches the screen"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isStepDone ? 'Fold Matched! ⭐' : 'Matches Mine? [✓]'}</span>
            </button>

            {/* Read-Aloud Voice Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer min-h-[40px] ${
                isSpeaking
                  ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200'
              }`}
              title="Read current step instructions aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Primary Physical Controls Dock */}
      <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Physical Button 1: Previous Fold */}
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-[0.98] border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none min-h-[48px] shadow-xs"
          title="Previous step (Keyboard: ←)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {/* Physical Button 2: Center Fold Scrubber & Simulation */}
        <div className="flex-1 w-full max-w-xl flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={togglePlay}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer min-h-[44px] shrink-0 border ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-900 dark:text-amber-300'
                : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
            title="Animate fold movement (Keyboard: Space)"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <Play className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            <span>{isPlaying ? 'Pause' : 'Animate Fold'}</span>
          </button>

          {/* Pancake 180 Flip Button */}
          <button
            onClick={togglePancakeFlip}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-mono text-xs font-medium transition-all cursor-pointer min-h-[44px] shrink-0 border ${
              isPancakeFlipped
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-900 dark:text-amber-300'
                : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
            title="Flip paper 180° over (Keyboard: F)"
          >
            <span>🥞</span>
            <span>{isPancakeFlipped ? 'Flip Front' : 'Flip 180°'}</span>
          </button>

          {/* Smooth Tactile Range Scrub */}
          <div className="flex items-center gap-2.5 flex-1 w-full">
            <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 shrink-0">FLAT</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(foldFactor * 100)}
              onPointerDown={() => setIsPlaying(false)}
              onChange={(e) => {
                setIsPlaying(false);
                setFoldFactor(parseInt(e.target.value, 10) / 100);
              }}
              className="w-full accent-amber-600 dark:accent-[#d4af37] h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 shrink-0">FOLDED</span>
          </div>
        </div>

        {/* Physical Button 3: Next Fold */}
        <button
          onClick={handleNext}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 dark:bg-[#d4af37] hover:bg-stone-800 dark:hover:bg-[#dfba48] active:scale-[0.98] text-white dark:text-stone-950 text-xs font-mono font-bold transition-all cursor-pointer min-h-[48px] shadow-sm hover:shadow-md"
          title="Next step (Keyboard: →)"
        >
          <span>{isFinalStep ? 'Complete Sculpture 🏆' : 'Next Step'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle Keyboard Shortcuts Footer */}
      <div className="pt-4 mt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-400 dark:text-stone-500 border-t border-stone-100 dark:border-stone-800/80">
        <div className="flex items-center gap-3">
          <span>Keyboard: <strong className="text-stone-600 dark:text-stone-400">← / →</strong> Steps</span>
          <span>•</span>
          <span><strong className="text-stone-600 dark:text-stone-400">Space</strong> Animate</span>
          <span>•</span>
          <span><strong className="text-stone-600 dark:text-stone-400">F</strong> Flip</span>
          <span>•</span>
          <span><strong className="text-stone-600 dark:text-stone-400">M</strong> Voice</span>
        </div>
        <div className="text-[10px] tracking-wider uppercase text-stone-400 dark:text-stone-500">
          Zero-Cut Folding Desk
        </div>
      </div>
    </div>
  );
};

export default ZenFoldingDock;
