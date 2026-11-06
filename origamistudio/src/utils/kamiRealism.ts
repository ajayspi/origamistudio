import type { OrigamiKit } from '../types/origami';

export interface KamiOrientationHint {
  colorSideFacing: 'up' | 'down';
  callout: string;
  frontColorHex: string;
  backColorHex: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates WCAG contrast ratio between front pattern color and clean reverse side
 */
export function getPaperContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Provides explicit dual-sided Kami realism orientation callouts for child folders
 */
export function getKamiOrientationHint(
  kit?: OrigamiKit,
  _stepIndex = 0,
  isPancakeFlipped = false
): KamiOrientationHint {
  const paper = kit?.paper?.[0];
  const frontColorHex = paper?.frontColorHex || '#f43f5e';
  const backColorHex = paper?.backColorHex || '#ffffff';

  const colorSideFacing: 'up' | 'down' = isPancakeFlipped ? 'up' : 'down';
  const callout = colorSideFacing === 'down'
    ? 'Place paper COLOR SIDE DOWN (White side looking at you)!'
    : 'Paper is COLOR SIDE UP (Folded pattern visible)!';

  return {
    colorSideFacing,
    callout,
    frontColorHex,
    backColorHex,
  };
}
