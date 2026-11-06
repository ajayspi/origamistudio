import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { detectHardwareBudget, type HardwareBudget } from '../utils/HardwareTierGovernor';

interface HeroKineticStageProps {
  heroFold: number;
}

export const HeroKineticStage: React.FC<HeroKineticStageProps> = ({ heroFold }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useOrigamiStore((state) => state.theme);
  const isCalmMode = useOrigamiStore((state) => state.isCalmMode);

  // Persistent Three.js engine refs
  const engineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    plinth: THREE.Mesh;
    haloRing: THREE.Mesh;
    centralGroup: THREE.Group;
    satellitesGroup: THREE.Group;
    particles: THREE.Points | null;
    particlePositions: Float32Array | null;
    particleVelocities: Float32Array | null;
    budget: HardwareBudget;
    animId?: number;
    rotY: number;
    targetRotY: number;
    rotX: number;
    targetRotX: number;
    lastTime: number;
    isVisible: boolean;
  } | null>(null);

  // Initialize unified single WebGL scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const budget = detectHardwareBudget(isCalmMode);
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: budget.maxDPR < 2,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(budget.maxDPR);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = budget.enableDynamicShadows;
    if (budget.enableDynamicShadows) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const isLight = theme === 'light';

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(
      isLight ? 0xfffaf0 : 0xffffff,
      isLight ? 1.15 : 0.95
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      isLight ? 0xfffdfa : 0xfff5ea,
      isLight ? 1.5 : 1.4
    );
    keyLight.position.set(4, 6, 5);
    if (budget.enableDynamicShadows) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.85);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(0, -4, 3);
    scene.add(fillLight);

    // Exhibition Plinth (Sandstone in Light mode, Dark Slate in Dark mode)
    const plinthGeo = new THREE.CylinderGeometry(1.55, 1.68, 0.04, 48);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe8e4dc : 0x0c0f1a,
      roughness: 0.55,
      metalness: 0.5,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.75;
    if (budget.enableDynamicShadows) {
      plinth.receiveShadow = true;
    }
    scene.add(plinth);

    // Gold Accent Halo Ring
    const ringGeo = new THREE.RingGeometry(1.58, 1.62, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const haloRing = new THREE.Mesh(ringGeo, ringMat);
    haloRing.rotation.x = -Math.PI / 2;
    haloRing.position.y = -0.728;
    scene.add(haloRing);

    // Central Monument Group
    const centralGroup = new THREE.Group();
    centralGroup.position.set(0, 0.12, 0);
    scene.add(centralGroup);

    // Satellites Group (for orbiters)
    const satellitesGroup = new THREE.Group();
    satellitesGroup.position.set(0, 0.12, 0);
    scene.add(satellitesGroup);

    // Build Kinetic Satellites if enabled
    if (budget.enableOrbitals && !isCalmMode) {
      const satelliteModels = [
        { color: 0x059669, scale: 0.22, orbitR: 1.75, speed: 0.7, yOffset: 0.35 },  // Crane (Emerald)
        { color: 0x0891b2, scale: 0.20, orbitR: 1.55, speed: -0.9, yOffset: -0.2 }, // Frog (Cyan)
        { color: 0xd97706, scale: 0.24, orbitR: 1.95, speed: 0.5, yOffset: 0.15 },  // Airplane (Amber)
        { color: 0x7c3aed, scale: 0.18, orbitR: 1.40, speed: -1.1, yOffset: 0.45 }, // Star (Purple)
      ];

      satelliteModels.forEach((sat) => {
        const satMeshGroup = new THREE.Group();
        // Zero-cut faceted paper tetrahedral origami shape
        const satGeo = new THREE.OctahedronGeometry(sat.scale, 0);
        const satMat = new THREE.MeshStandardMaterial({
          color: sat.color,
          roughness: 0.35,
          metalness: 0.15,
          flatShading: true,
        });
        const mesh = new THREE.Mesh(satGeo, satMat);
        satMeshGroup.add(mesh);
        satMeshGroup.userData = { ...sat, baseAngle: Math.random() * Math.PI * 2 };
        satellitesGroup.add(satMeshGroup);
      });
    }

    // Unified Particle System (Stardust & Crease Sparklers via THREE.Points)
    let particles: THREE.Points | null = null;
    let particlePositions: Float32Array | null = null;
    let particleVelocities: Float32Array | null = null;

    if (budget.particleCount > 0 && !isCalmMode) {
      const pCount = budget.particleCount;
      const particleGeo = new THREE.BufferGeometry();
      particlePositions = new Float32Array(pCount * 3);
      particleVelocities = new Float32Array(pCount * 3);

      for (let i = 0; i < pCount; i++) {
        const i3 = i * 3;
        // Distribute in a spherical halo avoiding center text area
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.2 + Math.random() * 2.2;
        particlePositions[i3] = Math.cos(angle) * radius;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 2.4;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 1.8;

        particleVelocities[i3] = (Math.random() - 0.5) * 0.004;
        particleVelocities[i3 + 1] = 0.002 + Math.random() * 0.004; // Gentle upward float
        particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.038,
        color: isLight ? 0xb45309 : 0xfbbf24, // Gold stardust
        transparent: true,
        opacity: isLight ? 0.45 : 0.75,
      });

      particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);
    }

    const state = {
      scene,
      camera,
      renderer,
      plinth,
      haloRing,
      centralGroup,
      satellitesGroup,
      particles,
      particlePositions,
      particleVelocities,
      budget,
      rotY: -0.4,
      targetRotY: -0.4,
      rotX: 0.18,
      targetRotX: 0.18,
      lastTime: performance.now(),
      isVisible: true,
      animId: undefined as number | undefined,
    };
    engineRef.current = state;

    // Mouse movement interaction for gentle 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (isCalmMode) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      state.targetRotY = -0.4 + x * 0.35;
      state.targetRotX = 0.18 - y * 0.2;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Visibility & Scrolled-out Throttling via IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
        if (state.isVisible && !state.animId && !isCalmMode) {
          state.lastTime = performance.now();
          animate();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      state.isVisible = !document.hidden;
      if (state.isVisible && !state.animId && !isCalmMode) {
        state.lastTime = performance.now();
        animate();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Main 60 FPS Render Loop (Protected against delta spikes & GC pauses)
    const animate = () => {
      if (!state.isVisible) {
        state.animId = undefined;
        return;
      }

      state.animId = requestAnimationFrame(animate);

      const now = performance.now();
      const _delta = Math.min((now - state.lastTime) / 1000, 0.1);
      void _delta;
      state.lastTime = now;

      if (!isCalmMode) {
        state.targetRotY += 0.003;
        state.rotY += (state.targetRotY - state.rotY) * 0.08;
        state.rotX += (state.targetRotX - state.rotX) * 0.08;

        centralGroup.rotation.y = state.rotY;
        centralGroup.rotation.x = state.rotX;
        centralGroup.position.y = 0.12 + Math.sin(now * 0.0018) * 0.025;

        // Animate Kinetic Satellites
        if (satellitesGroup.children.length > 0) {
          satellitesGroup.children.forEach((child) => {
            const data = child.userData;
            const currentAngle = data.baseAngle + (now * 0.0008 * data.speed);
            child.position.x = Math.cos(currentAngle) * data.orbitR;
            child.position.z = Math.sin(currentAngle) * data.orbitR;
            child.position.y = data.yOffset + Math.sin(now * 0.002 + currentAngle) * 0.08;
            child.rotation.y += 0.02;
            child.rotation.x += 0.015;
          });
        }

        // In-place particle update (0 GC allocations)
        if (particles && particlePositions && particleVelocities) {
          const pCount = state.budget.particleCount;
          for (let i = 0; i < pCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] += particleVelocities[i3];
            particlePositions[i3 + 1] += particleVelocities[i3 + 1];
            particlePositions[i3 + 2] += particleVelocities[i3 + 2];

            // Boundary wrap
            if (particlePositions[i3 + 1] > 1.8) {
              particlePositions[i3 + 1] = -0.8;
            }
            if (Math.abs(particlePositions[i3]) > 3.0) {
              particlePositions[i3] = -particlePositions[i3] * 0.9;
            }
          }
          particles.geometry.attributes.position.needsUpdate = true;
        }
      } else {
        // Calm mode: steady static presentation
        centralGroup.rotation.y = -0.4;
        centralGroup.rotation.x = 0.18;
        centralGroup.position.y = 0.12;
      }

      renderer.render(scene, camera);
    };

    if (isCalmMode) {
      // 1-shot render for calm mode
      renderer.render(scene, camera);
    } else {
      animate();
    }

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isCalmMode) renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // Deterministic React 19 Cleanup
    return () => {
      if (state.animId) cancelAnimationFrame(state.animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Deep GPU VRAM disposal
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      if (particles) {
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
      }

      plinthGeo.dispose();
      plinthMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      engineRef.current = null;
    };
  }, [theme, isCalmMode]);

  // Dynamic mesh update when heroFold changes
  useEffect(() => {
    const state = engineRef.current;
    if (!state) return;

    // Clear existing central mesh
    while (state.centralGroup.children.length > 0) {
      const child = state.centralGroup.children[0];
      state.centralGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material?.dispose();
      }
    }

    const f = heroFold;
    const S = 1.35;

    // Dual-Sided Materials: Washi White + Kintsugi Gold Underside
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0xf5f2eb,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.FrontSide,
      flatShading: true,
    });

    const backMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.42,
      side: THREE.BackSide,
      flatShading: true,
    });

    const vertices: number[] = [];
    const addTri = (p1: number[], p2: number[], p3: number[]) => {
      vertices.push(...p1, ...p2, ...p3);
    };
    const addQuad = (p1: number[], p2: number[], p3: number[], p4: number[]) => {
      vertices.push(...p1, ...p2, ...p3, ...p1, ...p3, ...p4);
    };

    // Authentic 12-Faceted Origami Star-Craned Pavilion Form
    const wingLift = Math.sin(f * Math.PI * 0.5) * 1.35;
    const chestPuff = f * 0.6;
    const neckAngle = f * 1.15;

    // Center Dorsal Spine & Torso
    addQuad([-0.25, -0.5, 0], [0.25, -0.5, 0], [0.18, 0.4, chestPuff], [-0.18, 0.4, chestPuff]);
    // Swept Sculptural Wings
    addQuad(
      [-0.18, 0.4, chestPuff],
      [-S * (1 - f * 0.12), 0.25 + wingLift, -0.2],
      [-S * 0.85, -0.35 + wingLift, -0.1],
      [-0.25, -0.5, 0]
    );
    addQuad(
      [0.18, 0.4, chestPuff],
      [0.25, -0.5, 0],
      [S * 0.85, -0.35 + wingLift, -0.1],
      [S * (1 - f * 0.12), 0.25 + wingLift, -0.2]
    );
    // Sculpted Crown Neck & Beak
    addQuad(
      [-0.1, 0.4, chestPuff],
      [0.1, 0.4, chestPuff],
      [0.06, 1.05 + f * 0.25, chestPuff + neckAngle],
      [-0.06, 1.05 + f * 0.25, chestPuff + neckAngle]
    );
    addTri(
      [-0.06, 1.05 + f * 0.25, chestPuff + neckAngle],
      [0.06, 1.05 + f * 0.25, chestPuff + neckAngle],
      [0, 1.25 + f * 0.2, chestPuff + neckAngle - 0.2 * f]
    );
    // Slender Tapered Tail
    addQuad(
      [-0.18, -0.5, 0],
      [0.18, -0.5, 0],
      [0.08, -1.2 - f * 0.25, -0.25],
      [-0.08, -1.2 - f * 0.25, -0.25]
    );

    // Concentric Miura-Ori Geometric Facets around Base
    const ribs = 8;
    for (let i = 0; i < ribs; i++) {
      const a1 = (i / ribs) * Math.PI * 2;
      const a2 = ((i + 1) / ribs) * Math.PI * 2;
      const rInner = 0.45 * (1 - f * 0.2);
      const rOuter = 1.15 * (0.4 + 0.6 * f);
      const hFacet = (i % 2 === 0 ? 0.35 : -0.25) * f;

      const p1 = [Math.cos(a1) * rInner, -0.3, Math.sin(a1) * rInner];
      const p2 = [Math.cos(a2) * rInner, -0.3, Math.sin(a2) * rInner];
      const p3 = [Math.cos((a1 + a2) / 2) * rOuter, -0.3 + hFacet, Math.sin((a1 + a2) / 2) * rOuter];
      addTri(p1, p2, p3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    const frontMesh = new THREE.Mesh(geo, frontMat);
    const backMesh = new THREE.Mesh(geo, backMat);
    if (state.budget.enableDynamicShadows) {
      frontMesh.castShadow = true;
      backMesh.castShadow = true;
    }
    state.centralGroup.add(frontMesh);
    state.centralGroup.add(backMesh);

    // Blueprint Crease Lines
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.2,
    });
    state.centralGroup.add(new THREE.LineSegments(wireGeo, wireMat));

    if (isCalmMode) {
      state.renderer.render(state.scene, state.camera);
    }
  }, [heroFold, isCalmMode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden"
    />
  );
};

export default HeroKineticStage;
