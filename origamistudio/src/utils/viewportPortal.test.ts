import { describe, it, expect } from 'vitest';
import {
  type DOMRectBounds,
  calculateScissorBounds,
  isPortalVisible,
  computePortalCameraAspect,
  PortalManager
} from './viewportPortal';

describe('d3adrabbit Viewport Portal Single-Canvas Scissor Manager', () => {
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  it('translates DOM screen coordinates to WebGL lower-left scissor coordinates', () => {
    // A card located at top: 100, left: 200, width: 300, height: 300
    // bottom = 400
    const rect: DOMRectBounds = {
      top: 100,
      left: 200,
      width: 300,
      height: 300,
      right: 500,
      bottom: 400
    };

    const scissor = calculateScissorBounds(rect, canvasWidth, canvasHeight);

    expect(scissor.x).toBe(200);
    expect(scissor.width).toBe(300);
    expect(scissor.height).toBe(300);
    // In WebGL, y=0 is at bottom of viewport: y = canvasHeight - rect.bottom = 1080 - 400 = 680
    expect(scissor.y).toBe(680);
  });

  it('accurately identifies off-screen cards to cull unneeded draw calls', () => {
    const visibleCard: DOMRectBounds = {
      top: 50,
      left: 50,
      width: 200,
      height: 200,
      right: 250,
      bottom: 250
    };
    expect(isPortalVisible(visibleCard, canvasWidth, canvasHeight)).toBe(true);

    const offscreenTop: DOMRectBounds = {
      top: -300,
      left: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: -100
    };
    expect(isPortalVisible(offscreenTop, canvasWidth, canvasHeight)).toBe(false);

    const offscreenBottom: DOMRectBounds = {
      top: 1200,
      left: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 1400
    };
    expect(isPortalVisible(offscreenBottom, canvasWidth, canvasHeight)).toBe(false);
  });

  it('computes distortion-free camera aspect ratios for arbitrary card dimensions', () => {
    const squareAspect = computePortalCameraAspect(300, 300);
    expect(squareAspect).toBe(1.0);

    const wideAspect = computePortalCameraAspect(400, 200);
    expect(wideAspect).toBe(2.0);

    const zeroAspect = computePortalCameraAspect(0, 300);
    expect(zeroAspect).toBe(1.0); // Safe fallback
  });

  it('manages active portals and registers lifecycle callbacks', () => {
    const manager = new PortalManager();

    manager.registerPortal('kit-japanese-01', {
      rect: { top: 100, left: 100, width: 250, height: 250, right: 350, bottom: 350 },
      kitId: 'japanese-01'
    });

    expect(manager.getActiveCount()).toBe(1);
    expect(manager.getPortal('kit-japanese-01')).toBeDefined();

    manager.unregisterPortal('kit-japanese-01');
    expect(manager.getActiveCount()).toBe(0);
    expect(manager.getPortal('kit-japanese-01')).toBeUndefined();
  });
});
