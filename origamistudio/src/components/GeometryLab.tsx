import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const GeometryLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kawasaki' | 'maekawa' | 'miura' | 'axioms'>('kawasaki');

  // Kawasaki state: user controls angle theta1
  const [theta1, setTheta1] = useState<number>(65);
  const [theta2, setTheta2] = useState<number>(115);
  // Enforce Kawasaki condition: theta1 + theta3 = 180, theta2 + theta4 = 180
  const theta3 = 180 - theta1;
  const theta4 = 180 - theta2;
  const sumOdd = theta1 + theta3;
  const sumEven = theta2 + theta4;

  // Maekawa state: Mountain / Valley parity
  const [creaseTypes, setCreaseTypes] = useState<('M' | 'V')[]>(['M', 'M', 'M', 'V']);
  const countM = creaseTypes.filter((c) => c === 'M').length;
  const countV = creaseTypes.filter((c) => c === 'V').length;
  const parityDelta = Math.abs(countM - countV);
  const isMaekawaValid = parityDelta === 2;

  const toggleCrease = (index: number) => {
    setCreaseTypes((prev) => {
      const next = [...prev];
      next[index] = next[index] === 'M' ? 'V' : 'M';
      return next;
    });
  };

  // Miura-ori deployment state (0.0 to 1.0)
  const [miuraDeployment, setMiuraDeployment] = useState<number>(0.7);

  // 7 Huzita-Justin Axioms
  const [selectedAxiom, setSelectedAxiom] = useState<number>(6);

  const AXIOMS = [
    {
      num: 1,
      title: 'Line Through Two Points',
      formal: 'Given two points p₁ and p₂, fold a straight crease connecting them.',
      kidSummary: 'Connect two dots with a sharp fold line!',
      power: 'Degree 1 (Linear). The foundation for making edges and book folds.'
    },
    {
      num: 2,
      title: 'Point Reflection (Halving Segment)',
      formal: 'Given two points p₁ and p₂, fold p₁ exactly onto p₂.',
      kidSummary: 'Kiss corner to corner to make an exact halfway crease line!',
      power: 'Degree 1 (Linear). Automatically finds the exact middle perpendicular line.'
    },
    {
      num: 3,
      title: 'Line Reflection (Splitting an Angle)',
      formal: 'Given two crease lines l₁ and l₂, fold l₁ squarely onto l₂.',
      kidSummary: 'Fold one edge onto another to cut an angle exactly in half!',
      power: 'Degree 1 (Linear). Automatically creates perfect petal and kite folds.'
    },
    {
      num: 4,
      title: 'Perpendicular Fold Through a Point',
      formal: 'Given point p₁ and line l₁, fold a crease through p₁ at a 90° right angle to l₁.',
      kidSummary: 'Make a perfect 90° square corner through any reference dot!',
      power: 'Degree 1 (Linear). Essential for box corners and origami cubes.'
    },
    {
      num: 5,
      title: 'Point-to-Line Pivot Fold',
      formal: 'Given two points p₁, p₂ and line l₁, fold through p₂ landing p₁ onto l₁.',
      kidSummary: 'Hold one corner still while swinging another corner onto a line!',
      power: 'Degree 2 (Quadratic). Solves circle-line compass geometry with pure paper.'
    },
    {
      num: 6,
      title: 'The Master Cubic Fold (Trisection)',
      formal: 'Given two points p₁, p₂ and two lines l₁, l₂, fold placing p₁ onto l₁ and p₂ onto l₂ together.',
      kidSummary: 'The Impossible Fold! Splits any angle into 3 equal pieces — something a ruler and compass cannot do!',
      power: 'Degree 3 (Cubic Equations!). Solves problems ancient Greeks proved impossible with compass and straightedge!'
    },
    {
      num: 7,
      title: 'Point-to-Line with Fixed Angle',
      formal: 'Given point p and lines l₁, l₂, fold perpendicular to l₂ landing p onto l₁.',
      kidSummary: 'Locks sliding tabs squarely into opposing pockets.',
      power: 'Discovered in 1989/2002. Completes the universal set of all paper folds.'
    }
  ];

  return (
    <section id="geometry-lab" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200 dark:border-white/[0.08] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-800 dark:text-[#38bdf8] mb-3 font-bold">
            <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="tracking-wider uppercase text-[11px]">
              🕵️‍♂️ Origami Math Detective • Hands-On STEAM Lab
            </span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-[0.04em] text-stone-900 dark:text-white">
            The Geometry of <span className="italic text-amber-700 dark:text-[#d4af37]">Flat-Foldability</span>
          </h2>
          <p className="text-stone-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-2.5">
            Origami is an exact science! Test paper mysteries with interactive sliders to discover the universal geometric laws that make paper fold flat without wrinkling.
          </p>
        </div>

        {/* Navigation Selector Tabs (48px Touch Targets) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('kawasaki')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border min-h-[48px] ${
              activeTab === 'kawasaki'
                ? 'bg-[#d4af37] text-stone-950 border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-extrabold'
                : 'bg-stone-100 dark:bg-white/[0.03] border-stone-300 dark:border-white/[0.08] text-stone-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            1. Kawasaki (180° Rule) 📐
          </button>

          <button
            onClick={() => setActiveTab('maekawa')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border min-h-[48px] ${
              activeTab === 'maekawa'
                ? 'bg-[#d4af37] text-stone-950 border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-extrabold'
                : 'bg-stone-100 dark:bg-white/[0.03] border-stone-300 dark:border-white/[0.08] text-stone-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            2. Maekawa (Mountain/Valley) ⛰️
          </button>

          <button
            onClick={() => setActiveTab('miura')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border min-h-[48px] ${
              activeTab === 'miura'
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-600/25 font-extrabold'
                : 'bg-stone-100 dark:bg-white/[0.03] border-stone-300 dark:border-white/[0.08] text-stone-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            3. Space Solar Wings (NASA) 🚀
          </button>

          <button
            onClick={() => setActiveTab('axioms')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border min-h-[48px] ${
              activeTab === 'axioms'
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/25 font-extrabold'
                : 'bg-stone-100 dark:bg-white/[0.03] border-stone-300 dark:border-white/[0.08] text-stone-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            4. 7 Magic Rules (Axioms) ✨
          </button>
        </div>

        {/* Interactive Lab Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#101322] rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-white/[0.12] shadow-2xl transition-colors duration-200"
        >
          {/* TAB 1: KAWASAKI'S THEOREM */}
          {activeTab === 'kawasaki' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual Interactive Diagram */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-black/40 rounded-2xl border border-stone-200 dark:border-white/[0.08] relative">
                <div className="text-xs font-mono font-bold text-amber-800 dark:text-[#d4af37] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mystery #1: Can It Fold Flat in Your Book?</span>
                </div>

                <svg viewBox="-120 -120 240 240" className="w-60 h-60 sm:w-68 sm:h-68">
                  {/* Outer Circular Boundary */}
                  <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-white/20" />
                  
                  {/* Crease rays */}
                  {(() => {
                    const toRad = (deg: number) => (deg * Math.PI) / 180;
                    const a0 = 0;
                    const a1 = toRad(theta1);
                    const a2 = a1 + toRad(theta2);
                    const a3 = a2 + toRad(theta3);

                    const p0 = [Math.cos(a0) * 100, Math.sin(a0) * 100];
                    const p1 = [Math.cos(a1) * 100, Math.sin(a1) * 100];
                    const p2 = [Math.cos(a2) * 100, Math.sin(a2) * 100];
                    const p3 = [Math.cos(a3) * 100, Math.sin(a3) * 100];

                    return (
                      <>
                        <line x1="0" y1="0" x2={p0[0]} y2={p0[1]} stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2={p1[0]} y2={p1[1]} stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2={p2[0]} y2={p2[1]} stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2={p3[0]} y2={p3[1]} stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                      </>
                    );
                  })()}
                </svg>

                {/* Status Pill */}
                <div className="mt-4 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Kawasaki Rule Proven: 180° = 180° (Folds Perfectly Flat!)</span>
                </div>
              </div>

              {/* Controls & Plain-English Kid Explanation */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <h3 className="font-cinzel text-2xl font-bold text-stone-900 dark:text-white">
                    Kawasaki's Theorem (The Magic 180° Rule)
                  </h3>
                  <p className="text-stone-700 dark:text-slate-300 text-sm leading-relaxed mt-2 font-normal">
                    Imagine 4 fold lines meeting in the center of your paper. If you add up every other angle, they <strong className="text-stone-950 dark:text-white">MUST equal exactly 180°</strong>! If they don't, the paper will crumple like an accordion and cannot close flat inside your book.
                  </p>
                </div>

                {/* Mathematical Formula Box */}
                <div className="p-4 bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.08] rounded-2xl font-mono text-xs space-y-2">
                  <div className="text-stone-600 dark:text-slate-400 font-semibold">Yellow Alternating Angles (Odd):</div>
                  <div className="text-base font-bold text-amber-700 dark:text-[#d4af37]">
                    θ₁ ({theta1}°) + θ₃ ({theta3}°) = {sumOdd}° (Straight Line)
                  </div>
                  <div className="text-stone-600 dark:text-slate-400 font-semibold pt-1">Blue Alternating Angles (Even):</div>
                  <div className="text-base font-bold text-cyan-700 dark:text-[#38bdf8]">
                    θ₂ ({theta2}°) + θ₄ ({theta4}°) = {sumEven}° (Straight Line)
                  </div>
                </div>

                {/* Tactile Sliders */}
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-stone-700 dark:text-slate-300 mb-1.5 font-bold">
                      <span>Drag Yellow Angle θ₁</span>
                      <span className="text-amber-700 dark:text-[#d4af37]">{theta1}°</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="150"
                      value={theta1}
                      onChange={(e) => setTheta1(parseInt(e.target.value, 10))}
                      aria-label="Angle theta 1 slider"
                      className="w-full accent-[#d4af37] h-2.5 bg-stone-200 dark:bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-stone-700 dark:text-slate-300 mb-1.5 font-bold">
                      <span>Drag Blue Angle θ₂</span>
                      <span className="text-cyan-700 dark:text-[#38bdf8]">{theta2}°</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="150"
                      value={theta2}
                      onChange={(e) => setTheta2(parseInt(e.target.value, 10))}
                      aria-label="Angle theta 2 slider"
                      className="w-full accent-[#0284c7] h-2.5 bg-stone-200 dark:bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAEKAWA'S THEOREM */}
          {activeTab === 'maekawa' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Interactive Vertex with 4 clickable creases */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-black/40 rounded-2xl border border-stone-200 dark:border-white/[0.08]">
                <div className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 mb-3 uppercase tracking-wider">
                  Tap Any Crease to Flip Mountain ⛰️ ⟷ Valley 🏞️
                </div>

                <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm">
                  {creaseTypes.map((type, i) => (
                    <button
                      key={i}
                      onClick={() => toggleCrease(i)}
                      className={`p-4 rounded-2xl border font-mono text-xs font-bold transition-all cursor-pointer text-center min-h-[52px] ${
                        type === 'M'
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300 shadow-md shadow-rose-500/10'
                          : 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-300 shadow-md shadow-sky-500/10'
                      }`}
                    >
                      <div className="text-lg font-extrabold mb-1">{type === 'M' ? '▲ MOUNTAIN ⛰️' : '▼ VALLEY 🏞️'}</div>
                      <div className="text-[11px] opacity-80">Crease #{i + 1} (Tap to Flip)</div>
                    </button>
                  ))}
                </div>

                <div className={`mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold ${
                  isMaekawaValid
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}>
                  {isMaekawaValid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Valid Flat Fold: |M - V| = |{countM} - {countV}| = 2 (Paper Can Fold Flat!)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Impossible Fold: |M - V| = |{countM} - {countV}| ≠ 2 (Paper Paper Tears/Crumples!)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-bold text-stone-900 dark:text-white">
                    Maekawa's Parity Law (|M − V| = 2)
                  </h3>
                  <p className="text-stone-700 dark:text-slate-300 text-sm leading-relaxed mt-2 font-normal">
                    Discovered by Japanese origami master Jun Maekawa. When 4 creases meet at a corner, you <strong className="text-stone-900 dark:text-white">always have 3 Mountains and 1 Valley, or 3 Valleys and 1 Mountain</strong>. You can never have 2 Mountains and 2 Valleys!
                  </p>
                </div>

                <div className="p-4 bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.08] rounded-2xl font-mono text-center space-y-1">
                  <div className="text-2xl font-extrabold text-amber-700 dark:text-[#d4af37]">| Mountains − Valleys | = 2</div>
                  <div className="text-xs text-stone-600 dark:text-slate-400 font-medium">
                    Try tapping the buttons to see if you can make a flat fold with 2 Mountains and 2 Valleys!
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-sans bg-stone-100 dark:bg-white/[0.02] p-3 rounded-xl border border-stone-200 dark:border-white/5">
                  💡 <strong>Kid Detective Secret:</strong> When paper folds flat, the paper wraps all the way around 360°. One fold direction must always have 2 more than the other to make a complete loop!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MIURA-ORI SPACE DEPLOYER */}
          {activeTab === 'miura' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Geometric Miura-Ori Canvas Visualization */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-black/40 rounded-2xl border border-stone-200 dark:border-white/[0.08]">
                <div className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300 mb-2 uppercase tracking-wider">
                  NASA Space Telescope Solar Wing Simulator 🛰️
                </div>

                <svg viewBox="0 0 320 220" className="w-full h-52">
                  {(() => {
                    const rows = 4;
                    const cols = 4;
                    const w = 45 * (0.3 + 0.7 * miuraDeployment);
                    const h = 35 * (0.35 + 0.65 * miuraDeployment);
                    const skew = 12 * (1 - miuraDeployment);

                    const polygons = [];
                    for (let r = 0; r < rows; r++) {
                      for (let c = 0; c < cols; c++) {
                        const x0 = 40 + c * w + (r % 2 === 0 ? skew : -skew);
                        const y0 = 25 + r * h;
                        const p1 = `${x0},${y0}`;
                        const p2 = `${x0 + w},${y0}`;
                        const p3 = `${x0 + w + (r % 2 === 0 ? -skew : skew)},${y0 + h}`;
                        const p4 = `${x0 + (r % 2 === 0 ? -skew : skew)},${y0 + h}`;

                        const isAlt = (r + c) % 2 === 0;
                        polygons.push(
                          <polygon
                            key={`${r}-${c}`}
                            points={`${p1} ${p2} ${p3} ${p4}`}
                            fill={isAlt ? 'rgba(212, 175, 55, 0.35)' : 'rgba(56, 189, 248, 0.35)'}
                            stroke={isAlt ? '#d4af37' : '#0284c7'}
                            strokeWidth="1.5"
                          />
                        );
                      }
                    }
                    return polygons;
                  })()}
                </svg>

                <div className="w-full mt-4 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-stone-600 dark:text-slate-400 font-bold whitespace-nowrap">
                    FOLDED STACK (0%)
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round(miuraDeployment * 100)}
                    onChange={(e) => setMiuraDeployment(parseInt(e.target.value, 10) / 100)}
                    aria-label="Miura deployment slider"
                    className="flex-1 accent-[#0284c7] h-2.5 bg-stone-200 dark:bg-white/10 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-cyan-700 dark:text-[#38bdf8] font-extrabold whitespace-nowrap">
                    OPENED ({Math.round(miuraDeployment * 100)}%)
                  </span>
                </div>
              </div>

              {/* Aerospace Heritage */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-bold text-stone-900 dark:text-white">
                    Miura-Ori (How Space Panels Open in Space)
                  </h3>
                  <p className="text-stone-700 dark:text-slate-300 text-sm leading-relaxed mt-2 font-normal">
                    Invented by astrophysicist Koryo Miura for satellites. By pulling just <strong className="text-stone-950 dark:text-white">two diagonal corners</strong>, the entire solar array expands both up and across at the exact same second without heavy mechanical motors!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.08] rounded-xl">
                    <div className="text-stone-500 dark:text-slate-400 text-[10px] uppercase font-bold">Space Application</div>
                    <div className="text-stone-900 dark:text-white font-bold mt-1">Satellite Solar Arrays</div>
                  </div>
                  <div className="p-3.5 bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.08] rounded-xl">
                    <div className="text-stone-500 dark:text-slate-400 text-[10px] uppercase font-bold">Medical Marvel</div>
                    <div className="text-stone-900 dark:text-white font-bold mt-1">Tiny Heart Stents</div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-sans bg-stone-100 dark:bg-white/[0.02] p-3 rounded-xl border border-stone-200 dark:border-white/5">
                  🚀 <strong>Why Kids Love This:</strong> Drag the slider above to see how a small folded square fits inside a rocket nose cone, then blossoms into a giant solar panel in orbit!
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: THE 7 HUZITA-JUSTIN AXIOMS */}
          {activeTab === 'axioms' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <h3 className="font-cinzel text-2xl font-bold text-stone-900 dark:text-white">
                  The 7 Magic Rules of Folding (Huzita-Justin Axioms)
                </h3>
                <p className="text-stone-700 dark:text-slate-300 text-sm leading-relaxed mt-1 font-normal">
                  In mathematics, paper folding is <strong className="text-stone-950 dark:text-white">strictly more powerful than a ruler and compass</strong>! Tap each rule to see what paper can do:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {AXIOMS.map((ax) => (
                  <button
                    key={ax.num}
                    onClick={() => setSelectedAxiom(ax.num)}
                    className={`p-3 rounded-xl border font-mono text-xs transition-all cursor-pointer text-center min-h-[48px] ${
                      selectedAxiom === ax.num
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/25 font-bold'
                        : 'bg-stone-100 dark:bg-white/[0.02] border-stone-300 dark:border-white/[0.08] text-stone-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] opacity-80">RULE</div>
                    <div className="text-lg font-bold">#{ax.num}</div>
                  </button>
                ))}
              </div>

              {/* Selected Axiom Details */}
              {(() => {
                const ax = AXIOMS.find((a) => a.num === selectedAxiom) || AXIOMS[5];
                return (
                  <div className="p-6 bg-stone-100 dark:bg-black/40 rounded-2xl border border-stone-200 dark:border-white/[0.08] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                        RULE {ax.num} OF 7
                      </span>
                      <h4 className="font-cinzel text-lg font-bold text-stone-900 dark:text-white">{ax.title}</h4>
                    </div>

                    <div className="bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-stone-200 dark:border-white/[0.05] space-y-2">
                      <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Kid Action: {ax.kidSummary}</span>
                      </div>
                      <p className="text-stone-700 dark:text-slate-300 text-xs font-mono leading-relaxed">
                        Formal: {ax.formal}
                      </p>
                    </div>

                    <div className="text-xs text-amber-800 dark:text-amber-300 font-mono flex items-center gap-2 pt-1 font-semibold">
                      <span>⚡ Mathematical Power:</span>
                      <span className="text-stone-700 dark:text-slate-300 font-normal">{ax.power}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default GeometryLab;
