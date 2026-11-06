import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stickmanTokens } from '../tokens';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import { Sparkles, Play, RotateCcw } from 'lucide-react';

interface NotebookPaperRocketProps {
  onLaunchStudio?: () => void;
  className?: string;
}

export const NotebookPaperRocket: React.FC<NotebookPaperRocketProps> = ({
  onLaunchStudio,
  className = '',
}) => {
  const { playCrease, playChime } = useOrigamiAudio();
  const [isFlying, setIsFlying] = useState(false);
  const [hasFlownOnce, setHasFlownOnce] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tick, setTick] = useState(0);

  // Cape flapping animation tick
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const loop = (now: number) => {
      setTick((now - start) / 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const flutter = Math.sin(tick * 14) * 5;
  const capeColor = stickmanTokens.colors.cape; // #ff565d

  const handleLaunch = () => {
    if (isFlying) return;
    setIsFlying(true);
    playCrease();

    // Flight takes 2.2 seconds, then chimes and optionally opens studio or lands
    setTimeout(() => {
      playChime();
      setHasFlownOnce(true);
      setIsFlying(false);
      if (onLaunchStudio) {
        onLaunchStudio();
      }
    }, 2200);
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* 1. Fullscreen Flight Stage during Blast-Off */}
      <AnimatePresence>
        {isFlying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          >
            {/* Darkened Notebook Space Backdrop */}
            <div className="absolute inset-0 bg-[#070913]/70 backdrop-blur-xs" />

            {/* Notebook Space Doodled Stars & Orbiting Planets */}
            <svg className="absolute inset-0 w-full h-full text-white/40" xmlns="http://www.w3.org/2000/svg">
              {/* Hand-drawn stars */}
              {[
                { x: '15%', y: '20%', s: 16 },
                { x: '35%', y: '12%', s: 22 },
                { x: '75%', y: '18%', s: 18 },
                { x: '85%', y: '45%', s: 24 },
                { x: '20%', y: '65%', s: 20 },
                { x: '60%', y: '75%', s: 26 },
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

              {/* Doodled Graph Paper Moon */}
              <g transform="translate(180 120)">
                <circle cx="0" cy="0" r="45" fill="#fdfbf7" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M-40 -15h80 M-43 0h86 M-40 15h80 M-20 -40v80 M0 -45v90 M20 -40v80" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                <circle cx="-12" cy="-14" r="7" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="15" cy="10" r="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              </g>

              {/* Kinetic Origami Valley Crease Flight Trajectory */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                d="M -100 800 Q 300 650 600 400 T 1400 150 Q 1800 -50 2200 -200"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
            </svg>

            {/* Flying Rocket Actor with Animated Swoop Trajectory */}
            <motion.div
              initial={{ x: '-10vw', y: '85vh', scale: 0.85, rotate: -35 }}
              animate={{
                x: ['-10vw', '35vw', '70vw', '115vw'],
                y: ['85vh', '45vh', '25vh', '-20vh'],
                scale: [0.85, 1.25, 1.1, 0.9],
                rotate: [-42, -30, -18, -48],
              }}
              transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 top-0 w-44 h-56"
            >
              {/* Paper Rocket Body with School Notebook Texture */}
              <NotebookRocketSvg flutter={flutter} capeColor={capeColor} isFullFlight={true} />

              {/* Sparkling Origami Dust Trail */}
              <div className="absolute -bottom-6 -left-6 flex items-center gap-2">
                <span className="text-xl animate-ping text-amber-400">✨</span>
                <span className="text-sm animate-pulse text-cyan-400">📄</span>
                <span className="text-lg animate-bounce text-rose-400">★</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Standing / Floating Paper Rocket on the Landing Page */}
      <div className="relative group">
        {/* Washi Paper Tape Accents (Top corners of rocket card) */}
        <div className="absolute -top-3 left-6 w-16 h-5 bg-amber-400/40 dark:bg-amber-500/30 backdrop-blur-xs -rotate-3 rounded-xs border-y border-amber-500/30 z-30 pointer-events-none shadow-xs" />
        <div className="absolute -top-2 right-8 w-14 h-5 bg-rose-400/35 dark:bg-rose-500/30 backdrop-blur-xs rotate-6 rounded-xs border-y border-rose-500/30 z-30 pointer-events-none shadow-xs" />

        {/* Notebook Card Plinth */}
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="relative rounded-3xl bg-[#faf9f5] dark:bg-[#0f1322] border-2 border-stone-300/80 dark:border-white/15 p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.45)] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Red Notebook Margin Line */}
          <div className="absolute top-0 bottom-0 left-9 w-0.5 bg-rose-400/60 dark:bg-rose-500/40 pointer-events-none" />

          {/* Teacher Stamp of Authenticity */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-rose-500/60 dark:border-rose-400/50 flex flex-col items-center justify-center -rotate-12 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-mono">
              <span className="text-[8px] font-black tracking-widest uppercase">KINETIC</span>
              <span className="text-[11px] font-extrabold leading-none">A4 KAMI</span>
              <span className="text-[7px] font-bold">100% PAPER</span>
            </div>
          </div>

          {/* Interactive Rocket Illustration */}
          <div className="flex flex-col items-center justify-center pt-2 pb-4">
            <motion.div
              animate={{
                y: hovered ? [-4, 4, -4] : [-2, 2, -2],
                rotate: hovered ? [-1, 2, -1] : [-0.5, 0.5, -0.5],
              }}
              transition={{ repeat: Infinity, duration: hovered ? 2.5 : 4.5, ease: 'easeInOut' }}
              className="relative w-48 h-56 cursor-pointer drop-shadow-xl"
              onClick={handleLaunch}
              title="Click to launch the origami paper rocket into space!"
            >
              <NotebookRocketSvg flutter={flutter} capeColor={capeColor} isFullFlight={false} />
            </motion.div>

            {/* Rocket Title & Mission Tag */}
            <div className="text-center mt-2 z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-bold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>MISSION: FOLDING PLAYGROUND</span>
              </div>
              <h3 className="font-fredoka text-xl font-bold text-stone-900 dark:text-white mt-1">
                The School Notebook Rocket
              </h3>
              <p className="text-xs font-quicksand font-medium text-stone-600 dark:text-stone-300 max-w-xs mt-0.5">
                Folded from standard ruled classroom paper with our cape-wearing stickman pilot!
              </p>
            </div>

            {/* Launch Call-To-Action Button */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleLaunch}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-fredoka font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-transform active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                <span>Blast Off Rocket! 🚀</span>
              </button>

              {hasFlownOnce && (
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-mono font-semibold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer min-h-[44px]"
                  title="Replay launch animation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Internal SVG Component: Precision Japanese Folded School Notebook Paper Rocket
interface NotebookRocketSvgProps {
  flutter: number;
  capeColor: string;
  isFullFlight: boolean;
}

const NotebookRocketSvg: React.FC<NotebookRocketSvgProps> = ({ flutter, capeColor, isFullFlight }) => {
  return (
    <svg
      viewBox="-110 -150 220 280"
      className="w-full h-full overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Authentic School Ruled Paper Pattern */}
        <pattern id="notebook-ruled-lines" width="40" height="16" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="40" y2="0" stroke="#93c5fd" strokeWidth="0.8" opacity="0.65" />
        </pattern>

        {/* Paper Shading Gradients for 3D Fold Depth */}
        <linearGradient id="paper-left-facet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ebe8df" />
        </linearGradient>

        <linearGradient id="paper-right-facet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f5ed" />
          <stop offset="100%" stopColor="#dad6c8" />
        </linearGradient>

        <linearGradient id="paper-wing-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dedbd0" />
        </linearGradient>

        <linearGradient id="paper-wing-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9e5d9" />
          <stop offset="100%" stopColor="#c5c0b0" />
        </linearGradient>
      </defs>

      {/* ROCKET THRUST EXHAUST CONE (Origami Paper Flaps) */}
      <g opacity={isFullFlight ? 1 : 0.85}>
        <polygon points="-16,75 16,75 0,115" fill="#f59e0b" opacity="0.4" />
        <polygon points="-10,75 10,75 0,105" fill="#ef4444" opacity="0.6" />
        <polygon points="-5,75 5,75 0,95" fill="#ffffff" />
      </g>

      {/* LEFT DELTA WING (Folded Notebook Paper) */}
      <polygon
        points="0,-120 -85,75 0,55"
        fill="url(#paper-wing-left)"
        stroke="#78716c"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Notebook Ruled Lines Overlay on Left Wing */}
      <polygon
        points="0,-120 -85,75 0,55"
        fill="url(#notebook-ruled-lines)"
        opacity="0.7"
      />

      {/* RIGHT DELTA WING (Shaded Underside Fold) */}
      <polygon
        points="0,-120 85,75 0,55"
        fill="url(#paper-wing-right)"
        stroke="#57534e"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Notebook Ruled Lines Overlay on Right Wing */}
      <polygon
        points="0,-120 85,75 0,55"
        fill="url(#notebook-ruled-lines)"
        opacity="0.7"
      />

      {/* LEFT CENTER FUSELAGE FACET */}
      <polygon
        points="0,-125 -32,55 0,75"
        fill="url(#paper-left-facet)"
        stroke="#57534e"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* RIGHT CENTER FUSELAGE FACET (Darker Fold Plinth) */}
      <polygon
        points="0,-125 32,55 0,75"
        fill="url(#paper-right-facet)"
        stroke="#44403c"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* CENTER CREASE (Mountain Fold: Red Dash 8,4,2,4) */}
      <line
        x1="0"
        y1="-125"
        x2="0"
        y2="75"
        stroke="#e11d48"
        strokeWidth="1.6"
        strokeDasharray="6 3 2 3"
        strokeLinecap="round"
      />

      {/* WING CREASES (Valley Fold: Cyan Dash 6,4) */}
      <line
        x1="-32"
        y1="55"
        x2="-85"
        y2="75"
        stroke="#0284c7"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <line
        x1="32"
        y1="55"
        x2="85"
        y2="75"
        stroke="#0284c7"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />

      {/* RED NOTEBOOK MARGIN LINE SLANTED ACROSS FOLD */}
      <line
        x1="-18"
        y1="-60"
        x2="-48"
        y2="60"
        stroke="#f87171"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* STICKMAN CO-PILOT HOLDING THE FUSELAGE */}
      <g transform="translate(-18 -5) scale(0.68)">
        {/* Flapping Origami Washi Cape */}
        <path
          d={`M0 -30 C-14 -26 -26 -24 ${-36 + flutter} -12 L${-26 + flutter} -8 Q${-24 + flutter} 0 -20 -2 Q-8 -8 0 -30 Z`}
          fill={capeColor}
        />

        {/* Stickman Spine & Limbs */}
        <g stroke="#18181c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Spine */}
          <line x1="0" y1="-32" x2="2" y2="4" />
          {/* Left Arm clinging to cockpit */}
          <path d="M0 -22 L14 -16 L22 -10" />
          {/* Right Arm waving at the user */}
          <path d="M0 -22 L-14 -32 L-18 -48" />
          {/* Legs standing on rocket fin */}
          <path d="M2 4 L-6 22 L-10 38" />
          <path d="M2 4 L10 20 L16 38" />
        </g>

        {/* Waving Hand */}
        <g transform="translate(-18 -48) scale(0.65)" fill="#18181c">
          <circle cx="0" cy="0" r="3" />
        </g>

        {/* Clinging Hand */}
        <circle cx="22" cy="-10" r="2.2" fill="#18181c" />

        {/* Stickman Head & Smiling Face */}
        <g transform="translate(0 -32)">
          <ellipse cy="-12" rx="10" ry="9.5" fill="#18181c" />
          {/* Smile */}
          <path d="M-4 -9 Q0 -5 4 -9" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="-3" cy="-13" r="1" fill="#ffffff" />
          <circle cx="3" cy="-13" r="1" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
};
