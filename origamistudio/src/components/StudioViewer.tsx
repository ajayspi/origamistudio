import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { getKitById } from '../data/kits';
import { useOrigamiAudio } from '../hooks/useOrigamiAudio';
import {
  RotateCcw, Download, Sparkles, ExternalLink, X
} from 'lucide-react';
import { synthesizeKitStepGeometry } from '../utils/origamiGeometry';
import { calculateStepPlanMetrics, calculateSpringDampedProgress } from '../utils/origamiKinematics';
import {
  downloadFoldFile,
  COMPUTATIONAL_PRESETS
} from '../utils/foldFormat';
import { ReferenceFinderModal } from './ReferenceFinderModal';
import { FoldTimelineHUD } from './FoldTimelineHUD';
import { useDevicePosture } from '../hooks/useDevicePosture';
import { getStudioMoodConfig, calculateMoodLighting, type StudioMood } from '../utils/studioMoods';
import { getKamiOrientationHint } from '../utils/kamiRealism';

type CameraAnglePreset = 'perspective' | 'top' | 'front';
type LightingMood = 'studio' | 'daylight' | 'midnight';

/**
 * 3D Quadratic Bézier Curve for Procedural Trajectory Arrow Extrusion
 * Evaluates B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2 and analytical tangent B'(t)
 */
class OrigamiBezierCurve extends THREE.Curve<THREE.Vector3> {
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;

  constructor(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3) {
    super();
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const u2t = 2 * u * t;

    optionalTarget.set(
      uu * this.p0.x + u2t * this.p1.x + tt * this.p2.x,
      uu * this.p0.y + u2t * this.p1.y + tt * this.p2.y,
      uu * this.p0.z + u2t * this.p1.z + tt * this.p2.z
    );
    return optionalTarget;
  }

  getTangent(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const u = 1 - t;
    const dx = 2 * u * (this.p1.x - this.p0.x) + 2 * t * (this.p2.x - this.p1.x);
    const dy = 2 * u * (this.p1.y - this.p0.y) + 2 * t * (this.p2.y - this.p1.y);
    const dz = 2 * u * (this.p1.z - this.p0.z) + 2 * t * (this.p2.z - this.p1.z);
    optionalTarget.set(dx, dy, dz).normalize();
    return optionalTarget;
  }
}

interface DynamicArrowRig {
  group: THREE.Group;
  materials: THREE.MeshStandardMaterial[];
  geometries: THREE.BufferGeometry[];
  curves: OrigamiBezierCurve[];
  cones: THREE.Mesh[];
  targetCones: THREE.Mesh[];
}

/**
 * Procedural Paper Pulp Fiber Bump Texture
 * Synthesizes an offscreen 256x256 micro-texture providing authentic paper grain
 * without incurring large texture download latency or GPU bloat.
 */
function createPaperNoiseTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const imgData = ctx.createImageData(256, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = 124 + Math.floor((Math.random() - 0.5) * 24);
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = v;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

const sharedPaperNoiseTexture: THREE.CanvasTexture | null = typeof document !== 'undefined' ? createPaperNoiseTexture() : null;

/**
 * Authentic Yoshizawa-Randlett 3D Dashed Crease Marker
 * Renders physical 3D cylindrical dashes and dots elevated just above the paper surface:
 * - Valley Fold: Uniform electric-cyan dashes (- - - - -)
 * - Mountain Fold: Alternating coral-red dash-and-dot (- · - · - · -)
 */
function create3DCreaseDashes(
  x1: number, y1: number,
  x2: number, y2: number,
  isMountain: boolean,
  creasePulseMat: THREE.MeshStandardMaterial,
  isClassroomMode: boolean = false
): THREE.Group {
  const dashGroup = new THREE.Group();
  
  const elevation = isClassroomMode ? 0.052 : 0.045;
  const p1 = new THREE.Vector3(x1 * 0.75, y1 * 0.75, elevation);
  const p2 = new THREE.Vector3(x2 * 0.75, y2 * 0.75, elevation);
  const diff = new THREE.Vector3().subVectors(p2, p1);
  const len = diff.length();
  if (len < 0.02) return dashGroup;

  const dir = diff.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);

  // Subtle translucent guide track along the crease axis
  const guidePts = [p1, p2];
  const guideGeo = new THREE.BufferGeometry().setFromPoints(guidePts);
  const guideMat = new THREE.LineBasicMaterial({
    color: isMountain ? 0xf43f5e : 0x00f0ff,
    transparent: true,
    opacity: 0.3
  });
  dashGroup.add(new THREE.Line(guideGeo, guideMat));

  const cylRadius = isClassroomMode ? 0.016 : 0.009;
  const dotRadius = isClassroomMode ? 0.022 : 0.013;

  if (!isMountain) {
    // VALLEY FOLD: Authentic uniform dashes (- - - - -)
    const dashLen = 0.065;
    const gapLen = 0.035;
    const period = dashLen + gapLen;
    const count = Math.max(1, Math.floor(len / period));

    for (let i = 0; i < count; i++) {
      const centerDist = i * period + dashLen / 2 + (len - count * period) / 2;
      const centerPos = p1.clone().addScaledVector(dir, centerDist);
      
      const cylGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, dashLen, 8);
      const dashMesh = new THREE.Mesh(cylGeo, creasePulseMat);
      dashMesh.position.copy(centerPos);
      dashMesh.quaternion.setFromUnitVectors(up, dir);
      dashGroup.add(dashMesh);
    }
  } else {
    // MOUNTAIN FOLD: Authentic Dash-Dot pattern (- · - · - · -)
    const dashLen = 0.065;
    const gap1 = 0.022;
    const dotLen = 0.018;
    const gap2 = 0.022;
    const period = dashLen + gap1 + dotLen + gap2;
    const count = Math.max(1, Math.floor(len / period));

    for (let i = 0; i < count; i++) {
      const baseDist = i * period + (len - count * period) / 2;
      
      // Long Dash
      const dashCenter = baseDist + dashLen / 2;
      const dashPos = p1.clone().addScaledVector(dir, dashCenter);
      const cylGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, dashLen, 8);
      const dashMesh = new THREE.Mesh(cylGeo, creasePulseMat);
      dashMesh.position.copy(dashPos);
      dashMesh.quaternion.setFromUnitVectors(up, dir);
      dashGroup.add(dashMesh);

      // Dot (Sphere)
      const dotCenter = baseDist + dashLen + gap1 + dotLen / 2;
      if (dotCenter < len) {
        const dotPos = p1.clone().addScaledVector(dir, dotCenter);
        const sphereGeo = new THREE.SphereGeometry(dotRadius, 8, 8);
        const dotMesh = new THREE.Mesh(sphereGeo, creasePulseMat);
        dotMesh.position.copy(dotPos);
        dashGroup.add(dotMesh);
      }
    }
  }

  return dashGroup;
}

