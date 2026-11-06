import React from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { Wind, Zap } from 'lucide-react';

interface CalmModeToggleProps {
  className?: string;
  compact?: boolean;
}

export const CalmModeToggle: React.FC<CalmModeToggleProps> = ({ className = '', compact = false }) => {
  const { isCalmMode, toggleCalmMode } = useOrigamiStore();

  return (
    <button
      type="button"
      onClick={toggleCalmMode}
      title={isCalmMode ? 'Calm Mode active (motion minimized for classrooms)' : 'Kinetic Motion active (click to calm motion)'}
      aria-label="Toggle calm classroom motion mode"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
        isCalmMode
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
          : 'bg-stone-100 dark:bg-white/5 border-stone-300 dark:border-white/10 text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-white/10'
      } ${className}`}
    >
      {isCalmMode ? (
        <>
          <Wind className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{compact ? 'Calm' : '🍃 Calm Motion'}</span>
        </>
      ) : (
        <>
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{compact ? 'Motion' : '⚡ Dynamic Motion'}</span>
        </>
      )}
    </button>
  );
};

export default CalmModeToggle;
