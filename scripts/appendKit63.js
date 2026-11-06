import fs from 'fs';
import path from 'path';

const jsonPath = path.resolve('origamistudio/src/data/kits.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

data['aerospace-01'] = {
  id: 'aerospace-01',
  kitNumber: 63,
  title: 'Aerospace Hypar — Deployable Solar Metamaterial',
  subtitle: 'Curved-Crease Ruled Surface • James Webb Deployer • Zero-Gaussian Curvature',
  description: 'Cutting-edge aerospace origami exploring hyperbolic paraboloid (Hypar) geometry and Miura-ori space array deployment. Features concentric mountain-valley diamond creases that buckle a flat sheet into an ultra-rigid 3D curved saddle.',
  difficulty: 'Master',
  time: '25-30 min',
  category: 'stem',
  collection: 'american',
  collectionTitle: 'American Modern Computational',
  accent: '#0284c7',
  goal: 'A self-locking 3D hyperbolic paraboloid space solar array with zero-Gaussian curvature',
  paper: [
    {
      color: 'Mylar / Aerospace Cyan & Silver',
      size: '8x8 in',
      qty: 1,
      gsm: '90 gsm'
    }
  ],
  tools: [
    'Precision Ruler',
    'Embossing Stylus'
  ],
  principles: [
    'Developable ruled surface: z = (x^2 - y^2)/2',
    'Gauss Theorema Egregium (zero Gaussian curvature K = 0)',
    'Bistable snap-through aerospace deployment kinematics'
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'Diagonal Pre-Creasing & Cartesian Grid',
      foldType: 'Valley Diagonals',
      time: '3-4 min',
      instruction: 'Crease both major diagonals from corner to corner to establish the principal hyperbolic axes.',
      tip: 'Ensure creases meet at the exact mathematical center (0, 0).'
    },
    {
      stepNumber: 2,
      title: 'Concentric Diamond Grid Scoring',
      foldType: 'Concentric Diamond Folds',
      time: '4-5 min',
      instruction: 'Fold four concentric diamond rings radiating outward from center at 25%, 50%, 75%, and 100% radius.',
      tip: 'Accurate concentric spacing ensures uniform saddle curvature.'
    },
    {
      stepNumber: 3,
      title: 'Alternating Mountain-Valley Crease Assignment',
      foldType: 'Alternating Parity Inversion',
      time: '4-5 min',
      instruction: 'Reverse alternate concentric rings into mountain creases, creating alternating M-V pleats around the central vertex.',
      tip: 'Satisfies Kawasaki-Justin parity across all concentric sectors.'
    },
    {
      stepNumber: 4,
      title: '3D Hypar Saddle Buckling Collapse',
      foldType: 'Kinematic Ruled Buckling',
      time: '5-6 min',
      instruction: 'Pinch the center downward while lifting opposite diagonal corners to pop the flat paper into a 3D saddle.',
      tip: 'Opposite corners curl in opposing directions: two up (+z), two down (-z).'
    },
    {
      stepNumber: 5,
      title: 'Dihedral Hinge Compression & Flute Locking',
      foldType: 'Dihedral Angle Setting',
      time: '3-4 min',
      instruction: 'Press each diagonal ridge firmly beyond the 150° plastic threshold to lock the hyperbolic curvature permanently.',
      tip: 'Compliant XPBD mechanics give the structure high torsional stiffness.'
    },
    {
      stepNumber: 6,
      title: 'Deployable Space Array Truss Integration',
      foldType: 'Bistable Truss Actuation',
      time: '3-4 min',
      instruction: 'Compress along the x-axis to collapse the array into launch payload volume, then release to test snap deployment.',
      tip: 'Simulates kinetic solar panel unfurling on deep-space satellites.'
    },
    {
      stepNumber: 7,
      title: 'End Completion Model — Sculpted Aerospace Hypar Array',
      foldType: 'Ruled Hyperbolic Metamaterial',
      time: '2-3 min',
      instruction: 'Mount the hyperbolic paraboloid sculpture onto its launch plinth, showcasing self-supporting curved-crease rigidity.',
      tip: 'Your advanced aerospace origami metamaterial is complete!'
    }
  ]
};

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Success! Total kits in kits.json now:', Object.keys(data).length);