/**
 * Historical Crease Memory (Past Folds)
 * Renders subtle, dashed fold memory marks on paper faces from earlier steps.
 */
function createMemoryCreases(kitId: string, totalSteps: number, currentStep: number): THREE.Group {
  const memoryGroup = new THREE.Group();
  const memoryMat = new THREE.LineDashedMaterial({
    color: 0x94a3b8,
    dashSize: 0.04,
    gapSize: 0.025,
    transparent: true,
    opacity: 0.38
  });

  for (let s = 0; s < currentStep; s++) {
    const m = calculateStepPlanMetrics(kitId, s, totalSteps, 1.0);
    const p1 = new THREE.Vector3(m.creaseLine.x1 * 0.75, m.creaseLine.y1 * 0.75, 0.038);
    const p2 = new THREE.Vector3(m.creaseLine.x2 * 0.75, m.creaseLine.y2 * 0.75, 0.038);
    const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const line = new THREE.Line(geo, memoryMat);
    line.computeLineDistances();
    memoryGroup.add(line);
  }

  return memoryGroup;
}



export const StudioViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const {
    activeKitId,
    currentStepIdx,
    setCurrentStepIdx,
    foldFactor,
    setFoldFactor,
    isClassroomMode,
    setClassroomMode,
    ageTrack,
    theme,
    isLooping,
    autoAdvance,
    playbackSpeed,
    isPlaying,
    setIsPlaying,
    isPlayAll,
    setIsPlayAll,
    markKitCompleted,
    isCalmMode,
    cameraPreset,
    setCameraPreset,
    lightingMood,
    isPancakeFlipped,
    setPancakeFlipped,
    previewCompletionModel,
    isAutoRotating,
    showRefFinderModal,
    setShowRefFinderModal,
    showWaveHud,
    enableDynamicRelaxation,
    setDynamicRelaxation,
    paperStock,
    studioMood,
  } = useOrigamiStore();
  const kit = getKitById(activeKitId) || getKitById('japanese-01')!;
  const currentStep = kit?.steps?.[currentStepIdx] || kit?.steps?.[0];
  const { playCrease } = useOrigamiAudio();

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof Worker === 'undefined') return;
    try {
      const worker = new Worker(new URL('../workers/dynamicRelaxation.worker.ts', import.meta.url), { type: 'module' });
      workerRef.current = worker;

      worker.onmessage = (e) => {
        if (e.data && e.data.type === 'update' && e.data.positions) {
          const state = threeState.current;
          if (!state?.paperMesh) return;
          const mainMesh = state.paperMesh.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh);
          if (mainMesh && mainMesh.geometry) {
            const posAttr = mainMesh.geometry.getAttribute('position');
            if (posAttr && posAttr.array) {
              (posAttr.array as Float32Array).set(e.data.positions);
              posAttr.needsUpdate = true;
            }
          }
        }
      };

      worker.onerror = (err) => {
        console.warn('Dynamic relaxation worker error, falling back to analytical kinematics:', err);
        setDynamicRelaxation(false);
      };

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (err) {
      console.warn('Worker initialization failed:', err);
    }
  }, [setDynamicRelaxation]);

  const [showWireframe] = useState<boolean>(true);
  const [showFoldHints] = useState<boolean>(true);
  const [showStrainHeatmap] = useState<boolean>(false);
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);

  // W3C Device Posture Foldable Hardware Sensor (kami integration)
  useDevicePosture(useCallback((hingeFactor: number) => {
    setFoldFactor(hingeFactor);
  }, [setFoldFactor]));

  // Reset pancake flip when switching kits or changing step
  useEffect(() => {
    setPancakeFlipped(false);
    if (threeState.current) {
      threeState.current.flipAngle = 0;
      threeState.current.targetFlipAngle = 0;
    }
  }, [activeKitId, currentStepIdx, setPancakeFlipped]);

  useEffect(() => {
    if (threeState.current) {
      threeState.current.targetFlipAngle = isPancakeFlipped ? Math.PI : 0;
    }
  }, [isPancakeFlipped]);

  useEffect(() => {
    if (window.location.hash.includes('smartboard') || window.location.search.includes('smartboard')) {
      setClassroomMode(true);
    }
  }, [setClassroomMode]);

  const totalSteps = kit.steps ? kit.steps.length : 5;
  const isCompletedView = previewCompletionModel || currentStepIdx === totalSteps - 1;
  const metrics = calculateStepPlanMetrics(kit.id, currentStepIdx, totalSteps, foldFactor);

  // Adjust canvas and lighting when entering or exiting classroom smartboard mode
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 80);
    const state = threeState.current;
    if (state?.ambientLight) {
      const isLight = document.documentElement.classList.contains('light');
      state.ambientLight.intensity = isClassroomMode ? 1.25 : (isLight ? 1.05 : 0.85);
    }
    return () => clearTimeout(timer);
  }, [isClassroomMode]);

  const threeState = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    paperMesh?: THREE.Group;
    wireframeMesh?: THREE.LineSegments;
    creaseMesh?: THREE.Line;
    arcMesh?: THREE.Line;
    dynamicArrowRig?: DynamicArrowRig;
    travellingArrow?: {
      curve: THREE.CatmullRomCurve3;
      cone: THREE.Mesh;
      beads: THREE.Mesh[];
      targetCone: THREE.Mesh;
    };
    rippleMesh?: THREE.Mesh;
    targetBullseye?: THREE.Group;
    creasePulseMat?: THREE.MeshStandardMaterial;
    plinthGroup?: THREE.Group;
    ambientLight?: THREE.AmbientLight;
    keyLight?: THREE.DirectionalLight;
    rimLight?: THREE.DirectionalLight;
    fillLight?: THREE.DirectionalLight;
    isMouseDown: boolean;
    prevMouseX: number;
    prevMouseY: number;
    rotX: number;
    rotY: number;
    targetRotX: number;
    targetRotY: number;
    flipAngle: number;
    targetFlipAngle: number;
    cameraDist: number;
    animFrameId?: number;
    autoRotateRef: boolean;
  } | null>(null);

  // Sync auto-rotate ref (Calm Mode disables all automated motion)
  useEffect(() => {
    if (threeState.current) {
      threeState.current.autoRotateRef = isCalmMode ? false : isAutoRotating;
    }
  }, [isAutoRotating, isCalmMode]);

  // Lighting presets
  const applyLightingMood = useCallback((mood: LightingMood) => {
    const state = threeState.current;
    if (!state || !state.ambientLight || !state.keyLight || !state.rimLight || !state.fillLight) return;

    if (mood === 'studio') {
      state.keyLight.color.setHex(0xfffbf0);
      state.keyLight.intensity = 1.25;
      state.rimLight.color.setHex(0xfff5ea);
      state.rimLight.intensity = 0.75;
      state.fillLight.color.setHex(0xe2e8f0);
      state.fillLight.intensity = 0.35;
      state.ambientLight.color.setHex(0xffffff);
      state.ambientLight.intensity = 0.40;
    } else if (mood === 'daylight') {
      state.keyLight.color.setHex(0xffffff);
      state.keyLight.intensity = 1.35;
      state.rimLight.color.setHex(0x93c5fd);
      state.rimLight.intensity = 0.5;
      state.fillLight.color.setHex(0xf1f5f9);
      state.fillLight.intensity = 0.45;
      state.ambientLight.color.setHex(0xffffff);
      state.ambientLight.intensity = 0.50;
    } else if (mood === 'midnight') {
      state.keyLight.color.setHex(0x38bdf8);
      state.keyLight.intensity = 1.1;
      state.rimLight.color.setHex(0xf59e0b);
      state.rimLight.intensity = 1.15;
      state.fillLight.color.setHex(0x6366f1);
      state.fillLight.intensity = 0.4;
      state.ambientLight.color.setHex(0x0f172a);
      state.ambientLight.intensity = 0.35;
    }
  }, []);

  // Unified Aesthetic Mood Lighting & Backdrop Calibrator
  const applyStudioMood = useCallback((mood: StudioMood) => {
    const state = threeState.current;
    if (!state || !state.ambientLight || !state.keyLight || !state.rimLight || !state.fillLight || !state.scene) return;

    const lights = calculateMoodLighting(mood);
    const config = getStudioMoodConfig(mood);

    state.ambientLight.color.setHex(lights.ambientLight.color);
    state.ambientLight.intensity = lights.ambientLight.intensity;

    state.keyLight.color.setHex(lights.keyLight.color);
    state.keyLight.intensity = lights.keyLight.intensity;
    state.keyLight.position.set(...lights.keyLight.position);

    state.fillLight.color.setHex(lights.fillLight.color);
    state.fillLight.intensity = lights.fillLight.intensity;
    state.fillLight.position.set(...lights.fillLight.position);

    state.rimLight.color.setHex(lights.rimLight.color);
    state.rimLight.intensity = lights.rimLight.intensity;
    state.rimLight.position.set(...lights.rimLight.position);

    const isLight = document.documentElement.classList.contains('light');
    const clearColor = isLight ? config.floorColorLight : config.floorColor;
    if (state.renderer) {
      state.renderer.setClearColor(clearColor, 1.0);
    }
    state.scene.background = new THREE.Color(clearColor);
  }, []);

  useEffect(() => {
    applyStudioMood(studioMood);
  }, [studioMood, applyStudioMood]);

  // Reactive Three.js Canvas & Lighting Theme Synchronization
  useEffect(() => {
    applyLightingMood(lightingMood);
  }, [lightingMood]);

  useEffect(() => {
    applyCameraPreset(cameraPreset);
  }, [cameraPreset]);

  useEffect(() => {
    const state = threeState.current;
    if (!state || !state.renderer || !state.scene) return;

    const isLight = theme === 'light';
    const clearColor = isLight ? 0xfaf8f5 : 0x0c0a09;
    state.renderer.setClearColor(clearColor, 1.0);
    state.scene.background = new THREE.Color(clearColor);

    if (state.ambientLight) {
      state.ambientLight.intensity = isLight ? 0.45 : 0.35;
      state.ambientLight.color.setHex(isLight ? 0xfffaf0 : 0xffffff);
    }
    if (state.keyLight) {
      state.keyLight.intensity = isLight ? 1.25 : 1.15;
      state.keyLight.color.setHex(isLight ? 0xfffbf0 : 0xfff7ed);
    }
    if (state.plinthGroup) {
      const plinthMesh = state.plinthGroup.children[0] as THREE.Mesh;
      if (plinthMesh && plinthMesh.material instanceof THREE.MeshStandardMaterial) {
        plinthMesh.material.color.setHex(isLight ? 0xe7e4dc : 0x101422);
      }
    }
  }, [theme]);

  // Camera presets
  const applyCameraPreset = (preset: CameraAnglePreset) => {
    const state = threeState.current;
    if (!state) return;
    setCameraPreset(preset);

    if (preset === 'perspective') {
      // Desk View: 40° elevation angle (50° polar angle from vertical), FOV 32°
      state.targetRotX = 0.70;
      state.targetRotY = -0.45;
      state.cameraDist = 4.2;
    } else if (preset === 'top') {
      // True Architectural Plan View (Direct Top-Down Orthographic feel)
      state.targetRotX = Math.PI / 2;
      state.targetRotY = 0.0;
      state.cameraDist = 4.0;
    } else if (preset === 'front') {
      state.targetRotX = 0.0;
      state.targetRotY = 0.0;
      state.cameraDist = 4.2;
    }
    state.camera.position.set(0, 0.55, state.cameraDist);
    state.camera.lookAt(0, 0.22, 0);
  };

  const resetCamera = () => {
    const state = threeState.current;
    if (!state) return;
    state.targetRotX = 0.70;
    state.targetRotY = -0.45;
    state.cameraDist = 4.2;
    state.camera.position.set(0, 0.55, 4.2);
    state.camera.lookAt(0, 0.22, 0);
    setCameraPreset('perspective');
    setFoldFactor(0.0);
  };

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();

    // Perspective Camera: Desk View sweet spot (FOV 32°)
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 3.8);
    camera.lookAt(0, 0.22, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialTheme = useOrigamiStore.getState().theme;
    const isInitialLight = initialTheme === 'light';
    const initClearColor = isInitialLight ? 0xfaf8f5 : 0x0c0a09;
    renderer.setClearColor(initClearColor, 1.0);
    scene.background = new THREE.Color(initClearColor);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('OrigamiStudio: WebGL context lost. Suspending render loop.');
      if (state.animFrameId) {
        cancelAnimationFrame(state.animFrameId);
        state.animFrameId = undefined;
      }
    };

    const onContextRestored = () => {
      console.info('OrigamiStudio: WebGL context restored. Resuming render loop.');
      renderer.setClearColor(initClearColor, 1.0);
      animate();
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('webglcontextlost', onContextLost, false);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored, false);

    // 3-Point Photographic Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(isInitialLight ? 0xfffaf0 : 0xffffff, isInitialLight ? 0.45 : 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(isInitialLight ? 0xfffbf0 : 0xfff7ed, isInitialLight ? 1.25 : 1.15);
    keyLight.position.set(4.5, 9.0, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.2;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfff5ea, 0.75);
    rimLight.position.set(0, 8, -7);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.35);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    // Soft Tabletop Contact Shadow Receiver directly under model base
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 128;
    contactCanvas.height = 128;
    const cCtx = contactCanvas.getContext('2d');
    if (cCtx) {
      const grad = cCtx.createRadialGradient(64, 64, 8, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(0, 0, 128, 128);
    }
    const contactTexture = new THREE.CanvasTexture(contactCanvas);
    const contactGeo = new THREE.PlaneGeometry(2.6, 2.6);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTexture,
      transparent: true,
      depthWrite: false
    });
    const contactShadowMesh = new THREE.Mesh(contactGeo, contactMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.y = -0.01;
    scene.add(contactShadowMesh);

    // Exhibition Plinth (Pedestal) & Glowing Accent Halo
    const plinthGroup = new THREE.Group();
    plinthGroup.position.set(0, -0.92, 0);

    const baseCylGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 48);
    const baseCylMat = new THREE.MeshStandardMaterial({
      color: isInitialLight ? 0xe7e4dc : 0x101422,
      roughness: 0.45,
      metalness: 0.65
    });
    const plinthMesh = new THREE.Mesh(baseCylGeo, baseCylMat);
    plinthMesh.receiveShadow = true;
    plinthGroup.add(plinthMesh);

    const ringGeo = new THREE.RingGeometry(1.68, 1.74, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const haloMesh = new THREE.Mesh(ringGeo, ringMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.045;
    plinthGroup.add(haloMesh);
    scene.add(plinthGroup);

    // Floor Shadow Receiver
    const floorGeo = new THREE.PlaneGeometry(14, 14);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.96;
    floor.receiveShadow = true;
    scene.add(floor);

    // Procedural 3D Origami Master Hands Rig
    const state: NonNullable<typeof threeState.current> = {
      scene,
      camera,
      renderer,
      paperMesh: undefined,
      wireframeMesh: undefined,
      creaseMesh: undefined,
      arcMesh: undefined,
      travellingArrow: undefined,
      rippleMesh: undefined,
      targetBullseye: undefined,
      creasePulseMat: undefined,
      plinthGroup,
      ambientLight,
      keyLight,
      rimLight,
      fillLight,
      isMouseDown: false,
      prevMouseX: 0,
      prevMouseY: 0,
      rotX: 0.22,
      rotY: -0.45,
      targetRotX: 0.22,
      targetRotY: -0.45,
      flipAngle: 0,
      targetFlipAngle: 0,
      cameraDist: 3.8,
      animFrameId: undefined,
      autoRotateRef: false
    };
    threeState.current = state;

    container.style.touchAction = 'none';

    // Unified Pointer and Multi-Touch Pinch Controls
    const activePointers = new Map<number, { x: number; y: number }>();
    let initialPinchDist = 0;
    let initialCameraDist = state.cameraDist;

    const onPointerDown = (e: PointerEvent) => {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size === 1) {
        state.isMouseDown = true;
        state.prevMouseX = e.clientX;
        state.prevMouseY = e.clientY;
        try { container.setPointerCapture(e.pointerId); } catch {}
      } else if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        initialCameraDist = state.cameraDist;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 1 && state.isMouseDown) {
        const deltaX = e.clientX - state.prevMouseX;
        const deltaY = e.clientY - state.prevMouseY;
        state.prevMouseX = e.clientX;
        state.prevMouseY = e.clientY;

        state.targetRotY += deltaX * 0.008;
        state.targetRotX += deltaY * 0.008;
        state.targetRotX = Math.max(-1.4, Math.min(1.4, state.targetRotX));
      } else if (activePointers.size === 2 && initialPinchDist > 0) {
        const pts = Array.from(activePointers.values());
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (currentDist > 5) {
          const scale = initialPinchDist / currentDist;
          state.cameraDist = Math.max(2.2, Math.min(7.5, initialCameraDist * scale));
          camera.position.z = state.cameraDist;
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      if (container.hasPointerCapture(e.pointerId)) {
        try { container.releasePointerCapture(e.pointerId); } catch {}
      }
      if (activePointers.size < 2) initialPinchDist = 0;
      if (activePointers.size === 0) state.isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.cameraDist += e.deltaY * 0.003;
      state.cameraDist = Math.max(2.2, Math.min(7.5, state.cameraDist));
      camera.position.z = state.cameraDist;
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Window Resize
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    const animate = () => {
      state.animFrameId = requestAnimationFrame(animate);

      const isCompletedPreview = useOrigamiStore.getState().previewCompletionModel;
      if ((state.autoRotateRef || isCompletedPreview) && !state.isMouseDown) {
        state.targetRotY += 0.008;
      }

      state.flipAngle += (state.targetFlipAngle - state.flipAngle) * 0.08;
      state.rotX += (state.targetRotX - state.rotX) * 0.1;
      state.rotY += (state.targetRotY - state.rotY) * 0.1;

      if (state.paperMesh) {
        state.paperMesh.rotation.x = state.rotX + state.flipAngle;
        state.paperMesh.rotation.y = state.rotY;
        // Elevated floating bob + gentle flip arc hop during 180° pancake turnover
        const flipHop = Math.sin(Math.min(Math.PI, Math.max(0, state.flipAngle))) * 0.22;
        state.paperMesh.position.y = 0.22 + flipHop + Math.sin(Date.now() * 0.002) * 0.035;
      }

      const now = performance.now();

      // 1. Dynamic Travelling Fold Arrow along trajectory arc
      if (state.dynamicArrowRig) {
        const f = useOrigamiStore.getState().foldFactor;
        // Opacity lifecycle: full opacity 0.0 to 0.75, decays linearly to 0 at 1.0
        let alpha = 1.0;
        if (f <= 0.75) {
          alpha = 1.0;
        } else if (f < 1.0) {
          alpha = Math.max(0.0, 1.0 - (f - 0.75) / 0.25);
        } else {
          alpha = 0.0;
        }

        state.dynamicArrowRig.materials.forEach((mat) => {
          mat.opacity = alpha;
          mat.visible = alpha > 0.01;
        });
        state.dynamicArrowRig.group.visible = alpha > 0.01;

        if (alpha > 0.01) {
          const u = Math.min(0.98, Math.max(0.02, f));
          state.dynamicArrowRig.curves.forEach((curve, idx) => {
            const cone = state.dynamicArrowRig?.cones[idx];
            if (cone) {
              const pt = curve.getPoint(u);
              const tangent = curve.getTangent(u);
              cone.position.copy(pt);
              cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
            }
            const targetCone = state.dynamicArrowRig?.targetCones[idx];
            if (targetCone) {
              targetCone.scale.setScalar(1.0 + 0.12 * Math.sin(now * 0.006));
            }
          });
        }
      } else if (state.travellingArrow) {
        const { curve, cone, beads, targetCone } = state.travellingArrow;
        const t = (now * 0.00065) % 1.0;
        const pt = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        cone.position.copy(pt);
        cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        const s = 0.85 + 0.25 * Math.sin(t * Math.PI);
        cone.scale.set(s, s, s);

        // Flowing energy beads along arc
        beads.forEach((bead: THREE.Mesh, idx: number) => {
          const beadT = (t + idx / beads.length) % 1.0;
          const bPt = curve.getPointAt(beadT);
          bead.position.copy(bPt);
          const bScale = 0.5 + 0.5 * Math.sin(beadT * Math.PI);
          bead.scale.setScalar(bScale);
        });

        // Pulsing target destination cone
        if (targetCone) {
          targetCone.scale.setScalar(1.0 + 0.12 * Math.sin(now * 0.006));
        }
      }

      // 2. Point ❶ expanding beacon ripple
      if (state.rippleMesh) {
        const ripplePhase = (now * 0.0012) % 1.0;
        state.rippleMesh.scale.set(0.6 + ripplePhase * 1.5, 0.6 + ripplePhase * 1.5, 1.0);
        const mat = state.rippleMesh.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = (1.0 - ripplePhase) * 0.9;
      }

      // 3. Point ❷ target bullseye pulse
      if (state.targetBullseye) {
        const bullseyePulse = 1.0 + 0.12 * Math.sin(now * 0.005);
        state.targetBullseye.scale.set(bullseyePulse, bullseyePulse, 1.0);
      }

      // 4. Crease dashes pulsating breathing glow
      if (state.creasePulseMat) {
        state.creasePulseMat.emissiveIntensity = 0.7 + 0.35 * Math.sin(now * 0.004);
      }

      camera.lookAt(0, 0.22, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
      if (state.dynamicArrowRig) {
        state.dynamicArrowRig.geometries.forEach((g) => g.dispose());
        state.dynamicArrowRig.materials.forEach((m) => m.dispose());
      }
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      renderer.dispose();
    };
  }, []);

  // Update Procedural 3D Mesh whenever activeKitId, currentStepIdx, or foldFactor change
  useEffect(() => {
    const state = threeState.current;
    if (!state || !kit) return;

    if (state.paperMesh) {
      state.scene.remove(state.paperMesh);
      state.paperMesh.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
      });
    }

    const paperSpec = kit.paper?.[0];
    const frontHex = paperSpec?.frontColorHex || kit.accent || '#0284c7';
    const frontColor = parseInt(frontHex.replace('#', '0x'));

    // Calibrated Aesthetic Mood & Tactile Paper Stock Presets
    const moodConfig = getStudioMoodConfig(studioMood);
    const activeStock = paperStock || moodConfig.paperStock;

    let frontRoughness = isClassroomMode ? 0.92 : moodConfig.roughness;
    let frontMetalness = isClassroomMode ? 0.0 : moodConfig.metalness;
    let paperBackColor = paperSpec?.backColorHex ? parseInt(paperSpec.backColorHex.replace('#', '0x')) : moodConfig.backColor;
    let backRoughness = moodConfig.backRoughness;
    let bumpScale = moodConfig.bumpScale;

    if (activeStock === 'washi') {
      frontRoughness = 0.94;
      frontMetalness = 0.0;
      paperBackColor = 0xfbf7ee; // Warm mulberry unbleached washi fiber
      backRoughness = 0.96;
      bumpScale = 0.0075;
    } else if (activeStock === 'foil') {
      frontRoughness = 0.28;
      frontMetalness = 0.72; // Metallic festival foil sheen
      bumpScale = 0.0016;
      paperBackColor = 0xfcfdfd;
      backRoughness = 0.90;
    } else if (activeStock === 'kami') {
      frontRoughness = 0.88;
      frontMetalness = 0.01;
      paperBackColor = 0xfcfdfd;
      backRoughness = 0.92;
      bumpScale = 0.0032;
    }

    const materials = [
      new THREE.MeshStandardMaterial({
        color: frontColor,
        roughness: frontRoughness,
        metalness: frontMetalness,
        bumpMap: sharedPaperNoiseTexture || undefined,
        bumpScale: bumpScale,
        side: THREE.FrontSide,
        flatShading: true
      }),
      new THREE.MeshStandardMaterial({
        color: paperBackColor,
        roughness: backRoughness,
        metalness: 0.0,
        bumpMap: sharedPaperNoiseTexture || undefined,
        bumpScale: bumpScale * 0.85,
        side: THREE.BackSide,
        flatShading: true
      })
    ];

    const group = new THREE.Group();
    group.position.set(0, 0.22, 0);

    // Synthesize dedicated, step-accurate 3D geometry for this exact kit and step!
    const isCompletedView = previewCompletionModel || currentStepIdx === totalSteps - 1;
    const effectiveStep = isCompletedView ? totalSteps - 1 : currentStepIdx;
    const effectiveFold = isCompletedView ? 1.0 : Math.max(0.01, Math.min(1.0, foldFactor));
    const geo = synthesizeKitStepGeometry(kit.id, effectiveStep, totalSteps, effectiveFold);
    currentGeoRef.current = geo;

    if (enableDynamicRelaxation && workerRef.current) {
      const posAttr = geo.getAttribute('position');
      if (posAttr && posAttr.array) {
        workerRef.current.postMessage({
          type: 'init',
          positions: new Float32Array(posAttr.array)
        });
        workerRef.current.postMessage({
          type: 'step',
          foldFactor: effectiveFold
        });
      }
    }

    // Dynamic Strain Heatmap (Origami Simulator physics-inspired)
    // Facet tension shifts from relaxed emerald (0.0) -> elastic amber (0.5) -> peak compression crimson (1.0)
    const frontMat = showStrainHeatmap
      ? new THREE.MeshStandardMaterial({
          color: foldFactor < 0.25 ? 0x10b981 : foldFactor < 0.7 ? 0xf59e0b : 0xef4444,
          roughness: 0.42,
          metalness: 0.12,
          side: THREE.FrontSide,
          flatShading: true
        })
      : materials[0];

    const backMat = showStrainHeatmap
      ? new THREE.MeshStandardMaterial({
          color: foldFactor < 0.35 ? 0x059669 : foldFactor < 0.8 ? 0xd97706 : 0xdc2626,
          roughness: 0.42,
          metalness: 0.12,
          side: THREE.BackSide,
          flatShading: true
        })
      : materials[1];

    const frontMesh = new THREE.Mesh(geo, frontMat);
    const backMesh = new THREE.Mesh(geo, backMat);
    frontMesh.castShadow = true;
    frontMesh.receiveShadow = true;
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    group.add(frontMesh);
    group.add(backMesh);

    // Subtle, Realistic Crease Edge Lines
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: showWireframe ? 0.12 : 0.0
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireMesh);
    state.wireframeMesh = wireMesh;

    // Historical Crease Memory (renders past step creases in subtle slate dashes on the paper)
    if (currentStepIdx > 0 && !isCompletedView) {
      const memoryCreases = createMemoryCreases(kit.id, totalSteps, currentStepIdx);
      group.add(memoryCreases);
    }

    // Authentic Yoshizawa-Randlett 3D Folding Guidance (Dashed Crease Markers + Animated Flow Arrow)
    if (showFoldHints && !isCompletedView) {
      const isMountain = metrics.foldCategory === 'mountain' || metrics.foldCategory === 'reverse';

      // 1. Glowing 3D Dashed Crease Marker (Cylindrical dashes: Valley = dashes, Mountain = dash-dot)
      const creaseMat = new THREE.MeshStandardMaterial({
        color: isMountain ? 0xf43f5e : 0x00f0ff,
        emissive: isMountain ? 0xe11d48 : 0x00b4d8,
        emissiveIntensity: 0.85,
        roughness: 0.15
      });
      state.creasePulseMat = creaseMat;

      const creaseDashGroup = create3DCreaseDashes(
        metrics.creaseLine.x1, metrics.creaseLine.y1,
        metrics.creaseLine.x2, metrics.creaseLine.y2,
        isMountain,
        creaseMat,
        isClassroomMode
      );
      group.add(creaseDashGroup);

      // 1B. 2D Stylized Pinch Glyphs at active crease endpoints
      const pinchGeo = new THREE.RingGeometry(0.02, 0.045, 16);
      const pinchMat = new THREE.MeshBasicMaterial({
        color: 0xd97706,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const pinch1 = new THREE.Mesh(pinchGeo, pinchMat);
      pinch1.position.set(metrics.creaseLine.x1 * 0.75, metrics.creaseLine.y1 * 0.75, 0.053);
      const pinch2 = pinch1.clone();
      pinch2.position.set(metrics.creaseLine.x2 * 0.75, metrics.creaseLine.y2 * 0.75, 0.053);
      group.add(pinch1);
      group.add(pinch2);

      // 2. Point ❶ Landmark: Corner to Lift (Beacon Ring + Glowing Dot + Animated Expanding Ripple)
      const ptA = new THREE.Vector3(metrics.mobileVertex[0] * 0.75, metrics.mobileVertex[1] * 0.75, 0.06);
      
      const ringAGeo = new THREE.RingGeometry(0.045, 0.075, 24);
      const ringAMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const ringAMesh = new THREE.Mesh(ringAGeo, ringAMat);
      ringAMesh.position.set(ptA.x, ptA.y, ptA.z);
      group.add(ringAMesh);

      // Expanding animated ripple wave
      const rippleGeo = new THREE.RingGeometry(0.06, 0.095, 24);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
      rippleMesh.position.set(ptA.x, ptA.y, 0.062);
      group.add(rippleMesh);
      state.rippleMesh = rippleMesh;

      const dotAGeo = new THREE.SphereGeometry(0.026, 12, 12);
      const dotAMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const dotAMesh = new THREE.Mesh(dotAGeo, dotAMat);
      dotAMesh.position.set(ptA.x, ptA.y, 0.07);
      group.add(dotAMesh);

      // 3. Point ❷ Landmark: Target Destination (Amber Bullseye Concentric Rings)
      const lastTraj = metrics.trajectoryPath[metrics.trajectoryPath.length - 1];
      if (lastTraj) {
        const ptB = new THREE.Vector3(lastTraj.x * 0.75, lastTraj.y * 0.75, 0.06);
        const bullseyeGroup = new THREE.Group();
        bullseyeGroup.position.set(ptB.x, ptB.y, ptB.z);

        const ringBGeo = new THREE.RingGeometry(0.065, 0.095, 24);
        const ringBMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95
        });
        const ringBMesh = new THREE.Mesh(ringBGeo, ringBMat);
        bullseyeGroup.add(ringBMesh);

        const innerRingBGeo = new THREE.RingGeometry(0.018, 0.038, 24);
        const innerRingBMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95
        });
        const innerRingBMesh = new THREE.Mesh(innerRingBGeo, innerRingBMat);
        bullseyeGroup.add(innerRingBMesh);

        group.add(bullseyeGroup);
        state.targetBullseye = bullseyeGroup;
      } else {
        state.targetBullseye = undefined;
      }

      // 4. Procedural 3D Quadratic Bézier Trajectory Arrow Rig (Tube + Cone with Memory Safety)
      if (state.dynamicArrowRig) {
        state.dynamicArrowRig.geometries.forEach((g) => g.dispose());
        state.dynamicArrowRig.materials.forEach((m) => m.dispose());
        state.dynamicArrowRig = undefined;
      }

      const flaps = metrics.mobileFlaps && metrics.mobileFlaps.length > 0
        ? metrics.mobileFlaps
        : [
            {
              id: 'primary',
              start: metrics.trajectoryArc.start,
              target: metrics.trajectoryArc.target,
              badge: 'amber' as const,
              creaseLine: metrics.creaseLine,
            }
          ];

      const arrowRigGroup = new THREE.Group();
      const arrowMaterials: THREE.MeshStandardMaterial[] = [];
      const arrowGeometries: THREE.BufferGeometry[] = [];
      const arrowCurves: OrigamiBezierCurve[] = [];
      const arrowCones: THREE.Mesh[] = [];
      const arrowTargetCones: THREE.Mesh[] = [];

      flaps.forEach((flap) => {
        const p0 = new THREE.Vector3(flap.start[0] * 0.75, flap.start[1] * 0.75, 0.06);
        const p2 = new THREE.Vector3(flap.target[0] * 0.75, flap.target[1] * 0.75, 0.06);
        const dist = Math.hypot(flap.target[0] - flap.start[0], flap.target[1] - flap.start[1]);
        const zenithZ = Math.max(0.35, dist * 0.55);
        const p1 = new THREE.Vector3(
          ((flap.start[0] + flap.target[0]) * 0.5) * 0.75,
          ((flap.start[1] + flap.target[1]) * 0.5) * 0.75,
          zenithZ
        );

        const curve = new OrigamiBezierCurve(p0, p1, p2);
        arrowCurves.push(curve);

        // Procedural Tube Geometry along Quadratic Bézier Arc
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.016, 8, false);
        arrowGeometries.push(tubeGeo);

        const isCyan = flap.badge === 'cyan';
        const arrowMat = new THREE.MeshStandardMaterial({
          color: isCyan ? 0x06b6d4 : 0xf59e0b,
          emissive: isCyan ? 0x0891b2 : 0xd97706,
          emissiveIntensity: 0.75,
          roughness: 0.3,
          metalness: 0.6,
          transparent: true,
          opacity: 1.0,
          depthWrite: false,
        });
        arrowMaterials.push(arrowMat);

        const tubeMesh = new THREE.Mesh(tubeGeo, arrowMat);
        arrowRigGroup.add(tubeMesh);

        // Target arrival cone at destination p2
        const targetConeGeo = new THREE.ConeGeometry(0.046, 0.12, 16);
        arrowGeometries.push(targetConeGeo);
        const targetCone = new THREE.Mesh(targetConeGeo, arrowMat);
        const arrivalTangent = curve.getTangent(1.0);
        targetCone.position.copy(p2);
        targetCone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrivalTangent);
        arrowRigGroup.add(targetCone);
        arrowTargetCones.push(targetCone);

        // Travelling cone head positioned at fold progress
        const coneHeadGeo = new THREE.ConeGeometry(0.044, 0.11, 16);
        arrowGeometries.push(coneHeadGeo);
        const coneHeadMesh = new THREE.Mesh(coneHeadGeo, arrowMat);
        const uInit = Math.min(0.98, Math.max(0.02, foldFactor));
        coneHeadMesh.position.copy(curve.getPoint(uInit));
        coneHeadMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangent(uInit));
        arrowRigGroup.add(coneHeadMesh);
        arrowCones.push(coneHeadMesh);
      });

      group.add(arrowRigGroup);
      state.dynamicArrowRig = {
        group: arrowRigGroup,
        materials: arrowMaterials,
        geometries: arrowGeometries,
        curves: arrowCurves,
        cones: arrowCones,
        targetCones: arrowTargetCones,
      };
      state.travellingArrow = undefined;
    } else {
      if (state.dynamicArrowRig) {
        state.dynamicArrowRig.geometries.forEach((g) => g.dispose());
        state.dynamicArrowRig.materials.forEach((m) => m.dispose());
        state.dynamicArrowRig = undefined;
      }
      state.travellingArrow = undefined;
      state.rippleMesh = undefined;
      state.targetBullseye = undefined;
      state.creasePulseMat = undefined;
    }

    state.paperMesh = group;
    state.scene.add(group);
  }, [activeKitId, currentStepIdx, foldFactor, kit, showWireframe, showFoldHints, showStrainHeatmap, totalSteps, metrics, previewCompletionModel, enableDynamicRelaxation, paperStock, studioMood]);

  // Auto-animate folding when active step changes
  useEffect(() => {
    animTimeRef.current = 0.0;
    setFoldFactor(0.0);
    setIsPlaying(true);
  }, [currentStepIdx, setFoldFactor, setIsPlaying]);

  // Automated Fold Simulation Player with Spring-Damper Kinetic Easing & Looping Dwell
  const animTimeRef = useRef<number>(0);
  const dwellTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
      return;
    }

    let isSubscribed = true;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      if (!isSubscribed) return;
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Base cycle duration is 2.8 seconds, scaled inversely by playbackSpeed
      const cycleDuration = 2.8 / (playbackSpeed || 1.0);
      animTimeRef.current += dt / cycleDuration;

      if (animTimeRef.current < 1.0) {
        const easedProgress = calculateSpringDampedProgress(animTimeRef.current);
        setFoldFactor(easedProgress);
        requestAnimationFrame(loop);
      } else {
        // Reached 100% fold completion
        setFoldFactor(1.0);
        playCrease();

        // Dwell pause at completion before next action
        dwellTimerRef.current = window.setTimeout(() => {
          if (!isSubscribed) return;
          if (isPlayAll) {
            if (currentStepIdx < totalSteps - 1) {
              animTimeRef.current = 0.0;
              setFoldFactor(0.0);
              setCurrentStepIdx(currentStepIdx + 1);
              lastTimestamp = performance.now();
              requestAnimationFrame(loop);
            } else {
              // Finished all steps in continuous story playback!
              setIsPlayAll(false);
              setIsPlaying(false);
              markKitCompleted(kit.id, kit.title);
            }
          } else if (autoAdvance && currentStepIdx < totalSteps - 1) {
            animTimeRef.current = 0.0;
            setFoldFactor(0.0);
            setCurrentStepIdx(currentStepIdx + 1);
            lastTimestamp = performance.now();
            requestAnimationFrame(loop);
          } else if (isLooping) {
            animTimeRef.current = 0.0;
            setFoldFactor(0.0);
            lastTimestamp = performance.now();
            requestAnimationFrame(loop);
          } else {
            setIsPlaying(false);
          }
        }, 1100);
      }
    };

    const handle = requestAnimationFrame(loop);
    return () => {
      isSubscribed = false;
      cancelAnimationFrame(handle);
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
    };
  }, [isPlaying, isPlayAll, isLooping, autoAdvance, playbackSpeed, currentStepIdx, totalSteps, playCrease, setFoldFactor, setCurrentStepIdx, setIsPlaying, setIsPlayAll, markKitCompleted, kit.id, kit.title]);

  const togglePlay = () => {
    if (foldFactor >= 0.98) {
      animTimeRef.current = 0.0;
      setFoldFactor(0.0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[radial-gradient(ellipse_at_50%_36%,rgba(242,238,230,0.95)_0%,rgba(235,228,216,0.98)_55%,#faf8f5_100%)] dark:bg-[radial-gradient(ellipse_at_50%_36%,rgba(28,40,68,0.7)_0%,rgba(12,16,28,0.95)_55%,#05060b_100%)] transition-colors duration-200">
      {/* Interactive 3D Paper Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Dynamic Before / Folding / After Paper State Badge (Top-Right Anchor — Non-Intrusive) */}
      {!isCompletedView && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-auto flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border transition-all ${
            foldFactor <= 0.05
              ? 'bg-blue-500/15 border-blue-500/40 text-blue-800 dark:text-blue-300'
              : foldFactor >= 0.95
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              foldFactor <= 0.05
                ? 'bg-blue-500 dark:bg-blue-400 animate-pulse'
                : foldFactor >= 0.95
                ? 'bg-emerald-500 dark:bg-emerald-400'
                : 'bg-amber-500 dark:bg-amber-400 animate-ping'
            }`} />
            <span className="text-[11px] font-mono font-bold tracking-wide">
              {foldFactor <= 0.05
                ? '◀ BEFORE FOLD'
                : foldFactor >= 0.95
                ? '✓ AFTER FOLD'
                : `🔄 FOLDING (${Math.round(foldFactor * 100)}%)`}
            </span>
          </div>
        </div>
      )}

      {/* Completed View Header (if viewing final model) */}
      {isCompletedView && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 bg-white/95 dark:bg-[#0a0d18]/90 backdrop-blur-md border border-amber-500/50 px-3.5 py-1.5 rounded-lg shadow-xl shadow-amber-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 tracking-wide flex items-center gap-1.5">
              <span>🌟 MASTER 3D SCULPTURE</span>
              <span className="text-stone-500 dark:text-slate-400 font-normal hidden sm:inline">• Completed Model</span>
            </span>
          </div>
        </div>
      )}

      {/* Pillar 3: Table Orientation Landmark (Square □ vs Diamond ♢ on desk) */}
      {!isCompletedView && currentStep && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/95 dark:bg-[#11131b]/95 backdrop-blur-md border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200 shadow-sm font-mono text-[10px] sm:text-[11px] font-bold">
          <span className="text-amber-600 dark:text-[#d4af37] text-sm leading-none">
            {currentStep.instruction?.toLowerCase().includes('diamond') || currentStep.title?.toLowerCase().includes('diamond') ? '♢' : '□'}
          </span>
          <span>
            {currentStep.instruction?.toLowerCase().includes('diamond') || currentStep.title?.toLowerCase().includes('diamond') ? 'Diamond on Desk' : 'Square on Desk'}
          </span>
        </div>
      )}

      {/* Pillar 2: Step 1 Color-Side-Down Orientation Callout */}
      {!isCompletedView && currentStepIdx === 0 && !isPancakeFlipped && (
        <div className="absolute top-12 sm:top-4 left-1/2 -translate-x-1/2 bg-rose-500/20 dark:bg-rose-500/30 backdrop-blur-md border border-rose-500/50 text-rose-900 dark:text-rose-200 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 sm:gap-2 z-20 pointer-events-none max-w-[90vw] text-center">
          <span>🎨</span>
          <span className="truncate">{getKamiOrientationHint(kit, currentStepIdx, isPancakeFlipped).callout}</span>
        </div>
      )}

      {/* Pancake Flip Notification Toast */}
      {isPancakeFlipped && (
        <div className="absolute top-12 sm:top-4 left-1/2 -translate-x-1/2 bg-amber-500/25 backdrop-blur-md border border-amber-500/50 text-amber-800 dark:text-amber-200 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold shadow-2xl flex items-center gap-1.5 sm:gap-2 z-20 animate-bounce max-w-[90vw] text-center">
          <span>🥞</span>
          <span className="truncate">Paper Turned Over (180° Flip)! White underside facing up.</span>
        </div>
      )}

      {/* Bottom Controls: Camera Reset & Interaction Hint */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20 pointer-events-auto">
        <button
          onClick={resetCamera}
          className="p-2 rounded-xl bg-white/95 dark:bg-[#11131b]/95 backdrop-blur-md border border-stone-300 dark:border-stone-800 hover:border-amber-500 text-stone-700 dark:text-stone-200 transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-mono"
          title="Reset Camera Framing"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        <div className="text-[11px] font-mono text-stone-500 dark:text-slate-400 bg-white/90 dark:bg-black/60 px-2.5 py-1.5 rounded-xl backdrop-blur-md border border-stone-200 dark:border-white/10 pointer-events-none hidden sm:block">
          🖱️ Drag / 👆 Touch to Orbit • Pinch to Zoom
        </div>
      </div>

      {/* WaveDrom Kinematic Timeline HUD (Actuation & Strain Phase Track - STEM Only) */}
      {showWaveHud && ageTrack === 'stem' && !isClassroomMode && (
        <div className="mb-4">
          <FoldTimelineHUD
            kitTitle={kit.title}
            stepIndex={currentStepIdx + 1}
            totalSteps={totalSteps}
            foldProgress={foldFactor}
            isPlaying={isPlaying}
            onSeek={(p) => {
              setIsPlaying(false);
              animTimeRef.current = p;
              setFoldFactor(p);
            }}
            onTogglePlay={togglePlay}
            onReset={() => {
              setIsPlaying(false);
              animTimeRef.current = 0.0;
              setFoldFactor(0.0);
            }}
          />
        </div>
      )}

      {/* Computational Origami Presets Modal (GitHub Research Integration) */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a0d18] border border-white/15 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-mono">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-wider font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Computational Origami Lab • Open Source Research</span>
                </div>
                <h3 className="text-xl font-bold font-['Clash_Display'] text-white mt-1">
                  MIT FOLD & Origami Simulator Models
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Derived from pioneering GitHub research: Amanda Ghassaei's <em>Origami Simulator</em>, Erik Demaine's <em>MIT FOLD Specification</em>, and Robby Kraft's <em>Rabbit-Ear</em>.
                </p>
              </div>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPUTATIONAL_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 rounded-xl p-4 space-y-3 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                      {preset.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      θ = {preset.foldAngle}°
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 flex items-center justify-between">
                    <span>{preset.verticesCount} Vertices • {preset.creasesCount} Creases</span>
                    <a
                      href={preset.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        downloadFoldFile(kit, currentStepIdx, foldFactor);
                        setShowPresetsModal(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MIT .FOLD</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Citations & GitHub Links */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] text-slate-400 space-y-1.5">
              <strong className="text-white block uppercase text-[10px] tracking-wider">
                Open Source Computational Origami Standards
              </strong>
              <p>
                • <strong>edemaine/fold</strong>: Universal FOLD format standard for storing 2D crease patterns, face layering, and 3D folding animations.
              </p>
              <p>
                • <strong>amandaghassaei/OrigamiSimulator</strong>: Real-time GPU particle simulation & strain physics for rigid origami.
              </p>
              <p>
                • <strong>robbykraft/Rabbit-Ear</strong>: JavaScript computational geometry engine for Kawasaki & Maekawa vertex parity checks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Robert Lang Reference Finder Modal */}
      <ReferenceFinderModal
        isOpen={showRefFinderModal}
        onClose={() => setShowRefFinderModal(false)}
      />
    </div>
  );
};
