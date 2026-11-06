# OrigamiStudio Application Blueprint

## System Overview
OrigamiStudio is the primary web application for Project O2, providing a browser-based computational origami design, 3D simulation, and kinematics platform. Built with React 19, TypeScript, Vite 8, Three.js, React Three Fiber (R3F), and Tailwind CSS v4, it renders authentic physical folding kinetics using Huzita-Hatori axioms, supports 63 complete multi-cultural origami kits across 9 collections, provides 3D showroom turntables with contact shadows, and exports to the MIT FOLD v1.1 open specification, Wavefront OBJ, and Cricut SVG.

## System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Browser Runtime"]
        App["React 19 Host App (Vite 8 & Tailwind v4)"]
        Store["Zustand 5 State Management (useOrigamiStore)"]
        App --> Store
    end

    subgraph GraphicsAndDiagramming ["3D Rendering & Diagram Engines"]
        Store --> R3F["React Three Fiber (v9) & Drei (v10)\nModular Canvas Stages"]
        Store --> Imperative["Imperative Three.js WebGL Engine"]
        Store --> X6["AntV X6 (v3.1) Crease Pattern Planar Graph"]
        Store --> Wave["WaveDrom Kinematic WaveJSON HUD"]
    end

    subgraph Solvers ["Computational Origami Solvers"]
        X6 --> KuSolver["Jason Ku (MIT) Layer-Order 2-SAT Solver\n(Non-Clipping Elevation)"]
        Store --> LangSolver["Robert Lang Universal Reference Finder\n(Continuous Huzita Axiom Tree Search)"]
        R3F --> XPBD["Pliego XPBD Compliant Sheet Mechanics\n(Dihedral Bending Strain & Plasticity)"]
    end

    subgraph Interoperability ["CAD & Fabrication Exporters"]
        Store --> FOLD["MIT .FOLD v1.1 Specification"]
        Store --> OBJ["Wavefront 3D .OBJ Exporter"]
        Store --> Cricut["Cricut Cut/Score Dual-Layer SVG"]
        Store --> PrintA4["Editorial A4 Print Guide (PrintGuide.tsx)"]
    end
```

### Build & Tooling Notes
- Built using Vite 8 with Fast HMR and Oxlint linting rules.
- Powered by `@vitejs/plugin-react` and `@tailwindcss/vite`.
- 3D rendering powered by `three`, `@react-three/fiber`, and `@react-three/drei`.
- Crease pattern graph engine powered by `@antv/x6`.
- Verification runner executes strict TypeScript compile checks (`tsc -b`) and Vite production bundle synthesis (`vite build`).

## Local Interface & Invariants
- `vite.config.ts`: Exports default Vite configuration mounting React and Tailwind CSS v4 plugins.
- `package.json`: Defines project dependencies (`three`, `framer-motion`, `lucide-react`, `react`, `react-dom`, `zustand`) and build pipeline scripts (`pnpm dev`, `pnpm build`, `pnpm test`, `pnpm verify:kits`, `pnpm lint`, `pnpm preview`).
- `index.html`: Host HTML document containing root element `#root` and viewport configuration.

## Subdirectories & System Boundaries
- [Source Code (`src`)](./src/README.md) - Primary application source tree grouping domain types, state store, Web Audio & posture hooks, 63-kit database, 3D math and CAD kinematics, design tokens, and React UI components.

## Global Invariants
- Dynamic fold factor `foldFactor` is strictly bounded between `0.0` (unfolded sheet) and `1.0` (fully completed fold) across kinematics engines and 3D viewers.
- 3D vertex coordinates in procedural mesh generators conform to the normalized 2-unit square coordinate boundary $[-1.0, 1.0]$.
- Kit data is strictly typed against `OrigamiKit` and requires continuous step indices starting from step 1.

## Global Side Effects
- Local browser persistence: Writes daily streak records, language preference, theme preference, and completed kit lists to `localStorage`.
- WebGL GPU context: Initializes Three.js WebGL rendering contexts in the browser DOM.
- Web Audio synthesis: Activates the Web Audio API hardware output for procedural paper creasing and chime effects.
- Speech synthesis: Utilizes the browser Web Speech API for multilingual step voice narration.
- Hardware posture: Listens to W3C `devicePosture` changes on foldable devices.

## System Verification
- Run: `pnpm build`
- Run: `pnpm test`
- Run: `pnpm verify:kits`
