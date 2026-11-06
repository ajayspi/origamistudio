import React from 'react';
import { motion } from 'framer-motion';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

interface Mascot {
  id: string;
  name: string;
  japaneseName: string;
  emoji: string;
  kitId: string;
  difficulty: 'Super Easy' | 'Easy' | 'Intermediate';
  folds: number;
  gradeBadge: string;
  colorClass: string;
  borderClass: string;
  tagline: string;
}

const MASCOTS: Mascot[] = [
  {
    id: 'crane',
    name: 'Peace Crane',
    japaneseName: '折鶴 (Orizuru)',
    emoji: '🕊️',
    kitId: 'japanese-01',
    difficulty: 'Easy',
    folds: 6,
    gradeBadge: '⭐ Grade 3+',
    colorClass: 'from-amber-500/15 via-amber-500/5 to-transparent text-amber-800 dark:text-amber-300',
    borderClass: 'border-amber-500/30 hover:border-amber-500',
    tagline: 'World symbol of peace and patience.',
  },
  {
    id: 'frog',
    name: 'Jumping Frog',
    japaneseName: '跳び蛙 (Tobikaeru)',
    emoji: '🐸',
    kitId: 'american-03',
    difficulty: 'Super Easy',
    folds: 4,
    gradeBadge: '🐣 Kindergarten & Grade 1',
    colorClass: 'from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-800 dark:text-emerald-300',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500',
    tagline: 'Press its back to make it leap 2 feet!',
  },
  {
    id: 'boat',
    name: 'Magic Boat',
    japaneseName: '福船 (Magic Boat)',
    emoji: '⛵',
    kitId: 'chinese-06',
    difficulty: 'Easy',
    folds: 6,
    gradeBadge: '🌊 All Ages Favorite',
    colorClass: 'from-blue-500/15 via-blue-500/5 to-transparent text-blue-800 dark:text-blue-300',
    borderClass: 'border-blue-500/30 hover:border-blue-500',
    tagline: 'Watertight hull geometry with iconic sails.',
  },
  {
    id: 'star',
    name: 'Lucky Shuriken Star',
    japaneseName: '手裏剣 (Shuriken)',
    emoji: '⭐',
    kitId: 'japanese-06',
    difficulty: 'Intermediate',
    folds: 6,
    gradeBadge: '🔬 Grade 4+ STEAM',
    colorClass: 'from-purple-500/15 via-purple-500/5 to-transparent text-purple-800 dark:text-purple-300',
    borderClass: 'border-purple-500/30 hover:border-purple-500',
    tagline: 'Interlocking twin-module 8-point star.',
  },
];

export const InteractiveOrigamiMascots: React.FC = () => {
  const launchKit = useOrigamiStore((state) => state.launchKit);
  const isCalmMode = useOrigamiStore((state) => state.isCalmMode);
  const { playCrease, playStepClick } = useOrigamiAudio();

  const handleLaunchMascot = (kitId: string) => {
    playCrease();
    launchKit(kitId);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
            Pick Your First Model • 1-Click Launch 🚀
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
          Tap any friend to start!
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MASCOTS.map((mascot, index) => (
          <motion.button
            key={mascot.id}
            type="button"
            onClick={() => handleLaunchMascot(mascot.kitId)}
            onMouseEnter={() => playStepClick()}
            initial={{ opacity: 0, y: isCalmMode ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
              delay: index * 0.06,
            }}
            whileHover={isCalmMode ? {} : { scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.96 }}
            className={`group text-left p-3.5 sm:p-4 rounded-xl bg-gradient-to-b ${mascot.colorClass} bg-white/70 dark:bg-black/40 backdrop-blur-md border ${mascot.borderClass} shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden select-none min-h-[44px]`}
          >
            {/* Top Grade Tag & Emoji */}
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl sm:text-3xl filter drop-shadow group-hover:scale-120 transition-transform duration-300">
                {mascot.emoji}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/60 border border-stone-200 dark:border-white/10 font-bold text-stone-700 dark:text-stone-300">
                {mascot.gradeBadge}
              </span>
            </div>

            {/* Mascot Title */}
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {mascot.name}
            </h3>
            <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400 italic mb-1.5">
              {mascot.japaneseName}
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed mb-3">
              {mascot.tagline}
            </p>

            {/* Bottom Quick Launch CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-white/10 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                {mascot.folds} Folds
              </span>
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                <Play className="w-3 h-3 fill-current" />
                Fold Now
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default InteractiveOrigamiMascots;
