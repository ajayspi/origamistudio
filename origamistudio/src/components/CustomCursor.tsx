import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for silky-smooth 60fps tracking
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Slower trail spring for paper airplane physics
  const trailConfig = { damping: 32, stiffness: 220, mass: 0.8 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    // Disable on touch screens or mobile
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, [role="button"], .cursor-pointer, [data-cursor]');
      if (interactive) {
        setIsHovered(true);
        const customText = interactive.getAttribute('data-cursor-text');
        setCursorText(customText || null);
      } else {
        setIsHovered(false);
        setCursorText(null);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Outer Soft Trail Halo */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 2.2 : isClicked ? 0.7 : 1,
          opacity: isHovered ? 0.45 : 0.25,
        }}
        transition={{ duration: 0.2 }}
        className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 blur-sm mix-blend-screen"
      />

      {/* Main Interactive Cursor (Folded Paper Plane / Glowing Pointer) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.4 : isClicked ? 0.85 : 1,
          rotate: isHovered ? 45 : 0,
        }}
        transition={{ duration: 0.18 }}
        className="relative flex items-center justify-center"
      >
        {isHovered ? (
          // Hover State: Glowing Magnetic Ring with Sparkle
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/80 bg-amber-500/20 backdrop-blur-xs flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-[10px] text-amber-500 dark:text-amber-300 font-bold">✨</span>
            </div>
            {cursorText && (
              <span className="absolute -top-7 px-2 py-0.5 rounded-full bg-stone-900/90 text-white dark:bg-white dark:text-stone-900 text-[10px] font-mono font-bold whitespace-nowrap shadow-md">
                {cursorText}
              </span>
            )}
          </div>
        ) : (
          // Default State: Miniature Origami Paper Plane
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-md text-amber-500 dark:text-amber-400 -rotate-12 transition-transform duration-75"
          >
            {/* Paper Plane Silhouette */}
            <path
              d="M3 3L21 11L13 14L10 21L3 3Z"
              fill="currentColor"
              fillOpacity="0.88"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Mountain Crease Fold */}
            <path
              d="M3 3L13 14"
              stroke="rgba(0, 0, 0, 0.35)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </motion.div>
    </div>
  );
};
