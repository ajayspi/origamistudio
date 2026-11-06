/**
 * ORIGAMISTUDIO DESIGN SYSTEM TOKENS
 * 
 * Single source of truth for Brand, Product Design, 3D Kinematics,
 * and Shorts / AI Creative Generation.
 * 
 * Follows 3-Tier Architecture:
 * 1. Global (Raw decisions)
 * 2. Semantic (Contextual & theme-aware decisions)
 * 3. Component & Creative (Component-specific & Shorts/AI pipeline specs)
 */

export const globalTokens = {
  color: {
    stone: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },
    craft: {
      daylight: '#faf8f5',
      parchment: '#f4f0ea',
      sandstone: '#e8e4dc',
      warmWhite: '#ffffff',
    },
    deepSpace: {
      void: '#05060b',
      surface: '#0a0c16',
      elevated: '#101322',
      border: '#1e2438',
    },
    vermillion: {
      500: '#e04822',
      400: '#ff5e36',
      600: '#c23817',
    },
    emerald: {
      500: '#059669',
      400: '#10b981',
      600: '#047857',
    },
    cyan: {
      500: '#0891b2',
      400: '#06b6d4',
      600: '#0e7490',
    },
    amber: {
      500: '#d97706',
      400: '#f59e0b',
      600: '#b45309',
    },
    violet: {
      500: '#7c3aed',
      400: '#8b5cf6',
      600: '#6d28d9',
    },
    rose: {
      500: '#e11d48',
      400: '#f43f5e',
      600: '#be123c',
    },
  },
  typography: {
    fontFamilies: {
      brandDisplay: "'Cinzel', Georgia, serif",
      bodyInterface: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      technicalCode: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: '1.15',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    11: '44px', // WCAG AAA minimum mobile touch target
    12: '48px', // Preferred smartboard touch target
    14: '56px', // Classroom thumb/cockpit target
    16: '64px',
    20: '80px',
    24: '96px',
  },
  radii: {
    none: '0px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    '2xl': '28px',
    full: '9999px',
  },
  shadows: {
    flat: 'none',
    subtle: '0 2px 8px -2px rgba(0, 0, 0, 0.06)',
    card: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    elevated: '0 20px 35px -10px rgba(0, 0, 0, 0.12), 0 10px 15px -5px rgba(0, 0, 0, 0.06)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glowCyan: '0 0 25px -5px rgba(6, 182, 212, 0.4)',
    glowEmerald: '0 0 25px -5px rgba(16, 185, 129, 0.4)',
    glowVermillion: '0 0 25px -5px rgba(255, 94, 54, 0.35)',
  },
  motion: {
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '350ms',
      slow: '600ms',
      turnover: '1200ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      springDamped: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
} as const;

export const semanticTokens = {
  theme: {
    daylight: {
      surface: {
        page: globalTokens.color.craft.daylight,
        canvas: globalTokens.color.craft.daylight,
        surface: globalTokens.color.craft.warmWhite,
        elevated: globalTokens.color.craft.parchment,
        plinth3d: globalTokens.color.craft.sandstone,
      },
      text: {
        primary: globalTokens.color.stone[900],
        secondary: globalTokens.color.stone[700],
        muted: globalTokens.color.stone[500],
        inverse: '#ffffff',
      },
      border: {
        card: globalTokens.color.stone[200],
        subtle: 'rgba(0, 0, 0, 0.08)',
        prominent: 'rgba(0, 0, 0, 0.16)',
      },
      brand: {
        primary: globalTokens.color.emerald[500],
        accent: globalTokens.color.vermillion[500],
        gold: globalTokens.color.amber[500],
        info: globalTokens.color.cyan[500],
      },
    },
    dark: {
      surface: {
        page: globalTokens.color.stone[950],
        canvas: globalTokens.color.deepSpace.void,
        surface: globalTokens.color.deepSpace.surface,
        elevated: globalTokens.color.deepSpace.elevated,
        plinth3d: '#181b2a',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        muted: '#94a3b8',
        inverse: globalTokens.color.stone[900],
      },
      border: {
        card: globalTokens.color.stone[800],
        subtle: 'rgba(255, 255, 255, 0.07)',
        prominent: 'rgba(255, 255, 255, 0.16)',
      },
      brand: {
        primary: globalTokens.color.cyan[400],
        accent: globalTokens.color.vermillion[400],
        gold: globalTokens.color.amber[400],
        info: globalTokens.color.cyan[400],
      },
    },
  },
  origamiSemantics: {
    creaseMountain: {
      stroke: globalTokens.color.rose[500],
      dashArray: '8,4,2,4',
      label: 'Mountain Fold (Point Up)',
      symbol: '- ·· - ·· -',
    },
    creaseValley: {
      stroke: globalTokens.color.cyan[500],
      dashArray: '6,4',
      label: 'Valley Fold (Valley Down)',
      symbol: '- - - - -',
    },
    creaseFoldedSeam: {
      stroke: globalTokens.color.emerald[500],
      dashArray: 'none',
      label: 'Folded & Creased Seam',
      symbol: '——————',
    },
    paperMaterials: {
      frontFace: '#f43f5e',   // Kami Carmine Red Front
      backFace: '#f8fafc',    // Pure White Back
      daylightRoughness: 0.92,
      daylightMetalness: 0.0,
      projectorAmbientBoost: 1.25,
      zenithTrajectoryArcHeight: 0.85,
    },
  },
  touch: {
    minMobileTarget: globalTokens.spacing[11],      // 44px (WCAG AAA)
    smartboardTarget: globalTokens.spacing[12],     // 48px
    classroomCockpitTarget: globalTokens.spacing[14], // 56px
  },
} as const;

export const componentTokens = {
  cockpit: {
    height: globalTokens.spacing[14],
    borderRadius: globalTokens.radii.xl,
    slowFoldBtn: {
      bg: 'bg-emerald-500 hover:bg-emerald-600',
      text: 'text-white font-bold',
      shadow: globalTokens.shadows.glowEmerald,
    },
    flipBtn: {
      bg: 'bg-amber-500 hover:bg-amber-600',
      text: 'text-white font-bold',
      shadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
    },
    speechBtn: {
      bg: 'bg-cyan-500 hover:bg-cyan-600',
      text: 'text-white font-bold',
      shadow: globalTokens.shadows.glowCyan,
    },
  },
  guidanceCards: {
    beforeState: {
      border: 'border-cyan-500/40',
      headerBg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      glow: globalTokens.shadows.glowCyan,
    },
    afterState: {
      border: 'border-emerald-500/40',
      headerBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      glow: globalTokens.shadows.glowEmerald,
    },
  },
  diplomaParchment: {
    bg: '#fdfbf7',
    border: '4px double #d97706',
    goldSealShadow: '0 8px 24px rgba(217, 119, 6, 0.25)',
    fontFamily: globalTokens.typography.fontFamilies.brandDisplay,
  },
} as const;

/**
 * SHORTS & AI CREATIVE TOKENS
 * 
 * Standardized decisions for vertical short-form video (YouTube Shorts,
 * Instagram Reels, TikTok) and AI Prompt conditioning.
 */
export const creativeTokens = {
  shortsVideo: {
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    frameRate: 60,
    safeZones: {
      topMargin: 180,      // Below platform header & camera notch
      bottomMargin: 320,   // Above platform description, audio pill, & comment icons
      leftMargin: 64,
      rightMargin: 128,    // Clear right-side like/comment/share rail
    },
    overlays: {
      stepBadge: {
        font: globalTokens.typography.fontFamilies.brandDisplay,
        fontSize: '44px',
        color: '#ffffff',
        background: 'rgba(28, 25, 23, 0.85)',
        backdropBlur: '12px',
        borderRadius: '24px',
        padding: '16px 32px',
      },
      animatedSubtitle: {
        font: globalTokens.typography.fontFamilies.bodyInterface,
        fontSize: '40px',
        fontWeight: '800',
        color: '#facc15', // Bright yellow for quick scan
        stroke: '3px #0c0a09',
        animation: 'popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      watermark: {
        brandName: 'OrigamiStudio™ 3D Lab',
        logoPosition: 'top-left',
        opacity: 0.9,
      },
    },
  },
  aiPromptConditioning: {
    brandStyleKeywords: [
      'precision Japanese origami',
      'authentic crisp folds',
      'zero-cut papercraft art',
      'soft daylight studio illumination',
      'tactile paper fiber texture',
      'sandstone exhibition plinth',
      'cinematic depth of field',
      'clean minimalist aesthetic',
      'macro 8k photography style',
    ],
    negativePromptKeywords: [
      'scissors',
      'torn edges',
      'cuts',
      'glue',
      'crumpled paper',
      'distorted hands',
      'blurry folds',
      'low quality',
      'dark muddy lighting',
    ],
    hexPaletteDirectives: {
      primaryAccent: '#e04822',
      paperFront: '#f43f5e',
      paperBack: '#ffffff',
      plinth: '#e8e4dc',
      backgroundDaylight: '#faf8f5',
    },
  },
} as const;

/**
 * HFI BEHAVIORAL & TACTILE MATERIALITY TOKENS
 * 
 * Implements Elephant & Goldfish model, Fitts's Law, Von Restorff effect,
 * and Neumorphism-lite physical button states.
 */
export const tactileTokens = {
  colors: {
    paperBase: '#faf8f5',
    paperShadow: 'rgba(0, 0, 0, 0.08)',
    deskCraftWood: '#f4f0ea',
    accentAmber: '#d4af37',
    safeCyan: '#0891b2',
    successEmerald: '#059669',
  },
  shadows: {
    tactileRest: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    tactileHover: '0 10px 22px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
    tactilePressed: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.16)',
    glowAmberVonRestorff: '0 8px 24px -4px rgba(212, 175, 55, 0.38)',
  },
  touch: {
    fittsLawMinTarget: '44px',
    smartboardPreferredTarget: '48px',
    cockpitTarget: '56px',
  },
  buttonStates: {
    default: {
      transform: 'scale(1)',
      shadow: 'var(--shadow-tactile-rest)',
      opacity: 1.0,
      cursor: 'pointer',
    },
    hover: {
      transform: 'scale(1.02) translateY(-2px)',
      shadow: 'var(--shadow-tactile-hover)',
      opacity: 1.0,
      cursor: 'pointer',
    },
    pressed: {
      transform: 'scale(0.97) translateY(1px)',
      shadow: 'var(--shadow-tactile-pressed)',
      opacity: 0.95,
      cursor: 'pointer',
    },
    focused: {
      outline: '2px solid var(--text-primary)',
      outlineOffset: '2px',
      shadow: '0 0 0 3px var(--accent-gold)',
    },
    disabled: {
      transform: 'none',
      shadow: 'none',
      opacity: 0.35,
      cursor: 'not-allowed',
      pointerEvents: 'none' as const,
    },
  },
  hfiPetTriggers: {
    trustErrorPrevention: {
      undoButtonLabel: '↺ Undo Fold (Safe)',
      safeSandboxBanner: '🛡️ Safe Folding Sandbox: You can never tear paper in 3D!',
      omnipresentUndo: true,
    },
    consensusSocialProof: {
      starRating: '★ 4.9',
      studentCountPrefix: '👥 Folded by',
      studentCountSuffix: 'students',
    },
    endowedProgress: {
      starterMomentumPct: 18,
      rankTitleMap: [
        'White Belt (Starter Momentum)',
        'Yellow Belt (Active Creaser)',
        'Green Belt (Flap Specialist)',
        'Brown Belt (Sculpture Architect)',
        'Master Gold Belt (100% Certified)',
      ],
    },
    vonRestorffIsolation: {
      primaryAccentGradient: 'linear-gradient(to right, #d4af37, #b38927)',
      primaryAccentHoverGradient: 'linear-gradient(to right, #dfba48, #be9332)',
      textColor: '#0c0a09',
      isolationContrastRatio: '9.8:1',
    },
  },
} as const;

