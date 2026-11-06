import React, { useEffect, useState } from 'react';
import { stickmanTokens, type StickmanPoseKey } from '../tokens';

export interface StickmanHelperProps {
  role?: 'download' | 'push' | 'wave' | 'sweep' | 'hang' | 'flat' | 'spent';
  caption?: string;
  size?: number;
  className?: string;
  interactive?: boolean;
  onAction?: () => void;
  accentColor?: string;
}

// Procedural bent limb quadratic curve matching stickman kinematics
function bentLimb(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const before = [lerp(bx, ax, 0.15), lerp(by, ay, 0.15)];
  const after = [lerp(bx, cx, 0.15), lerp(by, cy, 0.15)];
  return `M${ax} ${ay}L${before[0]} ${before[1]}Q${bx} ${by} ${after[0]} ${after[1]}L${cx} ${cy}`;
}

export const StickmanHelper: React.FC<StickmanHelperProps> = ({
  role = 'wave',
  caption,
  size = 64,
  className = '',
  interactive = false,
  onAction,
  accentColor
}) => {
  const [currentPose, setCurrentPose] = useState<StickmanPoseKey>(
    role === 'download' ? 'haul' : role === 'push' ? 'push' : role === 'sweep' ? 'sweep' : role === 'hang' ? 'hang' : 'wave'
  );
  const [animating, setAnimating] = useState(false);
  const [tick, setTick] = useState(0);

  // Subtle breathing / cape flutter
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      setTick(elapsed);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const poseData = stickmanTokens.poses[currentPose] || stickmanTokens.poses.stand;
  const v = poseData;
  const capeColor = stickmanTokens.colors.cape;
  const strokeColor = accentColor || 'currentColor';

  const flutter = Math.sin(tick * 7) * 2.5;
  const effort = currentPose === 'push' || currentPose === 'haul' || currentPose === 'toggleBrace';

  // Cape path computation
  const capePath = `M${v[0]} ${v[1] + 1}C${v[0] - 12} ${v[1] + 4} ${v[0] - 24} ${v[1] + 6 + flutter} ${v[0] - 34} ${v[1] + 14 + flutter}L${v[0] - 25} ${v[1] + 18 + flutter}Q${v[0] - 23} ${v[1] + 25} ${v[0] - 19} ${v[1] + 23}Q${v[0] - 8} ${v[1] + 18} ${v[0]} ${v[1] + 1}Z`;

  // Spine & Limbs
  const spinePath = `M${v[0]} ${v[1] - 5}Q${v[0] + 3} ${v[1] + 11} ${v[2]} ${v[3]}`;
  const armsPath = bentLimb(v[0], v[1], v[4], v[5], v[6], v[7]) + bentLimb(v[0], v[1], v[8], v[9], v[10], v[11]);
  const legsPath =
    bentLimb(v[2], v[3], v[12], v[13], v[14], v[15]) +
    'q-3-2-7 0q-2 2 7 2' +
    bentLimb(v[2], v[3], v[16], v[17], v[18], v[19]) +
    'q4-2 7 1q1 2-7 1';

  // Comic facial expressions
  const mouthPath = effort
    ? 'M-5 -60q5 -5 10 0'
    : currentPose === 'spent'
    ? 'M-5 -59q4 -2 9 0'
    : currentPose === 'wave'
    ? 'M-5 -62q5 7 11 -1'
    : 'M-4 -61q4 3 8 0';

  const eyesPath = effort ? 'M-7 -70l4 2-4 2m14-4-4 2 4 2' : 'M-5 -69v1m9 -1v1';
  const browsPath = effort ? 'M-8 -74l5 2m6 0 5-2' : '';

  const handleClick = () => {
    if (interactive && !animating) {
      setAnimating(true);
      if (role === 'download') {
        setCurrentPose('windup');
        setTimeout(() => setCurrentPose('overhead'), 250);
        setTimeout(() => setCurrentPose('release'), 500);
        setTimeout(() => setCurrentPose('haul'), 800);
        setTimeout(() => {
          setCurrentPose('wave');
          setAnimating(false);
          onAction?.();
        }, 1600);
      } else if (role === 'push') {
        setCurrentPose('toggleContact');
        setTimeout(() => setCurrentPose('toggleBrace'), 300);
        setTimeout(() => setCurrentPose('push'), 700);
        setTimeout(() => {
          setCurrentPose('wave');
          setAnimating(false);
          onAction?.();
        }, 1400);
      } else {
        setCurrentPose('wave');
        setTimeout(() => setAnimating(false), 800);
        onAction?.();
      }
    } else {
      onAction?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center gap-2 select-none ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''} ${className}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={caption || (stickmanTokens.missions[role === 'download' ? 'downloadGuide' : role === 'push' ? 'foldCoach' : 'secretHint']?.title)}
    >
      <svg
        width={size}
        height={size}
        viewBox="-45 -95 90 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-hidden="true"
      >
        {/* Origami Red Washi Cape */}
        <path d={capePath} fill={capeColor} />

        {/* Worker Spine & Limbs */}
        <g stroke={strokeColor} strokeWidth={stickmanTokens.strokeWidth.body} strokeLinecap="round" strokeLinejoin="round">
          <path d={spinePath} />
          <path d={armsPath} />
          <path d={legsPath} />
        </g>

        {/* Palms */}
        <g fill="#18181c" stroke={strokeColor} strokeWidth="1.5">
          <circle cx={v[6]} cy={v[7]} r="2.3" />
          {currentPose !== 'wave' && <circle cx={v[10]} cy={v[11]} r="2.3" />}
        </g>

        {/* Waving Hand (if wave pose) */}
        {currentPose === 'wave' && (
          <g transform={`translate(${v[10]} ${v[11]}) scale(0.65)`} fill={strokeColor} strokeWidth="1.2">
            <path d="M-3 2V-6L1-11V-18Q1-21 4-20Q7-19 6-15L5-10H12Q15-10 14-6L12 1Q12 3 9 3H1Z" />
          </g>
        )}

        {/* Head and Expressive Comic Face */}
        <g transform={`translate(${v[0]} ${v[1] + 50})`}>
          <ellipse cy="-66" rx="12" ry="11.5" fill="#18181c" />
          <path d={mouthPath} stroke={stickmanTokens.colors.inkLight} strokeWidth={stickmanTokens.strokeWidth.prop} strokeLinecap="round" />
          <path d={eyesPath} stroke={stickmanTokens.colors.inkLight} strokeWidth={stickmanTokens.strokeWidth.eyes} strokeLinecap="round" />
          {browsPath && <path d={browsPath} stroke={stickmanTokens.colors.inkLight} strokeWidth={stickmanTokens.strokeWidth.expression} strokeLinecap="round" />}
        </g>

        {/* Straining Sweat / Effort Marks */}
        {effort && (
          <path
            d={`M${v[0] - 18} ${v[1] - 22}q-5-4-4 1q2 3 4-1m2 9q-6-1-4 3q3 1 4-3`}
            stroke={stickmanTokens.colors.effortWater}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        )}

        {/* Grappling Hook Tool (if download helper) */}
        {role === 'download' && currentPose !== 'wave' && (
          <g transform={`translate(${v[6] - 4} ${v[7] - 2}) rotate(-25) scale(0.6)`} stroke={stickmanTokens.colors.accentRope} strokeWidth="2" strokeLinecap="round">
            <line x1="0" y1="0" x2="0" y2="18" />
            <path d="M0 18Q0 26 12 26T24 14V10l-4 5" />
          </g>
        )}

        {/* Broom Tool (if sweep helper) */}
        {role === 'sweep' && (
          <g stroke={stickmanTokens.colors.accentRope} strokeWidth="1.8" strokeLinecap="round">
            <line x1={v[6] - 10} y1={v[7] - 25} x2={v[6] + 20} y2={v[7] + 22} />
            <path d={`M${v[6] + 16} ${v[7] + 22}h14l4 4h-22Z`} fill="#d4af37" />
          </g>
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
