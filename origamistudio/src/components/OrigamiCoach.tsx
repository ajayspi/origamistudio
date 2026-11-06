import React, { useState, useEffect } from 'react';

export type CoachType = 'kenji' | 'aoi' | 'hands' | 'hidden';
export type CoachAction = 'rotate' | 'flip' | 'crease' | 'cheer' | 'idle';

export interface OrigamiCoachProps {
  coachType?: CoachType;
  action?: CoachAction;
  metaphor?: string;
  cheer?: string;
  stepNumber?: number;
  onSelectCoach?: (coach: CoachType) => void;
  className?: string;
}

export const OrigamiCoach: React.FC<OrigamiCoachProps> = ({
  coachType = 'aoi',
  action = 'idle',
  metaphor = 'Fold step by step!',
  cheer,
  stepNumber,
  onSelectCoach,
  className = '',
}) => {
  const [activeCoach, setActiveCoach] = useState<CoachType>(coachType);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setActiveCoach(coachType);
  }, [coachType]);

  const handleSwitchCoach = (type: CoachType) => {
    setActiveCoach(type);
    onSelectCoach?.(type);
  };

  const playVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = cheer ? `${metaphor} ${cheer}` : metaphor;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05;
      utterance.pitch = activeCoach === 'kenji' ? 1.2 : 1.35; // Cheerful child voice
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (activeCoach === 'hidden') {
    return (
      <button
        onClick={() => handleSwitchCoach('aoi')}
        className={`fixed bottom-28 sm:bottom-24 left-3 sm:left-4 z-40 bg-white/90 dark:bg-stone-900/90 text-xs px-2.5 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 shadow-md backdrop-blur-sm flex items-center gap-1.5 hover:scale-105 transition-all ${className}`}
        title="Show Origami Coach"
        aria-label="Show Origami Coach"
      >
        <span className="text-base">👧</span>
        <span className="font-medium text-stone-700 dark:text-stone-200">Coach</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Origami Coach"
      className={`fixed bottom-28 sm:bottom-24 left-3 sm:left-4 z-40 max-w-[280px] sm:max-w-[320px] pointer-events-auto select-none transition-all duration-200 ${className}`}
    >
      {/* Speech Bubble */}
      {!isMinimized && (
        <div className="relative mb-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border-2 border-emerald-400 dark:border-emerald-500 animate-in fade-in slide-in-from-bottom-2">
          {/* Arrow */}
          <div className="absolute -bottom-2 left-7 w-3.5 h-3.5 bg-white dark:bg-stone-900 border-r-2 border-b-2 border-emerald-400 dark:border-emerald-500 transform rotate-45" />

          {/* Coach Header & Picker */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span>{activeCoach === 'kenji' ? 'Kenji' : activeCoach === 'aoi' ? 'Aoi' : 'Folding Hands'}</span>
              {stepNumber !== undefined && (
                <span className="text-stone-400 font-normal">· Step {stepNumber}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={playVoice}
                className={`p-1 rounded-full text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isSpeaking ? 'text-emerald-500 animate-pulse' : ''}`}
                title="Read aloud"
                aria-label="Read coach instructions aloud"
              >
                🔊
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-[11px] px-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                title="Minimize Coach"
              >
                _
              </button>
            </div>
          </div>

          {/* Metaphor Message */}
          <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 leading-snug">
            {metaphor}
          </p>

          {/* Cheerful Encouragement */}
          {cheer && (
            <p className="text-[11px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              ✨ {cheer}
            </p>
          )}

          {/* Quick Coach Picker Chips */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800/60 text-[10px]">
            <span className="text-stone-400">Coach:</span>
            <button
              onClick={() => handleSwitchCoach('aoi')}
              className={`px-1.5 py-0.5 rounded-md font-medium transition-colors ${activeCoach === 'aoi' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              👧 Aoi
            </button>
            <button
              onClick={() => handleSwitchCoach('kenji')}
              className={`px-1.5 py-0.5 rounded-md font-medium transition-colors ${activeCoach === 'kenji' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              👦 Kenji
            </button>
            <button
              onClick={() => handleSwitchCoach('hands')}
              className={`px-1.5 py-0.5 rounded-md font-medium transition-colors ${activeCoach === 'hands' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              🤲 Hands
            </button>
            <button
              onClick={() => handleSwitchCoach('hidden')}
              className="ml-auto text-stone-400 hover:text-stone-600 text-[10px]"
              title="Hide Coach"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Coach Avatar / Hands Display */}
      <div className="flex items-end gap-2">
        <button
          onClick={() => (isMinimized ? setIsMinimized(false) : playVoice())}
          className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-stone-900 border-2 border-emerald-400 dark:border-emerald-500 shadow-xl overflow-hidden hover:scale-105 active:scale-95 transition-all"
          title={`${activeCoach === 'kenji' ? 'Kenji' : activeCoach === 'aoi' ? 'Aoi' : 'Folding Hands'} - Tap to repeat instruction`}
        >
          {activeCoach === 'aoi' && (
            <svg viewBox="0 0 64 64" className="w-12 h-12" aria-hidden="true">
              {/* Hair Buns */}
              <circle cx="16" cy="20" r="9" fill="#78350f" />
              <circle cx="48" cy="20" r="9" fill="#78350f" />
              <circle cx="16" cy="20" r="6" fill="#f43f5e" />
              <circle cx="48" cy="20" r="6" fill="#f43f5e" />
              {/* Face */}
              <circle cx="32" cy="34" r="19" fill="#fed7aa" />
              {/* Bangs */}
              <path d="M15 30 Q32 18 49 30 Q32 24 15 30 Z" fill="#78350f" />
              {/* Eyes */}
              <ellipse cx="25" cy="34" rx="2.5" ry="3.5" fill="#1c1917" />
              <circle cx="26" cy="33" r="1" fill="#ffffff" />
              <ellipse cx="39" cy="34" rx="2.5" ry="3.5" fill="#1c1917" />
              <circle cx="40" cy="33" r="1" fill="#ffffff" />
              {/* Cheeks */}
              <circle cx="21" cy="39" r="2.5" fill="#fda4af" opacity="0.8" />
              <circle cx="43" cy="39" r="2.5" fill="#fda4af" opacity="0.8" />
              {/* Smile */}
              <path d="M28 41 Q32 45 36 41" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          )}

          {activeCoach === 'kenji' && (
            <svg viewBox="0 0 64 64" className="w-12 h-12" aria-hidden="true">
              {/* Hair */}
              <path d="M16 28 Q32 10 48 28 Q40 14 32 14 Q24 14 16 28 Z" fill="#1e293b" />
              {/* Headband */}
              <rect x="15" y="24" width="34" height="6" rx="3" fill="#0284c7" />
              <circle cx="32" cy="27" r="2" fill="#ffffff" />
              {/* Face */}
              <circle cx="32" cy="35" r="18" fill="#ffedd5" />
              {/* Hair strands */}
              <polygon points="16,24 22,29 20,22" fill="#1e293b" />
              <polygon points="48,24 42,29 44,22" fill="#1e293b" />
              {/* Happy eyes */}
              <path d="M22 34 Q26 31 29 34" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M35 34 Q38 31 42 34" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Cheeks */}
              <circle cx="22" cy="39" r="2.5" fill="#fca5a5" opacity="0.7" />
              <circle cx="42" cy="39" r="2.5" fill="#fca5a5" opacity="0.7" />
              {/* Big grin */}
              <path d="M26 40 Q32 47 38 40 Z" fill="#b91c1c" />
              <path d="M28 40 Q32 42 36 40" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            </svg>
          )}

          {activeCoach === 'hands' && (
            <svg viewBox="0 0 64 64" className="w-12 h-12" aria-hidden="true">
              {/* Stylized Hands folding paper */}
              <rect x="18" y="22" width="28" height="28" rx="2" fill="#f43f5e" transform="rotate(-10 32 36)" />
              <path d="M18 22 L38 22 L18 42 Z" fill="#ffffff" opacity="0.9" />
              {/* Left Hand */}
              <g className={action === 'rotate' ? 'animate-spin origin-center' : ''}>
                <rect x="10" y="32" width="14" height="18" rx="7" fill="#fed7aa" stroke="#fb923c" strokeWidth="1.5" />
                <rect x="18" y="28" width="6" height="12" rx="3" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" />
              </g>
              {/* Right Hand */}
              <g className={action === 'crease' ? 'animate-pulse' : ''}>
                <rect x="40" y="32" width="14" height="18" rx="7" fill="#fed7aa" stroke="#fb923c" strokeWidth="1.5" />
                <rect x="40" y="28" width="6" height="12" rx="3" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" />
              </g>
              {/* Crease line sparkle */}
              {action === 'crease' && (
                <line x1="20" y1="36" x2="44" y2="36" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3,3" />
              )}
            </svg>
          )}
        </button>

        {/* Action badge indicator */}
        <div className="bg-stone-900/85 dark:bg-stone-100/90 text-white dark:text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow flex items-center gap-1 shrink-0">
          {action === 'rotate' && <span>🔄 Rotate</span>}
          {action === 'flip' && <span>🥞 Flip</span>}
          {action === 'crease' && <span>⚡ Crease</span>}
          {action === 'cheer' && <span>🎉 Great!</span>}
          {action === 'idle' && <span>✨ Ready</span>}
        </div>
      </div>
    </aside>
  );
};
