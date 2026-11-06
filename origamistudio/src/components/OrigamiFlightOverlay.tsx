import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import { OrigamiFigure } from './OrigamiFigure';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import { Sparkles } from 'lucide-react';

export const OrigamiFlightOverlay: React.FC = () => {
  const { isLaunching, launchingKitId, finishLaunch } = useOrigamiStore();
  const { playCrease, playChime } = useOrigamiAudio();
  const [tick, setTick] = useState(0);

  const kit = launchingKitId ? getKitById(launchingKitId) || getKitById('japanese-01')! : null;

  // Cape flapping animation loop
  useEffect(() => {
    if (!isLaunching) return;
    let animId: number;
    const start = performance.now();
    const loop = (now: number) => {
      setTick((now - start) / 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isLaunching]);

  // Audio cues and studio entry timer
  useEffect(() => {
    if (!isLaunching) return;

    playCrease();

    const timer = setTimeout(() => {
      playChime();
      finishLaunch();
    }, 2600);

    return () => clearTimeout(timer);
  }, [isLaunching, finishLaunch, playCrease, playChime]);

  if (!isLaunching || !kit) return null;

  const flutter = Math.sin(tick * 16) * 6;
  const accentColor = kit.accent || '#f59e0b';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={finishLaunch}
        className="fixed inset-0 z-50 pointer-events-auto cursor-pointer select-none overflow-hidden"
      >
        {/* Atmospheric Starry Space Backdrop */}
        <div className="absolute inset-0 bg-[#070913]/75 backdrop-blur-xs transition-colors duration-500" />

        {/* Hand-Drawn Constellations & Notebook Grid */}
        <svg className="absolute inset-0 w-full h-full text-white/40" xmlns="http://www.w3.org/2000/svg">
          {/* Animated Crease Flight Trajectory Arc */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            d="M -100 800 Q 300 650 600 400 T 1400 150 Q 1800 -50 2200 -200"
            fill="none"
            stroke={accentColor}
            strokeWidth="3.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Doodled Origami Constellations */}
          {[
            { x: '12%', y: '18%', s: 18 },
            { x: '32%', y: '12%', s: 24 },
            { x: '58%', y: '22%', s: 16 },
            { x: '78%', y: '15%', s: 22 },
            { x: '88%', y: '42%', s: 26 },
            { x: '22%', y: '68%', s: 20 },
            { x: '50%', y: '78%', s: 24 },
            { x: '72%', y: '82%', s: 18 },
          ].map((star, i) => (
            <g key={i} transform={`translate(${star.x} ${star.y}) scale(${star.s / 20})`}>
              <path
                d="M0 -15 L3 -4 L14 -3 L5 4 L8 15 L0 8 L-8 15 L-5 4 L-14 -3 L-3 -4 Z"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
                style={{ transformOrigin: '0 0', animationDuration: `${6 + i * 2}s` }}
              />
            </g>
          ))}
        </svg>

        {/* The Flying Origami Model with Stickman Pilot Sitting On It */}
        <motion.div
          initial={{ x: '-15vw', y: '80vh', scale: 0.8, rotate: -32 }}
          animate={{
            x: ['-15vw', '25vw', '55vw', '115vw'],
            y: ['80vh', '48vh', '24vh', '-20vh'],
            scale: [0.8, 1.25, 1.15, 0.85],
            rotate: [-32, -22, -12, -40],
          }}
          transition={{
            duration: 2.6,
            times: [0, 0.35, 0.7, 1],
            ease: 'easeInOut',
          }}
          className="absolute left-0 top-0 w-64 h-64 pointer-events-none drop-shadow-2xl z-20"
        >
          {/* 1. Stickman Rider sitting on top of the origami sculpture */}
          <div className="absolute top-1 left-16 z-20 pointer-events-none">
            <svg width="68" height="74" viewBox="0 0 68 74" fill="none" className="overflow-visible">
              {/* Flapping Red Cape */}
              <path
                d={`M 30 28 Q ${12 + flutter} ${36 + flutter * 0.5} ${2 - flutter} ${56 + flutter} L ${18 - flutter * 0.5} 44 Z`}
                fill="#ff565d"
                stroke="#c92a2a"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Little Stickman Body */}
              <line x1="33" y1="24" x2="33" y2="48" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

              {/* Head with Goggles */}
              <circle cx="33" cy="14" r="10" fill="#fdfbf7" stroke="#1c1917" strokeWidth="2.5" />
              {/* Flight Goggles */}
              <rect x="25" y="10" width="16" height="6" rx="3" fill="#38bdf8" stroke="#1c1917" strokeWidth="1.5" />
              <line x1="33" y1="10" x2="33" y2="16" stroke="#1c1917" strokeWidth="1.5" />
              {/* Joyful Grin */}
              <path d="M 29 18 Q 33 22 37 18" stroke="#1c1917" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Hands Holding the Paper Fold Hinge */}
              <path d="M 33 30 L 46 36 L 52 44" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 33 30 L 22 36 L 16 44" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Legs Sitting astride the origami spine */}
              <path d="M 33 48 L 44 56 L 48 64" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 33 48 L 22 56 L 18 64" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 2. The Selected Origami Model Figure */}
          <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
            <OrigamiFigure kit={kit} size={190} animated={true} />
          </div>

          {/* 3. Sparkling Origami Stardust Trail */}
          <div className="absolute -bottom-4 -left-6 flex items-center gap-2">
            <span className="text-xl animate-ping text-amber-400">✨</span>
            <span className="text-sm animate-pulse text-cyan-300">📄</span>
            <span className="text-lg animate-bounce text-rose-400">★</span>
            <span className="text-xs animate-pulse text-emerald-400">🌸</span>
          </div>
        </motion.div>

        {/* Sleek Bottom Loading Status Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-30 pointer-events-none">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-amber-500/30 shadow-xl text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Flying into 3D Studio: {kit.title}...</span>
          </div>

          {/* Animated Loading Bar */}
          <div className="w-56 h-1.5 rounded-full bg-stone-300/60 dark:bg-stone-800 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.9, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
