# Framer + GSAP Animated Tutorial System

Interactive animated guides showcasing each origami figure with step-by-step animations, 3D reveals, and guided tutorials.

## Project Structure

```
nativity-set/
├── web/
│   ├── index.html           # Main landing page with hero animations
│   ├── css/
│   │   ├── main.css         # Global styles with Framer-inspired design
│   │   ├── animations.css   # GSAP animation utilities
│   │   └── print.css        # Print styles
│   ├── js/
│   │   ├── app.js           # Main app logic
│   │   ├── gsap-animations.js # GSAP timeline animations
│   │   └── tutorial-engine.js # Interactive tutorial controller
│   └── assets/
│       └── diagrams/        # SVG diagrams for animations
├── print-guides/
│   ├── guide-01-stable.html
│   ├── guide-02-holy-family.html
│   ├── guide-03-angel.html
│   ├── guide-04-star.html
│   ├── guide-05-shepherd-sheep.html
│   ├── guide-06-wise-man-melchior.html
│   ├── guide-07-wise-man-balthazar.html
│   ├── guide-08-wise-man-gaspar.html
│   ├── guide-09-animals.html
│   └── guide-10-complete-assembly.html
└── tutorials/
    ├── interactive-tutorial.html
    └── tutorial-data.json
```
