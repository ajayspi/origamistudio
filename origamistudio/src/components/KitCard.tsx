import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { OrigamiKit } from '../types/origami';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { OrigamiFigure } from './OrigamiFigure';
import { LivingStickman } from './LivingStickman';
import { getKitLevel } from './KitGrid';
import { Clock, Layers, FileText, Play, Printer, CheckCircle2, Eye, Sparkles } from 'lucide-react';

export const KitCard: React.FC<{ kit: OrigamiKit }> = ({ kit }) => {
  const { setView, completedKitIds, launchKit } = useOrigamiStore();
  const isCompleted = completedKitIds.includes(kit.id);
  const [viewMode, setViewMode] = useState<'sculpture' | 'crease'>('sculpture');
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const springX = useSpring(mouseX, { damping: 20, stiffness: 180 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 180 });

  const rotateX = useTransform(springY, [-120, 120], [8, -8]);
  const rotateY = useTransform(springX, [-120, 120], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const level = getKitLevel(kit);

  const getLevelBadge = () => {
    if (level === 'A') {
      return {
        label: '🐣 Kit A • Starter Magic',
        badgeClass: 'text-amber-800 dark:text-amber-300 bg-amber-500/15 border-amber-500/30'
      };
    }
    if (level === 'B') {
      return {
        label: '🐸 Kit B • Make it Move',
        badgeClass: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
      };
    }
    return {
      label: '🐉 Kit C • Master Builder',
      badgeClass: 'text-purple-800 dark:text-purple-300 bg-purple-500/15 border-purple-500/30'
    };
  };

  const badge = getLevelBadge();
  const paperDesc = kit.paper && kit.paper[0] ? kit.paper[0].size : '15 × 15 cm';
  const stepsCount = kit.steps ? kit.steps.length : 6;
  const accentColor = kit.accent || '#f59e0b';

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 35px -10px ${accentColor}33`,
      }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-3xl p-5 flex flex-col justify-between transition-colors duration-300 bg-white/80 dark:bg-[#111422]/90 backdrop-blur-md border border-stone-200/90 dark:border-white/10 shadow-sm"
      data-cursor-text={`Fold ${kit.title}`}
    >
      {/* Top Colorful Accent Strip & Washi Tape Detail */}
      <div
        className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl opacity-85 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />
      <div className="absolute -top-2.5 left-7 w-12 h-3.5 bg-amber-400/40 dark:bg-amber-500/30 backdrop-blur-xs -rotate-2 rounded-xs border-y border-amber-500/30 z-20 pointer-events-none shadow-xs" />

      {/* Hover Sparkle Particles Trigger */}
      {isHovered && (
        <div className="absolute top-3 right-3 pointer-events-none z-20 flex items-center gap-1 text-amber-500 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div>
        {/* Top Header: Level Badge with Stickman Helper & Completed Status */}
        <div className="flex items-center justify-between text-xs font-mono mb-3.5 pt-1">
          <div className="flex items-center gap-1.5">
            <LivingStickman
              mode={level === 'A' ? 'percher' : level === 'B' ? 'pusher' : 'peeker'}
              size={26}
            />
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-fredoka font-bold border ${badge.badgeClass}`}>
              {badge.label}
            </span>
          </div>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              FOLDED
            </span>
          )}
        </div>

        {/* Heroic Origami Stage Showcase: 1:1 Square Ratio Box (Click to Launch 3D Studio Flight) */}
        <div
          onClick={() => launchKit(kit.id)}
          className="relative w-full aspect-square rounded-2xl flex items-center justify-center p-1.5 sm:p-2 mb-3 cursor-pointer group/stage overflow-hidden transition-all duration-300 bg-stone-100/75 dark:bg-black/40 border border-stone-200/80 dark:border-white/10 shadow-inner hover:border-amber-500/50"
          title={`Click to launch 3D Studio for ${kit.title}`}
        >
          {/* Tactile Dual-Sided Kami Paper Dog-Ear Fold */}
          <div className="absolute bottom-0 right-0 w-5 h-5 overflow-hidden pointer-events-none z-10">
            <div className="w-8 h-8 bg-stone-300/80 dark:bg-stone-600 rotate-45 translate-x-3.5 translate-y-3.5 shadow-xs border-t border-l border-white/70 dark:border-white/20" />
          </div>
          {/* Dual-View Switcher: [ ❖ 3D Fold ] [ ⬡ Crease ] */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 z-10 flex items-center bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-0.5 rounded-lg border border-stone-300/80 dark:border-white/10 text-[10px] font-mono shadow-xs"
          >
            <button
              type="button"
              onClick={() => setViewMode('sculpture')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'sculpture'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="View 3D Folded Model"
            >
              ❖ 3D
            </button>
            <button
              type="button"
              onClick={() => setViewMode('crease')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'crease'
                  ? 'bg-cyan-500 text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="View Crease Pattern Blueprint"
            >
              ⬡ Crease
            </button>
          </div>

          {/* Large Scaled 3D Origami Figure Filling the Stage Box */}
          <div className="w-full h-full flex items-center justify-center group-hover/stage:scale-105 transition-transform duration-300 drop-shadow-lg p-0.5">
            <OrigamiFigure
              kit={kit}
              size={230}
              variant={viewMode}
              animated={true}
              className="w-full h-full"
            />
          </div>

          {/* Hover Overlay Hint */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/stage:opacity-100 transition-opacity bg-stone-900/90 dark:bg-amber-400 text-white dark:text-stone-950 text-[10px] font-fredoka font-bold px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none whitespace-nowrap z-10">
            <Eye className="w-3.5 h-3.5" />
            <span>Launch into 3D Studio ▶</span>
          </div>

          {/* Animated Crease Shimmer Line for the Box */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent overflow-hidden pointer-events-none">
            <div className="w-1/2 h-full bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 blur-[0.5px] animate-[slide_3s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Title & Short Kid-Friendly Description */}
        <div className="mb-2">
          <h3
            onClick={() => launchKit(kit.id)}
            className="font-fredoka text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-1 cursor-pointer"
          >
            {kit.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5 line-clamp-1">
            {kit.subtitle || kit.goal || 'Folds from one square sheet of paper'}
          </p>
        </div>

        <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 font-quicksand font-medium">
          {kit.description || kit.goal || 'A wonderful kinetic origami toy you can fold step-by-step with 3D guidance.'}
        </p>
      </div>

      <div>
        {/* Simple Kid-Friendly Specs Strip */}
        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 mb-3.5 rounded-xl bg-stone-100/90 dark:bg-white/[0.04] text-[11px] font-mono text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-white/5">
          <div className="flex items-center justify-center gap-1 truncate" title="Estimated folding time">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{kit.time}</span>
          </div>
          <div className="flex items-center justify-center gap-1 truncate" title="Paper size">
            <FileText className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>{paperDesc}</span>
          </div>
          <div className="flex items-center justify-center gap-1 truncate" title="Total steps">
            <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{stepsCount} steps</span>
          </div>
        </div>

        {/* Clean Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => launchKit(kit.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-stone-950 font-fredoka text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 cursor-pointer transition-all"
            data-cursor-text="Start!"
          >
            <Play className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
            <span>Start Folding</span>
          </button>

          <button
            type="button"
            onClick={() => setView('print-guide', kit.id)}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex items-center justify-center min-w-[42px] border border-stone-200/80 dark:border-white/10"
            title="Print A4 Paper Folding Guide"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
