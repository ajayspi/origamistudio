import React, { useEffect, useRef, useState, useCallback } from 'react';
import { stickmanTokens, type StickmanPoseKey } from '../tokens';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';

export interface LivingStickmanProps {
  mode?: 'walker' | 'peeker' | 'sweeper' | 'pusher' | 'percher';
  size?: number;
  className?: string;
  railWidth?: number; // Distance in pixels to walk along if mode="walker" (default 260)
  accentColor?: string;
  caption?: string;
  interactive?: boolean;
  onAction?: () => void;
}

// Procedural bent limb quadratic curve matching natural biomechanics
function bentLimb(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const before = [lerp(bx, ax, 0.15), lerp(by, ay, 0.15)];
  const after = [lerp(bx, cx, 0.15), lerp(by, cy, 0.15)];
  return `M${ax} ${ay}L${before[0]} ${before[1]}Q${bx} ${by} ${after[0]} ${after[1]}L${cx} ${cy}`;
}

export const LivingStickman: React.FC<LivingStickmanProps> = ({
  mode = 'percher',
  size = 54,
  className = '',
  railWidth = 260,
  accentColor,
  caption,
  interactive = true,
  onAction,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playFootstep, playBroomSweep, playJointPop, playPushStrain } = useOrigamiAudio();

  // Motion states
  const [isVisible, setIsVisible] = useState(true);
  const [currentPose, setCurrentPose] = useState<StickmanPoseKey>('stand');
  const [stuntActive, setStuntActive] = useState(false);
  const [stuntProgress, setStuntProgress] = useState(0);

  // Autonomous Walker State
  const [walkX, setWalkX] = useState(0);
  const [walkDir, setWalkDir] = useState<1 | -1>(1);
  const [isPausedAtTurn, setIsPausedAtTurn] = useState(false);

  // Peeker State
  const [peekDuck, setPeekDuck] = useState(false);

  // Cursor Gaze Angle for Percher / Observer
  const [gazeAngle, setGazeAngle] = useState(0);
  const [isCursorNear, setIsCursorNear] = useState(false);

  // Time tick
  const [tick, setTick] = useState(0);

  // Performance: IntersectionObserver pauses animation when scrolled offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main autonomous life loop (Runs only when visible & reduced motion not active)
  useEffect(() => {
    if (!isVisible) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();
    let footstepCooldown = 0;

    const loop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      setTick((prev) => prev + delta);

      // Autonomous Walker Logic
      if (mode === 'walker' && !stuntActive) {
        if (!isPausedAtTurn) {
          setWalkX((prevX) => {
            const speed = 36 * walkDir; // 36 px/sec walking speed
            const nextX = prevX + speed * delta;

            // Trigger subtle paper footsteps
            footstepCooldown += delta;
            if (footstepCooldown > 0.38) {
              footstepCooldown = 0;
              playFootstep();
            }

            // Boundary checks
            if (walkDir === 1 && nextX >= railWidth) {
              setIsPausedAtTurn(true);
              setTimeout(() => {
                setWalkDir(-1);
                setIsPausedAtTurn(false);
              }, 1200);
              return railWidth;
            } else if (walkDir === -1 && nextX <= 0) {
              setIsPausedAtTurn(true);
              setTimeout(() => {
                setWalkDir(1);
                setIsPausedAtTurn(false);
              }, 1200);
              return 0;
            }
            return nextX;
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, mode, walkDir, isPausedAtTurn, railWidth, stuntActive, playFootstep]);

  // Cursor Gaze Tracking for Percher / Observer
  useEffect(() => {
    if (mode !== 'percher' && mode !== 'peeker') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < 260) {
        setIsCursorNear(true);
        if (mode === 'peeker' && dist < 110) {
          setPeekDuck(true);
        } else {
          setPeekDuck(false);
        }
        // Angle to cursor
        const angleRad = Math.atan2(dy, dx);
        const deg = (angleRad * 180) / Math.PI;
        // Clamp to natural neck range [-35, 35]
        const clamped = Math.max(-35, Math.min(35, deg - 90));
        setGazeAngle(clamped);
      } else {
        setIsCursorNear(false);
        setPeekDuck(false);
        setGazeAngle(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode]);

  // Interactive Click Stunt: Acrobatic Backflip / Pop
  const handleStuntClick = useCallback(() => {
    if (!interactive || stuntActive) return;

    setStuntActive(true);
    if (mode === 'sweeper') {
      playBroomSweep();
    } else if (mode === 'pusher') {
      playPushStrain();
    } else {
      playJointPop();
    }
    onAction?.();

    // Stunt animation sequence: squat -> jump & flip -> land -> bow & wave
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      setStuntProgress(frame / totalFrames);
      if (frame >= totalFrames) {
        clearInterval(interval);
        setStuntActive(false);
        setStuntProgress(0);
        setCurrentPose('wave');
        setTimeout(() => {
          setCurrentPose(mode === 'pusher' ? 'push' : mode === 'sweeper' ? 'sweep' : 'stand');
        }, 1200);
      }
    }, 28);
  }, [interactive, stuntActive, onAction, playJointPop, playBroomSweep, playPushStrain, mode]);

  // Derive pose coordinates and kinematic limb offsets
  const basePoseKey: StickmanPoseKey =
    mode === 'pusher'
      ? 'push'
      : mode === 'sweeper'
      ? 'sweep'
      : mode === 'peeker'
      ? 'stand'
      : mode === 'walker'
      ? isPausedAtTurn
        ? 'wave'
        : 'stand'
      : isCursorNear
      ? 'wave'
      : 'hang';

  const activePoseKey = stuntActive ? 'overhead' : currentPose !== 'stand' ? currentPose : basePoseKey;
  const rawRig: number[] = [...stickmanTokens.poses[activePoseKey]];

  // Procedural Walking Cycle Kinematics
  if (mode === 'walker' && !isPausedAtTurn && !stuntActive) {
    const walkPhase = tick * 6; // gait frequency
    const stride = Math.sin(walkPhase) * 14;
    const armSwing = Math.cos(walkPhase) * 16;
    const bob = Math.abs(Math.sin(walkPhase)) * 3;

    // Head/torso vertical bounce
    rawRig[1] -= bob;
    rawRig[3] -= bob;

    // Legs striding
    rawRig[14] = -13 - stride;
    rawRig[15] = Math.max(0, -Math.sin(walkPhase) * 4);
    rawRig[18] = 13 + stride;
    rawRig[19] = Math.max(0, Math.sin(walkPhase) * 4);

    // Arms swinging in opposition
    rawRig[6] = -12 + armSwing;
    rawRig[10] = 12 - armSwing;
  }

  // Dangling feet pendulum sway for Percher
  if (mode === 'percher' && !stuntActive) {
    const sway1 = Math.sin(tick * 3.5) * 6;
    const sway2 = Math.cos(tick * 3.5) * 6;
    rawRig[14] += sway1;
    rawRig[18] += sway2;
  }

  // Sweeper broom sweep motion
  if (mode === 'sweeper' && !stuntActive) {
    const sweepPhase = Math.sin(tick * 4.5);
    rawRig[6] += sweepPhase * 10;
    rawRig[10] += sweepPhase * 10;
  }

  // Straining effort vibration for Pusher
  const isPusherEffort = mode === 'pusher';
  if (isPusherEffort && !stuntActive) {
    const strainJitter = Math.sin(tick * 45) * 1.5;
    rawRig[0] += strainJitter;
    rawRig[2] += strainJitter;
  }

  const v = rawRig;
  const capeColor = stickmanTokens.colors.cape;
  const strokeColor = accentColor || 'currentColor';
  const flutter = Math.sin(tick * 9) * 3;

  // Stunt Transform (Backflip rotation and parabolic arc)
  const stuntY = stuntActive ? -Math.sin(stuntProgress * Math.PI) * 42 : 0;
  const stuntRotation = stuntActive ? stuntProgress * 360 : 0;

  // Peeker Duck offset
  const peekerY = mode === 'peeker' ? (peekDuck ? 28 : Math.sin(tick * 2) * 3) : 0;

  // Cape path
  const capePath = `M${v[0]} ${v[1] + 1}C${v[0] - 12} ${v[1] + 4} ${v[0] - 25} ${v[1] + 6 + flutter} ${v[0] - 36} ${
    v[1] + 14 + flutter
  }L${v[0] - 26} ${v[1] + 18 + flutter}Q${v[0] - 24} ${v[1] + 25} ${v[0] - 20} ${v[1] + 23}Q${v[0] - 9} ${
    v[1] + 18
  } ${v[0]} ${v[1] + 1}Z`;

  // Spine & Limbs
  const spinePath = `M${v[0]} ${v[1] - 5}Q${v[0] + 3} ${v[1] + 11} ${v[2]} ${v[3]}`;
  const armsPath = bentLimb(v[0], v[1], v[4], v[5], v[6], v[7]) + bentLimb(v[0], v[1], v[8], v[9], v[10], v[11]);
  const legsPath =
    bentLimb(v[2], v[3], v[12], v[13], v[14], v[15]) +
    'q-3-2-7 0q-2 2 7 2' +
    bentLimb(v[2], v[3], v[16], v[17], v[18], v[19]) +
    'q4-2 7 1q1 2-7 1';

  // Facial expressions
  const isEffort = isPusherEffort || activePoseKey === 'push';
  const mouthPath = isEffort
    ? 'M-5 -60q5 -5 10 0'
    : activePoseKey === 'wave' || isCursorNear
    ? 'M-5 -62q5 7 11 -1'
    : 'M-4 -61q4 3 8 0';

  const eyesPath = isEffort ? 'M-7 -70l4 2-4 2m14-4-4 2 4 2' : 'M-5 -69v1m9 -1v1';
  const browsPath = isEffort ? 'M-8 -74l5 2m6 0 5-2' : '';

  // Container styling depending on mode
  const containerStyle: React.CSSProperties = {
    transform:
      mode === 'walker'
        ? `translate3d(${walkX}px, ${stuntY}px, 0) scaleX(${walkDir}) rotate(${stuntRotation}deg)`
        : `translate3d(0, ${stuntY + peekerY}px, 0) rotate(${stuntRotation}deg)`,
    transition: stuntActive ? 'none' : 'transform 0.15s ease-out',
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onClick={handleStuntClick}
      className={`inline-flex items-center gap-2 select-none ${
        interactive ? 'cursor-pointer hover:brightness-110 active:scale-95 transition-all' : ''
      } ${className}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={caption || (stuntActive ? 'Acrobatic Stunt!' : 'Click me for a playful paper trick!')}
    >
      <svg
        width={size}
        height={size}
        viewBox="-45 -95 90 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible drop-shadow-sm"
        aria-hidden="true"
      >
        {/* Origami Red Washi Cape with Flutter Physics */}
        <path d={capePath} fill={capeColor} />

        {/* Worker Spine & Articulated Limbs */}
        <g stroke={strokeColor} strokeWidth={stickmanTokens.strokeWidth.body} strokeLinecap="round" strokeLinejoin="round">
          <path d={spinePath} />
          <path d={armsPath} />
          <path d={legsPath} />
        </g>

        {/* Tactile Palms */}
        <g fill="#18181c" stroke={strokeColor} strokeWidth="1.5">
          <circle cx={v[6]} cy={v[7]} r="2.3" />
          {activePoseKey !== 'wave' && !isCursorNear && <circle cx={v[10]} cy={v[11]} r="2.3" />}
        </g>

        {/* Waving Glove (if waving or greeting cursor) */}
        {(activePoseKey === 'wave' || isCursorNear) && (
          <g transform={`translate(${v[10]} ${v[11]}) scale(0.68)`} fill={strokeColor} strokeWidth="1.2">
            <path d="M-3 2V-6L1-11V-18Q1-21 4-20Q7-19 6-15L5-10H12Q15-10 14-6L12 1Q12 3 9 3H1Z" />
          </g>
        )}

        {/* Head and Expressive Comic Face with Dynamic Gaze Tracking */}
        <g transform={`translate(${v[0]} ${v[1] + 50}) rotate(${gazeAngle} 0 -66)`}>
          <ellipse cy="-66" rx="12" ry="11.5" fill="#18181c" />
          <path d={mouthPath} stroke={stickmanTokens.colors.inkLight} strokeWidth={stickmanTokens.strokeWidth.prop} strokeLinecap="round" />
          <path d={eyesPath} stroke={stickmanTokens.colors.inkLight} strokeWidth={stickmanTokens.strokeWidth.eyes} strokeLinecap="round" />
          {browsPath && <path d={browsPath} stroke={stickmanTokens.colors.inkLight} strokeWidth={stickmanTokens.strokeWidth.expression} strokeLinecap="round" />}
        </g>

        {/* Effort / Sweat Drops during Straining */}
        {isEffort && (
          <path
            d={`M${v[0] - 18} ${v[1] - 22}q-5-4-4 1q2 3 4-1m2 9q-6-1-4 3q3 1 4-3`}
            stroke={stickmanTokens.colors.effortWater}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )}

        {/* Sweeper Golden Broom Tool & Little Paper Confetti Scraps */}
        {mode === 'sweeper' && (
          <g>
            {/* Wooden Broom Handle & Bristles */}
            <g stroke="#d4af37" strokeWidth="2.0" strokeLinecap="round">
              <line x1={v[6] - 12} y1={v[7] - 28} x2={v[6] + 18} y2={v[7] + 20} />
              <path d={`M${v[6] + 14} ${v[7] + 20}h15l4 5h-23Z`} fill="#eab308" />
            </g>
            {/* Paper Confetti Scraps being swept */}
            <g fill="#f59e0b" opacity="0.8">
              <circle cx={v[6] + 34} cy={v[7] + 24} r="2.2" />
              <rect x={v[6] + 26} y={v[7] + 22} width="3.5" height="3" transform="rotate(25)" />
              <polygon points={`${v[6] + 40},${v[7] + 20} ${v[6] + 43},${v[7] + 24} ${v[6] + 38},${v[7] + 25}`} />
            </g>
          </g>
        )}

        {/* Pusher Target Contact Indicator */}
        {mode === 'pusher' && (
          <circle cx={v[6] + 14} cy={v[7] + 2} r="4" fill="#f59e0b" opacity="0.3" className="animate-ping" />
        )}
      </svg>

      {caption && (
        <span className="text-xs font-mono font-medium text-stone-600 dark:text-stone-300">
          {caption}
        </span>
      )}
    </div>
  );
};
