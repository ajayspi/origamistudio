import { create } from 'zustand';
import type { ViewMode } from '../types/origami';
import type { StudioMood } from '../utils/studioMoods';

export type AgeTrack = 'junior' | 'explorer' | 'stem';
export type SchoolGradeFilter = 'all' | 'sprouts' | 'explorers' | 'stem';

export interface EconomyActivityItem {
  id: string;
  date: string;
  action: string;
  magicSheetsChange: number;
  balanceAfter: number;
  shippingStatus: 'Delivered' | 'Shipped via Shiprocket' | 'Processing' | 'Digital';
  kitTitle?: string;
  trackingNumber?: string;
}

interface OrigamiState {
  currentView: ViewMode;
  activeKitId: string;
  currentStepIdx: number;
  completedStepIndices: number[];
  foldFactor: number;
  viewerMode: '3d' | 'cp';
  soundEnabled: boolean;
  ageTrack: AgeTrack;
  schoolGradeFilter: SchoolGradeFilter;
  isClassroomMode: boolean;
  isSpeaking: boolean;
  activeCultureFilter: string;
  searchQuery: string;
  dailyStreak: number;
  completedKitIds: string[];
  isCalmMode: boolean;
  magicSheetsBalance: number;
  activityLedger: EconomyActivityItem[];

  // Visual Animation & Classroom Theme Controls
  theme: 'light' | 'dark';
  isLooping: boolean;
  autoAdvance: boolean;
  playbackSpeed: number;
  isPlaying: boolean;
  isPlayAll: boolean;

  // Zen Studio & Artisan Inspector Controls
  studioMood: StudioMood;
  setStudioMood: (mood: StudioMood) => void;
  paperStock: 'kami' | 'washi' | 'foil';
  setPaperStock: (stock: 'kami' | 'washi' | 'foil') => void;
  isArtisanDrawerOpen: boolean;
  toggleArtisanDrawer: () => void;
  setArtisanDrawerOpen: (open: boolean) => void;
  cameraPreset: 'perspective' | 'top' | 'front';
  setCameraPreset: (preset: 'perspective' | 'top' | 'front') => void;
  lightingMood: 'studio' | 'daylight' | 'midnight';
  setLightingMood: (mood: 'studio' | 'daylight' | 'midnight') => void;
  isPancakeFlipped: boolean;
  togglePancakeFlip: () => void;
  setPancakeFlipped: (flipped: boolean) => void;
  previewCompletionModel: boolean;
  setPreviewCompletionModel: (preview: boolean) => void;
  isAutoRotating: boolean;
  toggleAutoRotate: () => void;
  setIsAutoRotating: (rotating: boolean) => void;
  showRefFinderModal: boolean;
  setShowRefFinderModal: (show: boolean) => void;
  showWaveHud: boolean;
  setShowWaveHud: (show: boolean) => void;
  enableDynamicRelaxation: boolean;
  toggleDynamicRelaxation: () => void;
  setDynamicRelaxation: (enable: boolean) => void;
  launchingKitId: string | null;
  isLaunching: boolean;
  launchKit: (kitId: string) => void;
  finishLaunch: () => void;

  // Actions
  setView: (view: ViewMode, kitId?: string) => void;
  setActiveKitId: (id: string) => void;
  setCurrentStepIdx: (idx: number) => void;
  toggleStepCompleted: (idx: number) => void;
  setFoldFactor: (factor: number) => void;
  setViewerMode: (mode: '3d' | 'cp') => void;
  toggleSound: () => void;
  setAgeTrack: (track: AgeTrack) => void;
  setSchoolGradeFilter: (filter: SchoolGradeFilter) => void;
  setClassroomMode: (active: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setActiveCultureFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  markKitCompleted: (kitId: string, kitTitle?: string) => void;
  orderPhysicalKit: (kitId: string, kitTitle?: string) => void;
  toggleCalmMode: () => void;
  setCalmMode: (calm: boolean) => void;

  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleLooping: () => void;
  setAutoAdvance: (advance: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsPlayAll: (playAll: boolean) => void;
}

const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const raw = localStorage.getItem('origami_theme');
    if (raw === 'dark' || raw === 'light') return raw;
  } catch {}
  return 'light'; // daylight theme default for school accessibility
};

