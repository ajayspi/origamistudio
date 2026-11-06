// -----------------------------------------------------------------------------
// ORIGAMISTUDIO™ — W3C Device Posture API & Foldable Hinge Sensor Hook
// Inspired by maxwase/kami: Bridges physical folding hardware (foldable phones,
// dual-screen tablets, convertible laptops) directly to Three.js fold kinematics.
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';

export interface DevicePostureState {
  isSupported: boolean;
  type: 'continuous' | 'folded' | 'half-folded' | null;
  angle: number | null; // physical angle in degrees (0..180)
  postureFoldFactor: number | null; // normalized 0..1 fold progress
}

export function useDevicePosture(onHingeFold?: (factor: number) => void): DevicePostureState {
  const [posture, setPosture] = useState<DevicePostureState>({
    isSupported: false,
    type: null,
    angle: null,
    postureFoldFactor: null,
  });

  useEffect(() => {
    // Check for standard W3C Device Posture API or Samsung/Chromium foldable extensions
    const nav = navigator as unknown as {
      devicePosture?: {
        type: 'continuous' | 'folded' | 'half-folded';
        angle?: number;
        addEventListener: (event: string, callback: () => void) => void;
        removeEventListener: (event: string, callback: () => void) => void;
      };
    };

    if (!nav.devicePosture) {
      return;
    }

    const updatePosture = () => {
      const type = nav.devicePosture?.type || 'continuous';
      const angle = nav.devicePosture?.angle ?? (type === 'folded' ? 10 : type === 'half-folded' ? 90 : 180);
      
      // Map 180° (flat) -> 0.0 foldFactor; 0° (fully closed) -> 1.0 foldFactor
      const factor = Math.max(0, Math.min(1, (180 - angle) / 180));

      setPosture({
        isSupported: true,
        type,
        angle,
        postureFoldFactor: factor,
      });

      if (onHingeFold) {
        onHingeFold(factor);
      }
    };

    updatePosture();
    nav.devicePosture.addEventListener('change', updatePosture);

    return () => {
      nav.devicePosture?.removeEventListener('change', updatePosture);
    };
  }, [onHingeFold]);

  return posture;
}
