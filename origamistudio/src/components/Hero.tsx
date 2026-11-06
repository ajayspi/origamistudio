import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import { getKitById } from '../data/kits';
import { OrigamiFigure } from './OrigamiFigure';
import { LivingStickman } from './LivingStickman';
import {
  Sparkles, ArrowRight, Play,
  Compass, CheckCircle2, Wand2
} from 'lucide-react';

interface HeroFloatingModel {
  id: string;
  name: string;
  tag: string;
  levelBadge: string;
  levelTier: 'Kit A' | 'Kit B' | 'Kit C';
  color: string;
  glowColor: string;
  defaultX: number;
  defaultY: number;
  floatDelay: number;
}

const HERO_MODELS: HeroFloatingModel[] = [
  {
    id: 'japanese-01',
    name: 'Peace Crane',
    tag: 'Kit A • Starter Magic',
    levelBadge: 'Easy / Starter',
    levelTier: 'Kit A',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    defaultX: -140,
    defaultY: -110,
    floatDelay: 0,
  },
  {
    id: 'american-03',
    name: 'Jumping Frog',
    tag: 'Kit B • Action Toy',
    levelBadge: 'Intermediate / Kinetic',
    levelTier: 'Kit B',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    defaultX: 130,
    defaultY: -80,
    floatDelay: 1.5,
  },
  {
    id: 'japanese-06',
    name: 'Imperial Dragon',
    tag: 'Kit C • Master Builder',
    levelBadge: 'Master / 3D Beast',
    levelTier: 'Kit C',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    defaultX: -110,
    defaultY: 100,
    floatDelay: 2.5,
  },
  {
    id: 'japanese-03',
    name: 'Sakura Blossom',
    tag: 'Kit A • Petal Wonder',
    levelBadge: 'Easy / Beginner',
    levelTier: 'Kit A',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    defaultX: 140,
    defaultY: 90,
    floatDelay: 0.8,
  },
];

