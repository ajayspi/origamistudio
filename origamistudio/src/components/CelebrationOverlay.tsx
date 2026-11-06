import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OrigamiKit } from '../types/origami';
import { ALL_KITS_ARRAY } from '../data/kits';
import { OrigamiFigure } from './OrigamiFigure';
import { StickmanHelper } from './StickmanHelper';
import { useOrigamiStore } from '../store/useOrigamiStore';
import {
  Trophy, Star, Sparkles, Download, Package,
  RotateCcw, X, CheckCircle2, ArrowRight
} from 'lucide-react';

interface CelebrationOverlayProps {
  kit: OrigamiKit;
  onClose: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ kit, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setView, setActiveKitId, setCurrentStepIdx, setFoldFactor, dailyStreak, orderPhysicalKit, magicSheetsBalance } = useOrigamiStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const collectionKits = kit.collection 
    ? ALL_KITS_ARRAY.filter(k => k.collection === kit.collection) 
    : [];
  const currentIdxInCol = collectionKits.findIndex(k => k.id === kit.id);
  const nextPartKit = (currentIdxInCol >= 0 && currentIdxInCol < collectionKits.length - 1)
    ? collectionKits[currentIdxInCol + 1]
    : null;
  const isLastPartInCol = currentIdxInCol === collectionKits.length - 1;
  const isMultiPartCol = collectionKits.length > 1;

  const handleNextPart = () => {
    if (nextPartKit) {
      setActiveKitId(nextPartKit.id);
      setCurrentStepIdx(0);
      setFoldFactor(0.0);
      onClose();
    }
  };

  // Standard-Library HTML5 Canvas Confetti Burst
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6', '#fbbf24', '#ffffff'];
    const particles = Array.from({ length: 90 }, () => ({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 160,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 5,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.25,
      gravity: 0.3,
      opacity: 1
    }));

    const startTime = performance.now();

    const loop = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let anyAlive = false;
      for (const p of particles) {
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (elapsed > 2000) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          anyAlive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.35);
          ctx.restore();
        }
      }

      if (anyAlive && elapsed < 4500) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleOrderPhysicalKit = () => {
    orderPhysicalKit(kit.id, kit.title);
    const mockTracking = `SR-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTrackingId(mockTracking);
    setOrderPlaced(true);
  };

  const handleDownloadPDF = () => {
    setView('print-guide', kit.id);
  };

  return (
    <div
      id="burst-reward-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />

      {/* Juicy Glowing Card with Spring Scale-Up */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="relative z-20 w-full max-w-lg bg-[#fcfbf7] dark:bg-[#0d101a] border-2 border-amber-500/40 dark:border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.25)] text-stone-900 dark:text-stone-100 flex flex-col gap-5 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors cursor-pointer rounded-xl bg-stone-100 dark:bg-stone-800/60 min-h-[36px] min-w-[36px] flex items-center justify-center"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mastered Header */}
        <div className="text-center pt-1">
          {/* Glowing Animated Trophy Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-stone-950 shadow-xl shadow-amber-500/35 mb-3"
          >
            <Trophy className="w-10 h-10" />
          </motion.div>

          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span className="font-mono text-xs font-black tracking-widest uppercase text-amber-700 dark:text-amber-400">
              ACHIEVEMENT UNLOCKED
            </span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl font-black tracking-tight text-stone-950 dark:text-white">
            Kit Mastered!
          </h2>
          <p className="text-sm font-serif text-stone-600 dark:text-stone-300 mt-1 max-w-sm mx-auto">
            You successfully folded <span className="font-semibold text-stone-900 dark:text-white">{kit.title}</span> using kinetic paper geometry.
          </p>
        </div>

        {/* 3D Model Display with Golden Stars */}
        <div className="relative py-3 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-stone-900/40 dark:to-stone-900/10 rounded-2xl border border-amber-200/60 dark:border-stone-800">
          <div className="w-24 h-24 flex items-center justify-center drop-shadow-xl">
            <OrigamiFigure kit={kit} size={84} />
          </div>

          {/* 3 Golden Mastery Stars */}
          <div className="flex items-center gap-1.5 mt-2">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + star * 0.1, type: 'spring', stiffness: 500 }}
              >
                <Star className="w-5 h-5 fill-amber-400 text-amber-500 drop-shadow-sm" />
              </motion.div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
              +50 Magic Sheets 📄
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
              Streak: {Math.max(1, dailyStreak)} Days 🔥
            </span>
          </div>
        </div>

        {/* Physical Order Success Toast Notification (if ordered) */}
        <AnimatePresence>
          {orderPlaced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 font-mono text-xs flex items-start gap-2.5 shadow-md"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Physical Kit Order Confirmed!</div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Pre-creased Japanese Washi paper pack shipped to your doorstep.
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                  Shiprocket Tracking: <span className="underline">{trackingId}</span> • 2-3 Business Days
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCREEN 2 MANDATORY PRIMARY CTAs:
            1. [Next Part in Collection (if multi-part)]
            2. [Download Free PDF]
            3. [Order Physical Kit to Home - ₹299] */}
        <div className="space-y-2.5 pt-1">
          {/* Multi-Part Next Part Progression Handoff */}
          {nextPartKit && (
            <button
              onClick={handleNextPart}
              className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-mono text-sm font-black shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-[0.98] min-h-[48px]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">🧩</span>
                <div className="text-left truncate">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-900/80">
                    Fold Next Part ({currentIdxInCol + 2} of {collectionKits.length})
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold truncate">
                    {nextPartKit.title}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-950 shrink-0 ml-2" />
            </button>
          )}

          {isMultiPartCol && isLastPartInCol && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-2 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-center font-mono text-xs font-bold">
              🎉 Master Collection Complete! All {collectionKits.length} parts folded!
            </div>
          )}

          {/* Stickman Retrieval Crew Guidance Helper */}
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 text-xs font-mono">
            <StickmanHelper role="download" size={38} interactive onAction={handleDownloadPDF} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>Stickman Retrieval Crew</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold">READY</span>
              </div>
              <div className="text-[10px] text-stone-600 dark:text-stone-400 truncate">
                Click Stickman to reel in your printable Japanese origami template!
              </div>
            </div>
          </div>

          {/* Secondary Actions: PDF Guide & Home Kit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-950 font-mono text-xs font-bold shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
              <span>Download PDF Guide</span>
            </button>

            <button
              onClick={handleOrderPhysicalKit}
              disabled={orderPlaced}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                orderPlaced
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{orderPlaced ? 'Kit Ordered (₹299)' : 'Order Paper Kit (₹299)'}</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation Links */}
        <div className="flex items-center justify-between text-xs font-mono border-t border-stone-200 dark:border-stone-800 pt-3">
          <button
            onClick={() => setView('trophy-room')}
            className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline font-bold cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>View in Trophy Room ({magicSheetsBalance} 📄)</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Keep Folding 3D</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CelebrationOverlay;
