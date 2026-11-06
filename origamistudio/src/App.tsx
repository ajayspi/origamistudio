import React from 'react';
import { useOrigamiStore } from './store/useOrigamiStore';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { KitGrid } from './components/KitGrid';
import { StudioView } from './components/StudioView';
import { PrintGuide } from './components/PrintGuide';
import { TrophyRoomView } from './components/TrophyRoomView';
import { CustomCursor } from './components/CustomCursor';
import { OrigamiFlightOverlay } from './components/OrigamiFlightOverlay';

export const App: React.FC = () => {
  const currentView = useOrigamiStore((state) => state.currentView);

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) return;
      if (hash.startsWith('studio')) {
        const parts = hash.split('/');
        useOrigamiStore.getState().setView('studio', parts[1] || 'japanese-01');
        if (parts[2]) {
          const stepIdx = parseInt(parts[2], 10);
          if (!isNaN(stepIdx)) {
            useOrigamiStore.getState().setCurrentStepIdx(stepIdx);
          }
        }
      } else if (hash.startsWith('print-guide')) {
        const parts = hash.split('/');
        useOrigamiStore.getState().setView('print-guide', parts[1]);
      } else if (hash === 'pavilions' || hash === 'cultural-pavilions') {
        useOrigamiStore.getState().setView('pavilions');
      } else if (hash === 'trophy-room' || hash === 'trophy' || hash === 'economy') {
        useOrigamiStore.getState().setView('trophy-room');
      } else if (hash === 'hub' || hash === 'journey-track' || hash === 'kits-gallery') {
        useOrigamiStore.getState().setView('hub');
        if (hash === 'journey-track' || hash === 'kits-gallery') {
          setTimeout(() => {
            const el = document.getElementById('journey-track') || document.getElementById('kits-gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const isStudio = currentView === 'studio';

  return (
    <div className={`min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300 flex flex-col justify-between transition-colors duration-200 ${isStudio ? 'h-screen h-[100dvh] overflow-hidden' : ''}`}>
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Universal Origami Flying Ride Loading Animation */}
      <OrigamiFlightOverlay />

      {/* Global Navigation (Hidden in Fullscreen Studio Mode) */}
      {!isStudio && <Navigation />}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'hub' && (
          <>
            <Hero />
            <KitGrid />
          </>
        )}

        {currentView === 'pavilions' && (
          <div className="pt-16">
            <KitGrid />
          </div>
        )}

        {currentView === 'studio' && <StudioView />}

        {currentView === 'print-guide' && <PrintGuide />}

        {currentView === 'trophy-room' && <TrophyRoomView />}
      </main>

      {/* Footer (Hidden in Fullscreen Studio Mode) */}
      {!isStudio && (
        <footer className="border-t border-stone-200 dark:border-stone-800/80 bg-stone-100/60 dark:bg-[#0c0e15] py-8 sm:py-10 px-6 text-xs font-mono text-stone-500 dark:text-stone-400 transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-amber-600 dark:text-amber-400 text-lg">❖</span>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-sm tracking-wide">ORIGAMI.STUDIO FOR KIDS</span>
              <span className="text-stone-400 dark:text-stone-500 hidden md:inline">• 63 Fun 3D Folding Kits for Grades K–12</span>
            </div>
            <div className="text-stone-500 dark:text-stone-400 text-xs text-center sm:text-right">
              Level A, B & C • Step-by-Step 3D Animations • Zero Tricky Jargon
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