const applyThemeToDOM = (theme: 'light' | 'dark') => {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch {}
};

const DEFAULT_COMPLETED = ['japanese-01', 'japanese-02', 'chinese-01', 'lotus-01'];

const DEFAULT_LEDGER: EconomyActivityItem[] = [
  {
    id: 'act-001',
    date: '2026-11-03',
    action: 'Mastered Kinetic Dragon 🐉',
    magicSheetsChange: 50,
    balanceAfter: 450,
    shippingStatus: 'Digital',
    kitTitle: 'Kinetic Dragon',
  },
  {
    id: 'act-002',
    date: '2026-11-02',
    action: 'Ordered Physical Kinetic Builder Kit (Level B) 📦',
    magicSheetsChange: -299,
    balanceAfter: 400,
    shippingStatus: 'Shipped via Shiprocket',
    kitTitle: 'Kinetic Builder Kit B',
    trackingNumber: 'SR-84920194',
  },
  {
    id: 'act-003',
    date: '2026-11-01',
    action: 'Completed STEM Classroom Geometry Lesson 📐',
    magicSheetsChange: 100,
    balanceAfter: 699,
    shippingStatus: 'Digital',
  },
  {
    id: 'act-004',
    date: '2026-10-29',
    action: 'Ordered Starter Paper Pack (773x3 Washi) 📦',
    magicSheetsChange: -299,
    balanceAfter: 599,
    shippingStatus: 'Delivered',
    kitTitle: 'Starter Paper Pack A4',
    trackingNumber: 'SR-77301289',
  },
  {
    id: 'act-005',
    date: '2026-10-28',
    action: 'Mastered Japanese Orizuru Crane 🕊️',
    magicSheetsChange: 50,
    balanceAfter: 898,
    shippingStatus: 'Digital',
    kitTitle: 'Orizuru Crane',
  },
  {
    id: 'act-006',
    date: '2026-10-27',
    action: 'Daily Streak 5-Day Bonus 🔥',
    magicSheetsChange: 25,
    balanceAfter: 848,
    shippingStatus: 'Digital',
  },
];

