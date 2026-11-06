# HyperFrames Advanced Origami Studio

Building a cutting-edge interactive origami platform using HyperFrames (HTML rendered to video), advanced GSAP animations, 3D transforms, and micro-interactions.

## Vision
A modern, multi-kit origami platform with:
- HyperFrames-generated cinematic tutorials
- Interactive 3D paper folding simulations
- Step-by-step guided flow with auto-advancement
- Print-ready multi-colored guides
- Category-based collections
- Micro-interactions and smooth transitions

## Tech Stack
- HyperFrames (HTML/CSS/JS rendered to video)
- GSAP 3.12+ with ScrollTrigger
- Three.js for 3D paper simulation
- CSS 3D transforms
- View Transitions API
- Web Animations API

## Project Structure
```
origami-studio/
├── hyperframes/
│   ├── scenes/           # HyperFrames scene definitions
│   ├── components/       # Reusable blocks
│   └── renders/          # Generated videos
├── web/
│   ├── index.html        # Main hub
│   ├── studio/           # Interactive studio
│   ├── viewer/           # 3D viewer
│   └── guides/           # Print guides
├── kits/
│   ├── nativity/         # 10 kits
│   ├── lotus/            # 6 kits
│   ├── geometric/        # 8 kits
│   └── ...               # More categories
└── assets/
```
