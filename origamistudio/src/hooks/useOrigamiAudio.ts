import { useRef, useCallback } from 'react';
import { useOrigamiStore } from '../store/useOrigamiStore';

export function useOrigamiAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundEnabled = useOrigamiStore((state) => state.soundEnabled);

  const initCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch((err) => {
        console.warn('AudioContext resume deferred until user interaction:', err);
      });
    }
  }, []);

  const playCrease = useCallback(() => {
    // Tactile haptic pulse (guarded for non-supporting browsers)
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([15, 30, 20]);
      }
    } catch {}

    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 2.4kHz high-frequency acoustic crease snap impulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio playCrease error:', e);
    }
  }, [soundEnabled, initCtx]);

  const playStepClick = useCallback(() => {
    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio playStepClick error:', e);
    }
  }, [soundEnabled, initCtx]);

  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const triad = [523.25, 783.99, 1318.51];
      triad.forEach((freq, idx) => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const delay = idx * 0.05;
        gain.gain.setValueAtTime(0.18 / (idx + 1), now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 2.3);
      });
    } catch (e) {
      console.warn('Audio playChime error:', e);
    }
  }, [soundEnabled, initCtx]);

  // Procedural Web Audio Foley Engine for Living Stickmen Helpers (Classroom-safe < 0.12 gain)
  const playFootstep = useCallback(() => {
    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.038);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }, [soundEnabled, initCtx]);

  const playBroomSweep = useCallback(() => {
    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = Math.ceil(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.frequency.exponentialRampToValueAtTime(650, now + 0.16);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.17);
    } catch {}
  }, [soundEnabled, initCtx]);

  const playJointPop = useCallback(() => {
    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.035);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }, [soundEnabled, initCtx]);

  const playPushStrain = useCallback(() => {
    if (!soundEnabled) return;
    initCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.22);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }, [soundEnabled, initCtx]);

  return { playCrease, playStepClick, playChime, playFootstep, playBroomSweep, playJointPop, playPushStrain };
}
