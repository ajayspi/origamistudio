import React from 'react';
import { useOrigamiStore, type SchoolGradeFilter } from '../store/useOrigamiStore';
import { Search, X, GraduationCap, Baby, Compass, Cpu } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'ALL', count: 62 },
  { id: 'indian', label: '🇮🇳 INDIAN', count: 8 },
  { id: 'japanese', label: '🇯🇵 JAPANESE', count: 6 },
  { id: 'chinese', label: '🇨🇳 CHINESE', count: 6 },
  { id: 'american', label: '🇺🇸 AMERICAN', count: 6 },
  { id: 'lotus', label: '🪷 LOTUS', count: 6 },
  { id: 'butterfly', label: '🦋 BUTTERFLY', count: 7 },
  { id: 'geometric', label: '🏺 GEOMETRIC', count: 8 },
  { id: 'nativity', label: '🏛️ NATIVITY', count: 10 },
  { id: 'holiday', label: '🎃 FESTIVALS', count: 5 }
];

const GRADE_TRACKS: { id: SchoolGradeFilter; label: string; icon: React.ReactNode; tooltip: string }[] = [
  { id: 'all', label: 'All Grade Tracks', icon: <GraduationCap className="w-3.5 h-3.5 text-amber-400" />, tooltip: 'Show all 62 origami master kits' },
  { id: 'sprouts', label: '🐣 Sprouts (K-3)', icon: <Baby className="w-3.5 h-3.5 text-amber-400" />, tooltip: 'Ages 5-8: Big folds, fun animal/food shapes' },
  { id: 'explorers', label: '⭐ Explorers (4-8)', icon: <Compass className="w-3.5 h-3.5 text-cyan-400" />, tooltip: 'Ages 9-13: Numbered landmarks and intermediate models' },
  { id: 'stem', label: '🔬 STEM Champions (9-12)', icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />, tooltip: 'Ages 14-18: Advanced polyhedra, Kawasaki theorems' }
];

export const CulturalFilter: React.FC<{ totalMatched: number }> = ({ totalMatched }) => {
  const {
    activeCultureFilter,
    setActiveCultureFilter,
    searchQuery,
    setSearchQuery,
    schoolGradeFilter,
    setSchoolGradeFilter
  } = useOrigamiStore();

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search Input Row */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 62 master kits by name, subject, or folding technique..."
          className="w-full bg-[#0a0b14] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b35] transition-all font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* School Grade & Age Track Filter Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          {GRADE_TRACKS.map((track) => {
            const isActive = schoolGradeFilter === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSchoolGradeFilter(track.id)}
                title={track.tooltip}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#f59e0b] text-white shadow-md shadow-[#ff6b35]/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {track.icon}
                <span>{track.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cultural Filter Tabs Row */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
        {FILTER_OPTIONS.map((f) => {
          const isActive = activeCultureFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveCultureFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer font-semibold ${
                isActive
                  ? 'bg-[#ff6b35] text-white border-[#ff6b35] shadow-lg shadow-[#ff6b35]/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label} <span className="opacity-70 text-[10px]">({f.count})</span>
            </button>
          );
        })}
      </div>

      {/* Results Telemetry */}
      <div className="text-center text-xs font-mono text-slate-400">
        Showing <span className="text-[#00f0ff] font-semibold">{totalMatched}</span> master origami kits
      </div>
    </div>
  );
};
