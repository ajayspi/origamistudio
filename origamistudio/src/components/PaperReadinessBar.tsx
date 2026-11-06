import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, AlertCircle } from 'lucide-react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';

export const PaperReadinessBar: React.FC = () => {
  const ageTrack = useOrigamiStore((state) => state.ageTrack);
  const { playStepClick, playChime } = useOrigamiAudio();

  const [paperReady, setPaperReady] = useState(true);
  const [flatTableReady, setFlatTableReady] = useState(true);
  const [cleanHandsReady, setCleanHandsReady] = useState(true);

  const toggleChip = (
    current: boolean,
    setter: (val: boolean) => void,
    other1: boolean,
    other2: boolean
  ) => {
    const next = !current;
    setter(next);
    playStepClick();
    if (next && other1 && other2) {
      playChime();
    }
  };

  const guidance = {
    junior: {
      title: '🎒 Quick Desk Check (No Scissors Needed!)',
      chips: [
        {
          label: '📄 Square Paper',
          ready: paperReady,
          toggle: () => toggleChip(paperReady, setPaperReady, flatTableReady, cleanHandsReady),
        },
        {
          label: '🪑 Flat Desk',
          ready: flatTableReady,
          toggle: () => toggleChip(flatTableReady, setFlatTableReady, paperReady, cleanHandsReady),
        },
        {
          label: '🖐️ Clean Hands',
          ready: cleanHandsReady,
          toggle: () => toggleChip(cleanHandsReady, setCleanHandsReady, paperReady, flatTableReady),
        },
      ],
      tip: 'Press every fold firmly with your fingernail! ✨',
    },
    explorer: {
      title: '🎯 Desk Setup • Zero-Cut Heritage',
      chips: [
        {
          label: '15cm Kami Square',
          ready: paperReady,
          toggle: () => toggleChip(paperReady, setPaperReady, flatTableReady, cleanHandsReady),
        },
        {
          label: 'Flat Surface',
          ready: flatTableReady,
          toggle: () => toggleChip(flatTableReady, setFlatTableReady, paperReady, cleanHandsReady),
        },
        {
          label: 'Dual-Color (White Up)',
          ready: cleanHandsReady,
          toggle: () => toggleChip(cleanHandsReady, setCleanHandsReady, paperReady, flatTableReady),
        },
      ],
      tip: 'Precision at Step 1 makes Step 6 easy.',
    },
    stem: {
      title: '📐 Axiomatic Setup: Unit Square Euclidean Plane',
      chips: [
        {
          label: 'Domain [-1, 1]²',
          ready: paperReady,
          toggle: () => toggleChip(paperReady, setPaperReady, flatTableReady, cleanHandsReady),
        },
        {
          label: 'Flat Foldability Rules',
          ready: flatTableReady,
          toggle: () => toggleChip(flatTableReady, setFlatTableReady, paperReady, cleanHandsReady),
        },
        {
          label: 'Zero-Cut Invariant',
          ready: cleanHandsReady,
          toggle: () => toggleChip(cleanHandsReady, setCleanHandsReady, paperReady, flatTableReady),
        },
      ],
      tip: 'Huzita-Hatori Axioms 1–7 governing flat-foldability & graph theory.',
    },
  }[ageTrack] || {
    title: 'Paper Readiness Check',
    chips: [
      {
        label: 'Square Paper',
        ready: paperReady,
        toggle: () => toggleChip(paperReady, setPaperReady, flatTableReady, cleanHandsReady),
      },
      {
        label: 'Flat Surface',
        ready: flatTableReady,
        toggle: () => toggleChip(flatTableReady, setFlatTableReady, paperReady, cleanHandsReady),
      },
      {
        label: 'Hands Ready',
        ready: cleanHandsReady,
        toggle: () => toggleChip(cleanHandsReady, setCleanHandsReady, paperReady, flatTableReady),
      },
    ],
    tip: 'Zero cuts • Pure paper folding',
  };

  const allReady = paperReady && flatTableReady && cleanHandsReady;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="p-3 sm:p-3.5 rounded-xl bg-white/85 dark:bg-black/55 border border-stone-200/90 dark:border-white/10 backdrop-blur-md shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {allReady ? (
            <motion.span
              key="ready-badge"
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-sm"
            >
              ✓
            </motion.span>
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 tracking-wide">
            {guidance.title}
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
          {guidance.tip}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {guidance.chips.map((chip, idx) => (
          <motion.button
            key={idx}
            type="button"
            onClick={chip.toggle}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer min-h-[40px] select-none ${
              chip.ready
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/35 shadow-xs'
                : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-white/10 opacity-75'
            }`}
          >
            <motion.span
              animate={chip.ready ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                chip.ready
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white dark:bg-black/40 border-stone-400'
              }`}
            >
              {chip.ready && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </motion.span>
            <span>{chip.label}</span>
          </motion.button>
        ))}

        {allReady && (
          <motion.span
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Ready to Fold!
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default PaperReadinessBar;