/**
 * STICKMAN HELPER SYSTEM DESIGN TOKENS
 *
 * Articulated vector character rig for guiding children through origami steps,
 * challenging folds, file delivery, camera resets, and workspace cleanup.
 */
export const stickmanTokens = {
  colors: {
    cape: '#ff565d',
    inkDark: '#18181c',
    inkLight: '#eeeeef',
    effortWater: '#38bdf8',
    accentRope: '#d4af37',
  },
  strokeWidth: {
    body: 2.2,
    prop: 1.6,
    eyes: 1.7,
    expression: 1.3,
  },
  poses: {
    stand: [0, -50, 0, -26, -12, -37, -12, -25, 12, -37, 12, -25, -7, -12, -13, 0, 7, -12, 13, 0],
    push: [12, -44, 19, -23, 28, -43, 39, -43, 28, -31, 39, -34, 3, -13, -13, 0, 25, -10, 35, 0],
    haul: [14, -43, 20, -24, -3, -37, -28, -48, 1, -29, -27, -45, 1, -13, -18, 0, 25, -12, 35, 0],
    reach: [0, -50, 0, -26, -16, -62, -16, -79, 16, -62, 16, -79, -9, -13, -17, 0, 9, -13, 17, 0],
    hang: [0, -50, 0, -26, -8, -65, 0, -82, 8, -65, 0, -82, -5, -11, -9, 4, 13, -17, 22, -6],
    sweep: [7, -44, 13, -23, 22, -37, 33, -24, 25, -28, 39, -15, 1, -12, -9, 0, 20, -12, 30, 0],
    kick: [5, -49, 4, -26, -6, -36, -9, -23, 15, -35, 20, -23, -7, -12, -15, 0, 19, -21, 38, -17],
    flat: [28, -8, 5, -5, 17, -2, 35, 0, 23, -14, 35, -19, -8, -5, -20, 0, -7, -1, -23, 0],
    wave: [0, -50, 0, -26, -12, -37, -12, -25, 17, -43, 19, -61, -7, -12, -13, 0, 7, -12, 13, 0],
    toggleContact: [6, -46, -6, -25, 25, -43, 45, -39, 25, -28, 45, -27, -20, -13, -35, 0, 12, -15, 16, 0],
    toggleBrace: [20, -39, -8, -24, 32, -40, 45, -39, 28, -29, 45, -27, -21.5, -12, -35, 0, 16, -16, 16, 0],
    windup: [18, -49, 6, -25, 35, -59, 42, -72, 2, -37, -10, -29, -7, -13, -22, 0, 19, -12, 26, 0],
    overhead: [2, -56, 1, -27, 14, -76, -8, -89, -7, -39, -15, -30, -13, -14, -25, 0, 16, -13, 27, 0],
    release: [-12, -53, -5, -27, -31, -65, -46, -74, -10, -36, -4, -26, -19, -13, -28, 0, 13, -15, 27, 0],
    follow: [-20, -43, -7, -25, -39, -42, -54, -32, -12, -30, 0, -25, -20, -12, -28, 0, 11, -14, 27, -3],
    cast: [-7, -51, 1, -27, -19, -55, -32, -72, 4, -43, -16, -59, -10, -12, -21, 0, 11, -13, 23, 0],
    spent: [-5, -38, 2, -22, -14, -24, -17, -13, 9, -24, 14, -13, -5, -10, -13, 0, 12, -10, 20, 0],
  },
  missions: {
    downloadGuide: {
      title: 'Hook & Retrieve Download Helper',
      description: 'Throws a grapple hook to rescue and reel in printable PDF guides and crease patterns.',
      defaultCaption: 'One more tug! Here comes your origami crease guide.',
    },
    foldCoach: {
      title: 'Stubborn Fold Coach',
      description: 'Pushes stuck fold steps and helps children collapse tricky origami bases.',
      defaultCaption: 'Just… a little… push! You got this!',
    },
    deskCleaner: {
      title: 'Tidy Desk Sweeper',
      description: 'Sweeps away paper scraps and resets the workbench or crease lines cleanly.',
      defaultCaption: 'All tidy! Ready for your next fold.',
    },
    cameraDizzy: {
      title: 'Orbit & Refresh Spinner',
      description: 'Re-centers the 3D camera viewpoint with playful spinning momentum.',
      defaultCaption: 'Whoa, that was fast! Camera re-centered.',
    },
    secretHint: {
      title: 'Curtain Peek Hint Guide',
      description: 'Draws back the washi curtain to reveal hidden teacher tips or the next fold clue.',
      defaultCaption: 'Psst! Here is how the flap folds together.',
    },
  },
} as const;

export type GlobalTokens = typeof globalTokens;
export type SemanticTokens = typeof semanticTokens;
export type ComponentTokens = typeof componentTokens;
export type CreativeTokens = typeof creativeTokens;
export type TactileTokens = typeof tactileTokens;
export type StickmanTokens = typeof stickmanTokens;
export type StickmanPoseKey = keyof typeof stickmanTokens.poses;
