import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ALL_KITS_ARRAY, getKitById } from '../data/kits';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { KitCard } from './KitCard';
import { OrigamiFigure } from './OrigamiFigure';
import { LivingStickman } from './LivingStickman';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import type { OrigamiKit } from '../types/origami';

export type KitLevel = 'A' | 'B' | 'C' | 'all';

export function getKitLevel(kit: OrigamiKit): 'A' | 'B' | 'C' {
  const stepsCount = kit.steps ? kit.steps.length : 6;
  const diff = (kit.difficulty || '').toLowerCase();
  if (
    diff.includes('beginner') ||
    stepsCount <= 6 ||
    kit.id === 'japanese-01' ||
    kit.id === 'japanese-02' ||
    kit.id === 'japanese-03' ||
    kit.id === 'american-03'
  ) {
    return 'A';
  }
  if (
    diff === 'master' ||
    diff === 'advanced' ||
    stepsCount >= 10 ||
    kit.id === 'japanese-06' ||
    kit.id === 'aerospace-01'
  ) {
    return 'C';
  }
  return 'B';
}

interface JourneyTrackItem {
  level: 'A' | 'B' | 'C';
  title: string;
  tagline: string;
  iconName: string;
  description: string;
  featuredKitId: string;
  gradeBadge: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

const JOURNEY_TRACK: JourneyTrackItem[] = [
  {
    level: 'A',
    title: 'Kit A (Starter)',
    tagline: 'Learn the Magic.',
    iconName: 'Basic Paper Fold',
    description: 'Master clean valley and mountain creases. Step-by-step 3D origami magic for young beginners.',
    featuredKitId: 'japanese-01',
    gradeBadge: 'Grades K–3 • 4-6 Steps',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'border-amber-500/30',
  },
  {
    level: 'B',
    title: 'Kit B (Explorer)',
    tagline: 'Make it Move.',
    iconName: 'Paper with Gears & Spring',
    description: 'Transform paper into hopping frogs, flappers, and kinetic hinges with lively mechanical motion.',
    featuredKitId: 'american-03',
    gradeBadge: 'Grades 4–8 • Action Toys',
    color: '#10b981',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-500/30',
  },
  {
    level: 'C',
    title: 'Kit C (Master Builder)',
    tagline: 'Build Machines.',
    iconName: 'Complex Kinetic Machine',
    description: 'Construct architectural wonders, NASA deployable solar arrays, and intricate 3D paper sculptures.',
    featuredKitId: 'japanese-06',
    gradeBadge: 'Grades 9–12 • Epic 3D',
    color: '#8b5cf6',
    bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    borderColor: 'border-purple-500/30',
  },
];

export const KitGrid: React.FC = () => {
  const { searchQuery, setSearchQuery } = useOrigamiStore();
  const [selectedLevel, setSelectedLevel] = useState<KitLevel>('all');
  const [visibleLimit, setVisibleLimit] = useState<number>(12);

  const handleSelectLevel = (level: KitLevel, shouldScroll = false) => {
    setSelectedLevel(level);
    setVisibleLimit(12);
    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById('all-kits-gallery');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  // Reset pagination limit on filter changes
  useEffect(() => {
    setVisibleLimit(12);
  }, [searchQuery, selectedLevel]);

  // Compute counts per level
  const levelCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, all: ALL_KITS_ARRAY.length };
    ALL_KITS_ARRAY.forEach((k) => {
      const lvl = getKitLevel(k);
      counts[lvl]++;
    });
    return counts;
  }, []);

  // Filter kits
  const filteredKits = useMemo(() => {
    return ALL_KITS_ARRAY.filter((kit) => {
      // 1. Level filter
      if (selectedLevel !== 'all' && getKitLevel(kit) !== selectedLevel) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = kit.title.toLowerCase().includes(query);
        const nameMatch = (kit.name || '').toLowerCase().includes(query);
        const descMatch = (kit.description || '').toLowerCase().includes(query);
        const goalMatch = (kit.goal || '').toLowerCase().includes(query);
        const colMatch = (kit.collectionTitle || kit.collection || '').toLowerCase().includes(query);
        return titleMatch || nameMatch || descMatch || goalMatch || colMatch;
      }

      return true;
    });
  }, [selectedLevel, searchQuery]);

  const visibleKits = useMemo(() => {
    return filteredKits.slice(0, visibleLimit);
  }, [filteredKits, visibleLimit]);

  const hasMore = visibleLimit < filteredKits.length;

  return (
    <section id="journey-track" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
      {/* SECTION 2 HEADER: The 3-Part Journey with Border Patrol Walker */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '9s' }} />
          <span>SCROLL-TRIGGERED PROGRESSION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-fredoka font-bold text-stone-900 dark:text-white tracking-tight">
          The 3-Part Folding Journey
        </h2>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-quicksand font-medium max-w-2xl mx-auto">
          Progress from simple magic folds to moving kinetic action toys and epic mechanical paper machines.
        </p>

        {/* Living Patrol Pip walking autonomously along the section boundary ledge */}
        <div className="w-full max-w-md mx-auto pt-3 pb-1 flex flex-col items-center">
          <div className="relative w-[340px] h-14 overflow-visible">
            <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-stone-200 dark:bg-white/10 rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-amber-500/40" />
              <span className="w-2 h-2 rounded-full bg-amber-500/40" />
            </div>
            <LivingStickman
              mode="walker"
              railWidth={290}
              size={48}
              caption="Patrol Pip on duty!"
              className="absolute bottom-1 left-0"
            />
          </div>
        </div>
      </div>

      {/* 3 HEROIC TRACK PROGRESSION CARDS (Kit A, Kit B, Kit C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {JOURNEY_TRACK.map((track, idx) => {
          const featuredKit = getKitById(track.featuredKitId);
          const isCurrent = selectedLevel === track.level;

          return (
            <motion.div
              key={track.level}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              onClick={() => handleSelectLevel(track.level, true)}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer border-2 transition-all duration-300 backdrop-blur-xl bg-gradient-to-b ${track.bgGradient} ${
                isCurrent
                  ? `${track.borderColor} shadow-2xl ring-2 ring-amber-500/50`
                  : 'border-stone-200/80 dark:border-white/10 hover:border-amber-500/40 shadow-md'
              }`}
              data-cursor-text={`Filter ${track.title}`}
            >
              {/* Washi Paper Tape Top Detail */}
              <div
                className="absolute -top-3 left-10 w-16 h-4.5 backdrop-blur-xs -rotate-2 rounded-xs border-y z-20 pointer-events-none shadow-xs"
                style={{
                  backgroundColor: `${track.color}40`,
                  borderColor: `${track.color}60`,
                }}
              />

              {/* Header Badge & Level Number */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LivingStickman
                      mode={track.level === 'A' ? 'percher' : track.level === 'B' ? 'pusher' : 'peeker'}
                      size={36}
                    />
                    <span
                      className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${track.color}20`,
                        color: track.color,
                        border: `1px solid ${track.color}40`,
                      }}
                    >
                      {track.gradeBadge}
                    </span>
                  </div>
                  <span className="text-2xl font-fredoka font-bold opacity-30 text-stone-900 dark:text-white">
                    0{idx + 1}
                  </span>
                </div>

                {/* 3D Featured Origami Stage Showcase (1:1 Ratio Box) */}
                <div className="w-full aspect-square rounded-2xl bg-white/65 dark:bg-black/35 flex items-center justify-center p-3 mb-4 border border-stone-200/50 dark:border-white/5 shadow-inner overflow-hidden">
                  {featuredKit && (
                    <OrigamiFigure kit={featuredKit} size={142} variant="sculpture" animated={true} />
                  )}
                </div>

                {/* Title & Tagline */}
                <h3 className="font-fredoka text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                  {track.title}
                </h3>
                <h4
                  className="font-fredoka text-base font-semibold mt-0.5"
                  style={{ color: track.color }}
                >
                  "{track.tagline}"
                </h4>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-quicksand font-medium mt-2 leading-relaxed">
                  {track.description}
                </p>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-6 mt-4 border-t border-stone-200/60 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
                  {levelCounts[track.level]} Fun Models
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectLevel(track.level, true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-fredoka font-bold px-3 py-1.5 rounded-xl transition-transform group-hover:translate-x-1 cursor-pointer"
                  style={{ color: track.color }}
                >
                  <span>{isCurrent ? 'Viewing Level ↓' : 'Select Level →'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* GALLERY SECTION HEADER WITH LIVING BROOMIE SWEEPER */}
      <div id="all-kits-gallery" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-white/10 pb-4 pt-6 scroll-mt-24">
        <div>
          <h3 className="text-2xl sm:text-3xl font-fredoka font-bold text-stone-900 dark:text-white">
            Explore All 63 Kinetic Kits
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-mono mt-1">
            Pick a kit, grab a sheet of paper, and fold along in real-time 3D.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-400/5 px-3 py-1.5 rounded-2xl border border-amber-500/20">
          <LivingStickman mode="sweeper" size={44} caption="Broomie sweeping paper scraps" />
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-[#111422]/90 backdrop-blur-md p-3 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-sm">
        {/* Level Tabs: Kit A, Kit B, Kit C, All */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleSelectLevel('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-fredoka font-bold transition-all cursor-pointer ${
              selectedLevel === 'all'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10'
            }`}
          >
            <span>✨ All Kits</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/15 dark:bg-black/20 font-bold font-mono">
              {levelCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLevel('A')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-fredoka font-bold transition-all cursor-pointer ${
              selectedLevel === 'A'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10'
            }`}
          >
            <span>🐣 Kit A: Starter</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/15 font-bold font-mono">
              {levelCounts.A}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLevel('B')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-fredoka font-bold transition-all cursor-pointer ${
              selectedLevel === 'B'
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/25'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10'
            }`}
          >
            <span>🐸 Kit B: Explorer</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/15 font-bold font-mono">
              {levelCounts.B}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLevel('C')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-fredoka font-bold transition-all cursor-pointer ${
              selectedLevel === 'C'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10'
            }`}
          >
            <span>🐉 Kit C: Master Builder</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/15 font-bold font-mono">
              {levelCounts.C}
            </span>
          </button>
        </div>

        {/* Clean Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frogs, cranes, dragons..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-[#181c2e] border border-stone-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-quicksand font-medium text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-400 px-2">
        <span>
          Showing <strong>{visibleKits.length}</strong> of <strong>{filteredKits.length}</strong> origami kits
        </span>
        {selectedLevel !== 'all' && (
          <button
            type="button"
            onClick={() => setSelectedLevel('all')}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Reset to All Kits
          </button>
        )}
      </div>

      {/* CLUTTER-FREE 3D KITS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleKits.map((kit) => (
          <KitCard key={kit.id} kit={kit} />
        ))}
      </div>

      {/* Empty Search State */}
      {filteredKits.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-fredoka font-bold text-stone-900 dark:text-white">
            No Origami Kits Found
          </h3>
          <p className="text-xs font-mono text-stone-500 max-w-sm mx-auto">
            No models match "{searchQuery}". Try searching for "crane", "frog", or "box".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-fredoka font-bold cursor-pointer shadow-md"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination "Load More" Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 12)}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-white/10 hover:border-amber-500 dark:hover:border-amber-400 text-xs sm:text-sm font-fredoka font-bold text-stone-800 dark:text-stone-200 transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <span>Load More Origami Kits (+12)</span>
            <span className="text-xs font-mono opacity-60">
              ({filteredKits.length - visibleLimit} remaining)
            </span>
          </button>
        </div>
      )}
    </section>
  );
};
