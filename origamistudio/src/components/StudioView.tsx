import React, { useState, useEffect, useMemo } from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById, ALL_KITS_ARRAY } from '../data/kits';
import { StudioViewer } from './StudioViewer';
import { CreasePatternSvg } from './CreasePatternSvg';
import { StepGuidance } from './StepGuidance';
import { ArtisanInspectorDrawer } from './ArtisanInspectorDrawer';
import { CelebrationOverlay } from './CelebrationOverlay';
import { StickmanHelper } from './StickmanHelper';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import { schoolVoice, getSchoolStepProfile, SUPPORTED_LANGUAGES, type LanguageCode } from '../utils/schoolOrigami';
import { getMultiPartAssemblyProfile } from '../utils/assemblyGuide';
import { AssemblyStageModal } from './AssemblyStageModal';
import { OrigamiCoach, type CoachType, type CoachAction } from './OrigamiCoach';
import {
  Box, Grid, Printer, CheckCircle2,
  X, ChevronLeft, ChevronRight,
  Play, Pause, FastForward, Volume2, VolumeX,
  Sparkles, Trophy, Search, Globe, RotateCcw
} from 'lucide-react';

export const StudioView: React.FC = () => {
  const {
    activeKitId,
    setActiveKitId,
    currentStepIdx,
    setCurrentStepIdx,
    completedStepIndices,
    completedKitIds,
    toggleStepCompleted,
    markKitCompleted,
    foldFactor,
    setFoldFactor,
    isPlaying,
    setIsPlaying,
    isPlayAll,
    setIsPlayAll,
    isSpeaking,
    setIsSpeaking,
    ageTrack,
    isPancakeFlipped,
    togglePancakeFlip,
    viewerMode,
    setViewerMode,
    setView,
    toggleArtisanDrawer,
    enableDynamicRelaxation,
    toggleDynamicRelaxation,
    setPreviewCompletionModel,
    isAutoRotating,
    toggleAutoRotate,
    paperStock,
    setPaperStock,
    studioMood,
    setStudioMood,
  } = useOrigamiStore();

  const [isShowroomMode, setIsShowroomMode] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState<boolean>(true);
  const [showStepGuidance, setShowStepGuidance] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'steps' | 'kits' | 'parts'>('steps');
  const [kitSearchQuery, setKitSearchQuery] = useState('');
  const [kitLevelFilter, setKitLevelFilter] = useState<'all' | 'easy' | 'intermediate' | 'advanced'>('all');
  const [showAssemblyModal, setShowAssemblyModal] = useState(false);
  const [coachType, setCoachType] = useState<CoachType>('aoi');

  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;
  const { playCrease, playChime } = useOrigamiAudio();

  const collectionKits = useMemo(() => {
    if (!kit.collection) return [];
    return ALL_KITS_ARRAY.filter((k) => k.collection === kit.collection);
  }, [kit.collection]);

  const partIndex = useMemo(() => {
    return collectionKits.findIndex((k) => k.id === kit.id);
  }, [collectionKits, kit.id]);

  const assemblyProfile = useMemo(() => {
    return getMultiPartAssemblyProfile(kit, ALL_KITS_ARRAY, completedKitIds);
  }, [kit, completedKitIds]);

  // Reset to Showroom Mode whenever active kit changes
  useEffect(() => {
    setIsShowroomMode(true);
    setPreviewCompletionModel(true);
    setCurrentStepIdx(0);
    setFoldFactor(0.0);
  }, [activeKitId]);

  const totalSteps = kit.steps ? kit.steps.length : 1;
  const currentStep = kit.steps[currentStepIdx] || {
    stepNumber: 1,
    title: 'Preliminary Fold',
    instruction: 'Fold paper along the indicated axis.',
    foldType: 'Valley Fold'
  };

  const isStepDone = completedStepIndices.includes(currentStepIdx);
  const isFinalStep = currentStepIdx === totalSteps - 1;
  const schoolProfile = getSchoolStepProfile(currentStepIdx, currentStep.title, totalSteps);

  const coachAction: CoachAction = useMemo(() => {
    if (isFinalStep && isStepDone) return 'cheer';
    const text = (currentStep.title + ' ' + (currentStep.instruction || '')).toLowerCase();
    if (text.includes('rotate') || text.includes('turn') || text.includes('diamond')) return 'rotate';
    if (text.includes('flip') || text.includes('turn over') || isPancakeFlipped) return 'flip';
    if (text.includes('crease') || text.includes('press') || text.includes('fold') || text.includes('sharp')) return 'crease';
    return 'idle';
  }, [currentStep, isFinalStep, isStepDone, isPancakeFlipped]);

  const filteredKits = useMemo(() => {
    return ALL_KITS_ARRAY.filter((k) => {
      const matchSearch =
        k.title.toLowerCase().includes(kitSearchQuery.toLowerCase()) ||
        (k.subtitle && k.subtitle.toLowerCase().includes(kitSearchQuery.toLowerCase())) ||
        (k.category && k.category.toLowerCase().includes(kitSearchQuery.toLowerCase()));
      const diff = (k.difficulty || '').toLowerCase();
      let matchLevel = true;
      if (kitLevelFilter === 'easy') matchLevel = diff.includes('easy') || diff.includes('beginner');
      if (kitLevelFilter === 'intermediate') matchLevel = diff.includes('intermediate');
      if (kitLevelFilter === 'advanced') matchLevel = diff.includes('advanced') || diff.includes('master');
      return matchSearch && matchLevel;
    });
  }, [kitSearchQuery, kitLevelFilter]);

  // Keyboard shortcuts for seamless desktop workflow
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
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIdx, totalSteps, foldFactor, isPlaying]);

  const togglePlay = () => {
    if (isPlayAll) {
      setIsPlayAll(false);
    }
    if (foldFactor >= 0.98) {
      setFoldFactor(0.0);
    }
    setIsPlaying(!isPlaying);
  };

  const togglePlayAll = () => {
    if (isPlayAll) {
      setIsPlayAll(false);
      setIsPlaying(false);
    } else {
      setIsPlayAll(true);
      setCurrentStepIdx(0);
      setFoldFactor(0.0);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    schoolVoice.stop();
    setIsSpeaking(false);
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      playCrease();
      setCurrentStepIdx(prevIdx);
      if (isAutoVoiceEnabled && !isShowroomMode) {
        schoolVoice.speakStep(prevIdx, totalSteps, selectedLang);
      }
    }
  };

  const handleNext = () => {
    schoolVoice.stop();
    setIsSpeaking(false);
    if (!isStepDone) {
      toggleStepCompleted(currentStepIdx);
    }
    if (currentStepIdx < totalSteps - 1) {
      const nextIdx = currentStepIdx + 1;
      playCrease();
      setCurrentStepIdx(nextIdx);
      if (isAutoVoiceEnabled && !isShowroomMode) {
        schoolVoice.speakStep(nextIdx, totalSteps, selectedLang);
      }
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!isFinalStep) {
      // Jump to the final step to complete the sequence
      playCrease();
      setCurrentStepIdx(totalSteps - 1);
      return;
    }
    schoolVoice.stop();
    setIsSpeaking(false);
    playChime();
    markKitCompleted(kit.id, kit.title);
    setShowCelebration(true);
  };

  const handleStickmanPush = () => {
    setIsPlaying(false);
    playCrease();
    const startVal = foldFactor;
    const startTime = performance.now();
    const duration = 800;
    const animateFold = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      setFoldFactor(startVal + (1.0 - startVal) * p);
      if (p < 1) requestAnimationFrame(animateFold);
      else playCrease();
    };
    requestAnimationFrame(animateFold);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      schoolVoice.stop();
      setIsSpeaking(false);
    } else {
      schoolVoice.speakStep(
        currentStepIdx,
        totalSteps,
        selectedLang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <div className="fixed inset-0 z-30 h-screen h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#fcfbf7] dark:bg-[#0a0c13] transition-colors duration-200 select-none">
      {/* 1. TOP MINIMAL HEADER BAR (Distraction-Free) */}
      <header className="h-14 sm:h-15 px-3 sm:px-6 flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 bg-[#fcfbf7]/90 dark:bg-[#0a0c13]/90 backdrop-blur-md z-30 shrink-0 w-full max-w-full overflow-hidden">
        {/* Left: Return to Home & Kit Meta */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setView('hub')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-stone-800 dark:text-stone-200 hover:text-amber-600 neumorph-stone-raised transition-all cursor-pointer min-h-[38px] shrink-0"
            title="Return to Home"
          >
            <span>🏠</span>
            <span className="font-bold hidden sm:inline">Home</span>
          </button>

          <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>

          <div className="truncate max-w-[190px] sm:max-w-xs md:max-w-md">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-semibold text-stone-500 dark:text-stone-400">
              {collectionKits.length > 1 ? (
                <div className="flex items-center gap-1">
                  <span className="text-amber-700 dark:text-[#d4af37] font-bold shrink-0">
                    Part {partIndex + 1}/{collectionKits.length}:
                  </span>
                  <select
                    value={kit.id}
                    onChange={(e) => {
                      setActiveKitId(e.target.value);
                      setCurrentStepIdx(0);
                      setFoldFactor(0.0);
                      playCrease();
                    }}
                    className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-[#d4af37] font-bold text-[10px] sm:text-[11px] rounded-md px-1 py-0.5 border border-amber-500/30 focus:outline-none cursor-pointer truncate max-w-[85px] sm:max-w-[130px]"
                    aria-label="Select Model Part"
                  >
                    {collectionKits.map((sk, idx) => (
                      <option key={sk.id} value={sk.id} className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                        {idx + 1}. {sk.title} {completedKitIds.includes(sk.id) ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                  {assemblyProfile && (
                    <button
                      onClick={() => setShowAssemblyModal(true)}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] hover:bg-emerald-500/25 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                      title="Open Multi-Part Assembly Stage Guide"
                    >
                      <span>🧩</span>
                      <span className="hidden sm:inline">Assembly</span>
                    </button>
                  )}
                  <span>•</span>
                  <span className="truncate">{kit.collectionTitle || kit.category}</span>
                </div>
              ) : (
                <>
                  <span className="text-amber-700 dark:text-[#d4af37] shrink-0">
                    KIT #{String(kit.kitNumber || '01').padStart(2, '0')}
                  </span>
                  <span>•</span>
                  <span className="truncate">{kit.difficulty || 'Easy Fold'}</span>
                </>
              )}
            </div>
            <h1 className="font-cinzel text-xs sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate">
              {kit.title}
            </h1>
          </div>
        </div>

        {/* Center: Step Indicator Pill */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-[10px] sm:text-xs font-mono font-bold text-stone-700 dark:text-stone-300 shrink-0">
          <span className="text-amber-600 dark:text-[#d4af37]">Step {currentStepIdx + 1}</span>
          <span className="text-stone-400">/</span>
          <span>{totalSteps}</span>
        </div>

        {/* Right: View Modes & Auxiliary Tools */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 3D Showroom Trigger */}
          <button
            onClick={() => {
              setIsShowroomMode(true);
              setPreviewCompletionModel(true);
            }}
            className={`flex items-center justify-center gap-1.5 p-2 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer min-h-[38px] min-w-[38px] ${
              isShowroomMode
                ? 'neumorph-stone-pressed text-amber-800 dark:text-[#d4af37]'
                : 'neumorph-stone-raised text-stone-700 dark:text-stone-300'
            }`}
            title="3D Completed Showroom Inspection"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#d4af37]" />
            <span className="hidden lg:inline">Showroom 3D</span>
          </button>

          {/* Multilingual Voice Dropdown */}
          <div className="hidden sm:flex items-center gap-1 neumorph-stone-pressed px-1 sm:px-1.5 py-0.5 rounded-xl text-xs font-mono max-w-[85px] sm:max-w-none min-h-[36px]">
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37] ml-0.5 shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => {
                const newLang = e.target.value as LanguageCode;
                setSelectedLang(newLang);
                schoolVoice.setLanguage(newLang);
                if (!isShowroomMode && isAutoVoiceEnabled) {
                  schoolVoice.speakStep(currentStepIdx, totalSteps, newLang);
                }
              }}
              className="bg-transparent text-stone-800 dark:text-stone-200 font-bold focus:outline-none cursor-pointer text-[10px] sm:text-xs truncate pr-0.5 h-[32px] flex items-center"
              aria-label="Select Voice Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Step Voice Mute / Unmute */}
          <button
            onClick={() => {
              const next = !isAutoVoiceEnabled;
              setIsAutoVoiceEnabled(next);
              if (!next) {
                schoolVoice.stop();
                setIsSpeaking(false);
              } else if (!isShowroomMode) {
                schoolVoice.speakStep(currentStepIdx, totalSteps, selectedLang);
              }
            }}
            className={`p-1.5 sm:p-2 rounded-xl text-xs font-mono transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
              isAutoVoiceEnabled
                ? 'neumorph-amber-convex text-white shadow-xs'
                : 'neumorph-stone-pressed text-stone-400'
            }`}
            title={isAutoVoiceEnabled ? "Voice Guidance Active (Click to Mute)" : "Voice Guidance Muted (Click to Unmute)"}
          >
            {isAutoVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* 3D vs Crease Pattern Selector */}
          <div className="hidden lg:flex items-center neumorph-stone-pressed p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setViewerMode('3d')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer min-h-[32px] ${
                viewerMode === '3d'
                  ? 'bg-amber-500/20 text-amber-900 dark:text-[#d4af37] font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Desk</span>
            </button>
            <button
              onClick={() => setViewerMode('cp')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer min-h-[32px] ${
                viewerMode === 'cp'
                  ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Crease Pattern</span>
            </button>
          </div>

          {/* 2D Guide Toggle */}
          <button
            onClick={() => setShowStepGuidance(!showStepGuidance)}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer min-h-[36px] ${
              showStepGuidance
                ? 'neumorph-stone-pressed text-amber-800 dark:text-[#d4af37]'
                : 'neumorph-stone-raised text-stone-600 dark:text-stone-400'
            }`}
            title="Toggle 2D Step Diagrams & Guidance"
          >
            <span>📐</span>
            <span className="hidden md:inline">2D Guide</span>
          </button>

          {/* Teacher Lab Drawer Trigger */}
          <button
            onClick={() => toggleArtisanDrawer()}
            className="hidden lg:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl neumorph-stone-raised text-amber-800 dark:text-[#d4af37] text-xs font-mono font-bold transition-all cursor-pointer min-h-[36px]"
            title="Open Teacher Lab (Geometry Proofs & CAD Tools)"
          >
            <span>🎓</span>
            <span className="hidden md:inline">Teacher Lab</span>
          </button>

          {/* Printable Guide Shortcut */}
          <button
            onClick={() => setView('print-guide', kit.id)}
            className="hidden sm:flex p-2 rounded-xl neumorph-stone-raised text-stone-600 dark:text-stone-300 transition-all cursor-pointer min-h-[36px] min-w-[36px] items-center justify-center"
            title="Printable Crease Guide"
          >
            <Printer className="w-4 h-4 text-amber-700 dark:text-[#d4af37]" />
          </button>
        </div>
      </header>

      {/* 2. MASSIVE CENTER & RIGHT CANVAS VIEWPORT (Unobstructed, zero elements floating in center) */}
      <main className="relative flex-1 w-full h-[calc(100dvh-3.5rem)] overflow-hidden">
        {/* Full-width, full-height 3D Canvas / Crease Pattern Stage (Completely unobstructed) */}
        <div className="absolute inset-0 w-full h-full">
          {viewerMode === '3d' ? <StudioViewer /> : <CreasePatternSvg />}
        </div>

        {/* 3. SCREEN 1: SLIM VERTICAL LEFT SIDEBAR (Progress Tracker & Kit Switcher) */}
        <aside className="hidden md:flex absolute left-4 top-4 bottom-24 z-20 pointer-events-auto flex-col w-64 lg:w-72">
          <div className="w-full h-full flex flex-col justify-between p-3.5 rounded-3xl bg-[#fcfbf7]/95 dark:bg-[#0c0f1d]/92 backdrop-blur-xl border border-stone-200/90 dark:border-white/10 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100">
            {/* Top Section: Showroom Overview OR Current Step Header */}
            {isShowroomMode ? (
              /* Showroom Mode: Specs & Begin Folding CTA right in the step panel */
              <div className="border-b border-stone-200/80 dark:border-stone-800 pb-3 shrink-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-[#d4af37] text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>3D Showroom</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 font-bold">
                    {totalSteps} Steps
                  </span>
                </div>

                <div>
                  <h3 className="font-cinzel text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                    {kit.title}
                  </h3>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                    {kit.subtitle || kit.description || 'Authentic traditional paper sculpture.'}
                  </p>
                </div>

                {/* Compact Specs Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <div className="p-2 rounded-xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5">
                    <span className="text-sm">📐</span>
                    <div className="min-w-0">
                      <div className="text-[8px] text-stone-500 uppercase font-bold">Paper</div>
                      <div className="font-bold text-stone-800 dark:text-stone-200 truncate">15×15 cm</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5">
                    <span className="text-sm">⏱️</span>
                    <div className="min-w-0">
                      <div className="text-[8px] text-stone-500 uppercase font-bold">Time</div>
                      <div className="font-bold text-stone-800 dark:text-stone-200 truncate">5–8 min</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5">
                    <span className="text-sm">🎯</span>
                    <div className="min-w-0">
                      <div className="text-[8px] text-stone-500 uppercase font-bold">Level</div>
                      <div className="font-bold text-amber-700 dark:text-amber-400 capitalize truncate">{kit.difficulty || 'Easy'}</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5">
                    <span className="text-sm">📑</span>
                    <div className="min-w-0">
                      <div className="text-[8px] text-stone-500 uppercase font-bold">Folds</div>
                      <div className="font-bold text-stone-800 dark:text-stone-200 truncate">{totalSteps} Folds</div>
                    </div>
                  </div>
                </div>

                {/* Prominent Tactile Begin Folding CTA */}
                <button
                  onClick={() => {
                    setIsShowroomMode(false);
                    setPreviewCompletionModel(false);
                    setCurrentStepIdx(0);
                    setFoldFactor(0.0);
                    playCrease();
                    if (isAutoVoiceEnabled) {
                      schoolVoice.speakStep(0, totalSteps, selectedLang);
                    }
                  }}
                  className="w-full h-10 rounded-xl neumorph-amber-convex flex items-center justify-center gap-2 text-xs font-cinzel font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Begin Folding ▶</span>
                </button>

                {/* Tabs: Sequence vs Browse Kits vs Parts */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-stone-200/60 dark:bg-stone-900/60 font-mono text-[10px]">
                  {collectionKits.length > 1 && (
                    <button
                      onClick={() => setSidebarTab('parts')}
                      className={`flex-1 py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                        sidebarTab === 'parts'
                          ? 'bg-amber-500 text-stone-950 font-extrabold shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      🧩 Parts ({collectionKits.length})
                    </button>
                  )}
                  <button
                    onClick={() => setSidebarTab('steps')}
                    className={`flex-1 py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                      sidebarTab === 'steps'
                        ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    📋 Steps ({totalSteps})
                  </button>
                  <button
                    onClick={() => setSidebarTab('kits')}
                    className={`flex-1 py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                      sidebarTab === 'kits'
                        ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    🎨 Kits (63)
                  </button>
                </div>
              </div>
            ) : (
              /* Step Mode: Active Step Meta & Return to Showroom */
              <div className="border-b border-stone-200/80 dark:border-stone-800 pb-2.5 shrink-0 space-y-2">
                <button
                  onClick={() => {
                    setIsShowroomMode(true);
                    setPreviewCompletionModel(true);
                  }}
                  className="w-full py-1 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-[#d4af37] border border-amber-500/20 text-[10px] font-mono font-bold flex items-center justify-between cursor-pointer transition-colors"
                  title="Return to 3D Showroom View"
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Showroom 3D Specs</span>
                  </span>
                  <span>360° ↺</span>
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-extrabold text-amber-700 dark:text-[#d4af37] uppercase tracking-wider truncate mr-1">
                    STEP {currentStepIdx + 1} OF {totalSteps}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/20 shrink-0">
                    {currentStep.foldType || 'Valley'}
                  </span>
                </div>
                <h3 className="font-cinzel text-xs font-bold line-clamp-1">
                  {ageTrack === 'junior' ? schoolProfile.juniorTitle : currentStep.title}
                </h3>

                {/* Tabs: Sequence vs Browse Kits vs Parts */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-stone-200/60 dark:bg-stone-900/60 font-mono text-[10px]">
                  {collectionKits.length > 1 && (
                    <button
                      onClick={() => setSidebarTab('parts')}
                      className={`flex-1 py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                        sidebarTab === 'parts'
                          ? 'bg-amber-500 text-stone-950 font-extrabold shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      🧩 Parts ({collectionKits.length})
                    </button>
                  )}
                  <button
                    onClick={() => setSidebarTab('steps')}
                    className={`flex-1 py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                      sidebarTab === 'steps'
                        ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    📋 Steps ({totalSteps})
                  </button>
                  <button
                    onClick={() => setSidebarTab('kits')}
                    className={`flex-1 py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                      sidebarTab === 'kits'
                        ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    🎨 Kits (63)
                  </button>
                </div>
              </div>
            )}

            {/* Middle Section: Either Parts Tracker, Sequence Tracker OR Compact Kit Switcher */}
            {sidebarTab === 'parts' ? (
              /* Multi-Part Collection Tracker */
              <div className="flex-1 my-2 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                <div className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider px-1 flex items-center justify-between">
                  <span>Kit Sub-Assemblies</span>
                  <span className="text-amber-600 dark:text-[#d4af37] font-bold">
                    {collectionKits.filter((k) => completedKitIds.includes(k.id)).length}/{collectionKits.length} Done
                  </span>
                </div>
                {collectionKits.map((siblingKit, idx) => {
                  const isActive = siblingKit.id === kit.id;
                  const isDone = completedKitIds.includes(siblingKit.id);
                  const isFinalAssembly = idx === collectionKits.length - 1;
                  return (
                    <button
                      key={siblingKit.id}
                      onClick={() => {
                        if (siblingKit.id !== kit.id) {
                          setActiveKitId(siblingKit.id);
                          setCurrentStepIdx(0);
                          setFoldFactor(0.0);
                          playCrease();
                        }
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-xs'
                          : isDone
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-stone-800 dark:text-stone-200 hover:bg-emerald-500/15'
                          : 'bg-stone-100/60 dark:bg-stone-900/40 border border-transparent hover:bg-stone-200/60 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isActive
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] truncate leading-tight font-medium flex items-center gap-1.5">
                          <span className="truncate">{siblingKit.title}</span>
                          {isFinalAssembly && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/25 text-[9px] font-mono text-amber-800 dark:text-[#d4af37] font-bold shrink-0">
                              Assembly
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-stone-400 dark:text-stone-500 font-mono">
                          {siblingKit.time || '10-15 min'} • {siblingKit.difficulty || 'Easy'}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {assemblyProfile && (
                  <button
                    onClick={() => setShowAssemblyModal(true)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>🧩</span>
                    <span>Visual Assembly Guide</span>
                  </button>
                )}
              </div>
            ) : sidebarTab === 'steps' ? (
              /* Step Sequence List */
              <div className="flex-1 my-2 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                <div className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider px-1">
                  {isShowroomMode ? 'Step Preview' : 'Sequence Tracker'}
                </div>
                {kit.steps.map((st, idx) => {
                  const isActive = !isShowroomMode && currentStepIdx === idx;
                  const isDone = completedStepIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isShowroomMode) {
                          setIsShowroomMode(false);
                          setPreviewCompletionModel(false);
                        }
                        playCrease();
                        setCurrentStepIdx(idx);
                        setFoldFactor(0.0);
                        if (isAutoVoiceEnabled) {
                          schoolVoice.speakStep(idx, totalSteps, selectedLang);
                        }
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-xs'
                          : isDone
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-stone-800 dark:text-stone-200 hover:bg-emerald-500/15'
                          : 'bg-stone-100/60 dark:bg-stone-900/40 border border-transparent hover:bg-stone-200/60 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isActive
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] truncate leading-tight font-medium">
                          Step {idx + 1}: {st.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Compact In-Studio Kit Browser */
              <div className="flex-1 my-2 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={kitSearchQuery}
                    onChange={(e) => setKitSearchQuery(e.target.value)}
                    placeholder="Search 63 kits..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                  {kitSearchQuery && (
                    <button
                      onClick={() => setKitSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Level Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px] font-mono scrollbar-none">
                  {(['all', 'easy', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setKitLevelFilter(lvl)}
                      className={`px-2 py-0.5 rounded-md font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                        kitLevelFilter === lvl
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* 1:1 Ratio Kit Cards Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {filteredKits.map((k) => {
                    const isCurrent = k.id === kit.id;
                    return (
                      <button
                        key={k.id}
                        onClick={() => {
                          playChime();
                          setActiveKitId(k.id);
                          setCurrentStepIdx(0);
                          setSidebarTab('steps');
                        }}
                        className={`aspect-square w-full rounded-2xl flex flex-col items-center justify-between p-2 text-center transition-all cursor-pointer border ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200 shadow-md ring-1 ring-amber-500'
                            : 'bg-stone-100/70 dark:bg-stone-900/50 border-stone-200/60 dark:border-white/5 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-stone-700 dark:text-stone-300'
                        }`}
                        title={`${k.title} (${k.difficulty || 'Easy'})`}
                      >
                        <span className="text-2xl mt-1 select-none">
                          {k.emoji || '✨'}
                        </span>
                        <div className="w-full">
                          <div className="text-[10px] font-bold truncate leading-tight">
                            {k.title}
                          </div>
                          <div className="text-[8px] font-mono text-stone-500 dark:text-stone-400 truncate mt-0.5">
                            {k.steps?.length || 5} steps
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Controls in Sidebar: Paper Stock, Scrubber, 180° Flip & Quick Kit Switcher Button */}
            <div className="border-t border-stone-200/80 dark:border-stone-800 pt-2.5 space-y-2 shrink-0">
              {/* Studio Aesthetic Mood Switcher */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-stone-500 uppercase font-bold">Studio Mood</span>
                  <span className="text-[9px] text-amber-700 dark:text-[#d4af37] font-bold">
                    {studioMood === 'artisan' && 'Kyoto 3200K'}
                    {studioMood === 'minimalist' && 'Studio 5600K'}
                    {studioMood === 'engineering' && 'Carbon 7000K'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  {(['artisan', 'minimalist', 'engineering'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setStudioMood(m)}
                      className={`py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer text-center truncate min-h-[34px] flex items-center justify-center ${
                        studioMood === m
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'bg-stone-100/80 dark:bg-stone-900/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200/60 dark:border-stone-800'
                      }`}
                      title={m === 'artisan' ? 'Kyoto Artisan Gallery' : m === 'minimalist' ? 'Modern Minimalist Studio' : 'High-Tech Aerospace Engineering'}
                    >
                      {m === 'artisan' && '🏮 Kyoto'}
                      {m === 'minimalist' && '✨ Studio'}
                      {m === 'engineering' && '🛰️ Aero'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tactile Paper Stock & Kawasaki/Maekawa Validation Badge */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-stone-500 uppercase font-bold">Paper Stock</span>
                  <span className="flex items-center gap-1 text-[9px] text-emerald-700 dark:text-emerald-400 font-bold" title="Flat-foldability mathematically verified under Kawasaki (180°) and Maekawa (|M - V| = 2) theorems">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Flat-Foldable</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  {(['kami', 'washi', 'foil'] as const).map((stock) => (
                    <button
                      key={stock}
                      onClick={() => setPaperStock(stock)}
                      className={`py-1.5 px-1 rounded-lg font-bold capitalize transition-all cursor-pointer text-center min-h-[34px] flex items-center justify-center ${
                        paperStock === stock
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'bg-stone-100/80 dark:bg-stone-900/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200/60 dark:border-stone-800'
                      }`}
                    >
                      {stock === 'kami' && '📄 Kami'}
                      {stock === 'washi' && '🌾 Washi'}
                      {stock === 'foil' && '✨ Foil'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tactile Fold Progress Slider with Stickman Fold Coach */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                  <button
                    onClick={handleStickmanPush}
                    className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                    title="Click Stickman to push and fold this step!"
                  >
                    <StickmanHelper role="push" size={24} interactive onAction={handleStickmanPush} />
                    <span className="font-bold underline decoration-dotted text-stone-700 dark:text-stone-300">Push Fold</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-amber-700 dark:text-[#d4af37]">
                      {Math.round(foldFactor * 100)}%
                    </span>
                    <span>Folded</span>
                  </div>
                </div>
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
              </div>

              {/* Pancake Flip Button */}
              <button
                onClick={togglePancakeFlip}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-mono text-[11px] transition-all cursor-pointer min-h-[32px] ${
                  isPancakeFlipped
                    ? 'neumorph-stone-pressed text-amber-900 dark:text-amber-300 font-bold'
                    : 'neumorph-stone-raised text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Flip paper 180°"
              >
                <span>🥞</span>
                <span className="truncate">{isPancakeFlipped ? 'Front Side' : 'Flip 180° Pancake'}</span>
              </button>

              {/* Step Prev / Next Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIdx === 0}
                  className="flex items-center justify-center gap-1 p-1.5 rounded-xl neumorph-stone-raised disabled:opacity-30 text-stone-700 dark:text-stone-300 text-[11px] font-mono font-bold cursor-pointer min-h-[32px]"
                  title="Previous Step (Keyboard: ←)"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-1 p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-mono font-extrabold cursor-pointer min-h-[32px]"
                  title="Next Step (Keyboard: →)"
                >
                  <span>{isFinalStep ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Switch Kit Button (Below Fold Button) */}
              <button
                onClick={() => setSidebarTab(sidebarTab === 'kits' ? 'steps' : 'kits')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-mono text-[10px] transition-all cursor-pointer border ${
                  sidebarTab === 'kits'
                    ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                    : 'bg-stone-100/80 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-amber-500'
                }`}
                title="Switch to another origami kit"
              >
                <span className="truncate flex items-center gap-1">
                  <span>🎨</span>
                  <span>{sidebarTab === 'kits' ? 'Back to Steps' : 'Browse Kits'}</span>
                </span>
                <span className="text-amber-700 dark:text-[#d4af37] font-bold">
                  {sidebarTab === 'kits' ? '✕' : '❯'}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* 4. SLEEK, PILL-SHAPED FLOATING BOTTOM DOCK
            Elevated with generous breathing room (bottom-8 sm:bottom-9, z-40) to never clip.
            Contains:
            - [Play Step / Pause]
            - [Play All / Stop All]
            - [Rotate 360°]
            - [Voice Narration]
            - [Joint Physics]
            - [Complete] */}
        {/* 4. CONSOLIDATED PRIMARY FOLDING PLAYER DOCK (UX Doctrine Section 4)
            - Prev Step (Left, 48px)
            - Center: Play / Pause + 🥞 180° Pancake Flip (+ Play All & Rotate 360° on tablet/desktop)
            - Next Step (Right, 48px) / Complete
        */}
        <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[98vw] flex flex-col items-center gap-1.5">
          {/* Mobile Step Meta Pill */}
          <div className="md:hidden px-3.5 py-1 rounded-full bg-white/95 dark:bg-[#0c0f1d]/95 backdrop-blur-md border border-stone-200/80 dark:border-white/10 shadow-sm font-mono text-[11px] text-stone-700 dark:text-stone-300 max-w-[90vw] truncate flex items-center gap-1.5">
            <span className="font-bold text-amber-600 dark:text-[#d4af37]">Step {currentStepIdx + 1}/{totalSteps}:</span>
            <span className="truncate">{currentStep.title}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2.5 px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/95 dark:bg-[#0c0f1d]/95 backdrop-blur-xl border-2 border-stone-200/90 dark:border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.25)] font-mono text-xs select-none">
            {/* Primary Action 1: [◀ Prev Step] (48px height minimum) */}
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[48px] min-w-[48px] text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Step (Keyboard: ←)"
              aria-label="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <span className="w-px h-5 bg-stone-300 dark:bg-stone-800" />

            {/* Primary Action 2A: [▶ Play / ⏸ Pause Step] */}
            <button
              onClick={togglePlay}
              className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[48px] ${
                isPlaying && !isPlayAll
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
              }`}
              title={isPlaying && !isPlayAll ? "Pause fold animation (Space)" : "Play fold animation (Space)"}
              aria-label={isPlaying && !isPlayAll ? "Pause fold animation" : "Play fold animation"}
            >
              {isPlaying && !isPlayAll ? (
                <Pause className="w-4 h-4 text-amber-600 fill-amber-600" />
              ) : (
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              )}
              <span>{isPlaying && !isPlayAll ? 'Pause' : 'Play'}</span>
            </button>

            {/* Primary Action 2B: [🥞 Flip 180° Pancake] (Pillar 4 - Accessible on ALL viewports) */}
            <button
              onClick={togglePancakeFlip}
              className={`flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[48px] ${
                isPancakeFlipped
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 font-bold'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
              }`}
              title="Flip paper 180° like a pancake (Keyboard: F)"
              aria-label="Flip paper 180 degrees"
            >
              <span className="text-sm">🥞</span>
              <span>{isPancakeFlipped ? 'Front' : 'Flip 180°'}</span>
            </button>

            {/* Auxiliary Desktop/Tablet Actions: [Play All], [Rotate 360°], [Joint Physics] */}
            <button
              onClick={togglePlayAll}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[48px] ${
                isPlayAll
                  ? 'bg-purple-500/20 text-purple-900 dark:text-purple-300 border border-purple-500/40 animate-pulse'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
              }`}
              title="Play continuous demonstration through all steps"
            >
              <FastForward className="w-4 h-4 text-purple-600 fill-purple-600" />
              <span>{isPlayAll ? 'Stop All' : 'Play All'}</span>
            </button>

            <button
              onClick={toggleAutoRotate}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[48px] ${
                isAutoRotating
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
              }`}
              title="360° turntable rotation"
            >
              <RotateCcw className={`w-4 h-4 text-amber-600 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span>Rotate 360°</span>
            </button>

            <button
              onClick={toggleDynamicRelaxation}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[48px] ${
                enableDynamicRelaxation
                  ? 'bg-cyan-500/25 text-cyan-950 dark:text-cyan-200 border border-cyan-400'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
              }`}
              title="Particle-spring joint compliance physics"
            >
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>{enableDynamicRelaxation ? 'Joints Active' : 'Joints'}</span>
            </button>

            <span className="w-px h-5 bg-stone-300 dark:bg-stone-800" />

            {/* Primary Action 3: [Next Step ▶ / Finish 🏆] (High contrast primary button) */}
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-black shadow-lg shadow-orange-500/25 transition-all cursor-pointer min-h-[48px] active:scale-[0.98]"
              title={isFinalStep ? "Finish Model & Celebrate!" : "Next Step (Keyboard: →)"}
              aria-label={isFinalStep ? "Finish Model and Celebrate" : "Next Step"}
            >
              <span>{isFinalStep ? 'Finish' : 'Next'}</span>
              {isFinalStep ? <Trophy className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Floating Right 2D Yoshizawa-Randlett Diagram Drawer */}
        {showStepGuidance && (
          <aside className="absolute right-2 sm:right-4 top-2 sm:top-4 bottom-20 sm:bottom-22 z-40 pointer-events-none flex flex-col max-w-[calc(100vw-1rem)]">
            <div className="pointer-events-auto w-[calc(100vw-1.5rem)] sm:w-80 lg:w-96 h-full neumorph-stone-raised dark:bg-[#0c0f1d]/95 backdrop-blur-md border border-stone-200/80 dark:border-white/10 shadow-2xl overflow-y-auto rounded-3xl p-4">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200 dark:border-stone-800">
                <span className="font-mono text-xs font-bold text-amber-800 dark:text-[#d4af37] uppercase">
                  2D Yoshizawa-Randlett Guide
                </span>
                <button
                  onClick={() => setShowStepGuidance(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label="Close 2D Guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <StepGuidance />
            </div>
          </aside>
        )}
        {/* Pillar 5: Interactive Child Coach / Folding Hands */}
        {!isShowroomMode && (
          <OrigamiCoach
            coachType={coachType}
            action={coachAction}
            metaphor={
              currentStepIdx === 0 && !isPancakeFlipped
                ? 'Place paper COLOR SIDE DOWN (White side looking at you)!'
                : (schoolProfile?.juniorMetaphor || currentStep.instruction || currentStep.title)
            }
            cheer={schoolProfile?.juniorCheer}
            stepNumber={currentStepIdx + 1}
            onSelectCoach={(c) => setCoachType(c)}
          />
        )}
      </main>

      {/* Artisan Inspector Slide-Over Drawer */}
      <ArtisanInspectorDrawer />

      {/* Screen 2: Gamification Confetti & Burst Reward Modal */}
      {showCelebration && (
        <CelebrationOverlay
          kit={kit}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Pillar 1: Visual Multi-Part Assembly Stage Modal */}
      {showAssemblyModal && assemblyProfile && (
        <AssemblyStageModal
          profile={assemblyProfile}
          activeKitId={kit.id}
          onSelectPart={(id) => {
            setActiveKitId(id);
            setCurrentStepIdx(0);
            setFoldFactor(0.0);
          }}
          onClose={() => setShowAssemblyModal(false)}
        />
      )}
    </div>
  );
};

export default StudioView;
