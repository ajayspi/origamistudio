/**
 * -----------------------------------------------------------------------------
 * ORIGAMISTUDIO™ — Studio Aesthetic Moods & Visual Lighting Engine
 * Provides calibrated physical rendering presets for:
 * 1. Kyoto Artisan: Warm gallery spotlights, organic mulberry washi fibers, cedar backdrop.
 * 2. Modern Minimalist: Crisp studio daylight, matte Kami paper, neutral porcelain backdrop.
 * 3. High-Tech Engineering: Deep carbon slate, reflective Kapton foil, cyan rim lighting.
 * -----------------------------------------------------------------------------
 */

export type StudioMood = 'artisan' | 'minimalist' | 'engineering';

export interface StudioMoodConfig {
  id: StudioMood;
  name: string;
  emoji: string;
  tagline: string;
  paperStock: 'kami' | 'washi' | 'foil';
  roughness: number;
  metalness: number;
  bumpScale: number;
  backColor: number;
  backRoughness: number;
  stageBg: string;
  stageBgLight: string;
  floorColor: number;
  floorColorLight: number;
  edgeGlow: boolean;
  edgeColor: number;
  rimLightColor: number;
}

export interface MoodLightSource {
  color: number;
  intensity: number;
  position: [number, number, number];
}

export interface MoodLightingRig {
  ambientLight: { color: number; intensity: number };
  keyLight: MoodLightSource;
  fillLight: MoodLightSource;
  rimLight: MoodLightSource;
}

export const STUDIO_MOOD_CONFIGS: Record<StudioMood, StudioMoodConfig> = {
  artisan: {
    id: 'artisan',
    name: 'Kyoto Artisan',
    emoji: '🏮',
    tagline: 'Warm gallery spotlights with textured mulberry washi fibers',
    paperStock: 'washi',
    roughness: 0.94,
    metalness: 0.0,
    bumpScale: 0.0075,
    backColor: 0xfbf7ee, // Warm unbleached mulberry kozo
    backRoughness: 0.96,
    stageBg: '#1a1612', // Warm cedar dark wash
    stageBgLight: '#fcfaf6',
    floorColor: 0x221c17,
    floorColorLight: 0xf4eee4,
    edgeGlow: false,
    edgeColor: 0xb45309,
    rimLightColor: 0xfbbf24 // Warm amber rim
  },
  minimalist: {
    id: 'minimalist',
    name: 'Modern Minimalist',
    emoji: '✨',
    tagline: 'Crisp studio daylight with clean graphic Kami paper',
    paperStock: 'kami',
    roughness: 0.88,
    metalness: 0.01,
    bumpScale: 0.0032,
    backColor: 0xfcfdfd, // Crisp pure white underside
    backRoughness: 0.92,
    stageBg: '#0c0a09', // Crisp dark obsidian
    stageBgLight: '#faf8f5', // Clean pure porcelain
    floorColor: 0x0c0a09,
    floorColorLight: 0xfaf8f5,
    edgeGlow: false,
    edgeColor: 0x0284c7,
    rimLightColor: 0xffffff // Crisp neutral white rim
  },
  engineering: {
    id: 'engineering',
    name: 'High-Tech Aerospace',
    emoji: '🛰️',
    tagline: 'Carbon blueprint stage with reflective metallic Kapton foil',
    paperStock: 'foil',
    roughness: 0.28,
    metalness: 0.72,
    bumpScale: 0.0016,
    backColor: 0xfcfdfd,
    backRoughness: 0.90,
    stageBg: '#05070c', // Deep carbon blueprint slate
    stageBgLight: '#eef2f6',
    floorColor: 0x0a0f1d,
    floorColorLight: 0xdbeafe,
    edgeGlow: true,
    edgeColor: 0x38bdf8,
    rimLightColor: 0x38bdf8 // Cyan laser rim light
  }
};

/**
 * Retrieves the full rendering and material config for a studio mood.
 */
export function getStudioMoodConfig(mood: StudioMood): StudioMoodConfig {
  return STUDIO_MOOD_CONFIGS[mood] || STUDIO_MOOD_CONFIGS.minimalist;
}

/**
 * Computes calibrated 3D lighting coordinates and lumen output for a studio mood.
 */
export function calculateMoodLighting(mood: StudioMood): MoodLightingRig {
  switch (mood) {
    case 'artisan':
      return {
        ambientLight: { color: 0xfffaf5, intensity: 0.50 },
        keyLight: { color: 0xfff7ea, intensity: 1.20, position: [3, 4, 3] }, // Refined warm gallery spotlight
        fillLight: { color: 0xfef3c7, intensity: 0.35, position: [-3, 2, -2] },
        rimLight: { color: 0xfbbf24, intensity: 0.55, position: [0, 4, -4] }
      };

    case 'engineering':
      return {
        ambientLight: { color: 0x0f172a, intensity: 0.35 },
        keyLight: { color: 0xf8fafc, intensity: 1.35, position: [2.5, 4.5, 2.5] }, // 7000K crisp key
        fillLight: { color: 0x1e293b, intensity: 0.25, position: [-2.5, 2, -2.5] },
        rimLight: { color: 0x38bdf8, intensity: 1.1, position: [-1, 3.5, -3.5] } // High-contrast cyan rim
      };

    case 'minimalist':
    default:
      return {
        ambientLight: { color: 0xffffff, intensity: 0.55 },
        keyLight: { color: 0xfffbf0, intensity: 1.25, position: [2.5, 3.8, 2.5] }, // 5600K studio neutral daylight
        fillLight: { color: 0xf1f5f9, intensity: 0.40, position: [-2.5, 2, -2] },
        rimLight: { color: 0xffffff, intensity: 0.50, position: [0, 3, -3] }
      };
  }
}
