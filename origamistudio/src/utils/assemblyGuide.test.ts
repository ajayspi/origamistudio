import { describe, it, expect } from 'vitest';
import { getMultiPartAssemblyProfile, getNextAssemblyStep } from './assemblyGuide';
import type { OrigamiKit } from '../types/origami';

const mockJapanese01: OrigamiKit = {
  id: 'japanese-01',
  title: 'Orizuru (Peace Crane)',
  collection: 'japanese',
  collectionTitle: 'Japanese Master Origami',
  category: 'Traditional',
  difficulty: 'Intermediate',
  time: '15 min',
  paper: [{ size: '15x15 cm', color: 'Cherry Blossom Pink' }],
  tools: [],
  principles: ['Valley Fold', 'Mountain Fold'],
  goal: 'Fold a classic peace crane.',
  steps: [{ stepNumber: 1, title: 'Base Fold', instruction: 'Fold diagonal' }]
};

const mockJapanese02: OrigamiKit = {
  id: 'japanese-02',
  title: 'Kabuto (Samurai Helmet)',
  collection: 'japanese',
  collectionTitle: 'Japanese Master Origami',
  category: 'Traditional',
  difficulty: 'Beginner',
  time: '10 min',
  paper: [{ size: '15x15 cm', color: 'Gold Leaf' }],
  tools: [],
  principles: [],
  goal: 'Fold a samurai helmet.',
  steps: [{ stepNumber: 1, title: 'Diagonal Fold', instruction: 'Fold' }]
};

describe('Multi-Part Visual Assembly Engine', () => {
  it('returns valid assembly profile for multi-part collections', () => {
    const allKits = [mockJapanese01, mockJapanese02];
    const profile = getMultiPartAssemblyProfile(mockJapanese01, allKits, ['japanese-01']);
    expect(profile).not.toBeNull();
    expect(profile?.totalParts).toBe(2);
    expect(profile?.completedParts).toContain('japanese-01');
    expect(profile?.isComplete).toBe(false);
  });

  it('identifies the next physical assembly step between parts', () => {
    const allKits = [mockJapanese01, mockJapanese02];
    const profile = getMultiPartAssemblyProfile(mockJapanese01, allKits, ['japanese-01']);
    expect(profile).not.toBeNull();
    const nextStep = getNextAssemblyStep(profile!);
    expect(nextStep).not.toBeNull();
    expect(nextStep?.fromPart).toBe('japanese-01');
    expect(nextStep?.toPart).toBe('japanese-02');
  });

  it('returns null for standalone kits without sibling parts', () => {
    const profile = getMultiPartAssemblyProfile(mockJapanese01, [mockJapanese01], []);
    expect(profile).toBeNull();
  });
});
