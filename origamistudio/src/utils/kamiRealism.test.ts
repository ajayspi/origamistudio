import { describe, it, expect } from 'vitest';
import { getKamiOrientationHint, getPaperContrastRatio } from './kamiRealism';
import type { OrigamiKit } from '../types/origami';

const mockKit: OrigamiKit = {
  id: 'japanese-01',
  title: 'Orizuru (Peace Crane)',
  collection: 'japanese',
  category: 'Traditional',
  difficulty: 'Intermediate',
  time: '15 min',
  paper: [{ size: '15x15 cm', color: 'Cherry Blossom Pink', frontColorHex: '#f43f5e', backColorHex: '#ffffff' }],
  tools: [],
  principles: [],
  goal: 'Fold a classic peace crane.',
  steps: [{ stepNumber: 1, title: 'Step 1: Start', instruction: 'Diagonal fold' }]
};

describe('Dual-Sided Kami Realism Engine', () => {
  it('gives explicit Color Side Down callout on Step 0 / Step 1', () => {
    const hint = getKamiOrientationHint(mockKit, 0, false);
    expect(hint.colorSideFacing).toBe('down');
    expect(hint.callout).toContain('COLOR SIDE DOWN');
    expect(hint.backColorHex).toBe('#ffffff');
  });

  it('updates orientation when paper is flipped 180 degrees', () => {
    const hint = getKamiOrientationHint(mockKit, 1, true);
    expect(hint.colorSideFacing).toBe('up');
    expect(hint.callout).toContain('COLOR SIDE UP');
  });

  it('calculates WCAG high contrast ratio between front and back of Kami paper', () => {
    const ratio = getPaperContrastRatio('#1e293b', '#ffffff');
    expect(ratio).toBeGreaterThan(4.5);
  });
});
