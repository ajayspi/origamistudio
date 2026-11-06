import React from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { CalmModeToggle } from './CalmModeToggle';
import { Volume2, VolumeX, Box, BookOpen, Sun, Moon, Tv, Trophy } from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    currentView,
    setView,
    soundEnabled,
    toggleSound,
    theme,
    toggleTheme,
    isClassroomMode,
    setClassroomMode,
    magicSheetsBalance,
  } = useOrigamiStore();

  const handleNavClick = (view: 'hub' | 'studio' | 'pavilions' | 'trophy-room', hashTarget?: string) => {
    setView(view);
    if (hashTarget && view === 'hub') {
      setTimeout(() => {
        const el = document.getElementById(hashTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbf9f4]/95 dark:bg-[#0c0e15]/95 backdrop-blur-md border-b border-[#e5e0d5] dark:border-stone-800/80 px-4 sm:px-8 py-3 transition-colors duration-200 shadow-[0_2px_12px_rgba(222,218,209,0.35)] dark:shadow-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Monogram & Title */}
        <button
          onClick={() => handleNavClick('hub')}
          className="flex items-center gap-3 group text-left cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl neumorph-stone-raised text-amber-600 dark:text-[#d4af37] flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
            ❖
          </div>
          <div>
            <div className="font-cinzel font-bold text-sm tracking-[0.18em] text-stone-900 dark:text-stone-100">
              ORIGAMI<span className="text-amber-600 dark:text-[#d4af37]">.</span>STUDIO
            </div>
            <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400 tracking-wider hidden sm:block">
              Interactive Art Book & Paper Geometry Lab
            </div>
          </div>
        </button>

        {/* Primary Monograph Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 neumorph-stone-pressed p-1.5 rounded-xl text-xs font-mono">
          <button
            onClick={() => handleNavClick('hub', 'journey-track')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer min-h-[40px] ${
              currentView === 'hub'
                ? 'neumorph-stone-raised text-amber-900 dark:text-amber-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37]" />
            <span>The Collection</span>
          </button>

          <button
            onClick={() => handleNavClick('studio')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer min-h-[40px] ${
              currentView === 'studio'
                ? 'neumorph-stone-raised text-amber-900 dark:text-amber-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37]" />
            <span>3D Studio</span>
          </button>

          <button
            onClick={() => handleNavClick('trophy-room')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer min-h-[40px] ${
              currentView === 'trophy-room'
                ? 'neumorph-stone-raised text-amber-900 dark:text-amber-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37]" />
            <span>Trophy Room</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30">
              {magicSheetsBalance} 📄
            </span>
          </button>
        </div>

        {/* Right Utility & Craft Controls */}
        <div className="flex items-center gap-2">
          {/* Calm Mode Toggle (Reduced motion / Distraction-free) */}
          <CalmModeToggle compact className="hidden sm:inline-flex" />

          {/* Classroom Smartboard Mode Toggle */}
          <button
            onClick={() => setClassroomMode(!isClassroomMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer min-h-[40px] ${
              isClassroomMode
                ? 'bg-purple-700 text-white shadow-xs'
                : 'neumorph-stone-raised text-stone-700 dark:text-stone-300'
            }`}
            title="Classroom Presentation Mode (Touch-friendly 100% stage)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isClassroomMode ? 'Classroom: ON' : 'Classroom'}</span>
          </button>

          {/* Theme Toggle (Daylight Craft Paper / Studio Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Studio Dark Mode' : 'Switch to Daylight Light Mode'}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl neumorph-stone-raised text-stone-700 dark:text-stone-300 transition-all cursor-pointer text-xs font-mono min-h-[40px] min-w-[40px]"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="hidden xl:inline text-stone-700 font-bold">Washi Daylight</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-stone-300">Dark</span>
              </>
            )}
          </button>

          {/* Acoustic Crease Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Crease Audio' : 'Enable Acoustic Crease Audio'}
            className="p-2.5 rounded-xl neumorph-stone-raised text-stone-700 dark:text-stone-300 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle Crease Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-[#d4af37]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400 dark:text-stone-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