const getStoredCompleted = (): string[] => {
  try {
    const raw = localStorage.getItem('origami_completed_kit_ids');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_COMPLETED;
};

const getStoredLedger = (): EconomyActivityItem[] => {
  try {
    const raw = localStorage.getItem('origami_economy_ledger');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_LEDGER;
};

const getStoredBalance = (): number => {
  try {
    const raw = localStorage.getItem('origami_magic_sheets_balance');
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch {}
  return 450;
};

const getStoredStreak = (): number => {
  try {
    return parseInt(localStorage.getItem('origami_daily_streak') || '0', 10);
  } catch {
    return 0;
  }
};

const getStoredAgeTrack = (): AgeTrack => {
  try {
    const raw = localStorage.getItem('origami_age_track');
    if (raw === 'junior' || raw === 'explorer' || raw === 'stem') return raw;
  } catch {}
  return 'explorer';
};

const getStoredCalmMode = (): boolean => {
  try {
    const raw = localStorage.getItem('origami_calm_mode');
    if (raw !== null) return raw === 'true';
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
  } catch {}
  return false;
};

const getInitialState = (): { view: ViewMode; kitId: string; stepIdx?: number } => {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('studio')) {
      const parts = hash.split('/');
      const stepIdx = parts[2] ? parseInt(parts[2], 10) : undefined;
      return { view: 'studio', kitId: parts[1] || 'japanese-01', stepIdx };
    }
    if (hash === 'pavilions' || hash === 'cultural-pavilions') return { view: 'pavilions', kitId: 'japanese-01' };
    if (hash.startsWith('print-guide')) {
      const parts = hash.split('/');
      return { view: 'print-guide', kitId: parts[1] || 'japanese-01' };
    }
    if (hash === 'trophy-room' || hash === 'trophy' || hash === 'economy') {
      return { view: 'trophy-room', kitId: 'japanese-01' };
    }
  } catch {}
  return { view: 'hub', kitId: 'japanese-01' };
};

const initialNav = getInitialState();
const initialTheme = getStoredTheme();
applyThemeToDOM(initialTheme);

export const useOrigamiStore = create<OrigamiState>((set, get) => ({
  currentView: initialNav.view,
  activeKitId: initialNav.kitId,
  currentStepIdx: typeof initialNav.stepIdx === 'number' && !isNaN(initialNav.stepIdx) ? initialNav.stepIdx : 0,
  completedStepIndices: [],
  foldFactor: 1.0,
  viewerMode: '3d',
  soundEnabled: true,
  ageTrack: getStoredAgeTrack(),
  schoolGradeFilter: 'all',
  isClassroomMode: false,
  isSpeaking: false,
  activeCultureFilter: 'all',
  searchQuery: '',
  dailyStreak: getStoredStreak(),
  completedKitIds: getStoredCompleted(),
  isCalmMode: getStoredCalmMode(),
  magicSheetsBalance: getStoredBalance(),
  activityLedger: getStoredLedger(),

  theme: initialTheme,
  isLooping: true,
  autoAdvance: false,
  playbackSpeed: 1.0,
  isPlaying: false,
  isPlayAll: false,

  isArtisanDrawerOpen: false,
  studioMood: 'minimalist',
  setStudioMood: (studioMood) => set({ studioMood }),
  paperStock: 'kami',
  setPaperStock: (paperStock) => set({ paperStock }),
  cameraPreset: 'perspective',
  lightingMood: 'studio',
  isPancakeFlipped: false,
  previewCompletionModel: false,
  isAutoRotating: true,
  showRefFinderModal: false,
  showWaveHud: false,
  enableDynamicRelaxation: false,
  launchingKitId: null,
  isLaunching: false,

  setView: (view, kitId) => {
    try {
      const targetId = kitId || get().activeKitId;
      window.location.hash = targetId ? `${view}/${targetId}` : view;
    } catch {}
    set((state) => ({
      currentView: view,
      activeKitId: kitId || state.activeKitId,
      currentStepIdx: 0,
      completedStepIndices: [],
      foldFactor: 1.0,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setActiveKitId: (id) => {
    set({
      activeKitId: id,
      currentStepIdx: 0,
      completedStepIndices: [],
      foldFactor: 1.0,
    });
  },

  setCurrentStepIdx: (idx) => set({ currentStepIdx: idx }),

  toggleStepCompleted: (idx) => {
    const current = get().completedStepIndices;
    const exists = current.includes(idx);
    const updated = exists ? current.filter((i) => i !== idx) : [...current, idx];
    set({ completedStepIndices: updated });
  },

  setFoldFactor: (factor) => set({ foldFactor: factor }),

  setViewerMode: (mode) => set({ viewerMode: mode }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  setAgeTrack: (track: AgeTrack) => {
    try {
      localStorage.setItem('origami_age_track', track);
    } catch {}
    set({ ageTrack: track });
  },

  setSchoolGradeFilter: (filter: SchoolGradeFilter) => set({ schoolGradeFilter: filter }),

  setClassroomMode: (active: boolean) => set({ isClassroomMode: active }),

  setIsSpeaking: (speaking: boolean) => set({ isSpeaking: speaking }),

  setActiveCultureFilter: (filter) => set({ activeCultureFilter: filter }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  markKitCompleted: (kitId, kitTitle) => {
    const { completedKitIds, dailyStreak, magicSheetsBalance, activityLedger } = get();
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('origami_last_completed_date');
    let newStreak = dailyStreak;

    if (lastDate !== todayStr) {
      newStreak += 1;
      localStorage.setItem('origami_daily_streak', String(newStreak));
      localStorage.setItem('origami_last_completed_date', todayStr);
    }

    const updatedKits = Array.from(new Set([...completedKitIds, kitId]));
    try {
      localStorage.setItem('origami_completed_kit_ids', JSON.stringify(updatedKits));
    } catch {}

    const newBalance = magicSheetsBalance + 50;
    try {
      localStorage.setItem('origami_magic_sheets_balance', String(newBalance));
    } catch {}

    const newActivity: EconomyActivityItem = {
      id: `act-${Date.now()}`,
      date: todayStr,
      action: `Mastered ${kitTitle || 'Kinetic Model'} 🏆`,
      magicSheetsChange: 50,
      balanceAfter: newBalance,
      shippingStatus: 'Digital',
      kitTitle,
    };
    const updatedLedger = [newActivity, ...activityLedger];
    try {
      localStorage.setItem('origami_economy_ledger', JSON.stringify(updatedLedger));
    } catch {}

    set({
      completedKitIds: updatedKits,
      dailyStreak: newStreak,
      magicSheetsBalance: newBalance,
      activityLedger: updatedLedger,
    });
  },

  orderPhysicalKit: (kitId, kitTitle) => {
    const { magicSheetsBalance, activityLedger } = get();
    const todayStr = new Date().toISOString().slice(0, 10);
    const cost = 299;
    const newBalance = Math.max(0, magicSheetsBalance - cost);
    try {
      localStorage.setItem('origami_magic_sheets_balance', String(newBalance));
    } catch {}

    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const newActivity: EconomyActivityItem = {
      id: `act-${Date.now()}`,
      date: todayStr,
      action: `Ordered Physical Kit: ${kitTitle || kitId} (₹299) 📦`,
      magicSheetsChange: -cost,
      balanceAfter: newBalance,
      shippingStatus: 'Processing',
      kitTitle: kitTitle || kitId,
      trackingNumber: `SR-${randomSuffix}`,
    };
    const updatedLedger = [newActivity, ...activityLedger];
    try {
      localStorage.setItem('origami_economy_ledger', JSON.stringify(updatedLedger));
    } catch {}

    set({
      magicSheetsBalance: newBalance,
      activityLedger: updatedLedger,
    });
  },

  toggleCalmMode: () => {
    const next = !get().isCalmMode;
    try {
      localStorage.setItem('origami_calm_mode', String(next));
    } catch {}
    set({ isCalmMode: next });
  },

  setCalmMode: (calm: boolean) => {
    try {
      localStorage.setItem('origami_calm_mode', String(calm));
    } catch {}
    set({ isCalmMode: calm });
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('origami_theme', next);
    } catch {}
    applyThemeToDOM(next);
    set({ theme: next });
  },

  setTheme: (theme: 'light' | 'dark') => {
    try {
      localStorage.setItem('origami_theme', theme);
    } catch {}
    applyThemeToDOM(theme);
    set({ theme });
  },

  toggleLooping: () => set((state) => ({ isLooping: !state.isLooping })),

  setAutoAdvance: (advance: boolean) => set({ autoAdvance: advance }),

  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),

  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setIsPlayAll: (playAll: boolean) => set({ isPlayAll: playAll }),

  toggleArtisanDrawer: () => set((state) => ({ isArtisanDrawerOpen: !state.isArtisanDrawerOpen })),
  setArtisanDrawerOpen: (open: boolean) => set({ isArtisanDrawerOpen: open }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setLightingMood: (lightingMood) => set({ lightingMood }),
  togglePancakeFlip: () => set((state) => ({ isPancakeFlipped: !state.isPancakeFlipped })),
  setPancakeFlipped: (isPancakeFlipped: boolean) => set({ isPancakeFlipped }),
  setPreviewCompletionModel: (previewCompletionModel: boolean) => set({ previewCompletionModel }),
  toggleAutoRotate: () => set((state) => ({ isAutoRotating: !state.isAutoRotating })),
  setIsAutoRotating: (isAutoRotating: boolean) => set({ isAutoRotating }),
  setShowRefFinderModal: (showRefFinderModal: boolean) => set({ showRefFinderModal }),
  setShowWaveHud: (showWaveHud: boolean) => set({ showWaveHud }),
  toggleDynamicRelaxation: () => set((state) => ({ enableDynamicRelaxation: !state.enableDynamicRelaxation })),
  setDynamicRelaxation: (enable: boolean) => set({ enableDynamicRelaxation: enable }),
  launchKit: (kitId: string) => set({ isLaunching: true, launchingKitId: kitId }),
  finishLaunch: () => {
    const targetKitId = get().launchingKitId || get().activeKitId;
    try {
      window.location.hash = `studio/${targetKitId}`;
    } catch {}
    set({
      isLaunching: false,
      launchingKitId: null,
      currentView: 'studio',
      activeKitId: targetKitId,
      currentStepIdx: 0,
      completedStepIndices: [],
      foldFactor: 0.0,
      previewCompletionModel: true,
      isPlaying: false,
      isPlayAll: false,
      isPancakeFlipped: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));
