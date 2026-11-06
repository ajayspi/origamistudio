import { describe, it, expect } from 'vitest';
import { generateDxfContent, formatDxfFilename } from './dxfExporter';
import { getKitById } from '../data/kits';

describe('Digital Cutter CAM (.dxf) Exporter', () => {
  const kit = getKitById('japanese-01')!;

  it('generates a valid AutoCAD R12 ASCII DXF header with layers', () => {
    const dxf = generateDxfContent(kit, 0, 150);
    expect(dxf).toContain('SECTION');
    expect(dxf).toContain('HEADER');
    expect(dxf).toContain('TABLES');
    expect(dxf).toContain('LAYER');
    expect(dxf).toContain('BOUNDARY');
    expect(dxf).toContain('MOUNTAIN');
    expect(dxf).toContain('VALLEY');
    expect(dxf).toContain('ENTITIES');
    expect(dxf).toContain('LINE');
    expect(dxf).toContain('EOF');
  });

  it('normalizes square coordinates to physical millimeter bounding box', () => {
    const paperSizeMm = 200;
    const dxf = generateDxfContent(kit, 0, paperSizeMm);
    // Boundary square [0, paperSizeMm] x [0, paperSizeMm]
    expect(dxf).toContain('200.000');
    expect(dxf).toContain('0.000');
  });

  it('formats clean, sanitized export filenames', () => {
    const filename = formatDxfFilename(kit, 2);
    expect(filename).toBe('origamistudio_japanese-01_step3.dxf');
  });
});