export const Hero: React.FC = () => {
  const { launchKit } = useOrigamiStore();
  const { playCrease } = useOrigamiAudio();

  // Hero container ref for smooth mouse-move parallax physics
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Damped spring physics for realistic spatial tracking
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax rotation transforms for 3D stage
  const rotateX = useTransform(smoothMouseY, [-200, 200], [12, -12]);
  const rotateY = useTransform(smoothMouseX, [-200, 200], [-12, 12]);
  const floatSubtleX = useTransform(smoothMouseX, [-200, 200], [-15, 15]);
  const floatSubtleY = useTransform(smoothMouseY, [-200, 200], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLaunchKit = (kitId: string) => {
    playCrease();
    launchKit(kitId);
  };

  const handleScrollToJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('journey-track');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#faf8f5] dark:bg-[#07090e] transition-colors duration-300">
      {/* 1. Slow-moving Soft Chromatic Mesh Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft pastel light mesh / dark nebula */}
        <div className="absolute -top-[25%] -left-[15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-amber-300/35 via-rose-300/25 to-transparent dark:from-purple-900/30 dark:via-indigo-900/20 dark:to-transparent blur-3xl animate-mesh-slow" />
        <div
          className="absolute -bottom-[25%] -right-[15%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-bl from-sky-300/35 via-teal-200/20 to-transparent dark:from-blue-900/30 dark:via-cyan-950/20 dark:to-transparent blur-3xl animate-mesh-slow"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute top-[30%] left-[35%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-pink-200/20 via-amber-100/30 to-transparent dark:from-violet-950/25 dark:via-fuchsia-950/15 blur-2xl animate-mesh-slow"
          style={{ animationDelay: '-12s' }}
        />

        {/* Tactile Japanese Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 70%), radial-gradient(#d97706 1.2px, transparent 1.2px)`,
            backgroundSize: '100% 100%, 36px 36px',
          }}
        />
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Bold Friendly Macro-Typography & Kid Kickoff */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Playful Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-amber-500/30 shadow-sm text-xs font-mono font-bold text-amber-800 dark:text-amber-300"
            >
              <Wand2 className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="tracking-wider uppercase text-[11px]">
                MAGICAL 3D PAPER PLAYGROUND FOR KIDS
              </span>
            </motion.div>

            {/* Macro-Typography Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-fredoka text-4xl sm:text-6xl lg:text-[68px] font-bold text-stone-900 dark:text-white leading-[1.08] tracking-tight"
            >
              Fold Real Paper.{' '}
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 bg-clip-text text-transparent block sm:inline">
                Bring It to Life in 3D!
              </span>
            </motion.h1>

            {/* Friendly Plain-Language Subtitle for 10-year-olds */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-600 dark:text-stone-300 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-xl font-quicksand"
            >
              Grab a sheet of paper from your desk. Follow playful 3D animations that rotate in real-time, speak instructions out loud, and help you fold jumping frogs, peace cranes, and legendary dragons!
            </motion.p>

            {/* Glowing Primary CTA & Journey Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={() => handleLaunchKit('japanese-01')}
                className="group relative flex items-center gap-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-stone-950 font-fredoka font-bold text-sm sm:text-base px-7 py-4 rounded-2xl shadow-xl shadow-amber-500/30 transition-all cursor-pointer overflow-hidden min-h-[52px]"
                data-cursor-text="Fold Crane!"
              >
                {/* Glowing light sweep shimmer */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                <Play className="w-5 h-5 fill-stone-950 text-stone-950" />
                <span>Start Folding Now (Free)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="#journey-track"
                onClick={handleScrollToJourney}
                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-300/80 dark:border-white/15 text-stone-800 dark:text-stone-100 font-fredoka font-semibold text-sm hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer shadow-sm hover:shadow-md min-h-[52px]"
                data-cursor-text="3-Part Track"
              >
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Explore 3-Part Journey ↓</span>
              </a>
            </motion.div>

            {/* School-Friendly Proof Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 pt-3 text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Free • No Sign-In</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Works with Any Scrap Paper</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Speaks Out Loud 🔊</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Hero Stage (Permanent 3D Floating Origami Models) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[500px] h-[440px] sm:h-[480px] rounded-3xl bg-white/40 dark:bg-stone-900/30 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-2xl p-6 flex items-center justify-center overflow-visible"
              style={{ perspective: 1200 }}
            >
              {/* Living Percher Stickman on Stage Rim */}
              <div className="absolute -top-7 right-6 z-30 pointer-events-auto">
                <LivingStickman mode="percher" size={44} caption="Hover to look!" />
              </div>

              {/* Playful Floating Instruction Beacon */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-stone-900/90 dark:bg-amber-400 text-white dark:text-stone-950 text-xs font-fredoka font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950 animate-bounce" />
                <span>Click any floating toy to inspect & fold!</span>
              </div>

              {/* Central Kinetic Paper Pedestal */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  x: floatSubtleX,
                  y: floatSubtleY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
              >
                {/* Concentric Ambient Light Rings */}
                <div className="absolute w-72 h-72 rounded-full border border-amber-500/20 dark:border-amber-400/15 animate-ping" style={{ animationDuration: '6s' }} />
                <div className="absolute w-52 h-52 rounded-full border border-rose-500/20 dark:border-rose-400/15" />
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent blur-xl" />

                {/* Center Mascot Watermark */}
                <div className="text-center space-y-1 select-none opacity-40 dark:opacity-30">
                  <span className="text-4xl block">✨</span>
                  <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-stone-500">
                    KINETIC FOLDING LAB
                  </span>
                </div>
              </motion.div>

              {/* Floating Origami Models (Interactive Cards) */}
              {HERO_MODELS.map((model, idx) => {
                const kit = getKitById(model.id);
                if (!kit) return null;

                return (
                  <motion.div
                    key={model.id}
                    id={`hero-floating-kit-${idx}`}
                    onClick={() => handleLaunchKit(model.id)}
                    style={{
                      x: model.defaultX,
                      y: model.defaultY,
                    }}
                    animate={{
                      y: [model.defaultY - 8, model.defaultY + 8, model.defaultY - 8],
                      rotate: [-2, 2, -2],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      delay: model.floatDelay,
                      ease: 'easeInOut',
                    }}
                    whileHover={{
                      scale: 1.14,
                      zIndex: 40,
                      rotate: 0,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute cursor-pointer pointer-events-auto group select-none"
                    data-cursor-text={`Fold ${model.name}`}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Glassy 3D Card Stage with Magnetic Glow (1:1 Ratio Box) */}
                      <div
                        className="w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-2xl bg-white/95 dark:bg-[#131726]/95 backdrop-blur-md border-2 border-stone-200 dark:border-white/15 p-2 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:border-amber-500 group-hover:shadow-2xl"
                        style={{
                          boxShadow: `0 12px 28px -6px ${model.glowColor}`,
                        }}
                      >
                        <OrigamiFigure kit={kit} size={92} variant="sculpture" animated={true} />
                      </div>

                      {/* Playful Floating Badge & Direct Start Button */}
                      <div className="mt-1.5 flex flex-col items-center gap-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-fredoka font-bold shadow-xs whitespace-nowrap bg-stone-900/90 text-white dark:bg-white dark:text-stone-900 border border-white/20 transition-transform group-hover:scale-105">
                          {model.name}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchKit(model.id);
                          }}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-fredoka font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md flex items-center gap-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          title={`Start folding ${model.name} now`}
                        >
                          <Play className="w-2.5 h-2.5 fill-stone-950 text-stone-950" />
                          <span>Start ▶</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
