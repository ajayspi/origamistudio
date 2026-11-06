import { describe, it, expect } from 'vitest';
import {
  getStudioMoodConfig,
  calculateMoodLighting,
  type StudioMood
} from './studioMoods';

describe('Studio Aesthetic Moods Engine', () => {
  it('returns valid config for Kyoto Artisan mood with warm lighting and washi fibers', () => {
    const config = getStudioMoodConfig('artisan');
    expect(config.id).toBe('artisan');
    expect(config.name).toBe('Kyoto Artisan');
    expect(config.paperStock).toBe('washi');
    expect(config.roughness).toBeGreaterThan(0.9);
    expect(config.metalness).toBe(0.0);
    expect(config.backColor).toBe(0xfbf7ee); // Warm unbleached mulberry kozo
    expect(config.stageBg).toBe('#1a1612'); // Dark cedar background
  });

  it('returns valid config for Modern Minimalist mood with crisp Kami paper', () => {
    const config = getStudioMoodConfig('minimalist');
    expect(config.id).toBe('minimalist');
    expect(config.name).toBe('Modern Minimalist');
    expect(config.paperStock).toBe('kami');
    expect(config.backColor).toBe(0xfcfdfd); // Pure crisp white
    expect(config.metalness).toBeCloseTo(0.01, 2);
  });

  it('returns valid config for High-Tech Engineering mood with metallic foil and cyan rim', () => {
    const config = getStudioMoodConfig('engineering');
    expect(config.id).toBe('engineering');
    expect(config.name).toBe('High-Tech Aerospace');
    expect(config.paperStock).toBe('foil');
    expect(config.metalness).toBeGreaterThan(0.5);
    expect(config.edgeGlow).toBe(true);
    expect(config.rimLightColor).toBe(0x38bdf8); // Cyan rim light
  });

  it('computes calibrated light intensities across all moods', () => {
    const moods: StudioMood[] = ['artisan', 'minimalist', 'engineering'];
    for (const mood of moods) {
      const lights = calculateMoodLighting(mood);
      expect(lights.keyLight.intensity).toBeGreaterThan(0.5);
      expect(lights.ambientLight.intensity).toBeGreaterThan(0.15);
      expect(lights.fillLight.intensity).toBeGreaterThan(0.1);
    }
  });
});
