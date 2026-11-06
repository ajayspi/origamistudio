/**
 * -----------------------------------------------------------------------------
 * ORIGAMISTUDIO™ — Single-Canvas Viewport Portal & Scissor Manager
 * Inspired by d3adrabbit/origami: Renders multi-card 3D galleries using a single
 * shared WebGL canvas with hardware scissor testing, eliminating the browser's
 * 8-16 WebGL context limit and keeping mobile gallery scrolling at a crisp 60 FPS.
 * -----------------------------------------------------------------------------
 */

export interface DOMRectBounds {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export interface ScissorBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PortalData {
  rect: DOMRectBounds;
  kitId: string;
  rotation?: number;
  onRender?: () => void;
}

/**
 * Translates DOM client coordinates to WebGL lower-left origin scissor bounds.
 */
export function calculateScissorBounds(
  rect: DOMRectBounds,
  _canvasWidth: number,
  canvasHeight: number
): ScissorBounds {
  const x = Math.round(rect.left);
  const y = Math.round(canvasHeight - rect.bottom);
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  return { x, y, width, height };
}

/**
 * Checks whether a portal is inside the visible viewport area.
 * Culls off-screen portals to eliminate GPU draw calls.
 */
export function isPortalVisible(
  rect: DOMRectBounds,
  canvasWidth: number,
  canvasHeight: number
): boolean {
  return (
    rect.bottom > 0 &&
    rect.top < canvasHeight &&
    rect.right > 0 &&
    rect.left < canvasWidth &&
    rect.width > 0 &&
    rect.height > 0
  );
}

/**
 * Computes camera aspect ratio for a portal, guarding against zero dimensions.
 */
export function computePortalCameraAspect(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 1.0;
  return width / height;
}

/**
 * PortalManager orchestrates active 3D card portals registered across the DOM.
 */
export class PortalManager {
  private portals: Map<string, PortalData> = new Map();

  registerPortal(id: string, data: PortalData): void {
    this.portals.set(id, data);
  }

  unregisterPortal(id: string): void {
    this.portals.delete(id);
  }

  getPortal(id: string): PortalData | undefined {
    return this.portals.get(id);
  }

  getAllPortals(): [string, PortalData][] {
    return Array.from(this.portals.entries());
  }

  getActiveCount(): number {
    return this.portals.size;
  }

  clear(): void {
    this.portals.clear();
  }
}
