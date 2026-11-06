# Origami Hyperframes Web Prototype (`origami-hyperframes`)

## Overview
A standalone multi-kit origami exploration prototype built with HTML5, CSS3, vanilla JavaScript, GSAP animations, and Three.js 3D simulation. Serves as the interactive reference implementation that informed the React 19 / TypeScript OrigamiStudio application.

## Interface
- `web/index.html` [web/index.html]: Hub and catalog interface featuring cultural collection cards and 3D preview widgets.
- `web/studio/` [web/studio]: Vanilla JS Three.js 3D folding viewer implementing step-by-step paper mesh rendering.
- `web/image-to-origami.html` [web/image-to-origami.html]: Photo conversion and crease pattern generator demo.
- `web/print-guide.html` [web/print-guide.html]: Standalone printable origami instruction guide layout.

## Invariants
- Operates without build-step compilation; all modules are loaded directly via browser `<script type="module">` or standard CDN links.
- Kit definitions conform to JSON specifications in `./kits/`.

## Side Effects
- Browser DOM mutations: Dynamically constructs Three.js WebGL canvas and binds GSAP animation timelines.

## Verification
- Run: Open `origami-hyperframes/web/index.html` in any modern web browser.
