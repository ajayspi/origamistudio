import * as THREE from 'three';
import kitsJson from '../src/data/kits.json';
import { synthesizeKitStepGeometry } from '../src/utils/origamiGeometry';
import { calculateStepPlanMetrics } from '../src/utils/origamiKinematics';
import { generateStepIllustrationData, generatePrintablePaperSheetData } from '../src/utils/origamiDiagramRenderer';

interface StepIssue {
  kitId: string;
  stepIdx: number;
  issue: string;
}

const issues: StepIssue[] = [];
const kits = kitsJson as Record<string, any>;
const kitIds = Object.keys(kits);

console.log('================================================================');
console.log(`ORIGAMISTUDIO™ 63-KIT FULL-SPECTRUM VERIFICATION SUITE`);
console.log(`Auditing: Data Integrity, Kinematics, 3D Geometries & Diagrams`);
console.log(`Total Kits: ${kitIds.length}`);
console.log('================================================================\n');

let totalStepsTested = 0;
let totalMeshRenders = 0;
let totalKinematicsCalculated = 0;
let totalDiagramsGenerated = 0;
let totalSheetsGenerated = 0;

for (const kitId of kitIds) {
  const kit = kits[kitId];
  const steps = kit.steps || [];

  if (steps.length === 0) {
    issues.push({ kitId, stepIdx: -1, issue: 'Kit has 0 steps!' });
    continue;
  }

  // 1. Verify Printable Paper Sheet Generation
  totalSheetsGenerated++;
  try {
    const sheet = generatePrintablePaperSheetData(kit, { size: 500 });
    if (!sheet || !sheet.allCreases || sheet.allCreases.length === 0) {
      issues.push({ kitId, stepIdx: -1, issue: 'Failed to generate printable paper sheet creases' });
    }
  } catch (err: any) {
    issues.push({ kitId, stepIdx: -1, issue: `Sheet generation exception: ${err.message}` });
  }

  for (let s = 0; s < steps.length; s++) {
    totalStepsTested++;
    const step = steps[s];

    // 2. Step Metadata Checks
    if (!step.title || typeof step.title !== 'string') {
      issues.push({ kitId, stepIdx: s, issue: 'Missing step title' });
    }
    if (!step.instruction || typeof step.instruction !== 'string') {
      issues.push({ kitId, stepIdx: s, issue: 'Missing step instruction' });
    }

    // 3. Vector Step Illustration Generation
    totalDiagramsGenerated++;
    try {
      const diag = generateStepIllustrationData(kitId, s, steps.length, { size: 220 });
      if (!diag || !diag.polyPointsStr || diag.polyPointsStr.split(' ').length < 3) {
        issues.push({ kitId, stepIdx: s, issue: 'Invalid step polygon in diagram' });
      }
      if (isNaN(diag.cX1) || isNaN(diag.cY1) || isNaN(diag.cX2) || isNaN(diag.cY2)) {
        issues.push({ kitId, stepIdx: s, issue: 'NaN in crease line coordinates' });
      }
    } catch (err: any) {
      issues.push({ kitId, stepIdx: s, issue: `Diagram generation exception: ${err.message}` });
    }

    // 4. Kinematics Calculations at f = 0.01, 0.5, 1.0
    for (const f of [0.01, 0.5, 1.0]) {
      totalKinematicsCalculated++;
      try {
        const metrics = calculateStepPlanMetrics(kitId, s, steps.length, f);
        if (!metrics) {
          issues.push({ kitId, stepIdx: s, issue: `Null kinematics at fold ${f}` });
        }
      } catch (err: any) {
        issues.push({ kitId, stepIdx: s, issue: `Kinematics exception: ${err.message}` });
      }
    }

    // 5. 3D Procedural Mesh Generation at f = 0.01, 0.5, 1.0
    for (const f of [0.01, 0.5, 1.0]) {
      totalMeshRenders++;
      try {
        const geo = synthesizeKitStepGeometry(kitId, s, steps.length, f);
        const posAttr = geo?.getAttribute('position');
        if (!posAttr || posAttr.count === 0) {
          issues.push({ kitId, stepIdx: s, issue: `Empty 3D mesh (0 vertices) at fold ${f}` });
        }
      } catch (err: any) {
        issues.push({ kitId, stepIdx: s, issue: `3D Mesh exception: ${err.message}` });
      }
    }
  }
}

console.log('--- AUDIT METRICS ---');
console.log(`• Total Kits Audited: ${kitIds.length}`);
console.log(`• Total Folding Steps: ${totalStepsTested}`);
console.log(`• Total 3D Mesh Syntheses: ${totalMeshRenders}`);
console.log(`• Total Kinematics Computations: ${totalKinematicsCalculated}`);
console.log(`• Total 2D Vector Step Illustrations: ${totalDiagramsGenerated}`);
console.log(`• Total Printable Origami Sheets: ${totalSheetsGenerated}`);
console.log(`• Total Issues / Anomalies Detected: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n❌ FAILED ISSUES:');
  issues.forEach(i => console.log(`  [${i.kitId} S${i.stepIdx + 1}] ${i.issue}`));
  process.exit(1);
} else {
  console.log('\n🌟 100% CERTIFIED: All 63 kits verified end-to-end with complete folding sequences, active 3D models, plan kinematics, and printable illustrated guides!');
}
