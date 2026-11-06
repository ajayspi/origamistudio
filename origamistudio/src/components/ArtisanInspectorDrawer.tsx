import React, { useState } from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import {
  X, Compass, ShieldCheck, FileCode, Activity,
  Printer, Sun, Moon, Tv
} from 'lucide-react';
import {
  downloadFoldFile,
  downloadCricutSvg
} from '../utils/foldFormat';
import { downloadDxfFile } from '../utils/dxfExporter';

export const ArtisanInspectorDrawer: React.FC = () => {
  const {
    activeKitId,
    currentStepIdx,
    foldFactor,
    isArtisanDrawerOpen,
    setArtisanDrawerOpen,
    cameraPreset,
    setCameraPreset,
    lightingMood,
    setLightingMood,
    paperStock,
    setPaperStock,
    studioMood,
    setStudioMood,
    setShowRefFinderModal,
    showWaveHud,
    setShowWaveHud,
    ageTrack,
    setAgeTrack,
    isClassroomMode,
    setClassroomMode,
    setView
  } = useOrigamiStore();

  const [activeTab, setActiveTab] = useState<'theorems' | 'solvers' | 'stage' | 'curriculum'>('theorems');

  if (!isArtisanDrawerOpen) return null;

  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={() => setArtisanDrawerOpen(false)} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#faf8f5] dark:bg-[#0f111a] border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden text-stone-900 dark:text-stone-100 transition-colors duration-200">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-700 dark:text-[#d4af37]">🎓</span>
                <h2 className="font-cinzel text-lg font-bold tracking-wide">
                  Teacher & STEM Lab
                </h2>
              </div>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                High School Geometry, Flat-Foldability Proofs & CAD Tools
              </p>
            </div>

            <button
              onClick={() => setArtisanDrawerOpen(false)}
              className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Close Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-4 p-2 gap-1 bg-stone-100 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('theorems')}
              className={`py-2 px-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'theorems'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Theorems
            </button>
            <button
              onClick={() => setActiveTab('solvers')}
              className={`py-2 px-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'solvers'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Solvers
            </button>
            <button
              onClick={() => setActiveTab('stage')}
              className={`py-2 px-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'stage'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Stage & CAD
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`py-2 px-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Curriculum
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
            {/* TAB 1: THEOREMS */}
            {activeTab === 'theorems' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#141724] border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Kawasaki-Justin Theorem
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                      VERIFIED (180°)
                    </span>
                  </div>
                  <p className="text-xs font-serif text-stone-600 dark:text-stone-300 leading-relaxed">
                    At every flat-foldable degree-4 vertex, the sum of alternating angles equals 180° (i.e. <span className="font-mono font-semibold">θ₁ + θ₃ = θ₂ + θ₄ = 180°</span>). Proven flat-foldable without self-intersection.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#141724] border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-[#d4af37] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Maekawa-Justin Parity
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-[#d4af37] font-bold">
                      |M − V| = 2
                    </span>
                  </div>
                  <p className="text-xs font-serif text-stone-600 dark:text-stone-300 leading-relaxed">
                    The difference between the number of Mountain (M) and Valley (V) creases around any flat-foldable vertex is always strictly 2.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#141724] border border-stone-200 dark:border-stone-800 space-y-3">
                  <span className="font-mono text-xs font-bold block text-stone-700 dark:text-stone-300">
                    WaveDrom Kinematic Sequence HUD
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Inspect the multi-stage phase timing and strain actuation pulses for this sculpture.
                  </p>
                  <button
                    onClick={() => setShowWaveHud(!showWaveHud)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    <Activity className="w-4 h-4 text-amber-600 dark:text-[#d4af37]" />
                    <span>{showWaveHud ? 'Close WaveDrom Timeline' : 'Open WaveDrom Kinematic HUD'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: COMPUTATIONAL SOLVERS */}
            {activeTab === 'solvers' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-[#141724] border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-[#d4af37]">
                    <Compass className="w-4 h-4" />
                    <span>Robert Lang Reference Finder</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                    Solve geometric folding sequences using the 7 Huzita-Hatori axioms for arbitrary target points.
                  </p>
                  <button
                    onClick={() => {
                      setArtisanDrawerOpen(false);
                      setShowRefFinderModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-[#d4af37] text-white dark:text-stone-950 text-xs font-mono font-bold cursor-pointer shadow-xs hover:shadow-md transition-all"
                  >
                    <span>Launch Reference Finder</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 3: STAGE & CAD */}
            {activeTab === 'stage' && (
              <div className="space-y-5">
                {/* Camera View Angle */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
                    Camera Framing
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      onClick={() => setCameraPreset('perspective')}
                      className={`py-2 rounded-xl border font-semibold cursor-pointer ${
                        cameraPreset === 'perspective'
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      📐 3D Hero
                    </button>
                    <button
                      onClick={() => setCameraPreset('top')}
                      className={`py-2 rounded-xl border font-semibold cursor-pointer ${
                        cameraPreset === 'top'
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      🔝 Top Plan
                    </button>
                    <button
                      onClick={() => setCameraPreset('front')}
                      className={`py-2 rounded-xl border font-semibold cursor-pointer ${
                        cameraPreset === 'front'
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      🔲 Elevation
                    </button>
                  </div>
                </div>

                {/* Lighting Atmosphere */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
                    Lighting Atmosphere
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      onClick={() => setLightingMood('studio')}
                      className={`py-2 rounded-xl border font-semibold cursor-pointer ${
                        lightingMood === 'studio'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-[#d4af37] font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      💡 Studio
                    </button>
                    <button
                      onClick={() => setLightingMood('daylight')}
                      className={`flex items-center justify-center gap-1 py-2 rounded-xl border font-semibold cursor-pointer ${
                        lightingMood === 'daylight'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-[#d4af37] font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Daylight</span>
                    </button>
                    <button
                      onClick={() => setLightingMood('midnight')}
                      className={`flex items-center justify-center gap-1 py-2 rounded-xl border font-semibold cursor-pointer ${
                        lightingMood === 'midnight'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-[#d4af37] font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Midnight</span>
                    </button>
                  </div>
                </div>

                {/* Studio Aesthetic Moods */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
                    Studio Aesthetic Mood
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {(['artisan', 'minimalist', 'engineering'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setStudioMood(m)}
                        className={`py-2 px-1 text-center rounded-xl border font-semibold cursor-pointer truncate ${
                          studioMood === m
                            ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-[#d4af37] font-bold'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
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

                {/* Tactile Paper Stock */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
                    Paper Material Stock
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {(['kami', 'washi', 'foil'] as const).map((stock) => (
                      <button
                        key={stock}
                        onClick={() => setPaperStock(stock)}
                        className={`py-2 rounded-xl border font-semibold cursor-pointer capitalize ${
                          paperStock === stock
                            ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-[#d4af37] font-bold'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {stock === 'kami' && '📄 Kami'}
                        {stock === 'washi' && '🌾 Washi'}
                        {stock === 'foil' && '✨ Foil'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CAD Exporters */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <label className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
                    Export CAD & Computational Formats
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => downloadFoldFile(kit, currentStepIdx, foldFactor)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 text-xs font-mono cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-bold">MIT .FOLD v1.1</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Origami Simulator</span>
                    </button>

                    <button
                      onClick={() => downloadCricutSvg(kit, currentStepIdx)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 text-xs font-mono cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="font-bold">Cricut / Laser SVG</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Score & Cut Layers</span>
                    </button>

                    <button
                      onClick={() => downloadDxfFile(kit, currentStepIdx)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-cyan-500/50 text-xs font-mono cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span className="font-bold">AutoCAD .DXF CAM</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Cutter Score & Cut</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CURRICULUM */}
            {activeTab === 'curriculum' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
                    Pedagogical Age Track
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setAgeTrack('junior')}
                      className={`w-full p-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
                        ageTrack === 'junior'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      🐣 Junior Sprouts (Ages 5–8 / Grades K–3)
                      <div className="text-[10px] font-sans text-stone-500 mt-0.5">Big intuitive folds with fun food and animal metaphors.</div>
                    </button>

                    <button
                      onClick={() => setAgeTrack('explorer')}
                      className={`w-full p-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
                        ageTrack === 'explorer'
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-900 dark:text-cyan-300 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      ⭐ Origami Explorers (Ages 9–13 / Grades 4–8)
                      <div className="text-[10px] font-sans text-stone-500 mt-0.5">Numbered landmark guidance ❶ ➔ ❷ with precision thumb creasing.</div>
                    </button>

                    <button
                      onClick={() => setAgeTrack('stem')}
                      className={`w-full p-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
                        ageTrack === 'stem'
                          ? 'bg-purple-500/15 border-purple-500 text-purple-900 dark:text-purple-300 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      🔬 STEM Champions (Ages 14–18 / Grades 9–12)
                      <div className="text-[10px] font-sans text-stone-500 mt-0.5">Kawasaki parity, dihedral angles, aerospace folding kinetics.</div>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                  <button
                    onClick={() => {
                      setArtisanDrawerOpen(false);
                      setView('print-guide', kit.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4 text-amber-700 dark:text-[#d4af37]" />
                    <span>Open Printable A4 Crease Guide</span>
                  </button>

                  <button
                    onClick={() => setClassroomMode(!isClassroomMode)}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      isClassroomMode
                        ? 'bg-purple-700 text-white border-purple-600'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    <span>{isClassroomMode ? 'Classroom Mode: Active' : 'Enable Smartboard Projector Mode'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 text-center text-[10px] font-mono text-stone-500">
          OrigamiStudio™ Computational Geometry Core • Zero-Cut Purity
        </div>
      </div>
    </div>
  );
};

export default ArtisanInspectorDrawer;
