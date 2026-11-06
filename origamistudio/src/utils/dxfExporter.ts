/**
 * -----------------------------------------------------------------------------
 * ORIGAMISTUDIO™ — Universal AutoCAD DXF CAM Fabrication Pipeline
 * Inspired by pliego.madfam.io: Exports production-grade dual-layer .dxf files
 * formatted for automated digital cutters (Cricut, Silhouette Cameo, Brother ScanNCut)
 * and laser plotters (Glowforge, Epilog, Universal Laser Systems).
 * 
 * Layer Hierarchy:
 * - BOUNDARY: Perimeter through-cuts (Continuous line, Color 1: Red)
 * - MOUNTAIN: Mountain fold scores (Dashed line, Color 5: Blue)
 * - VALLEY: Valley fold scores (Dotted line, Color 3: Green)
 * -----------------------------------------------------------------------------
 */

import type { OrigamiKit } from '../types/origami';
import { calculateStepPlanMetrics } from './origamiKinematics';

/**
 * Sanitizes and generates an export filename for the DXF package.
 */
export function formatDxfFilename(kit: OrigamiKit, stepIdx: number): string {
  const kitSlug = (kit.id || 'origami').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `origamistudio_${kitSlug}_step${stepIdx + 1}.dxf`;
}

interface DxfLine {
  layer: 'BOUNDARY' | 'MOUNTAIN' | 'VALLEY';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Generates an AutoCAD ASCII R12 standard DXF file for CNC and laser cutters.
 */
export function generateDxfContent(
  kit: OrigamiKit,
  stepIdx: number,
  paperSizeMm: number = 150
): string {
  const totalSteps = kit.steps ? kit.steps.length : 5;
  const metrics = calculateStepPlanMetrics(kit.id, stepIdx, totalSteps, 1.0);

  // Map normalized paper coordinates [-1, 1] to physical cutter millimeters [0, paperSizeMm]
  const toMmX = (x: number) => ((x + 1) / 2) * paperSizeMm;
  const toMmY = (y: number) => ((y + 1) / 2) * paperSizeMm;

  const lines: DxfLine[] = [];

  // 1. BOUNDARY PERIMETER (Four outer through-cuts)
  lines.push({ layer: 'BOUNDARY', x1: 0, y1: 0, x2: paperSizeMm, y2: 0 });
  lines.push({ layer: 'BOUNDARY', x1: paperSizeMm, y1: 0, x2: paperSizeMm, y2: paperSizeMm });
  lines.push({ layer: 'BOUNDARY', x1: paperSizeMm, y1: paperSizeMm, x2: 0, y2: paperSizeMm });
  lines.push({ layer: 'BOUNDARY', x1: 0, y1: paperSizeMm, x2: 0, y2: 0 });

  // 2. ACTIVE STEP FOLD AXIS
  const isValley = metrics.foldCategory === 'valley';
  const foldLayer = isValley ? 'VALLEY' : 'MOUNTAIN';

  lines.push({
    layer: foldLayer,
    x1: toMmX(metrics.creaseLine.x1),
    y1: toMmY(metrics.creaseLine.y1),
    x2: toMmX(metrics.creaseLine.x2),
    y2: toMmY(metrics.creaseLine.y2)
  });

  // 3. DIAGONAL GUIDE PRE-CREASES
  lines.push({
    layer: 'VALLEY',
    x1: toMmX(-1.0),
    y1: toMmY(-1.0),
    x2: toMmX(1.0),
    y2: toMmY(1.0)
  });
  lines.push({
    layer: 'VALLEY',
    x1: toMmX(1.0),
    y1: toMmY(-1.0),
    x2: toMmX(-1.0),
    y2: toMmY(1.0)
  });

  // 4. ASSEMBLE AUTOCAD R12 ASCII DXF
  let dxf = '';

  // HEADER SECTION
  dxf += '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n';
  dxf += `9\n$INSUNITS\n70\n4\n`; // 4 = Millimeters in AutoCAD
  dxf += `9\n$EXTMIN\n10\n0.0\n20\n0.0\n30\n0.0\n`;
  dxf += `9\n$EXTMAX\n10\n${paperSizeMm.toFixed(3)}\n20\n${paperSizeMm.toFixed(3)}\n30\n0.0\n`;
  dxf += '0\nENDSEC\n';

  // TABLES SECTION (Layers & Line types)
  dxf += '0\nSECTION\n2\nTABLES\n';

  // LTYPE Table
  dxf += '0\nTABLE\n2\nLTYPE\n70\n3\n';
  dxf += '0\nLTYPE\n2\nCONTINUOUS\n70\n64\n3\nSolid Line\n72\n65\n73\n0\n40\n0.0\n';
  dxf += '0\nLTYPE\n2\nDASHED\n70\n64\n3\nDashed __ __ __\n72\n65\n73\n2\n40\n2.0\n49\n1.5\n49\n-0.5\n';
  dxf += '0\nLTYPE\n2\nDOT\n70\n64\n3\nDot . . . . .\n72\n65\n73\n2\n40\n1.0\n49\n0.2\n49\n-0.8\n';
  dxf += '0\nENDTAB\n';

  // LAYER Table
  dxf += '0\nTABLE\n2\nLAYER\n70\n3\n';
  dxf += '0\nLAYER\n2\nBOUNDARY\n70\n64\n62\n1\n6\nCONTINUOUS\n'; // Color 1 = Red
  dxf += '0\nLAYER\n2\nMOUNTAIN\n70\n64\n62\n5\n6\nDASHED\n';    // Color 5 = Blue
  dxf += '0\nLAYER\n2\nVALLEY\n70\n64\n62\n3\n6\nDOT\n';          // Color 3 = Green
  dxf += '0\nENDTAB\n';

  dxf += '0\nENDSEC\n';

  // ENTITIES SECTION
  dxf += '0\nSECTION\n2\nENTITIES\n';

  for (const l of lines) {
    dxf += '0\nLINE\n';
    dxf += `8\n${l.layer}\n`;
    dxf += `10\n${l.x1.toFixed(3)}\n`;
    dxf += `20\n${l.y1.toFixed(3)}\n`;
    dxf += `30\n0.0\n`;
    dxf += `11\n${l.x2.toFixed(3)}\n`;
    dxf += `21\n${l.y2.toFixed(3)}\n`;
    dxf += `31\n0.0\n`;
  }

  dxf += '0\nENDSEC\n';
  dxf += '0\nEOF\n';

  return dxf;
}

/**
 * Triggers a browser download of the generated DXF file.
 */
export function downloadDxfFile(
  kit: OrigamiKit,
  stepIdx: number,
  paperSizeMm: number = 150
): void {
  const content = generateDxfContent(kit, stepIdx, paperSizeMm);
  const blob = new Blob([content], { type: 'application/dxf;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const filename = formatDxfFilename(kit, stepIdx);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
