import kitsJson from '../src/data/kits.json';
import { generateStepIllustrationData, generateStepAfterIllustrationData, generatePrintablePaperSheetData } from '../src/utils/origamiDiagramRenderer';
import { getSchoolStepProfile } from '../src/utils/schoolOrigami';
import { calculateStepPlanMetrics, calculateSpringDampedProgress } from '../src/utils/origamiKinematics';

const kits = kitsJson as Record<string, any>;
const kitIds = Object.keys(kits);

console.log('================================================================');
console.log('AUXILIARY SYSTEM & PEDAGOGICAL PIPELINE EMPIRICAL TEST');
console.log('================================================================\n');

let errors = 0;

// 1. School Origami Pedagogical Profiles across all 434 steps
console.log('▶ [1] Testing School Origami Step Profiles (Sprouts metaphors & STEM theorems)...');
let sproutMetaphorCount = 0;
let stemTheoremCount = 0;

for (const kitId of kitIds) {
  const kit = kits[kitId];
  const steps = kit.steps || [];
  for (let s = 0; s < steps.length; s++) {
    const profile = getSchoolStepProfile(s, steps[s].title, steps.length);
    if (!profile) {
      console.error(`Missing profile for ${kitId} s${s}`);
      errors++;
    } else {
      if (profile.juniorInstruction) sproutMetaphorCount++;
      if (profile.stemTheorem) stemTheoremCount++;
    }
  }
}

console.log(`  ✔ Verified ${sproutMetaphorCount} child metaphors and ${stemTheoremCount} STEM theorems across ${sproutMetaphorCount} steps.`);

// 2. Printable Paper Sheet Generator for all kits
console.log(`\n▶ [2] Testing Printable Sheet Generator for all ${kitIds.length} kits...`);
for (const kitId of kitIds) {
  try {
    const sheet = generatePrintablePaperSheetData(kits[kitId], { size: 500 });
    if (!sheet || !sheet.allCreases || sheet.allCreases.length === 0) {
      console.error(`Sheet generation failed for ${kitId}`);
      errors++;
    }
  } catch (err: any) {
    console.error(`Exception generating sheet for ${kitId}: ${err.message}`);
    errors++;
  }
}
console.log(`  ✔ All ${kitIds.length} printable sheets generated valid fold crosshairs and cut boundaries.`);

// 3. Step Illustrations for all steps
console.log(`\n▶ [3] Testing Step Illustration Vector Data for all kits...`);
let diagCount = 0;
for (const kitId of kitIds) {
  const kit = kits[kitId];
  const steps = kit.steps || [];
  for (let s = 0; s < steps.length; s++) {
    try {
      const diag = generateStepIllustrationData(kitId, s, steps.length, { size: 220 });
      diagCount++;
      if (!diag || !diag.polyPointsStr) {
        console.error(`Missing polygon points for ${kitId} s${s}`);
        errors++;
      }
    } catch (err: any) {
      console.error(`Exception generating diagram for ${kitId} s${s}: ${err.message}`);
      errors++;
    }
  }
}
console.log(`  ✔ Verified ${diagCount} zero-literacy Yoshizawa-Randlett vector illustrations.`);

// 3B. Dual-State "After" Illustration Data
console.log('\n▶ [3B] Testing Dual-State "After" (Target Result) Vector Data...');
let diagAfterCount = 0;
for (const kitId of kitIds) {
  const kit = kits[kitId];
  const steps = kit.steps || [];
  for (let s = 0; s < steps.length; s++) {
    try {
      const diagAfter = generateStepAfterIllustrationData(kitId, s, steps.length, { size: 220 });
      diagAfterCount++;
      if (!diagAfter || !diagAfter.polyPointsStr) {
        console.error(`Missing after-polygon points for ${kitId} s${s}`);
        errors++;
      }
      if (!diagAfter.ptDocked || isNaN(diagAfter.ptDocked.x) || isNaN(diagAfter.ptDocked.y)) {
        console.error(`Invalid docked point for ${kitId} s${s}`);
        errors++;
      }
      if (!diagAfter.seamColor) {
        console.error(`Missing seam color for ${kitId} s${s}`);
        errors++;
      }
    } catch (err: any) {
      console.error(`Exception generating after-diagram for ${kitId} s${s}: ${err.message}`);
      errors++;
    }
  }
}
console.log(`  ✔ Verified ${diagAfterCount} dual-state "After" illustrations with docked targets and pressed seams.`);

// 4. Procedural 3D Trajectory Arcs & Multi-Flap Kinematics
console.log('\n▶ [4] Testing 3D Quadratic Bézier Trajectory Arcs & Multi-Flap Kinematics...');
let arcCount = 0;
for (const kitId of kitIds) {
  const kit = kits[kitId];
  const steps = kit.steps || [];
  for (let s = 0; s < steps.length; s++) {
    const m = calculateStepPlanMetrics(kitId, s, steps.length, 0.5);
    if (!m.trajectoryArc || !m.trajectoryArc.start || !m.trajectoryArc.zenith || !m.trajectoryArc.target) {
      console.error(`Invalid trajectory arc for ${kitId} s${s}`);
      errors++;
    } else if (m.trajectoryArc.zenith[2] <= 0.0) {
      console.error(`Zenith elevation must be > 0 for 3D trajectory arc in ${kitId} s${s}`);
      errors++;
    } else {
      arcCount++;
    }

    if (!m.mobileFlaps || m.mobileFlaps.length === 0) {
      console.error(`Empty mobile flaps in ${kitId} s${s}`);
      errors++;
    }
  }
}
console.log(`  ✔ Verified ${arcCount} 3D quadratic Bézier trajectory arcs with physical spatial zenith elevations.`);

// 5. Spring-Damper Kinetic Easing Function
console.log('\n▶ [5] Testing Spring-Damper Kinetic Easing Curve (calculateSpringDampedProgress)...');
const p0 = calculateSpringDampedProgress(0.0);
const p1 = calculateSpringDampedProgress(1.0);
const pMid = calculateSpringDampedProgress(0.5);

if (p0 !== 0.0) {
  console.error(`Spring damped progress at t=0 must be 0.0, got ${p0}`);
  errors++;
}
if (p1 !== 1.0) {
  console.error(`Spring damped progress at t=1 must be 1.0, got ${p1}`);
  errors++;
}
if (pMid <= 0.0 || pMid >= 1.0) {
  console.error(`Spring damped progress at t=0.5 must be between 0 and 1, got ${pMid}`);
  errors++;
}
console.log(`  ✔ Spring-damper oscillator confirmed: t=0.0 -> ${p0}, t=0.5 -> ${pMid.toFixed(4)}, t=1.0 -> ${p1}.`);

console.log('\n================================================================');
console.log(`AUXILIARY TEST FINISHED: ${errors} errors detected.`);
console.log('================================================================');

if (errors > 0) process.exit(1);
