import React from 'react';
import { motion } from 'framer-motion';
import { getDailyFeaturedKit } from '../data/kits';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { OrigamiFigure } from './OrigamiFigure';
import { Box, Printer, CheckCircle2, Star, Baby, Compass, Cpu } from 'lucide-react';

export const DailySpotlight: React.FC = () => {
  const kit = getDailyFeaturedKit();
  const { setView, completedKitIds, launchKit } = useOrigamiStore();
  const isCompleted = completedKitIds.includes(kit.id);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  const getGradePill = (diff: string) => {
    if (diff === 'Beginner' || diff === 'Beginner-Intermediate') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
          <Baby className="w-3.5 h-3.5" />
          <span>🐣 Ages 5–8 (Grades K–3)</span>
        </span>
      );
    }
    if (diff === 'Intermediate') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>⭐ Ages 9–13 (Grades 4–8)</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold">
        <Cpu className="w-3.5 h-3.5" />
        <span>🔬 Ages 14–18 (Grades 9–12)</span>
      </span>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl bg-white dark:bg-[#101322] border border-stone-200 dark:border-white/[0.12] p-6 sm:p-10 overflow-hidden shadow-2xl transition-colors duration-200"
      >
        {/* Ambient Subtle Golden Corner Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#d4af37]/15 via-transparent to-transparent rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-[#d4af37] border border-amber-500/30 font-bold tracking-wider">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                DAILY CLASSROOM CHALLENGE • {todayFormatted}
              </span>

              {getGradePill(kit.difficulty || 'Intermediate')}

              {isCompleted ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  COMPLETED TODAY ⭐
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-white/[0.04] text-stone-700 dark:text-slate-300 border border-stone-300 dark:border-white/[0.1] font-semibold">
                  EARN YOUR STAR
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cinzel text-stone-900 dark:text-white tracking-wide">
              {kit.title}
            </h2>

            <p className="text-stone-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {kit.description || kit.goal}
            </p>

            {/* Principles & Highlights */}
            <div className="flex flex-wrap gap-2 pt-1">
              {kit.principles?.slice(0, 3).map((p, i) => (
                <span key={i} className="text-xs font-mono px-3 py-1 rounded-lg bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.08] text-stone-700 dark:text-slate-300 font-medium">
                  ❖ {p}
                </span>
              ))}
            </div>

            {/* Action Buttons (48px Touch Targets) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => launchKit(kit.id)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b38927] hover:from-[#dfba48] hover:to-[#be9332] text-stone-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer font-mono min-h-[48px]"
              >
                <Box className="w-4 h-4" />
                <span>{isCompleted ? 'Practice Again in 3D Studio' : 'Fold Today\'s Challenge ▶️'}</span>
              </button>

              <button
                onClick={() => setView('print-guide', kit.id)}
                className="flex items-center gap-2 bg-stone-200/80 dark:bg-white/[0.04] hover:bg-stone-300/80 dark:hover:bg-white/[0.08] border border-stone-300 dark:border-white/[0.12] text-stone-800 dark:text-slate-200 hover:text-black dark:hover:text-white font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl transition-all cursor-pointer font-mono min-h-[48px]"
              >
                <Printer className="w-4 h-4 text-cyan-600 dark:text-[#38bdf8]" />
                <span>Print A4 Paper Sheet 🖨️</span>
              </button>
            </div>
          </div>

          {/* Right Cultural Stamp / Medallion Box */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-stone-100 dark:bg-black/50 border border-stone-200 dark:border-white/[0.1] text-center relative shadow-inner transition-colors duration-200">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#d4af37]/30 to-amber-500/10 p-[1.5px] mb-3 flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-[#070912] flex items-center justify-center overflow-hidden p-2">
                <OrigamiFigure kit={kit} size={74} variant="sculpture" animated={true} />
              </div>
            </div>

            <div className="font-mono text-xs font-extrabold text-amber-800 dark:text-[#d4af37] uppercase tracking-widest mb-1">
              {kit.collectionTitle || kit.collection}
            </div>

            <div className="font-mono text-xs text-stone-600 dark:text-slate-400 font-semibold">
              KIT {String(kit.kitNumber || '01').padStart(2, '0')} • {kit.difficulty}
            </div>

            <div className="text-[11px] text-stone-600 dark:text-slate-400 font-mono mt-3 bg-white dark:bg-white/[0.04] border border-stone-200 dark:border-white/[0.06] px-3 py-1.5 rounded-lg shadow-sm">
              ⏱️ {kit.time} • 📄 {kit.paper && kit.paper[0] ? kit.paper[0].size : '6" × 6"'}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DailySpotlight;
