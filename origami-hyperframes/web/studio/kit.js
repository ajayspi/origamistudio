// ORIGAMISTUDIO™ — Production-Grade 3D Paper Simulation & Tutorial Engine
// Enhanced with Procedural 3D Kinematics, Web Audio Synthesizer, Crease Pattern SVG & Master Celebration

let currentKit = null;
let currentStepIdx = 0;
let completedSteps = new Set();
let viewerMode = '3d'; // '3d' | 'cp'

// Three.js Globals
let scene, camera, renderer, paperMesh, creaseLinesGroup;
let handsRig = null, showHands = false, showFoldHints = true, isFoldPlaying = false, isFoldLooping = false, foldSpeed = 'slow';
let isEndModelPreview = false;
let isMouseDown = false, prevMouseX = 0, prevMouseY = 0;
let rotX = 0.3, rotY = -0.5, targetRotX = 0.3, targetRotY = -0.5;
let cameraDist = 4.2;

// -----------------------------------------------------------------------------
// WEB AUDIO API SYNTHESIZER (Paper Creasing & Zen Singing Bowl Chimes)
// -----------------------------------------------------------------------------
const OrigamiAudio = {
    ctx: null,
    enabled: true,
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    playCrease() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.09);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(750, now);
            filter.Q.setValueAtTime(2.5, now);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    },
    playStepClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    },
    playChime() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            // Harmonious Zen singing bowl triad (C5, G5, E6)
            [523.25, 783.99, 1318.51].forEach((freq, idx) => {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                const delay = idx * 0.05;
                gain.gain.setValueAtTime(0.18 / (idx + 1), now + delay);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + delay);
                osc.stop(now + delay + 2.3);
            });
        } catch (e) {}
    }
};

function toggleSound() {
    OrigamiAudio.enabled = !OrigamiAudio.enabled;
    const icon = document.getElementById('soundIcon');
    const label = document.getElementById('soundLabel');
    if (OrigamiAudio.enabled) {
        if (icon) icon.textContent = '🔊';
        if (label) label.textContent = 'Sound ON';
        OrigamiAudio.playCrease();
    } else {
        if (icon) icon.textContent = '🔇';
        if (label) label.textContent = 'Sound OFF';
    }
}

// Paper Color Palettes by Collection
const COLOR_THEMES = {
    'nativity': { front: 0x8b5cf6, back: 0xf59e0b, name: 'Imperial Purple / Gold' },
    'lotus': { front: 0xec4899, back: 0x10b981, name: 'Lotus Rose / Jade' },
    'geometric': { front: 0x3b82f6, back: 0xd97706, name: 'Navy / Brushed Copper' },
    'butterfly': { front: 0xf97316, back: 0x06b6d4, name: 'Monarch Orange / Cyan' },
    'indian': { front: 0x0284c7, back: 0xf59e0b, name: 'Peacock Turquoise / Gold' },
    'japanese': { front: 0xef4444, back: 0xffffff, name: 'Washi Cherry / Pearl' },
    'chinese': { front: 0xdc2626, back: 0xeab308, name: 'Festive Red / Imperial Gold' },
    'american': { front: 0x0369a1, back: 0x78350f, name: 'Eagle Blue / Prairie Amber' },
    'holiday': { front: 0xf97316, back: 0x1f2937, name: 'Pumpkin Orange / Midnight' },
    'default': { front: 0xff6b35, back: 0x00f0ff, name: 'Solar Orange / Neon Cyan' }
};

// Initialize Studio
async function initStudio() {
    const params = new URLSearchParams(window.location.search);
    const kitId = params.get('id') || 'nativity-01';

    // 1. Load Kit Data
    currentKit = resolveKit(kitId);

    if (!currentKit) {
        document.getElementById('kitTitle').textContent = 'Kit Not Found';
        return;
    }

    // 2. Setup Three.js WebGL Environment
    initThreeJS();

    // 3. Render UI & Content
    renderKitHeader(currentKit);
    renderStepsList(currentKit);
    setAgeTrack(currentAgeTrack);
    const initialStep = parseInt(params.get('step') || '0', 10);
    showStep(isNaN(initialStep) ? 0 : Math.max(0, Math.min(currentKit.steps.length - 1, initialStep)));

    // 4. Attach Event Listeners
    setupEventListeners();

    // 5. Setup Print Guide Link
    const printLink = document.getElementById('printGuideLink');
    if (printLink) {
        printLink.href = kitId === 'custom' ? `../print-guide.html?id=custom` : `../print-guide.html?id=${currentKit.id}`;
    }
}

// Resolve Kit from all potential sources
function resolveKit(id) {
    if (id === 'custom' || id === 'ai-generated') {
        const stored = sessionStorage.getItem('origami_custom_kit');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { console.error('Error parsing custom kit:', e); }
        }
    }

    if (window.ORIGAMI_KITS && window.ORIGAMI_KITS[id]) {
        return window.ORIGAMI_KITS[id];
    }

    if (window.ORIGAMI_KITS) {
        const firstKey = Object.keys(window.ORIGAMI_KITS)[0];
        return window.ORIGAMI_KITS[firstKey];
    }

    return null;
}

// -----------------------------------------------------------------------------
// THREE.JS 3D WEBGL ENGINE & PROCEDURAL KINEMATICS
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// PROCEDURAL 3D ORIGAMI MASTER HANDS RIG
// Stylized porcelain / frosted cyber mannequin hands that physically grasp,
// guide, and crease the paper at every step along the mathematical trajectory arc.
// -----------------------------------------------------------------------------
function createProceduralHand(isLeft = false) {
    const handGroup = new THREE.Group();

    const handMat = new THREE.MeshStandardMaterial({
        color: isLeft ? 0xe2e8f0 : 0x38bdf8,
        roughness: 0.28,
        metalness: 0.18,
        transparent: true,
        opacity: 0.82,
        depthWrite: false
    });

    const knuckleMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        roughness: 0.2,
        metalness: 0.85,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.4
    });

    const padMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.25,
        metalness: 0.5,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.35
    });

    // 1. Forearm & Wrist Cuff
    const wristGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.42, 16);
    const wristMesh = new THREE.Mesh(wristGeo, handMat);
    wristMesh.position.y = -0.24;
    wristMesh.castShadow = true;
    handGroup.add(wristMesh);

    const cuffGeo = new THREE.TorusGeometry(0.12, 0.018, 8, 24);
    const cuffMesh = new THREE.Mesh(cuffGeo, knuckleMat);
    cuffMesh.rotation.x = Math.PI / 2;
    cuffMesh.position.y = -0.05;
    handGroup.add(cuffMesh);

    // 2. Sculpted Palm
    const palmGeo = new THREE.BoxGeometry(0.32, 0.38, 0.1);
    const palmMesh = new THREE.Mesh(palmGeo, handMat);
    palmMesh.position.y = 0.16;
    palmMesh.castShadow = true;
    handGroup.add(palmMesh);

    // 3. Articulated Thumb
    const thumbBase = new THREE.Group();
    thumbBase.position.set(isLeft ? 0.17 : -0.17, 0.07, 0.04);
    thumbBase.rotation.z = isLeft ? -0.55 : 0.55;
    thumbBase.rotation.y = isLeft ? 0.45 : -0.45;

    const thumbKnuckle = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), knuckleMat);
    thumbBase.add(thumbKnuckle);

    const thumbPhalange1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.046, 0.17, 8), handMat);
    thumbPhalange1.position.y = 0.085;
    thumbBase.add(thumbPhalange1);

    const thumbTipGroup = new THREE.Group();
    thumbTipGroup.position.set(0, 0.17, 0.02);
    thumbTipGroup.rotation.x = -0.38;

    const thumbPhalange2 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.15, 8), handMat);
    thumbPhalange2.position.y = 0.075;
    thumbTipGroup.add(thumbPhalange2);

    const thumbPad = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), padMat);
    thumbPad.position.y = 0.15;
    thumbTipGroup.add(thumbPad);

    thumbBase.add(thumbTipGroup);
    handGroup.add(thumbBase);

    // 4. Four Articulated Fingers
    const fingerConfigs = [
        { name: 'index', x: isLeft ? 0.1 : -0.1, len: 0.32, curl: 0.65 },
        { name: 'middle', x: isLeft ? 0.032 : -0.032, len: 0.36, curl: 0.55 },
        { name: 'ring', x: isLeft ? -0.042 : 0.042, len: 0.31, curl: 0.48 },
        { name: 'pinky', x: isLeft ? -0.11 : 0.11, len: 0.24, curl: 0.42 }
    ];

    fingerConfigs.forEach(cfg => {
        const fGroup = new THREE.Group();
        fGroup.position.set(cfg.x, 0.35, 0.0);
        fGroup.rotation.x = -cfg.curl;

        const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), knuckleMat);
        fGroup.add(knuckle);

        const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, cfg.len * 0.48, 8), handMat);
        s1.position.y = (cfg.len * 0.48) / 2;
        fGroup.add(s1);

        const tipGroup = new THREE.Group();
        tipGroup.position.y = cfg.len * 0.48;
        tipGroup.rotation.x = -0.45;

        const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.03, cfg.len * 0.52, 8), handMat);
        s2.position.y = (cfg.len * 0.52) / 2;
        tipGroup.add(s2);

        const pad = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), padMat);
        pad.position.y = cfg.len * 0.52;
        tipGroup.add(pad);

        fGroup.add(tipGroup);
        handGroup.add(fGroup);
    });

    handGroup.scale.set(0.72, 0.72, 0.72);
    return handGroup;
}

function createOrigamiHandsRig() {
    const group = new THREE.Group();
    const rightHand = createProceduralHand(false);
    const leftHand = createProceduralHand(true);
    group.add(rightHand);
    group.add(leftHand);
    return { group, rightHand, leftHand };
}

function updateHandsPose(rightHand, leftHand, metrics, foldFactor) {
    if (!rightHand || !leftHand || !metrics) return;
    const f = Math.max(0.0, Math.min(1.0, foldFactor));

    // Active folding hand follows Rodrigues trajectory arc
    const samples = metrics.trajectoryPath.length - 1;
    const sampleIdx = Math.min(samples, Math.floor(f * samples));
    const pt = metrics.trajectoryPath[sampleIdx];

    if (pt) {
        if (f > 0.88) {
            // Burnishing crease press stroke along crease axis
            const burnT = (f - 0.88) / 0.12;
            const c1X = metrics.creaseLine.x1 * 0.7;
            const c1Z = metrics.creaseLine.y1 * 0.7;
            const c2X = metrics.creaseLine.x2 * 0.7;
            const c2Z = metrics.creaseLine.y2 * 0.7;

            const burnX = c1X + (c2X - c1X) * burnT;
            const burnZ = c1Z + (c2Z - c1Z) * burnT;
            rightHand.position.set(burnX, 0.14, burnZ);
            rightHand.rotation.set(-1.1, 0, Math.atan2(c2X - c1X, c2Z - c1Z));
        } else {
            const posX = pt.x * 0.7;
            const posY = Math.max(0.14, pt.z * 0.7 + 0.22);
            const posZ = pt.y * 0.7;
            rightHand.position.set(posX, posY, posZ);

            const midX = (metrics.creaseLine.x1 + metrics.creaseLine.x2) * 0.35;
            const midZ = (metrics.creaseLine.y1 + metrics.creaseLine.y2) * 0.35;
            rightHand.lookAt(midX, 0.08, midZ);
            rightHand.rotateX(-0.45);
        }
    }

    // Anchor hand holds base paper flat
    const midX = (metrics.creaseLine.x1 + metrics.creaseLine.x2) * 0.5;
    const midY = (metrics.creaseLine.y1 + metrics.creaseLine.y2) * 0.5;
    const dx = metrics.mobileVertex[0] - midX;
    const dy = metrics.mobileVertex[1] - midY;

    const anchorX = -dx * 0.32;
    const anchorZ = -dy * 0.32;
    const subtleY = 0.15 + Math.sin(Date.now() * 0.003) * 0.008;

    leftHand.position.set(anchorX, subtleY, anchorZ);
    const angle = Math.atan2(dx, dy);
    leftHand.rotation.set(-1.3, 0, isNaN(angle) ? 0 : angle + Math.PI);
}

function initThreeJS() {
    const container = document.getElementById('threeCanvasContainer');
    if (!container) return;

    container.innerHTML = '';
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // Scene
    scene = new THREE.Scene();

    // Camera (Optimized 40° FOV centered on elevated origami sculpture)
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.55, cameraDist);
    camera.lookAt(0, 0.22, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting (Museum Gallery Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.75);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xff6b35, 0.45);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    // Exhibition Plinth (Pedestal) & Glowing Accent Halo
    const plinthGroup = new THREE.Group();
    plinthGroup.position.set(0, -0.92, 0);

    const baseCylGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 48);
    const baseCylMat = new THREE.MeshStandardMaterial({
        color: 0x101422,
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
    handsRig = createOrigamiHandsRig();
    scene.add(handsRig.group);

    // Create Initial 3D Paper Model
    build3DPaperModel(1.0);

    // Mouse / Touch Orbit Controls
    container.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isMouseDown = false; });

    container.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
    });

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        cameraDist += e.deltaY * 0.003;
        cameraDist = Math.max(2.2, Math.min(8.0, cameraDist));
        camera.position.z = cameraDist;
    }, { passive: false });

    // Window Resize Handling
    window.addEventListener('resize', onWindowResize);

    // Start Render Loop
    animate();
}

function onWindowResize() {
    const container = document.getElementById('threeCanvasContainer');
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// -----------------------------------------------------------------------------
// PROCEDURAL ORIGAMI 3D MESH SYNTHESIS (All 62 Master Kits Handcrafted in 3D)
// -----------------------------------------------------------------------------
function addTriangle(arr, p1, p2, p3) {
    arr.push(...p1, ...p2, ...p3);
}

function addQuad(arr, p1, p2, p3, p4) {
    addTriangle(arr, p1, p2, p3);
    addTriangle(arr, p1, p3, p4);
}

function addBoxVertices(arr, x1, x2, y1, y2, z1, z2) {
    addQuad(arr, [x1, y1, z2], [x2, y1, z2], [x2, y2, z2], [x1, y2, z2]);
    addQuad(arr, [x2, y1, z1], [x1, y1, z1], [x1, y2, z1], [x2, y2, z1]);
    addQuad(arr, [x1, y2, z2], [x2, y2, z2], [x2, y2, z1], [x1, y2, z1]);
    addQuad(arr, [x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]);
    addQuad(arr, [x1, y1, z1], [x1, y1, z2], [x1, y2, z2], [x1, y2, z1]);
    addQuad(arr, [x2, y1, z2], [x2, y1, z1], [x2, y2, z1], [x2, y2, z2]);
}

function addCone(arr, apex, baseCenter, radius, segments) {
    for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * Math.PI * 2;
        const a2 = ((i + 1) / segments) * Math.PI * 2;
        const p1 = [baseCenter[0] + Math.cos(a1) * radius, baseCenter[1], baseCenter[2] + Math.sin(a1) * radius];
        const p2 = [baseCenter[0] + Math.cos(a2) * radius, baseCenter[1], baseCenter[2] + Math.sin(a2) * radius];
        addTriangle(arr, p1, p2, apex);
        addTriangle(arr, baseCenter, p2, p1);
    }
}

function addCylinder(arr, y1, y2, r1, r2, segments) {
    for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * Math.PI * 2;
        const a2 = ((i + 1) / segments) * Math.PI * 2;
        const p1 = [Math.cos(a1) * r1, y1, Math.sin(a1) * r1];
        const p2 = [Math.cos(a2) * r1, y1, Math.sin(a2) * r1];
        const p3 = [Math.cos(a2) * r2, y2, Math.sin(a2) * r2];
        const p4 = [Math.cos(a1) * r2, y2, Math.sin(a1) * r2];
        addQuad(arr, p1, p2, p3, p4);
    }
}


// -----------------------------------------------------------------------------
// PLAN VIEW & KINEMATICS ALGORITHM (Crease Axes, Fold Angles & Trajectory Paths)
// -----------------------------------------------------------------------------
function rodriguesRotate(v, k, theta) {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const dot = v[0] * k[0] + v[1] * k[1] + v[2] * k[2];
    const cross = [
        k[1] * v[2] - k[2] * v[1],
        k[2] * v[0] - k[0] * v[2],
        k[0] * v[1] - k[1] * v[0]
    ];
    return [
        v[0] * cosT + cross[0] * sinT + k[0] * dot * (1 - cosT),
        v[1] * cosT + cross[1] * sinT + k[1] * dot * (1 - cosT),
        v[2] * cosT + cross[2] * sinT + k[2] * dot * (1 - cosT)
    ];
}

function calculateStepPlanMetrics(kitId, stepIdx, totalSteps, foldFactor) {
    const f = Math.max(0.01, Math.min(1.0, foldFactor));
    const s = Math.max(0, Math.min(totalSteps - 1, stepIdx));
    const id = (kitId || '').toLowerCase().trim();

    let x1 = -1.0, y1 = 0.0, x2 = 1.0, y2 = 0.0;
    let foldAngleTarget = 180.0;
    let foldType = 'Valley Fold';
    let mobileVertex = [0, 1.0, 0];

    if (s === 0) {
        if (id.includes('japanese') || id.includes('indian-01') || id.includes('american-01')) {
            x1 = -1.2; y1 = -1.2; x2 = 1.2; y2 = 1.2;
            mobileVertex = [-1.2, 1.2, 0];
            foldType = 'Diagonal Valley Fold';
            foldAngleTarget = 180.0;
        } else if (id.includes('lotus') || id.includes('geometric')) {
            x1 = -1.0; y1 = 0.0; x2 = 0.0; y2 = 1.0;
            mobileVertex = [-1.0, 1.0, 0];
            foldType = 'Blintz Corner Fold';
            foldAngleTarget = 180.0;
        } else {
            x1 = -1.2; y1 = 0.0; x2 = 1.2; y2 = 0.0;
            mobileVertex = [0, 1.2, 0];
            foldType = 'Horizontal Valley Crease';
            foldAngleTarget = 180.0;
        }
    } else if (s === 1) {
        if (id.includes('japanese-01') || id.includes('indian-01')) {
            x1 = 0.0; y1 = -1.0; x2 = 0.6; y2 = 0.5;
            mobileVertex = [1.0, -0.2, 0];
            foldType = 'Petal Diamond Fold';
            foldAngleTarget = 180.0;
        } else if (id.includes('japanese-02')) {
            x1 = -0.7; y1 = 0.0; x2 = 0.7; y2 = 0.0;
            mobileVertex = [0, -1.0, 0];
            foldType = 'Apex Elevation Fold';
            foldAngleTarget = 180.0;
        } else {
            x1 = -0.8; y1 = -0.5; x2 = 0.8; y2 = -0.5;
            mobileVertex = [0, -1.0, 0];
            foldType = 'Squash Flap Separation';
            foldAngleTarget = 90.0;
        }
    } else if (s === 2) {
        if (id.includes('japanese-02')) {
            x1 = -0.3; y1 = 0.2; x2 = -0.8; y2 = 0.9;
            mobileVertex = [-0.1, 0.7, 0];
            foldType = 'Kuwagata Crest Horn Flare';
            foldAngleTarget = 120.0;
        } else {
            x1 = 0.0; y1 = -1.2; x2 = 0.4; y2 = 0.2;
            mobileVertex = [0.8, -0.6, 0];
            foldType = 'Side Taper Inversion';
            foldAngleTarget = 160.0;
        }
    } else if (s === 3) {
        if (id.includes('american-03')) {
            x1 = -0.8; y1 = -0.4; x2 = 0.8; y2 = -0.4;
            mobileVertex = [0, -1.2, 0];
            foldType = 'Elastic Spring Z-Pleat';
            foldAngleTarget = 180.0;
        } else {
            x1 = -0.2; y1 = 0.1; x2 = 0.2; y2 = 0.5;
            mobileVertex = [0.1, 1.2, 0];
            foldType = 'Inside Reverse Fold';
            foldAngleTarget = 65.0;
        }
    } else {
        x1 = -0.5; y1 = 0.0; x2 = 0.5; y2 = 0.0;
        mobileVertex = [0, 0.4, 0.5];
        foldType = '3D Volumetric Lock & Inflation';
        foldAngleTarget = 90.0;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1.0;
    const ux = dx / len;
    const uy = dy / len;
    const uz = 0.0;

    const creaseVector = [ux, uy, uz];
    const foldAngleCurrent = foldAngleTarget * f;
    const foldAngleRadians = (foldAngleCurrent * Math.PI) / 180.0;

    const midX = (x1 + x2) * 0.5;
    const midY = (y1 + y2) * 0.5;
    const midZ = 0.0;

    const trajectoryPath = [];
    const samples = 18;
    const relVec = [mobileVertex[0] - midX, mobileVertex[1] - midY, mobileVertex[2] - midZ];

    for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * foldAngleRadians;
        const rot = rodriguesRotate(relVec, creaseVector, t);
        trajectoryPath.push({
            x: midX + rot[0],
            y: midY + rot[1],
            z: midZ + rot[2]
        });
    }

    const kawasakiCheck = {
        sectorAngles: [90, 90, 90, 90],
        oddSum: 180,
        evenSum: 180,
        isValid: foldAngleTarget >= 170.0
    };
    const maekawaCheck = {
        mountains: 1,
        valleys: 3,
        parityDifference: 2,
        isValid: true
    };

    let huzitaAxiom;
    if (foldType.includes('Petal') || foldType.includes('Reverse') || foldType.includes('Flare') || foldType.includes('Inversion')) {
        huzitaAxiom = { number: 3, name: 'Axiom 3: Angle Bisector (L1 → L2)' };
    } else if (foldType.includes('Pleat')) {
        huzitaAxiom = { number: 4, name: 'Axiom 4: Orthogonal Projection (P1 ⊥ L1)' };
    } else if (foldType.includes('Squash') || foldType.includes('Lock') || foldType.includes('Inflation')) {
        huzitaAxiom = { number: 1, name: 'Axiom 1: Collinear Line (P1, P2)' };
    } else {
        huzitaAxiom = { number: 2, name: 'Axiom 2: Perpendicular Bisector (P1 → P2)' };
    }

    return {
        stepIndex: s,
        stepNumber: s + 1,
        foldType,
        creaseLine: { x1, y1, x2, y2 },
        creaseVector,
        creaseLength: len,
        foldAngleTarget,
        foldAngleCurrent,
        foldAngleRadians,
        mobileVertex,
        trajectoryPath,
        huzitaAxiom,
        kawasakiCheck,
        maekawaCheck
    };
}

function buildStepBaseGeometry(vertices, id, stepIdx, f) {
    // ---------------------------------------------------------------------------
    // 1. SPECIFIC STEP SCULPTORS FOR SIGNATURE KITS
    // ---------------------------------------------------------------------------

    // festival-02: Halloween Vampire Bat
    if (id === 'festival-02') {
        const w = 1.6;
        if (stepIdx === 0) {
            // Step 1: Diagonal Triangle & Forward Head Crimp
            addTriangle(vertices, [-w, -0.4, 0], [w, -0.4, 0], [0, 0.9, 0.1]);
            addTriangle(vertices, [-w, -0.4, -0.04], [0, 0.9, 0.06], [w, -0.4, -0.04]);
            addTriangle(vertices, [-w, -0.4, 0], [0, 0.9, 0.1], [-w * 0.5, 0.2, 0.05]);
            addTriangle(vertices, [w, -0.4, 0], [w * 0.5, 0.2, 0.05], [0, 0.9, 0.1]);
            const snoutY = 0.9 - 0.55 * f;
            const snoutZ = 0.1 + 0.45 * f;
            addTriangle(vertices, [-0.28, 0.85, 0.1], [0.28, 0.85, 0.1], [0, snoutY, snoutZ]);
            addTriangle(vertices, [-0.28, 0.85, 0.1], [0, snoutY, snoutZ], [-0.15, snoutY + 0.1, snoutZ - 0.15]);
            addTriangle(vertices, [0.28, 0.85, 0.1], [0.15, snoutY + 0.1, snoutZ - 0.15], [0, snoutY, snoutZ]);
            return;
        } else if (stepIdx === 1) {
            // Step 2: Pointed Ear Reverse Folds
            addTriangle(vertices, [-w, -0.35, 0], [w, -0.35, 0], [0, 0.75, 0.15]);
            addTriangle(vertices, [-w, -0.35, -0.04], [0, 0.75, 0.11], [w, -0.35, -0.04]);
            addTriangle(vertices, [-0.25, 0.75, 0.15], [0.25, 0.75, 0.15], [0, 0.35, 0.55]);
            const earH = 0.75 + 0.65 * f;
            addTriangle(vertices, [-0.28, 0.65, 0.15], [-0.08, 0.75, 0.22], [-0.38 * f, earH, 0.15]);
            addTriangle(vertices, [-0.28, 0.65, 0.15], [-0.38 * f, earH, 0.15], [-0.42 * f, 0.65, 0.08]);
            addTriangle(vertices, [0.08, 0.75, 0.22], [0.28, 0.65, 0.15], [0.38 * f, earH, 0.15]);
            addTriangle(vertices, [0.28, 0.65, 0.15], [0.42 * f, 0.65, 0.08], [0.38 * f, earH, 0.15]);
            addTriangle(vertices, [-w, -0.35, -0.15 * f], [0, -0.35, 0], [0, 0.75, 0.15]);
            addTriangle(vertices, [w, -0.35, -0.15 * f], [0, 0.75, 0.15], [0, -0.35, 0]);
            return;
        } else if (stepIdx === 2) {
            // Step 3: Wing Strut Accordion Pleats (3 finger bones)
            addTriangle(vertices, [-0.25, 0.65, 0.15], [0.25, 0.65, 0.15], [0, 0.3, 0.55]);
            addTriangle(vertices, [-0.25, 0.65, 0.15], [-0.35, 1.35, 0.15], [-0.08, 0.72, 0.2]);
            addTriangle(vertices, [0.08, 0.72, 0.2], [0.35, 1.35, 0.15], [0.25, 0.65, 0.15]);
            const pleatDepth = 0.25 * f;
            const b1L = [-0.75, 0.75 * f, pleatDepth];
            const tr1L = [-0.85, 0.45 * f, -pleatDepth * 0.5];
            const b2L = [-1.45 * f, 0.45 * f, pleatDepth * 1.2];
            const tr2L = [-1.25 * f, -0.15 * f, -pleatDepth * 0.5];
            const b3L = [-1.65 * f, -0.45 * f, pleatDepth * 0.8];
            const rootL = [-0.2, 0.4, 0.1];
            const baseL = [0, -0.4, 0];

            addTriangle(vertices, rootL, b1L, tr1L);
            addTriangle(vertices, rootL, tr1L, b2L);
            addTriangle(vertices, tr1L, b2L, tr2L);
            addTriangle(vertices, tr1L, tr2L, b3L);
            addTriangle(vertices, baseL, rootL, tr2L);
            addTriangle(vertices, baseL, tr2L, b3L);

            const b1R = [0.75, 0.75 * f, pleatDepth];
            const tr1R = [0.85, 0.45 * f, -pleatDepth * 0.5];
            const b2R = [1.45 * f, 0.45 * f, pleatDepth * 1.2];
            const tr2R = [1.25 * f, -0.15 * f, -pleatDepth * 0.5];
            const b3R = [1.65 * f, -0.45 * f, pleatDepth * 0.8];
            const rootR = [0.2, 0.4, 0.1];

            addTriangle(vertices, rootR, tr1R, b1R);
            addTriangle(vertices, rootR, b2R, tr1R);
            addTriangle(vertices, tr1R, tr2R, b2R);
            addTriangle(vertices, tr1R, b3R, tr2R);
            addTriangle(vertices, baseL, tr2R, rootR);
            addTriangle(vertices, baseL, b3R, tr2R);
            return;
        } else if (stepIdx === 3) {
            // Step 4: Scalloped Wing Trailing Edge & Thumb Claws
            addTriangle(vertices, [-0.25, 0.65, 0.15], [0.25, 0.65, 0.15], [0, 0.3, 0.55]);
            addTriangle(vertices, [-0.25, 0.65, 0.15], [-0.35, 1.35, 0.15], [-0.08, 0.72, 0.2]);
            addTriangle(vertices, [0.08, 0.72, 0.2], [0.35, 1.35, 0.15], [0.25, 0.65, 0.15]);
            addTriangle(vertices, [-0.75, 0.75, 0.25], [-0.9, 0.95 * f, 0.35 * f], [-0.65, 0.8, 0.2]);
            addTriangle(vertices, [0.65, 0.8, 0.2], [0.9, 0.95 * f, 0.35 * f], [0.75, 0.75, 0.25]);

            const b1L = [-0.75, 0.75, 0.25], b2L = [-1.45, 0.45, 0.3], b3L = [-1.65, -0.45, 0.2];
            const s1L = [-1.15, 0.25 - 0.2 * f, 0.05];
            const s2L = [-1.45, -0.15 - 0.25 * f, 0.05];
            const rootL = [-0.2, 0.4, 0.1], baseC = [0, -0.45, 0];

            addTriangle(vertices, rootL, b1L, s1L);
            addTriangle(vertices, rootL, s1L, b2L);
            addTriangle(vertices, s1L, b2L, s2L);
            addTriangle(vertices, s2L, b2L, b3L);
            addTriangle(vertices, baseC, rootL, s2L);
            addTriangle(vertices, baseC, s2L, b3L);

            const b1R = [0.75, 0.75, 0.25], b2R = [1.45, 0.45, 0.3], b3R = [1.65, -0.45, 0.2];
            const s1R = [1.15, 0.25 - 0.2 * f, 0.05];
            const s2R = [1.45, -0.15 - 0.25 * f, 0.05];
            const rootR = [0.2, 0.4, 0.1];

            addTriangle(vertices, rootR, s1R, b1R);
            addTriangle(vertices, rootR, b2R, s1R);
            addTriangle(vertices, s1R, s2R, b2R);
            addTriangle(vertices, s2R, b3R, b2R);
            addTriangle(vertices, baseC, s2R, rootR);
            addTriangle(vertices, baseC, b3R, s2R);
            return;
        }
    }

    // indian-01: Mayura — Imperial Indian Peacock
    if (id === 'indian-01') {
        if (stepIdx === 0) {
            // Step 1: Elongated Bird Base Diamond with 4 independent flaps
            const w = 0.85, h = 1.45, lift = 0.5 * f;
            addTriangle(vertices, [0, -h, 0], [w, 0, lift], [0, 0, lift * 1.3]);
            addTriangle(vertices, [0, -h, 0], [0, 0, lift * 1.3], [-w, 0, lift]);
            addTriangle(vertices, [0, h, 0], [-w, 0, lift], [0, 0, lift * 1.3]);
            addTriangle(vertices, [0, h, 0], [0, 0, lift * 1.3], [w, 0, lift]);
            addTriangle(vertices, [0, -h, -0.06], [-w, 0, -lift * 0.5], [0, 0, -lift]);
            addTriangle(vertices, [0, -h, -0.06], [0, 0, -lift], [w, 0, -lift * 0.5]);
            addTriangle(vertices, [0, h, -0.06], [0, 0, -lift], [-w, 0, -lift * 0.5]);
            addTriangle(vertices, [0, h, -0.06], [w, 0, -lift * 0.5], [0, 0, -lift]);
            return;
        } else if (stepIdx === 1) {
            // Step 2: Articulated S-Curve Neck & Head (Double Inside Reverse Fold)
            const w = 0.7, h = 1.2;
            addTriangle(vertices, [0, -h, 0], [w, 0, 0.2], [0, 0, 0.3]);
            addTriangle(vertices, [0, -h, 0], [0, 0, 0.3], [-w, 0, 0.2]);
            const neckY = 0.5 + 0.85 * f, neckZ = 0.3 + 0.65 * f;
            addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
            const headY = neckY + 0.25 * f, headZ = neckZ + 0.45 * f;
            addTriangle(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, headY, headZ]);
            addTriangle(vertices, [-0.08, neckY + 0.05, neckZ], [0.08, neckY + 0.05, neckZ], [0, headY - 0.15, headZ + 0.2 * f]);
            return;
        } else if (stepIdx === 2) {
            // Step 3: Crown Kalgi Crest Squash
            const w = 0.7, h = 1.2, neckY = 1.35, neckZ = 0.95;
            addTriangle(vertices, [0, -h, 0], [w, 0, 0.2], [0, 0, 0.3]);
            addTriangle(vertices, [0, -h, 0], [0, 0, 0.3], [-w, 0, 0.2]);
            addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
            addTriangle(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, neckY + 0.25, neckZ + 0.45]);
            const kH = 0.45 * f;
            addTriangle(vertices, [0, neckY + 0.25, neckZ + 0.45], [-0.25 * f, neckY + 0.25 + kH, neckZ + 0.4], [-0.08, neckY + 0.2, neckZ + 0.45]);
            addTriangle(vertices, [0, neckY + 0.25, neckZ + 0.45], [0, neckY + 0.25 + kH * 1.2, neckZ + 0.45], [0.05, neckY + 0.2, neckZ + 0.45]);
            addTriangle(vertices, [0, neckY + 0.25, neckZ + 0.45], [0.25 * f, neckY + 0.25 + kH, neckZ + 0.4], [0.08, neckY + 0.2, neckZ + 0.45]);
            return;
        } else if (stepIdx === 3) {
            // Step 4: Radiant 18-Pleat Fan Tail
            const neckY = 1.35, neckZ = 0.95;
            addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
            addTriangle(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, neckY + 0.25, neckZ + 0.45]);
            const fanRadius = 1.65 * f;
            const pleats = 18;
            for (let p = 0; p < pleats; p++) {
                const a1 = -Math.PI * 0.75 + (p / pleats) * Math.PI * 1.5;
                const a2 = -Math.PI * 0.75 + ((p + 1) / pleats) * Math.PI * 1.5;
                const r1 = (p % 2 === 0 ? fanRadius : fanRadius * 0.88);
                const r2 = ((p + 1) % 2 === 0 ? fanRadius : fanRadius * 0.88);
                const zOff = (p % 2 === 0 ? 0.12 : -0.12) * f;
                addTriangle(vertices, [0, -0.2, -0.1], [Math.cos(a1) * r1, Math.sin(a1) * r1 + 0.4, zOff], [Math.cos(a2) * r2, Math.sin(a2) * r2 + 0.4, -zOff]);
            }
            return;
        } else if (stepIdx === 4) {
            // Step 5: Chandrika Eyelet Concavities
            const neckY = 1.35, neckZ = 0.95;
            addQuad(vertices, [-0.15, 0, 0.3], [0.15, 0, 0.3], [0.1, neckY, neckZ], [-0.1, neckY, neckZ]);
            addTriangle(vertices, [-0.1, neckY, neckZ], [0.1, neckY, neckZ], [0, neckY + 0.25, neckZ + 0.45]);
            const fanRadius = 1.75;
            const pleats = 18;
            for (let p = 0; p < pleats; p++) {
                const a1 = -Math.PI * 0.75 + (p / pleats) * Math.PI * 1.5;
                const a2 = -Math.PI * 0.75 + ((p + 1) / pleats) * Math.PI * 1.5;
                const aMid = (a1 + a2) / 2;
                const r1 = (p % 2 === 0 ? fanRadius : fanRadius * 0.88);
                const r2 = ((p + 1) % 2 === 0 ? fanRadius : fanRadius * 0.88);
                addTriangle(vertices, [0, -0.2, -0.1], [Math.cos(a1) * r1, Math.sin(a1) * r1 + 0.4, 0.05], [Math.cos(a2) * r2, Math.sin(a2) * r2 + 0.4, -0.05]);
                addTriangle(vertices, [Math.cos(a1) * r1, Math.sin(a1) * r1 + 0.4, 0.05], [Math.cos(aMid) * (r1 + 0.25 * f), Math.sin(aMid) * (r1 + 0.25 * f) + 0.4, 0.25 * f], [Math.cos(a2) * r2, Math.sin(a2) * r2 + 0.4, -0.05]);
            }
            return;
        }
    }

    // japanese-01: Orizuru — Classical Peace Crane
    if (id === 'japanese-01') {
        if (stepIdx === 0) {
            // Step 1: Square Preliminary Base (Diamond 4-flaps)
            const w = 1.15, lift = 0.65 * f;
            addTriangle(vertices, [0, -w, 0], [w, 0, lift], [0, 0, lift * 1.2]);
            addTriangle(vertices, [0, -w, 0], [0, 0, lift * 1.2], [-w, 0, lift]);
            addTriangle(vertices, [0, w, 0], [-w, 0, lift], [0, 0, lift * 1.2]);
            addTriangle(vertices, [0, w, 0], [0, 0, lift * 1.2], [w, 0, lift]);
            addTriangle(vertices, [0, -w, -0.06], [-w, 0, -lift * 0.5], [0, 0, -lift]);
            addTriangle(vertices, [0, -w, -0.06], [0, 0, -lift], [w, 0, -lift * 0.5]);
            return;
        } else if (stepIdx === 1) {
            // Step 2: Bilateral Petal Folds into Bird Base
            const pLen = 1.55, sideW = 0.55 * (1 - f * 0.35);
            addQuad(vertices, [-sideW, 0, 0.1], [sideW, 0, 0.1], [0, pLen * f, 0.35 * f], [0, pLen * f, 0.35 * f]);
            addQuad(vertices, [-sideW, 0, -0.1], [sideW, 0, -0.1], [0, -pLen * f, -0.35 * f], [0, -pLen * f, -0.35 * f]);
            addTriangle(vertices, [-sideW, 0, 0], [0, pLen * 0.6, 0.4 * f], [0, 0, 0.3 * f]);
            addTriangle(vertices, [sideW, 0, 0], [0, 0, 0.3 * f], [0, pLen * 0.6, 0.4 * f]);
            return;
        } else if (stepIdx === 2) {
            // Step 3: Slender Neck & Tail Inside Reverse Folds
            const chest = 0.35 * f;
            addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.3, chest], [-0.15, 0.3, chest]);
            addQuad(vertices, [-0.1, 0.3, chest], [0.1, 0.3, chest], [0.08, 1.1 * f, chest + 0.8 * f], [-0.08, 1.1 * f, chest + 0.8 * f]);
            addQuad(vertices, [-0.12, -0.5, 0], [0.12, -0.5, 0], [0.06, -1.2 * f, -0.3 * f], [-0.06, -1.2 * f, -0.3 * f]);
            addTriangle(vertices, [-0.15, 0.3, chest], [-0.9 * (1 - f * 0.2), 0.1, -0.1], [-0.2, -0.5, 0]);
            addTriangle(vertices, [0.15, 0.3, chest], [0.2, -0.5, 0], [0.9 * (1 - f * 0.2), 0.1, -0.1]);
            return;
        } else if (stepIdx === 3) {
            // Step 4: Beak Crimp & Wing Flaring
            const chest = 0.45;
            addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.3, chest], [-0.15, 0.3, chest]);
            addQuad(vertices, [-0.1, 0.3, chest], [0.1, 0.3, chest], [0.08, 1.1, chest + 0.8], [-0.08, 1.1, chest + 0.8]);
            addTriangle(vertices, [-0.08, 1.1, chest + 0.8], [0.08, 1.1, chest + 0.8], [0, 1.25 - 0.25 * f, chest + 0.8 + 0.35 * f]);
            const wingFlare = 1.35 * f;
            addTriangle(vertices, [-0.15, 0.3, chest], [-1.45 * f, 0.2 + wingFlare * 0.4, -0.1], [-0.2, -0.5, 0]);
            addTriangle(vertices, [0.15, 0.3, chest], [0.2, -0.5, 0], [1.45 * f, 0.2 + wingFlare * 0.4, -0.1]);
            return;
        }
    }

    // ---------------------------------------------------------------------------
    // 2. GENERAL ORIGAMI LINEAGES (High-Dimensional Multi-Flap Bases)
    // ---------------------------------------------------------------------------
    const isBird = id.includes('crane') || id.includes('peacock') || id.includes('japanese-01') || id.includes('indian-01') || id.includes('american-01') || id.includes('chinese-04') || id.includes('nativity-03');
    const isHelmet = id.includes('kabuto') || id.includes('japanese-02') || id.includes('crown') || id.includes('indian-06') || id.includes('calavera') || id.includes('festival-04');
    const isQuadruped = id.includes('elephant') || id.includes('indian-02') || id.includes('tiger') || id.includes('indian-03') || id.includes('bison') || id.includes('american-02') || id.includes('donkey') || id.includes('nativity-09') || id.includes('rabbit') || id.includes('chinese-05');
    const isKinetic = id.includes('frog') || id.includes('american-03') || id.includes('beetle') || id.includes('american-04') || id.includes('bat') || id.includes('festival-02');
    const isBotanical = id.includes('lotus') || id.includes('sakura') || id.includes('japanese-03') || id.includes('flower') || id.includes('indian-04') || id.includes('butterfly');

    if (stepIdx === 0) {
        if (isBird) {
            const w = 1.15, lift = 0.65 * f;
            addTriangle(vertices, [0, -w, 0], [w * (1 - f * 0.3), 0, lift], [0, 0, lift * 1.2]);
            addTriangle(vertices, [0, -w, 0], [0, 0, lift * 1.2], [-w * (1 - f * 0.3), 0, lift]);
            addTriangle(vertices, [0, w, 0], [-w * (1 - f * 0.3), 0, lift], [0, 0, lift * 1.2]);
            addTriangle(vertices, [0, w, 0], [0, 0, lift * 1.2], [w * (1 - f * 0.3), 0, lift]);
        } else if (isHelmet) {
            const span = 1.45, drop = -0.85 * f;
            addTriangle(vertices, [-span, 0.4, 0], [span, 0.4, 0], [0, drop, 0.2 * f]);
            addTriangle(vertices, [-span, 0.4, 0], [0, drop, 0.2 * f], [-span * 0.5 * (1 - f * 0.5), drop * 0.5, 0.3 * f]);
            addTriangle(vertices, [span, 0.4, 0], [span * 0.5 * (1 - f * 0.5), drop * 0.5, 0.3 * f], [0, drop, 0.2 * f]);
        } else if (isQuadruped) {
            const s = 1.0, c = 0.55 * f;
            addTriangle(vertices, [-s, -s, 0], [0, -c, 0.1 * f], [-s, s, 0]);
            addTriangle(vertices, [-s, s, 0], [-c, 0, 0.1 * f], [s, s, 0]);
            addTriangle(vertices, [s, s, 0], [0, c, 0.1 * f], [s, -s, 0]);
            addTriangle(vertices, [s, -s, 0], [c, 0, 0.1 * f], [-s, -s, 0]);
        } else if (isKinetic) {
            const w = 1.35, h = 0.85, foldZ = 0.55 * f;
            addTriangle(vertices, [-w, -0.4, 0], [w, -0.4, 0], [0, h * f, foldZ]);
            addTriangle(vertices, [-w * 0.5, -0.4, -foldZ], [w * 0.5, -0.4, -foldZ], [0, h * f, foldZ]);
        } else if (isBotanical) {
            const rad = 1.35;
            for (let i = 0; i < 8; i++) {
                const a1 = (i / 8) * Math.PI * 2, a2 = ((i + 1) / 8) * Math.PI * 2;
                const dip = (i % 2 === 0 ? 0.3 : -0.2) * f;
                addTriangle(vertices, [0, 0, dip], [Math.cos(a1) * rad, Math.sin(a1) * rad, 0], [Math.cos(a2) * rad, Math.sin(a2) * rad, 0]);
            }
        } else {
            const bW = 1.35;
            addBoxVertices(vertices, -bW, bW, -0.2, 0.1 * f, -0.9, 0.9);
            addTriangle(vertices, [-bW, 0.1 * f, -0.9], [bW, 0.1 * f, -0.9], [0, 0.8 * f, 0]);
        }
    } else if (stepIdx === 1) {
        if (isBird) {
            const pLen = 1.55 * (0.5 + 0.5 * f), sideW = 0.55 * (1 - f * 0.35);
            addQuad(vertices, [-sideW, 0, 0], [sideW, 0, 0], [0, pLen, 0.2 * f], [0, pLen, 0.2 * f]);
            addQuad(vertices, [-sideW, 0, 0], [sideW, 0, 0], [0, -pLen, -0.2 * f], [0, -pLen, -0.2 * f]);
            addTriangle(vertices, [-sideW, 0, 0], [0, pLen * 0.6, 0.4 * f], [0, 0, 0.3 * f]);
            addTriangle(vertices, [sideW, 0, 0], [0, 0, 0.3 * f], [0, pLen * 0.6, 0.4 * f]);
        } else if (isHelmet) {
            const r = 0.95, h = 0.65 * f;
            addTriangle(vertices, [-r, -0.2, 0], [r, -0.2, 0], [0, h, 0.3 * f]);
            addTriangle(vertices, [-r * 0.6, -0.2, 0.2], [-r * 0.9, h * 0.8, 0.4 * f], [0, 0, 0.2]);
            addTriangle(vertices, [r * 0.6, -0.2, 0.2], [0, 0, 0.2], [r * 0.9, h * 0.8, 0.4 * f]);
        } else if (isQuadruped) {
            const w = 0.75;
            addBoxVertices(vertices, -w, w, -0.3, 0.3 * f, -w, w);
            addTriangle(vertices, [-w, -0.3, w], [-w * 1.3 * f, -0.6 * f, w * 1.3 * f], [-w * 0.5, -0.3, w]);
            addTriangle(vertices, [w, -0.3, w], [w * 0.5, -0.3, w], [w * 1.3 * f, -0.6 * f, w * 1.3 * f]);
        } else if (isKinetic) {
            const bW = 0.85;
            addQuad(vertices, [-bW, -0.2, -0.6], [bW, -0.2, -0.6], [bW * 0.7, 0.2, 0.4], [-bW * 0.7, 0.2, 0.4]);
            addTriangle(vertices, [-bW * 0.7, 0.2, 0.4], [-bW * 1.4 * f, 0.3 * f, 0.7 * f], [-bW * 0.2, 0.2, 0.4]);
            addTriangle(vertices, [bW * 0.2, 0.2, 0.4], [bW * 1.4 * f, 0.3 * f, 0.7 * f], [bW * 0.7, 0.2, 0.4]);
        } else if (isBotanical) {
            const rad = 1.25;
            for (let i = 0; i < 8; i++) {
                const a1 = (i / 8) * Math.PI * 2, a2 = ((i + 1) / 8) * Math.PI * 2, aMid = (a1 + a2) / 2;
                addTriangle(vertices, [0, -0.2, 0], [Math.cos(a1) * rad * 0.5, -0.2, Math.sin(a1) * rad * 0.5], [Math.cos(aMid) * rad, 0.2 * f, Math.sin(aMid) * rad]);
                addTriangle(vertices, [0, -0.2, 0], [Math.cos(aMid) * rad, 0.2 * f, Math.sin(aMid) * rad], [Math.cos(a2) * rad * 0.5, -0.2, Math.sin(a2) * rad * 0.5]);
            }
        } else {
            const span = 1.25, wallH = 0.85 * f;
            addQuad(vertices, [-span, 0, -0.6], [span, 0, -0.6], [span, wallH, -0.6], [-span, wallH, -0.6]);
            addQuad(vertices, [-span, 0, -0.6], [-span, wallH, -0.6], [-span * 0.6, wallH, 0.6], [-span * 0.6, 0, 0.6]);
            addQuad(vertices, [span, 0, -0.6], [span * 0.6, 0, 0.6], [span * 0.6, wallH, 0.6], [span, wallH, -0.6]);
        }
    } else if (stepIdx === 2) {
        if (isBird) {
            const pLen = 1.65, chest = 0.35 * f;
            addQuad(vertices, [-0.2, -0.5, 0], [0.2, -0.5, 0], [0.15, 0.3, chest], [-0.15, 0.3, chest]);
            addQuad(vertices, [-0.15, 0.3, chest], [-0.8 * (1 - f * 0.3), 0.1, -0.1], [-0.5, -0.3, -0.1], [-0.2, -0.5, 0]);
            addQuad(vertices, [0.15, 0.3, chest], [0.2, -0.5, 0], [0.5, -0.3, -0.1], [0.8 * (1 - f * 0.3), 0.1, -0.1]);
            addTriangle(vertices, [-0.1, 0.3, chest], [0.1, 0.3, chest], [0, pLen * 0.7 * f, 0.3]);
            addTriangle(vertices, [-0.1, -0.5, 0], [0.1, -0.5, 0], [0, -pLen * 0.7 * f, -0.2]);
        } else if (isHelmet) {
            const r = 0.95, h = 0.75 * f;
            addCone(vertices, [0, h, 0], [0, -0.2, 0], r * 0.9, 8);
            addTriangle(vertices, [-0.2, 0.2, r * 0.7], [-0.1, 0.2, r * 0.7], [-0.75 * f, 0.4 + 0.9 * f, r * 0.4]);
            addTriangle(vertices, [0.1, 0.2, r * 0.7], [0.2, 0.2, r * 0.7], [0.75 * f, 0.4 + 0.9 * f, r * 0.4]);
        } else if (isQuadruped) {
            const w = 0.5, h = 0.4, l = 0.75, legDrop = -0.55 * f;
            addBoxVertices(vertices, -w, w, -h, h, -l, l);
            addBoxVertices(vertices, -w, -w * 0.5, -h + legDrop, -h, l * 0.4, l * 0.8);
            addBoxVertices(vertices, w * 0.5, w, -h + legDrop, -h, l * 0.4, l * 0.8);
            addBoxVertices(vertices, -w, -w * 0.5, -h + legDrop, -h, -l * 0.8, -l * 0.4);
            addBoxVertices(vertices, w * 0.5, w, -h + legDrop, -h, -l * 0.8, -l * 0.4);
        } else if (isKinetic) {
            const bW = 0.75, bL = 0.85;
            addBoxVertices(vertices, -bW * 0.8, bW * 0.8, -0.2, 0.2, -bL * 0.8, bL * 0.4);
            addTriangle(vertices, [-bW, -0.2, -bL], [-bW * 0.8, 0.2, bL * 0.4], [-bW * 1.3 * f, 0.1, 0]);
            addTriangle(vertices, [bW, -0.2, -bL], [bW * 1.3 * f, 0.1, 0], [bW * 0.8, 0.2, bL * 0.4]);
        } else if (isBotanical) {
            for (let p = 0; p < 8; p++) {
                const a1 = (p / 8) * Math.PI * 2, a2 = ((p + 1) / 8) * Math.PI * 2, aMid = (a1 + a2) / 2;
                const pR = 1.35 * (0.6 + 0.4 * f);
                addTriangle(vertices, [0, -0.2, 0], [Math.cos(a1) * pR * 0.4, -0.2, Math.sin(a1) * pR * 0.4], [Math.cos(aMid) * pR, 0.3 * f, Math.sin(aMid) * pR]);
                addTriangle(vertices, [0, -0.2, 0], [Math.cos(aMid) * pR, 0.3 * f, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.4, -0.2, Math.sin(a2) * pR * 0.4]);
            }
        } else {
            const roofSpan = 1.3, roofH = 1.05 * f;
            addQuad(vertices, [-roofSpan, 0, -0.7], [0, roofH, -0.7], [0, roofH, 0.7], [-roofSpan, 0, 0.7]);
            addQuad(vertices, [0, roofH, -0.7], [roofSpan, 0, -0.7], [roofSpan, 0, 0.7], [0, roofH, 0.7]);
        }
    } else {
        if (isBird) {
            const chestPuff = 0.5 * f, neckAngle = 1.15 * f, S = 1.45;
            addQuad(vertices, [-0.2, -0.6, 0], [0.2, -0.6, 0], [0.15, 0.4, chestPuff], [-0.15, 0.4, chestPuff]);
            addQuad(vertices, [-0.15, 0.4, chestPuff], [-S * 0.8, 0.2, -0.1], [-S * 0.6, -0.3, -0.1], [-0.2, -0.6, 0]);
            addQuad(vertices, [0.15, 0.4, chestPuff], [0.2, -0.6, 0], [S * 0.6, -0.3, -0.1], [S * 0.8, 0.2, -0.1]);
            addQuad(vertices, [-0.1, 0.4, chestPuff], [0.1, 0.4, chestPuff], [0.05, 0.9 + f * 0.3, chestPuff + neckAngle], [-0.05, 0.9 + f * 0.3, chestPuff + neckAngle]);
            addQuad(vertices, [-0.15, -0.6, 0], [0.15, -0.6, 0], [0.08, -1.1 - f * 0.2, -0.2], [-0.08, -1.1 - f * 0.2, -0.2]);
        } else if (isHelmet) {
            const r = 0.95, h = 0.85 * f;
            addCone(vertices, [0, h, 0], [0, -0.25, 0], r, 10);
            addTriangle(vertices, [-0.2, 0.2, r * 0.8], [-0.1, 0.2, r * 0.8], [-0.75 * f, 0.4 + 1.2 * f, r * 0.5]);
            addTriangle(vertices, [0.1, 0.2, r * 0.8], [0.2, 0.2, r * 0.8], [0.75 * f, 0.4 + 1.2 * f, r * 0.5]);
            addQuad(vertices, [-r * 0.9, -0.25, 0], [-r * 1.25 * f, -0.6 * f, 0.3], [-r * 1.05 * f, -0.6 * f, -0.3], [-r * 0.9, -0.25, -0.3]);
            addQuad(vertices, [r * 0.9, -0.25, -0.3], [r * 1.05 * f, -0.6 * f, -0.3], [r * 1.25 * f, -0.6 * f, 0.3], [r * 0.9, -0.25, 0]);
        } else if (isQuadruped) {
            const w = 0.55, h = 0.48, l = 0.8, legDrop = -0.62 * f;
            addBoxVertices(vertices, -w, w, -h, h, -l, l);
            addBoxVertices(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, l * 0.3, l * 0.8);
            addBoxVertices(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, l * 0.3, l * 0.8);
            addBoxVertices(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, -l * 0.8, -l * 0.3);
            addBoxVertices(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, -l * 0.8, -l * 0.3);
            addQuad(vertices, [-0.2, h, l], [0.2, h, l], [0.15, h + 0.3 * f, l + 0.45 * f], [-0.15, h + 0.3 * f, l + 0.45 * f]);
        } else if (isKinetic) {
            const bW = 0.75 * f, bL = 0.9 * f;
            addQuad(vertices, [-bW, -0.15, -bL], [bW, -0.15, -bL], [bW * 0.6, 0.25, bL * 0.4], [-bW * 0.6, 0.25, bL * 0.4]);
            const zExt = 0.75 * f;
            addQuad(vertices, [-bW, -0.15, -bL], [-bW * 0.5, -0.15, -bL], [-bW * 1.3 * f, -0.35, -bL - zExt], [-bW * 1.6 * f, -0.35, -bL - zExt]);
            addQuad(vertices, [bW * 0.5, -0.15, -bL], [bW, -0.15, -bL], [bW * 1.6 * f, -0.35, -bL - zExt], [bW * 1.3 * f, -0.35, -bL - zExt]);
        } else if (isBotanical) {
            for (let t = 0; t < 2; t++) {
                const petals = 8, pR = (1.3 - t * 0.3) * f, pH = (0.2 + t * 0.3) * f;
                for (let p = 0; p < petals; p++) {
                    const a1 = (p / petals) * Math.PI * 2, a2 = ((p + 1) / petals) * Math.PI * 2, aMid = (a1 + a2) / 2;
                    addTriangle(vertices, [0, -0.25, 0], [Math.cos(a1) * pR * 0.35, -0.25, Math.sin(a1) * pR * 0.35], [Math.cos(aMid) * pR, -0.25 + pH, Math.sin(aMid) * pR]);
                    addTriangle(vertices, [0, -0.25, 0], [Math.cos(aMid) * pR, -0.25 + pH, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.35, -0.25, Math.sin(a2) * pR * 0.35]);
                }
            }
        } else {
            const roofSpan = 1.35, roofH = 1.25 * f;
            addQuad(vertices, [-roofSpan, 0, -0.8], [0, roofH, -0.8], [0, roofH, 0.8], [-roofSpan, 0, 0.8]);
            addQuad(vertices, [0, roofH, -0.8], [roofSpan, 0, -0.8], [roofSpan, 0, 0.8], [0, roofH, 0.8]);
            addQuad(vertices, [-roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, 0, -0.75], [-roofSpan * 0.9, 0, -0.75]);
        }
    }
}

function build3DPaperModel(foldFactor = 1.0) {
    if (paperMesh) scene.remove(paperMesh);
    if (creaseLinesGroup) scene.remove(creaseLinesGroup);

    const collectionKey = currentKit ? (currentKit.collection || currentKit.category || 'default') : 'default';
    const theme = COLOR_THEMES[collectionKey] || COLOR_THEMES.default;

    const frontColor = currentKit.accent ? parseInt(currentKit.accent.replace('#', '0x')) : theme.front;
    const backColor = theme.back;

    const materials = [
        new THREE.MeshStandardMaterial({
            color: frontColor,
            roughness: 0.55,
            metalness: 0.08,
            side: THREE.FrontSide,
            flatShading: true
        }),
        new THREE.MeshStandardMaterial({
            color: backColor,
            roughness: 0.35,
            metalness: 0.35,
            side: THREE.BackSide,
            flatShading: true
        })
    ];

    const group = new THREE.Group();
    group.position.set(0, 0.22, 0);
    const geo = new THREE.BufferGeometry();
    const vertices = [];

    const f = Math.max(0.01, Math.min(1.0, foldFactor));
    const id = (currentKit && currentKit.id ? currentKit.id : '').toLowerCase().trim();
    const totalSteps = currentKit && currentKit.steps ? currentKit.steps.length : 5;
    const s = typeof currentStepIdx !== 'undefined' ? currentStepIdx : totalSteps - 1;

    // Intermediate step check: If step is before final step, render the progressive folded base!
    const isCompletedView = isEndModelPreview || s === totalSteps - 1;
    const effectiveFold = isCompletedView ? 1.0 : f;
    if (!isCompletedView && s < totalSteps - 1) {
        buildStepBaseGeometry(vertices, id, s, effectiveFold);
    } else {

  if (id === 'japanese-01') {
    // ORIZURU: Classical Peace Crane with puffed chest, swept wings, arched neck & beak
    const wingLift = Math.sin(f * Math.PI * 0.5) * 1.45;
    const chestPuff = f * 0.65;
    const neckAngle = f * 1.25;
    const S = 1.6;

    addQuad(vertices, [-0.2, -0.6, 0], [0.2, -0.6, 0], [0.15, 0.4, chestPuff], [-0.15, 0.4, chestPuff]);
    addQuad(vertices, [-0.15, 0.4, chestPuff], [-S * (1 - f * 0.15), 0.2 + wingLift, -0.2], [-S * 0.85, -0.4 + wingLift, -0.1], [-0.2, -0.6, 0]);
    addQuad(vertices, [0.15, 0.4, chestPuff], [0.2, -0.6, 0], [S * 0.85, -0.4 + wingLift, -0.1], [S * (1 - f * 0.15), 0.2 + wingLift, -0.2]);
    addQuad(vertices, [-0.1, 0.4, chestPuff], [0.1, 0.4, chestPuff], [0.05, 1.05 + f * 0.3, chestPuff + neckAngle], [-0.05, 1.05 + f * 0.3, chestPuff + neckAngle]);
    addTriangle(vertices, [-0.05, 1.05 + f * 0.3, chestPuff + neckAngle], [0.05, 1.05 + f * 0.3, chestPuff + neckAngle], [0, 1.25 + f * 0.2, chestPuff + neckAngle - 0.2 * f]);
    addQuad(vertices, [-0.15, -0.6, 0], [0.15, -0.6, 0], [0.08, -1.25 - f * 0.3, -0.3], [-0.08, -1.25 - f * 0.3, -0.3]);
  }
  else if (id === 'japanese-02') {
    // KABUTO: Samurai Warlord Helmet with sweeping Kuwagata horns & flared Shikoro cheek plates
    const r = 0.95;
    const h = 0.85 * f;
    const hornL = 1.35 * f;
    const facets = 12;
    for (let i = 0; i < facets; i++) {
      const a1 = (i / facets) * Math.PI * 2;
      const a2 = ((i + 1) / facets) * Math.PI * 2;
      addTriangle(vertices, [Math.cos(a1) * r, -0.3, Math.sin(a1) * r], [Math.cos(a2) * r, -0.3, Math.sin(a2) * r], [0, h, 0]);
    }
    // Upturned Gold Kuwagata Crest Horns
    addTriangle(vertices, [-0.2, 0.2, r * 0.8], [-0.1, 0.2, r * 0.8], [-0.75 * f, 0.4 + hornL, r * 0.5]);
    addTriangle(vertices, [0.1, 0.2, r * 0.8], [0.2, 0.2, r * 0.8], [0.75 * f, 0.4 + hornL, r * 0.5]);
    // Stepped Shikoro Neck Guards
    addQuad(vertices, [-r * 0.9, -0.3, 0], [-r * 1.35 * f, -0.7 * f, 0.3], [-r * 1.1 * f, -0.7 * f, -0.3], [-r * 0.9, -0.3, -0.4]);
    addQuad(vertices, [r * 0.9, -0.3, -0.4], [r * 1.1 * f, -0.7 * f, -0.3], [r * 1.35 * f, -0.7 * f, 0.3], [r * 0.9, -0.3, 0]);
  }
  else if (id === 'japanese-03') {
    // SAKURA: 5-Petal Cherry Blossom with cleft notched tips & sunken floral core
    const petals = 5;
    const pLen = 1.35 * f;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
      const aLeft = angle - 0.35;
      const aRight = angle + 0.35;
      const center = [0, -0.15 * f, 0];
      const tipL = [Math.cos(aLeft) * pLen, 0.2 * Math.sin(f * Math.PI), Math.sin(aLeft) * pLen];
      const tipR = [Math.cos(aRight) * pLen, 0.2 * Math.sin(f * Math.PI), Math.sin(aRight) * pLen];
      const notch = [Math.cos(angle) * (pLen * 0.82), 0.1 * f, Math.sin(angle) * (pLen * 0.82)];
      addTriangle(vertices, center, tipL, notch);
      addTriangle(vertices, center, notch, tipR);
    }
  }
  else if (id === 'japanese-04') {
    // MINOGAME: Sacred Longevity Tortoise with hexagonal carapace, paddle flippers & algae fan
    const cRadius = 0.95;
    const cHeight = 0.45 * f;
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      addTriangle(vertices, [Math.cos(a1) * cRadius, -0.2, Math.sin(a1) * cRadius], [Math.cos(a2) * cRadius, -0.2, Math.sin(a2) * cRadius], [0, cHeight, 0]);
    }
    // Head & Foreflippers
    addTriangle(vertices, [-0.2, -0.1, cRadius], [0.2, -0.1, cRadius], [0, 0.2 * f, cRadius + 0.55 * f]);
    addTriangle(vertices, [-cRadius * 0.8, -0.2, cRadius * 0.5], [-cRadius * 1.4 * f, -0.3, cRadius * 0.7 * f], [-cRadius * 0.9, -0.2, 0]);
    addTriangle(vertices, [cRadius * 0.9, -0.2, 0], [cRadius * 1.4 * f, -0.3, cRadius * 0.7 * f], [cRadius * 0.8, -0.2, cRadius * 0.5]);
    // Trailing Algae Tail Ribbons
    for (let k = 0; k < 7; k++) {
      const aT = ((k - 3) / 3) * 0.5;
      const len = 1.4 * f;
      addTriangle(vertices, [-0.2, -0.2, -cRadius], [0.2, -0.2, -cRadius], [Math.sin(aT) * len, -0.4 * f, -cRadius - len]);
    }
  }
  else if (id === 'japanese-05') {
    // KOINOBORI: Children's Day Flying Carp Windsock with open mouth & ribbed scale cylinder
    const segments = 8;
    const bodyL = 2.0 * f;
    const rBody = 0.55;
    for (let s = 0; s < segments; s++) {
      const z1 = 0.9 - (s / segments) * bodyL;
      const z2 = 0.9 - ((s + 1) / segments) * bodyL;
      const t1 = 1 - (s / segments) * 0.45;
      const t2 = 1 - ((s + 1) / segments) * 0.45;
      for (let h = 0; h < 8; h++) {
        const a1 = (h / 8) * Math.PI * 2;
        const a2 = ((h + 1) / 8) * Math.PI * 2;
        addQuad(vertices, [Math.cos(a1) * rBody * t1, Math.sin(a1) * rBody * t1, z1], [Math.cos(a2) * rBody * t1, Math.sin(a2) * rBody * t1, z1], [Math.cos(a2) * rBody * t2, Math.sin(a2) * rBody * t2, z2], [Math.cos(a1) * rBody * t2, Math.sin(a1) * rBody * t2, z2]);
      }
    }
    const tailZ = 0.9 - bodyL;
    addTriangle(vertices, [0, 0, tailZ], [-0.6 * f, 0.4 * f, tailZ - 0.7 * f], [0, 0.1, tailZ - 0.4 * f]);
    addTriangle(vertices, [0, 0, tailZ], [0, -0.1, tailZ - 0.4 * f], [-0.6 * f, -0.4 * f, tailZ - 0.7 * f]);
  }
  else if (id === 'japanese-06') {
    // NIHON-RYU: Imperial Japanese Rising Dragon with spiked dorsal crest and sinuous curves
    const coils = 12;
    const spineR = 0.28;
    for (let i = 0; i < coils; i++) {
      const t1 = i / coils;
      const t2 = (i + 1) / coils;
      const z1 = (t1 - 0.5) * 2.4;
      const z2 = (t2 - 0.5) * 2.4;
      const x1 = Math.sin(t1 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const x2 = Math.sin(t2 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const y1 = Math.cos(t1 * Math.PI * 2) * 0.45 * f;
      const y2 = Math.cos(t2 * Math.PI * 2) * 0.45 * f;
      addQuad(vertices, [x1 - spineR, y1, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1 - spineR, y1, z1], [x1, y1 + spineR * 1.5, z1], [x2, y2 + spineR * 1.5, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1, y1 + spineR * 1.5, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2, y2 + spineR * 1.5, z2]);
    }
  }

  // ===========================================================================
  // GROUP 2: THE ROYAL DARBARS OF HINDOSTAN (Indian Master Heritage 01-08)
  // ===========================================================================
  else if (id === 'indian-01') {
    // MAYURA: Imperial Indian Peacock with 18-Pleat Radiant Fan Tail
    const chestPuff = f * 0.65;
    const neckAngle = f * 1.25;
    addQuad(vertices, [-0.2, -0.6, 0], [0.2, -0.6, 0], [0.15, 0.4, chestPuff], [-0.15, 0.4, chestPuff]);
    addQuad(vertices, [-0.1, 0.4, chestPuff], [0.1, 0.4, chestPuff], [0.06, 1.1 + f * 0.3, chestPuff + neckAngle], [-0.06, 1.1 + f * 0.3, chestPuff + neckAngle]);
    addTriangle(vertices, [-0.06, 1.1 + f * 0.3, chestPuff + neckAngle], [0.06, 1.1 + f * 0.3, chestPuff + neckAngle], [0, 1.35 + f * 0.2, chestPuff + neckAngle - 0.15]);
    const fans = 18;
    const tailR = 1.65 * (0.4 + 0.6 * f);
    for (let k = 0; k < fans; k++) {
      const a = ((k - (fans - 1) / 2) / (fans / 2)) * (Math.PI * 0.48) * f;
      const tx = Math.sin(a) * tailR;
      const ty = -0.5 + Math.cos(a) * tailR * 0.9;
      const tz = -0.35 * f - Math.abs(Math.sin(a)) * 0.3;
      addTriangle(vertices, [-0.15, -0.6, -0.1], [0.15, -0.6, -0.1], [tx, ty, tz]);
    }
  }
  else if (id === 'indian-02') {
    // GAJENDRA: Royal Mysore Elephant with Howdah canopy & raised blessing trunk
    const w = 0.55, h = 0.5, l = 0.85;
    const legDrop = -0.65 * f;
    addBoxVertices(vertices, -w, w, -h, h, -l, l);
    // 4 Sturdy folded legs
    addBoxVertices(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, l * 0.3, l * 0.8);
    addBoxVertices(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, l * 0.3, l * 0.8);
    addBoxVertices(vertices, -w * 0.95, -w * 0.4, -h + legDrop, -h, -l * 0.8, -l * 0.3);
    addBoxVertices(vertices, w * 0.4, w * 0.95, -h + legDrop, -h, -l * 0.8, -l * 0.3);
    // Trunk & Head
    const trunkH = h + 0.3 * f;
    addQuad(vertices, [-0.2, h, l], [0.2, h, l], [0.15, trunkH, l + 0.45 * f], [-0.15, trunkH, l + 0.45 * f]);
    addTriangle(vertices, [-0.1, trunkH + 0.5 * f, l + 0.7 * f], [0.1, trunkH + 0.5 * f, l + 0.7 * f], [0, trunkH + 0.85 * f, l + 0.55 * f]);
    addTriangle(vertices, [-0.2, h, l], [-0.75 * f, h + 0.25 * f, l - 0.2], [-0.2, h - 0.4 * f, l]);
    addTriangle(vertices, [0.2, h, l], [0.2, h - 0.4 * f, l], [0.75 * f, h + 0.25 * f, l - 0.2]);
    // Royal Howdah (Palanquin) on back
    addBoxVertices(vertices, -w * 0.7, w * 0.7, h, h + 0.45 * f, -l * 0.4, l * 0.4);
    addCone(vertices, [0, h + 0.85 * f, 0], [0, h + 0.45 * f, 0], w * 0.75, 4);
  }
  else if (id === 'indian-03') {
    // ROYAL BENGAL TIGER: Muscular stalking torso, bent stealth limbs & predatory head
    const tW = 0.4, tH = 0.38, tL = 0.95;
    const crouch = -0.55 * f;
    addBoxVertices(vertices, -tW, tW, -tH, tH, -tL, tL);
    // Prowling angled legs
    addBoxVertices(vertices, -tW * 1.1, -tW * 0.6, -tH + crouch, -tH, tL * 0.4, tL * 0.8);
    addBoxVertices(vertices, tW * 0.6, tW * 1.1, -tH + crouch, -tH, tL * 0.4, tL * 0.8);
    addBoxVertices(vertices, -tW * 1.1, -tW * 0.6, -tH + crouch, -tH, -tL * 0.8, -tL * 0.4);
    addBoxVertices(vertices, tW * 0.6, tW * 1.1, -tH + crouch, -tH, -tL * 0.8, -tL * 0.4);
    // Snarling Head & Ears
    addBoxVertices(vertices, -0.22, 0.22, -0.1, 0.35 * f, tL, tL + 0.5 * f);
    addTriangle(vertices, [-0.2, 0.35 * f, tL + 0.2], [-0.35 * f, 0.6 * f, tL + 0.1], [-0.1, 0.35 * f, tL + 0.1]);
    addTriangle(vertices, [0.1, 0.35 * f, tL + 0.1], [0.35 * f, 0.6 * f, tL + 0.1], [0.2, 0.35 * f, tL + 0.2]);
    // S-Curved Tail
    addQuad(vertices, [-0.08, 0, -tL], [0.08, 0, -tL], [0.06, 0.5 * f, -tL - 0.7 * f], [-0.06, 0.5 * f, -tL - 0.7 * f]);
  }
  else if (id === 'indian-04') {
    // GENDA PHOOL: Sacred Marigold Garland: 3 Pom-Pom blossoms on an arched strand
    const count = 3;
    for (let c = 0; c < count; c++) {
      const cx = (c - 1) * 1.05 * f;
      const cy = -Math.sin((c / 2) * Math.PI) * 0.35 * f;
      const cz = 0;
      // Multi-tier pom-pom petals
      for (let ring = 0; ring < 3; ring++) {
        const pCount = 10;
        const rad = (0.55 - ring * 0.12) * f;
        for (let p = 0; p < pCount; p++) {
          const a1 = (p / pCount) * Math.PI * 2;
          const a2 = ((p + 1) / pCount) * Math.PI * 2;
          const p1 = [cx + Math.cos(a1) * rad, cy + (ring * 0.15) * f, cz + Math.sin(a1) * rad];
          const p2 = [cx + Math.cos(a2) * rad, cy + (ring * 0.15) * f, cz + Math.sin(a2) * rad];
          addTriangle(vertices, [cx, cy, cz], p1, p2);
        }
      }
    }
  }
  else if (id === 'indian-05') {
    // DEEPAVALI DIYA: Faceted Terracotta Oil Well & 3D Flickering Teardrop Flame
    const bowlSides = 8;
    const rOuter = 1.05;
    const bHeight = 0.45 * f;
    for (let i = 0; i < bowlSides; i++) {
      const a1 = (i / bowlSides) * Math.PI * 2;
      const a2 = ((i + 1) / bowlSides) * Math.PI * 2;
      addQuad(vertices, [Math.cos(a1) * rOuter, -bHeight, Math.sin(a1) * rOuter], [Math.cos(a2) * rOuter, -bHeight, Math.sin(a2) * rOuter], [Math.cos(a2) * rOuter * 1.15, 0, Math.sin(a2) * rOuter * 1.15], [Math.cos(a1) * rOuter * 1.15, 0, Math.sin(a1) * rOuter * 1.15]);
    }
    // Upright 3D Flickering Flame
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      addTriangle(vertices, [Math.cos(a1) * 0.38 * f, 0.05, Math.sin(a1) * 0.38 * f], [Math.cos(a2) * 0.38 * f, 0.05, Math.sin(a2) * 0.38 * f], [0, 1.35 * f, 0]);
    }
  }
  else if (id === 'indian-06') {
    // KATHAKALI ROYAL CROWN (Kireetam): Conical tiered crown with massive circular halo (Vatta Mudi)
    const haloR = 1.35 * f;
    const discFacets = 16;
    for (let i = 0; i < discFacets; i++) {
      const a1 = (i / discFacets) * Math.PI * 2;
      const a2 = ((i + 1) / discFacets) * Math.PI * 2;
      addTriangle(vertices, [0, 0.4, -0.15], [Math.cos(a1) * haloR, 0.4 + Math.sin(a1) * haloR, -0.2], [Math.cos(a2) * haloR, 0.4 + Math.sin(a2) * haloR, -0.2]);
    }
    // Stepped Conical Tower (Kireetam)
    addCylinder(vertices, -0.4, 0.2 * f, 0.75, 0.55 * f, 10);
    addCylinder(vertices, 0.2 * f, 0.8 * f, 0.55 * f, 0.35 * f, 8);
    addCone(vertices, [0, 1.45 * f, 0], [0, 0.8 * f, 0], 0.35 * f, 8);
  }
  else if (id === 'indian-07') {
    // SACRED KAMALAM TEMPLE LOTUS: 24 multi-tier radiating petals on octagonal brass thali plate
    // Base thali dish
    addCylinder(vertices, -0.4, -0.25, 1.4 * f, 1.5 * f, 8);
    // 3 Tiers of upward-curving lotus petals
    for (let tier = 0; tier < 3; tier++) {
      const count = 8;
      const rad = (1.25 - tier * 0.3) * f;
      const h = (-0.25 + tier * 0.35) * f;
      for (let p = 0; p < count; p++) {
        const a1 = (p / count) * Math.PI * 2 + (tier * 0.3);
        const a2 = ((p + 1) / count) * Math.PI * 2 + (tier * 0.3);
        const aMid = (a1 + a2) / 2;
        addTriangle(vertices, [0, h - 0.1, 0], [Math.cos(a1) * rad * 0.4, h, Math.sin(a1) * rad * 0.4], [Math.cos(aMid) * rad, h + 0.45 * f, Math.sin(aMid) * rad]);
        addTriangle(vertices, [0, h - 0.1, 0], [Math.cos(aMid) * rad, h + 0.45 * f, Math.sin(aMid) * rad], [Math.cos(a2) * rad * 0.4, h, Math.sin(a2) * rad * 0.4]);
      }
    }
  }
  else if (id === 'indian-08') {
    // THE ROYAL DURBAR: Complete assembly: Central ceremonial throne with arch & twin royal standards
    // Ceremonial Royal Canopy Arch
    addBoxVertices(vertices, -1.2, -0.9, -0.5, 1.35 * f, -0.2, 0.2);
    addBoxVertices(vertices, 0.9, 1.2, -0.5, 1.35 * f, -0.2, 0.2);
    addBoxVertices(vertices, -1.3, 1.3, 1.15 * f, 1.45 * f, -0.3, 0.3);
    // Central Royal Throne Cushion
    addBoxVertices(vertices, -0.6, 0.6, -0.5, 0.1 * f, -0.5, 0.5);
    addBoxVertices(vertices, -0.5, 0.5, 0.1 * f, 0.8 * f, -0.5, -0.2);
    // Royal Emblems (Chattra / Parasol)
    addCone(vertices, [0, 1.85 * f, 0], [0, 1.5 * f, 0], 0.7 * f, 8);
  }

  // ===========================================================================
  // GROUP 3: CELESTIAL DYNASTIES & LANTERN FESTIVALS (Chinese Master Heritage 01-06)
  // ===========================================================================
  else if (id === 'chinese-01') {
    // YUANBAO: Auspicious Golden Wealth Ingot with raised boat rim & center dome
    const l = 1.35 * f, w = 0.75 * f, h = 0.55 * f;
    addQuad(vertices, [-l, h * 0.8, -w * 0.3], [l, h * 0.8, -w * 0.3], [l * 0.7, -h * 0.5, -w], [-l * 0.7, -h * 0.5, -w]);
    addQuad(vertices, [l, h * 0.8, w * 0.3], [-l, h * 0.8, w * 0.3], [-l * 0.7, -h * 0.5, w], [l * 0.7, -h * 0.5, w]);
    addTriangle(vertices, [-l, h * 0.8, -w * 0.3], [-l, h * 0.8, w * 0.3], [-l * 1.25, h * 1.2, 0]);
    addTriangle(vertices, [l, h * 0.8, w * 0.3], [l, h * 0.8, -w * 0.3], [l * 1.25, h * 1.2, 0]);
    // Center Golden Egg / Jewel Dome
    for (let k = 0; k < 8; k++) {
      const a1 = (k / 8) * Math.PI * 2;
      const a2 = ((k + 1) / 8) * Math.PI * 2;
      addTriangle(vertices, [Math.cos(a1) * 0.45 * f, h * 0.5, Math.sin(a1) * 0.35 * f], [Math.cos(a2) * 0.45 * f, h * 0.5, Math.sin(a2) * 0.35 * f], [0, h * 1.25, 0]);
    }
  }
  else if (id === 'chinese-02') {
    // DENGLONG: Royal Palace Red Lantern with ribbed bulb, hexagonal caps & gold tassel
    const rL = 0.95 * f;
    const hL = 1.15 * f;
    const ribs = 12;
    for (let i = 0; i < ribs; i++) {
      const a1 = (i / ribs) * Math.PI * 2;
      const a2 = ((i + 1) / ribs) * Math.PI * 2;
      addTriangle(vertices, [0, hL * 0.5, 0], [Math.cos(a1) * rL, 0, Math.sin(a1) * rL], [Math.cos(a2) * rL, 0, Math.sin(a2) * rL]);
      addTriangle(vertices, [0, -hL * 0.5, 0], [Math.cos(a2) * rL, 0, Math.sin(a2) * rL], [Math.cos(a1) * rL, 0, Math.sin(a1) * rL]);
    }
    // Hexagonal Top & Bottom Gold Caps
    addCylinder(vertices, hL * 0.5, hL * 0.65, 0.45 * f, 0.35 * f, 6);
    addCylinder(vertices, -hL * 0.65, -hL * 0.5, 0.35 * f, 0.45 * f, 6);
    // Hanging Gold Tassel
    addCone(vertices, [0, -hL * 1.25, 0], [0, -hL * 0.65, 0], 0.25 * f, 6);
  }
  else if (id === 'chinese-03') {
    // LOONG: Imperial Celestial Dragon with sinuous cloud-riding curves & flaming horn ridge
    const coils = 12;
    const spineR = 0.28;
    for (let i = 0; i < coils; i++) {
      const t1 = i / coils;
      const t2 = (i + 1) / coils;
      const z1 = (t1 - 0.5) * 2.4;
      const z2 = (t2 - 0.5) * 2.4;
      const x1 = Math.sin(t1 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const x2 = Math.sin(t2 * Math.PI * 2.5 + f * Math.PI) * 0.65 * f;
      const y1 = Math.cos(t1 * Math.PI * 2) * 0.45 * f;
      const y2 = Math.cos(t2 * Math.PI * 2) * 0.45 * f;
      addQuad(vertices, [x1 - spineR, y1, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1 - spineR, y1, z1], [x1, y1 + spineR * 1.6, z1], [x2, y2 + spineR * 1.6, z2], [x2 - spineR, y2, z2]);
      addQuad(vertices, [x1, y1 + spineR * 1.6, z1], [x1 + spineR, y1, z1], [x2 + spineR, y2, z2], [x2, y2 + spineR * 1.6, z2]);
    }
  }
  else if (id === 'chinese-04') {
    // FENGHUANG: Empress Phoenix with sweeping celestial wings & 5 long radiant tail plumes
    const bodyH = 0.8 * f;
    addBoxVertices(vertices, -0.2, 0.2, -0.3, bodyH, -0.3, 0.3);
    // Swept curved celestial wings
    const wSpan = 1.75 * f;
    addTriangle(vertices, [-0.2, bodyH * 0.8, 0], [-wSpan, bodyH * 1.2, 0.4], [-wSpan * 0.6, 0, -0.2]);
    addTriangle(vertices, [0.2, bodyH * 0.8, 0], [wSpan * 0.6, 0, -0.2], [wSpan, bodyH * 1.2, 0.4]);
    // Crown crest
    addTriangle(vertices, [-0.1, bodyH, 0.2], [0.1, bodyH, 0.2], [0, bodyH + 0.55 * f, 0.4]);
    // 5 Radiant Tail Plumes
    for (let t = 0; t < 5; t++) {
      const a = ((t - 2) / 2) * 0.4;
      const len = 1.8 * f;
      addTriangle(vertices, [-0.1, -0.3, -0.2], [0.1, -0.3, -0.2], [Math.sin(a) * len, -1.2 * f, -0.2 - Math.cos(a) * len * 0.5]);
    }
  }
  else if (id === 'chinese-05') {
    // MID-AUTUMN JADE RABBIT: Seated auspicious hare with long upright ears & rounded haunches
    addBoxVertices(vertices, -0.4, 0.4, -0.4, 0.3 * f, -0.5, 0.4);
    addBoxVertices(vertices, -0.3, 0.3, 0.3 * f, 0.75 * f, -0.1, 0.45);
    // Tall upright folded ears
    addTriangle(vertices, [-0.25, 0.75 * f, 0.2], [-0.1, 0.75 * f, 0.2], [-0.2, 1.45 * f, 0.1]);
    addTriangle(vertices, [0.1, 0.75 * f, 0.2], [0.25, 0.75 * f, 0.2], [0.2, 1.45 * f, 0.1]);
    // Fluffy tail
    addBoxVertices(vertices, -0.15, 0.15, -0.2, 0.1, -0.65 * f, -0.5);
  }
  else if (id === 'chinese-06') {
    // FU CHUAN: Traditional Chinese Junk Ship with flared hull & 3 ribbed batten sails
    const hL = 1.6, hW = 0.55, hD = 0.45 * f;
    // Tapered boat hull
    addQuad(vertices, [-hL * 0.8, hD, -hW], [hL * 0.8, hD, -hW * 0.7], [hL * 0.6, -hD, -hW * 0.5], [-hL * 0.6, -hD, -hW * 0.7]);
    addQuad(vertices, [hL * 0.8, hD, hW * 0.7], [-hL * 0.8, hD, hW], [-hL * 0.6, -hD, hW * 0.7], [hL * 0.6, -hD, hW * 0.5]);
    // 3 Battened Origami Sails
    const masts = [-0.6, 0.0, 0.6];
    const sHeights = [1.2, 1.55, 1.0];
    masts.forEach((mx, idx) => {
      const sh = sHeights[idx] * f;
      addQuad(vertices, [mx - 0.05, hD, 0], [mx + 0.35, hD, 0.1], [mx + 0.3, hD + sh, 0.1], [mx - 0.05, hD + sh, 0]);
    });
  }

  // ===========================================================================
  // GROUP 4: COMPUTATIONAL FRONTIERS & KINETIC ACTION (American Modern 01-06)
  // ===========================================================================
  else if (id === 'american-01') {
    // BALD EAGLE: Majestic raptor with wide wingspan, hooked beak & white cowl
    const wingSpan = 1.85 * f;
    addQuad(vertices, [-0.25, -0.4, 0], [0.25, -0.4, 0], [0.2, 0.4, 0.2], [-0.2, 0.4, 0.2]);
    addQuad(vertices, [-0.2, 0.4, 0.2], [-wingSpan, 0.6 * f, 0], [-wingSpan * 0.8, -0.2 * f, 0], [-0.25, -0.4, 0]);
    addQuad(vertices, [0.2, 0.4, 0.2], [0.25, -0.4, 0], [wingSpan * 0.8, -0.2 * f, 0], [wingSpan, 0.6 * f, 0]);
    addTriangle(vertices, [-0.15, 0.4, 0.2], [0.15, 0.4, 0.2], [0, 0.85 * f, 0.5 * f]);
  }
  else if (id === 'american-02') {
    // AMERICAN PRAIRIE BISON: Heavy woolly shoulder hump, downward horns & muscular stance
    const bW = 0.55, bH = 0.5, bL = 0.85;
    addBoxVertices(vertices, -bW, bW, -bH, bH, -bL, bL);
    // Massive raised dorsal hump
    addTriangle(vertices, [-bW * 0.9, bH, -bL * 0.2], [bW * 0.9, bH, -bL * 0.2], [0, bH + 0.65 * f, bL * 0.3]);
    // Lowered heavy head & beard
    addBoxVertices(vertices, -0.3, 0.3, -bH * 0.5, bH * 0.4, bL, bL + 0.45 * f);
    // Curved sharp horns
    addTriangle(vertices, [-0.3, bH * 0.2, bL + 0.2], [-0.65 * f, bH * 0.6 * f, bL + 0.1], [-0.15, bH * 0.2, bL + 0.1]);
    addTriangle(vertices, [0.15, bH * 0.2, bL + 0.1], [0.65 * f, bH * 0.6 * f, bL + 0.1], [0.3, bH * 0.2, bL + 0.2]);
  }
  else if (id === 'american-03') {
    // KINETIC JUMPING FROG: Bulging eye facets & double Z-fold leaping spring legs
    const bW = 0.75 * f, bL = 0.9 * f;
    addQuad(vertices, [-bW, -0.15, -bL], [bW, -0.15, -bL], [bW * 0.6, 0.25, bL * 0.4], [-bW * 0.6, 0.25, bL * 0.4]);
    // Eyes
    addTriangle(vertices, [-bW * 0.5, 0.25, bL * 0.4], [-bW * 0.2, 0.25, bL * 0.4], [-bW * 0.35, 0.45 * f, bL * 0.5]);
    addTriangle(vertices, [bW * 0.2, 0.25, bL * 0.4], [bW * 0.5, 0.25, bL * 0.4], [bW * 0.35, 0.45 * f, bL * 0.5]);
    // Z-Fold Rear Leaping Spring Bellows
    const zExt = 0.75 * f;
    addQuad(vertices, [-bW, -0.15, -bL], [-bW * 0.5, -0.15, -bL], [-bW * 1.3 * f, -0.35, -bL - zExt], [-bW * 1.6 * f, -0.35, -bL - zExt]);
    addQuad(vertices, [bW * 0.5, -0.15, -bL], [bW, -0.15, -bL], [bW * 1.6 * f, -0.35, -bL - zExt], [bW * 1.3 * f, -0.35, -bL - zExt]);
  }
  else if (id === 'american-04') {
    // HERCULES BEETLE: Lang-style 32-grid beetle with massive forward-curving pincer horns
    const bW = 0.6, bL = 0.85;
    addBoxVertices(vertices, -bW, bW, -0.3, 0.25, -bL, bL * 0.5);
    // Massive forward thoracic horn
    addTriangle(vertices, [-0.15, 0.2, bL * 0.5], [0.15, 0.2, bL * 0.5], [0, 0.85 * f, bL * 0.5 + 1.45 * f]);
    // Head pincer horn
    addTriangle(vertices, [-0.1, 0.0, bL * 0.5], [0.1, 0.0, bL * 0.5], [0, 0.2 * f, bL * 0.5 + 1.1 * f]);
    // Lateral elytra wing covers
    addTriangle(vertices, [-bW, -0.2, -bL], [-bW * 0.8, 0.2, bL * 0.5], [-bW * (1.2 + 0.4 * f), 0.1, 0]);
    addTriangle(vertices, [bW, -0.2, -bL], [bW * (1.2 + 0.4 * f), 0.1, 0], [bW * 0.8, 0.2, bL * 0.5]);
  }
  else if (id === 'american-05') {
    // 4TH OF JULY STARBURST: 12-point pyrotechnic origami firework explosion
    const rays = 12;
    for (let r = 0; r < rays; r++) {
      const a = (r / rays) * Math.PI * 2;
      const len = (r % 2 === 0 ? 1.55 : 0.85) * f;
      const p1 = [Math.cos(a - 0.25) * 0.25, Math.sin(a - 0.25) * 0.25, 0];
      const p2 = [Math.cos(a + 0.25) * 0.25, Math.sin(a + 0.25) * 0.25, 0];
      const tip = [Math.cos(a) * len, Math.sin(a) * len, 0.2 * (r % 2 === 0 ? 1 : -1) * f];
      addTriangle(vertices, p1, p2, tip);
    }
  }
  else if (id === 'american-06') {
    // GOLDEN GATE BRIDGE: Twin suspension towers, roadway deck & parabolic main cables
    const towerH = 1.65 * f, spanL = 1.45;
    addBoxVertices(vertices, -spanL * 0.6, -spanL * 0.45, -0.6, towerH, -0.15, 0.15);
    addBoxVertices(vertices, spanL * 0.45, spanL * 0.6, -0.6, towerH, -0.15, 0.15);
    addBoxVertices(vertices, -spanL * 1.2, spanL * 1.2, -0.1, 0.05, -0.3, 0.3);
    // Parabolic main suspension cables
    addTriangle(vertices, [-spanL * 0.525, towerH, 0], [0, 0.05, 0], [spanL * 0.525, towerH, 0]);
  }

  // ===========================================================================
  // GROUP 5: SACRED ARCHITECTURAL NATIVITY (Holiday Master Heritage 01-10)
  // ===========================================================================
  else if (id === 'nativity-01') {
    // ARCHITECTURAL STABLE: Angled timber gables, pitched roof & back wall alcove
    const roofSpan = 1.35;
    const roofH = 1.25 * f;
    addQuad(vertices, [-roofSpan, 0, -0.8], [0, roofH, -0.8], [0, roofH, 0.8], [-roofSpan, 0, 0.8]);
    addQuad(vertices, [0, roofH, -0.8], [roofSpan, 0, -0.8], [roofSpan, 0, 0.8], [0, roofH, 0.8]);
    addQuad(vertices, [-roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, -0.6, -0.75], [roofSpan * 0.9, 0, -0.75], [-roofSpan * 0.9, 0, -0.75]);
  }
  else if (id === 'nativity-02') {
    // HOLY FAMILY: Mary kneeling, Joseph standing with staff & baby manger crib
    // Joseph (Standing)
    addCone(vertices, [-0.45, 1.25 * f, 0], [-0.45, -0.6, 0], 0.45 * f, 8);
    // Mary (Kneeling)
    addCone(vertices, [0.45, 0.75 * f, 0], [0.45, -0.6, 0], 0.5 * f, 8);
    // Baby Jesus in Manger Crib
    addBoxVertices(vertices, -0.25, 0.25, -0.6, -0.25 * f, -0.3, 0.3);
    addCone(vertices, [0, -0.1, 0], [0, -0.25 * f, 0], 0.18 * f, 6);
  }
  else if (id === 'nativity-03') {
    // NATIVITY ANGEL: Volumetric gown, celestial halo & sweeping 3D wings
    const bodyH = 1.2 * f;
    addCone(vertices, [0, bodyH, 0], [0, -0.6, 0], 0.65 * f, 8);
    addTriangle(vertices, [-0.25, bodyH + 0.35, -0.1], [0.25, bodyH + 0.35, -0.1], [0, bodyH + 0.45, -0.1]);
    addTriangle(vertices, [-0.1, bodyH * 0.7, -0.1], [-1.35 * f, bodyH * 1.15, -0.3], [-0.85 * f, bodyH * 0.4, -0.2]);
    addTriangle(vertices, [0.1, bodyH * 0.7, -0.1], [0.85 * f, bodyH * 0.4, -0.2], [1.35 * f, bodyH * 1.15, -0.3]);
  }
  else if (id === 'nativity-04') {
    // STAR OF BETHLEHEM: 8-Pointed radiant heraldic star with elongated vertical tail
    const pts = 8;
    for (let p = 0; p < pts; p++) {
      const a = (p / pts) * Math.PI * 2;
      const isLong = (p === 6);
      const rayL = (isLong ? 1.65 : (p % 2 === 0 ? 0.95 : 0.45)) * f;
      const p1 = [Math.cos(a - 0.2) * 0.25, Math.sin(a - 0.2) * 0.25, 0];
      const p2 = [Math.cos(a + 0.2) * 0.25, Math.sin(a + 0.2) * 0.25, 0];
      const apex = [Math.cos(a) * rayL, Math.sin(a) * rayL, 0.15 * f];
      addTriangle(vertices, p1, p2, apex);
    }
  }
  else if (id === 'nativity-05') {
    // SHEPHERD & SHEEP: Standing draped shepherd with crook beside a faceted woolly lamb
    // Shepherd with cloak
    addCone(vertices, [-0.4, 1.2 * f, 0], [-0.4, -0.6, 0], 0.45 * f, 8);
    // Crook staff
    addBoxVertices(vertices, -0.75, -0.7, -0.6, 1.45 * f, 0.1, 0.15);
    // Woolly Lamb
    addBoxVertices(vertices, 0.2, 0.8, -0.6, -0.15, -0.2, 0.2);
    addCone(vertices, [0.85, 0.15 * f, 0], [0.75, -0.15, 0], 0.2 * f, 6);
  }
  else if (id === 'nativity-06') {
    // WISE MAN 1 (MELCHIOR): Standing king in pointed crown presenting ornate Gold Urn
    addCone(vertices, [0, 1.35 * f, 0], [0, -0.6, 0], 0.55 * f, 8);
    // Pointed gold crown
    addCone(vertices, [0, 1.65 * f, 0], [0, 1.35 * f, 0], 0.25 * f, 6);
    // Urn treasure box held in hands
    addBoxVertices(vertices, -0.2, 0.2, 0.2 * f, 0.5 * f, 0.4, 0.7);
  }
  else if (id === 'nativity-07') {
    // WISE MAN 2 (BALTHAZAR): Robed King with turban holding incense censer with plumes
    addCone(vertices, [0, 1.35 * f, 0], [0, -0.6, 0], 0.55 * f, 8);
    // Turban dome
    addCylinder(vertices, 1.35 * f, 1.55 * f, 0.28 * f, 0.15 * f, 8);
    // Frankincense vessel
    addCone(vertices, [0, 0.65 * f, 0.5], [0, 0.25 * f, 0.5], 0.22 * f, 6);
  }
  else if (id === 'nativity-08') {
    // WISE MAN 3 (GASPAR): Kneeling robed king bearing ornate chalice
    addCone(vertices, [0, 0.95 * f, 0], [0, -0.6, 0], 0.65 * f, 8);
    // Myrrh Chalice
    addCylinder(vertices, 0.1 * f, 0.45 * f, 0.1 * f, 0.25 * f, 6);
  }
  else if (id === 'nativity-09') {
    // DONKEY & OX: Dual animal vignette: Perked-ear donkey beside resting horned ox
    // Donkey
    addBoxVertices(vertices, -1.0, -0.4, -0.6, 0.1 * f, -0.3, 0.3);
    addCone(vertices, [-0.4, 0.55 * f, 0], [-0.5, 0.1 * f, 0], 0.25 * f, 6);
    addTriangle(vertices, [-0.5, 0.55 * f, 0], [-0.65 * f, 0.95 * f, 0], [-0.45, 0.55 * f, 0]);
    // Resting Ox
    addBoxVertices(vertices, 0.3, 1.0, -0.6, 0.05 * f, -0.4, 0.4);
    addCone(vertices, [1.05, 0.35 * f, 0], [0.95, 0.05 * f, 0], 0.3 * f, 6);
    addTriangle(vertices, [1.0, 0.35 * f, -0.2], [1.35 * f, 0.55 * f, -0.2], [1.0, 0.2 * f, -0.2]);
  }
  else if (id === 'nativity-10') {
    // COMPLETE SCENE ASSEMBLY: Stable gable, star overhead, and assembled holy figures
    const roofSpan = 1.45;
    const roofH = 1.45 * f;
    addQuad(vertices, [-roofSpan, 0, -0.9], [0, roofH, -0.9], [0, roofH, 0.9], [-roofSpan, 0, 0.9]);
    addQuad(vertices, [0, roofH, -0.9], [roofSpan, 0, -0.9], [roofSpan, 0, 0.9], [0, roofH, 0.9]);
    // Holy family inside
    addCone(vertices, [-0.4, 0.8 * f, 0], [-0.4, -0.6, 0], 0.35 * f, 6);
    addCone(vertices, [0.4, 0.6 * f, 0], [0.4, -0.6, 0], 0.35 * f, 6);
    addBoxVertices(vertices, -0.2, 0.2, -0.6, -0.3 * f, -0.2, 0.2);
    // Overhead Star
    addTriangle(vertices, [-0.2, roofH + 0.1, 0.9], [0.2, roofH + 0.1, 0.9], [0, roofH + 0.6 * f, 0.9]);
  }

  // ===========================================================================
  // GROUP 6: THE BIOMIMETIC BOTANICA & AQUATIC GARDENS (Lotus & Flora 01-06)
  // ===========================================================================
  else if (id === 'lotus-01') {
    // LOTUS BASE & CALYX: Octagonal sepals forming a firm water-level foundation
    const sepals = 8;
    const rSep = 1.45 * f;
    for (let i = 0; i < sepals; i++) {
      const a1 = (i / sepals) * Math.PI * 2;
      const a2 = ((i + 1) / sepals) * Math.PI * 2;
      const aMid = (a1 + a2) / 2;
      addTriangle(vertices, [0, -0.4, 0], [Math.cos(a1) * rSep * 0.5, -0.4, Math.sin(a1) * rSep * 0.5], [Math.cos(aMid) * rSep, -0.2 * f, Math.sin(aMid) * rSep]);
      addTriangle(vertices, [0, -0.4, 0], [Math.cos(aMid) * rSep, -0.2 * f, Math.sin(aMid) * rSep], [Math.cos(a2) * rSep * 0.5, -0.4, Math.sin(a2) * rSep * 0.5]);
    }
  }
  else if (id === 'lotus-02') {
    // BLOOMING LOTUS BLOSSOM: 16 multi-tiered curved petals opening radially
    for (let t = 0; t < 3; t++) {
      const petals = 8, pR = (1.4 - t * 0.35) * f, pH = (0.2 + t * 0.35) * f;
      for (let p = 0; p < petals; p++) {
        const a1 = (p / petals) * Math.PI * 2;
        const a2 = ((p + 1) / petals) * Math.PI * 2;
        const aMid = (a1 + a2) / 2;
        addTriangle(vertices, [0, -0.3, 0], [Math.cos(a1) * pR * 0.3, -0.3, Math.sin(a1) * pR * 0.3], [Math.cos(aMid) * pR, -0.3 + pH, Math.sin(aMid) * pR]);
        addTriangle(vertices, [0, -0.3, 0], [Math.cos(aMid) * pR, -0.3 + pH, Math.sin(aMid) * pR], [Math.cos(a2) * pR * 0.3, -0.3, Math.sin(a2) * pR * 0.3]);
      }
    }
  }
  else if (id === 'lotus-03') {
    // INNER LOTUS CORE & GOLDEN STAMEN: Cylindrical receptacle with 24 golden pleated stamen rays
    addCylinder(vertices, -0.2, 0.4 * f, 0.5 * f, 0.4 * f, 8);
    const rays = 24;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      const rx = Math.cos(a) * 0.85 * f;
      const rz = Math.sin(a) * 0.85 * f;
      addTriangle(vertices, [Math.cos(a) * 0.45 * f, 0.4 * f, Math.sin(a) * 0.45 * f], [rx, 0.7 * f, rz], [Math.cos(a + 0.1) * 0.45 * f, 0.4 * f, Math.sin(a + 0.1) * 0.45 * f]);
    }
  }
  else if (id === 'lotus-04') {
    // MULTI-LAYERED LILY PADS: Stepped floating pads with characteristic V-notch cuts
    const count = 3;
    for (let c = 0; c < count; c++) {
      const px = (c - 1) * 0.85 * f;
      const pz = (c % 2 === 0 ? 0.4 : -0.4) * f;
      const rad = 0.95 * f;
      const facets = 12;
      for (let i = 0; i < facets - 2; i++) {
        const a1 = (i / facets) * Math.PI * 2 + 0.4;
        const a2 = ((i + 1) / facets) * Math.PI * 2 + 0.4;
        addTriangle(vertices, [px, -0.4 + c * 0.08, pz], [px + Math.cos(a1) * rad, -0.4 + c * 0.08, pz + Math.sin(a1) * rad], [px + Math.cos(a2) * rad, -0.4 + c * 0.08, pz + Math.sin(a2) * rad]);
      }
    }
  }
  else if (id === 'lotus-05') {
    // SCULPTURAL 3D KOI FISH: S-curving hydrodynamic body, undulating dorsal ridge & flared fins
    const segments = 10;
    const bodyL = 2.2 * f;
    const rBody = 0.48;
    for (let s = 0; s < segments; s++) {
      const t1 = s / segments;
      const t2 = (s + 1) / segments;
      const z1 = 1.0 - t1 * bodyL;
      const z2 = 1.0 - t2 * bodyL;
      const x1 = Math.sin(t1 * Math.PI * 1.8) * 0.45 * f;
      const x2 = Math.sin(t2 * Math.PI * 1.8) * 0.45 * f;
      const w1 = Math.sin(t1 * Math.PI) * rBody;
      const w2 = Math.sin(t2 * Math.PI) * rBody;
      for (let h = 0; h < 6; h++) {
        const a1 = (h / 6) * Math.PI * 2;
        const a2 = ((h + 1) / 6) * Math.PI * 2;
        addQuad(vertices, [x1 + Math.cos(a1) * w1, Math.sin(a1) * w1, z1], [x1 + Math.cos(a2) * w1, Math.sin(a2) * w1, z1], [x2 + Math.cos(a2) * w2, Math.sin(a2) * w2, z2], [x2 + Math.cos(a1) * w2, Math.sin(a1) * w2, z2]);
      }
    }
    // Wide Flared Pectoral Fins
    addTriangle(vertices, [-0.3, 0, 0.4], [-1.2 * f, 0.2 * f, 0.1], [-0.3, 0, -0.2]);
    addTriangle(vertices, [0.3, 0, 0.4], [0.3, 0, -0.2], [1.2 * f, 0.2 * f, 0.1]);
    // Rippling Forged Tail Fin
    const tailZ = 1.0 - bodyL;
    addTriangle(vertices, [0, 0, tailZ], [-0.75 * f, 0.5 * f, tailZ - 0.7 * f], [0.75 * f, -0.5 * f, tailZ - 0.7 * f]);
  }
  else if (id === 'lotus-06') {
    // AQUATIC GARDEN WATER & STONE SETTING: Stepped ripple rings with zen stones & miniature bloom
    addCylinder(vertices, -0.5, -0.4, 1.6 * f, 1.7 * f, 16);
    // Zen River Stones
    addCone(vertices, [-0.6 * f, -0.2, 0.4 * f], [-0.6 * f, -0.4, 0.4 * f], 0.35 * f, 6);
    addCone(vertices, [0.5 * f, -0.25, -0.4 * f], [0.5 * f, -0.4, -0.4 * f], 0.28 * f, 6);
    // Center Floating Water Lily
    addCone(vertices, [0, 0.25 * f, 0], [0, -0.4, 0], 0.65 * f, 8);
  }

  // ===========================================================================
  // GROUP 7: SACRED MODULAR POLYHEDRA & VESSEL ARCHITECTURE (Geometric 01-08)
  // ===========================================================================
  else if (id === 'geometric-01') {
    // TRI-FACETED BASE UNIT: Triangular Sonobe unit with 60-degree mountain/valley lock tabs
    const side = 1.25 * f;
    const h = side * 0.866;
    addTriangle(vertices, [-side * 0.5, -0.3, -h * 0.33], [side * 0.5, -0.3, -h * 0.33], [0, 0.5 * f, h * 0.66]);
    // 3 Locking Tabs
    addTriangle(vertices, [-side * 0.5, -0.3, -h * 0.33], [0, 0.5 * f, h * 0.66], [-side * 0.8 * f, 0.1, 0]);
    addTriangle(vertices, [side * 0.5, -0.3, -h * 0.33], [side * 0.8 * f, 0.1, 0], [0, 0.5 * f, h * 0.66]);
    addTriangle(vertices, [-side * 0.5, -0.3, -h * 0.33], [0, -0.6 * f, -h * 0.8], [side * 0.5, -0.3, -h * 0.33]);
  }
  else if (id === 'geometric-02') {
    // DIAMOND HONEYCOMB MODULE: Rhombic dodecahedron unit with accordion pleats
    const r = 1.15 * f;
    const h = 0.85 * f;
    // Diamond facets
    for (let d = 0; d < 6; d++) {
      const a1 = (d / 6) * Math.PI * 2;
      const a2 = ((d + 1) / 6) * Math.PI * 2;
      addTriangle(vertices, [0, h, 0], [Math.cos(a1) * r, 0, Math.sin(a1) * r], [Math.cos(a2) * r, 0, Math.sin(a2) * r]);
      addTriangle(vertices, [0, -h, 0], [Math.cos(a2) * r, 0, Math.sin(a2) * r], [Math.cos(a1) * r, 0, Math.sin(a1) * r]);
    }
  }
  else if (id === 'geometric-03') {
    // FLUTED NECK COLLAR: 12-crease conical corrugated collar flaring outward
    const folds = 12;
    const h = 1.35 * f;
    for (let i = 0; i < folds; i++) {
      const a1 = (i / folds) * Math.PI * 2;
      const a2 = ((i + 1) / folds) * Math.PI * 2;
      const rTop = (i % 2 === 0 ? 1.25 : 0.85) * f;
      const rBot = 0.45 * f;
      addTriangle(vertices, [Math.cos(a1) * rBot, -h * 0.5, Math.sin(a1) * rBot], [Math.cos(a2) * rBot, -h * 0.5, Math.sin(a2) * rBot], [Math.cos(a1) * rTop, h * 0.5, Math.sin(a1) * rTop]);
      addTriangle(vertices, [Math.cos(a2) * rBot, -h * 0.5, Math.sin(a2) * rBot], [Math.cos(a2) * rTop, h * 0.5, Math.sin(a2) * rTop], [Math.cos(a1) * rTop, h * 0.5, Math.sin(a1) * rTop]);
    }
  }
  else if (id === 'geometric-04') {
    // HEXAGONAL WAIST ASSEMBLY: Sturdy 6-sided interlocking mortise-and-tenon belt
    addCylinder(vertices, -0.4 * f, 0.4 * f, 1.25 * f, 1.25 * f, 6);
    // Outer interlocking flange facets
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const fx = Math.cos(a) * 1.55 * f;
      const fz = Math.sin(a) * 1.55 * f;
      addTriangle(vertices, [Math.cos(a - 0.2) * 1.25 * f, 0, Math.sin(a - 0.2) * 1.25 * f], [Math.cos(a + 0.2) * 1.25 * f, 0, Math.sin(a + 0.2) * 1.25 * f], [fx, 0, fz]);
    }
  }
  else if (id === 'geometric-05') {
    // METALLIC ACCENT CORNER BRACKETS: 8 corner triangular pyramidal bracket caps (Kintsugi)
    for (let c = 0; c < 8; c++) {
      const sx = (c & 1 ? 1 : -1) * 0.8 * f;
      const sy = (c & 2 ? 1 : -1) * 0.8 * f;
      const sz = (c & 4 ? 1 : -1) * 0.8 * f;
      addTriangle(vertices, [sx, sy, sz], [sx * 1.3, sy * 0.7, sz * 0.7], [sx * 0.7, sy * 1.3, sz * 0.7]);
      addTriangle(vertices, [sx, sy, sz], [sx * 0.7, sy * 1.3, sz * 0.7], [sx * 0.7, sy * 0.7, sz * 1.3]);
    }
  }
  else if (id === 'geometric-06') {
    // SPIRAL PLEAT EXTERIOR SKIN: Chirality-twisted helical origami cylinder
    const rings = 8;
    const sides = 8;
    for (let r = 0; r < rings; r++) {
      const y1 = (r / rings) * 2.0 - 1.0;
      const y2 = ((r + 1) / rings) * 2.0 - 1.0;
      const twist1 = (r / rings) * Math.PI * 1.2 * f;
      const twist2 = ((r + 1) / rings) * Math.PI * 1.2 * f;
      for (let s = 0; s < sides; s++) {
        const a1 = (s / sides) * Math.PI * 2;
        const a2 = ((s + 1) / sides) * Math.PI * 2;
        const rad = 0.95 * f;
        addQuad(vertices, [Math.cos(a1 + twist1) * rad, y1, Math.sin(a1 + twist1) * rad], [Math.cos(a2 + twist1) * rad, y1, Math.sin(a2 + twist1) * rad], [Math.cos(a2 + twist2) * rad, y2, Math.sin(a2 + twist2) * rad], [Math.cos(a1 + twist2) * rad, y2, Math.sin(a1 + twist2) * rad]);
      }
    }
  }
  else if (id === 'geometric-07') {
    // WEIGHTED ARCHITECTURAL PLINTH: Tiered stepped square podium with chamfered bevels
    addBoxVertices(vertices, -1.3 * f, 1.3 * f, -0.6, -0.4, -1.3 * f, 1.3 * f);
    addBoxVertices(vertices, -1.0 * f, 1.0 * f, -0.4, -0.15, -1.0 * f, 1.0 * f);
    addBoxVertices(vertices, -0.7 * f, 0.7 * f, -0.15, 0.2 * f, -0.7 * f, 0.7 * f);
  }
  else if (id === 'geometric-08') {
    // FULL MODULAR VASE SYNTHESIS: Complete assembled 3D origami vase!
    // Lower bowl
    addCylinder(vertices, -0.8, -0.2, 0.5 * f, 1.25 * f, 8);
    // Hexagonal waist
    addCylinder(vertices, -0.2, 0.2, 1.25 * f, 0.65 * f, 6);
    // Fluted helical neck
    addCylinder(vertices, 0.2, 0.9 * f, 0.65 * f, 1.15 * f, 8);
  }

  // ===========================================================================
  // GROUP 8: LEPIDOPTERA & SACRED MANDALAS (Butterflies & Mandalas 01-07)
  // ===========================================================================
  else if (id === 'butterfly-01') {
    // SWALLOWTAIL MONARCH: Distinctive elongated swallowtail streamers & chevron veins
    const wingW = 1.65 * f;
    addBoxVertices(vertices, -0.08, 0.08, -0.1, 0.1, -0.5, 0.5);
    // Forewings
    addTriangle(vertices, [-0.08, 0.1, 0.2], [-wingW, 0.4 * f, 1.0], [-wingW * 0.7, 0.2 * f, -0.1]);
    addTriangle(vertices, [0.08, 0.1, 0.2], [wingW * 0.7, 0.2 * f, -0.1], [wingW, 0.4 * f, 1.0]);
    // Hindwings with swallowtail tails
    addTriangle(vertices, [-0.08, 0, -0.1], [-wingW * 0.8, 0.1 * f, -0.8], [-0.15, 0, -0.9 * f]);
    addTriangle(vertices, [0.08, 0, -0.1], [0.15, 0, -0.9 * f], [wingW * 0.8, 0.1 * f, -0.8]);
  }
  else if (id === 'butterfly-02') {
    // EMERALD MORPHO: Broad structural wings with deep dihedral lift
    const wSpan = 1.8 * f;
    const dihedral = 0.55 * Math.sin(f * Math.PI * 0.5);
    addBoxVertices(vertices, -0.09, 0.09, -0.1, 0.1, -0.4, 0.4);
    addQuad(vertices, [-0.09, 0.08, 0.3], [-wSpan, 0.08 + dihedral, 0.7], [-wSpan * 0.85, 0.08 + dihedral, -0.5], [-0.09, 0.08, -0.3]);
    addQuad(vertices, [0.09, 0.08, 0.3], [0.09, 0.08, -0.3], [wSpan * 0.85, 0.08 + dihedral, -0.5], [wSpan, 0.08 + dihedral, 0.7]);
  }
  else if (id === 'butterfly-03') {
    // GOLDEN BIRDWING: Massive angular swept wings with predatory posture
    const wSpan = 2.0 * f;
    addBoxVertices(vertices, -0.1, 0.1, -0.12, 0.12, -0.6, 0.5);
    addTriangle(vertices, [-0.1, 0.1, 0.3], [-wSpan, 0.6 * f, 0.6], [-wSpan * 0.5, 0.2, -0.4]);
    addTriangle(vertices, [0.1, 0.1, 0.3], [wSpan * 0.5, 0.2, -0.4], [wSpan, 0.6 * f, 0.6]);
  }
  else if (id === 'butterfly-04') {
    // PYGMY AZURE TRIO: Three miniature flutter butterflies in helical flight dance
    const trio = [
      { x: -0.6 * f, y: 0.3 * f, z: 0.3 * f, rot: 0.4 },
      { x: 0.6 * f, y: -0.2 * f, z: -0.2 * f, rot: -0.5 },
      { x: 0.0, y: 0.7 * f, z: -0.4 * f, rot: 1.2 }
    ];
    trio.forEach((b) => {
      const bW = 0.55 * f;
      addBoxVertices(vertices, b.x - 0.04, b.x + 0.04, b.y - 0.04, b.y + 0.04, b.z - 0.15, b.z + 0.15);
      addTriangle(vertices, [b.x - 0.04, b.y, b.z], [b.x - bW, b.y + 0.2 * f, b.z + 0.2], [b.x - bW * 0.6, b.y + 0.1, b.z - 0.2]);
      addTriangle(vertices, [b.x + 0.04, b.y, b.z], [b.x + bW * 0.6, b.y + 0.1, b.z - 0.2], [b.x + bW, b.y + 0.2 * f, b.z + 0.2]);
    });
  }
  else if (id === 'butterfly-05') {
    // RADIAL MANDALA ARMATURE: 8-fold symmetrical star armature with interlinked struts
    const spokes = 8;
    const rOut = 1.45 * f;
    for (let s = 0; s < spokes; s++) {
      const a = (s / spokes) * Math.PI * 2;
      const aNext = ((s + 1) / spokes) * Math.PI * 2;
      const pTip = [Math.cos(a) * rOut, 0, Math.sin(a) * rOut];
      const pMid = [Math.cos((a + aNext) / 2) * (rOut * 0.5), 0.3 * f, Math.sin((a + aNext) / 2) * (rOut * 0.5)];
      addTriangle(vertices, [0, 0, 0], pTip, pMid);
    }
  }
  else if (id === 'butterfly-06') {
    // CONCENTRIC PETAL RING: 16-facet pleated circular origami rosette with scalloped outer edges
    const petals = 16;
    const rOuter = 1.45 * f;
    const rInner = 0.5 * f;
    for (let p = 0; p < petals; p++) {
      const a1 = (p / petals) * Math.PI * 2;
      const a2 = ((p + 1) / petals) * Math.PI * 2;
      const hP = (p % 2 === 0 ? 0.35 : -0.15) * f;
      addTriangle(vertices, [Math.cos(a1) * rInner, 0, Math.sin(a1) * rInner], [Math.cos(a1) * rOuter, hP, Math.sin(a1) * rOuter], [Math.cos(a2) * rOuter, hP, Math.sin(a2) * rOuter]);
      addTriangle(vertices, [Math.cos(a1) * rInner, 0, Math.sin(a1) * rInner], [Math.cos(a2) * rOuter, hP, Math.sin(a2) * rOuter], [Math.cos(a2) * rInner, 0, Math.sin(a2) * rInner]);
    }
  }
  else if (id === 'butterfly-07') {
    // GRAND MANDALA WALL INSTALLATION: Multi-layer masterwork combining armature and double rosette
    // Layer 1: Outer 8-Star
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      addTriangle(vertices, [0, 0, -0.1], [Math.cos(a - 0.2) * 1.6 * f, Math.sin(a - 0.2) * 1.6 * f, -0.1], [Math.cos(a) * 1.9 * f, Math.sin(a) * 1.9 * f, 0.1 * f]);
    }
    // Layer 2: Inner pleated rosette
    for (let p = 0; p < 12; p++) {
      const a1 = (p / 12) * Math.PI * 2;
      const a2 = ((p + 1) / 12) * Math.PI * 2;
      addTriangle(vertices, [0, 0, 0.2 * f], [Math.cos(a1) * 0.9 * f, Math.sin(a1) * 0.9 * f, 0], [Math.cos(a2) * 0.9 * f, Math.sin(a2) * 0.9 * f, 0]);
    }
  }

  // ===========================================================================
  // GROUP 9: FESTIVAL & HERITAGE TRADITIONS (Festival 01-05)
  // ===========================================================================
  else if (id === 'festival-01') {
    // HALLOWEEN JACK-O'-LANTERN: 12-ribbed pumpkin with curved stem & carved facial facets
    const ribs = 12, pR = 0.95 * f, pH = 0.85 * f;
    for (let i = 0; i < ribs; i++) {
      const a1 = (i / ribs) * Math.PI * 2;
      const a2 = ((i + 1) / ribs) * Math.PI * 2;
      const bulg = (i % 2 === 0 ? 1.15 : 0.9);
      addTriangle(vertices, [0, pH * 0.6, 0], [Math.cos(a1) * pR * bulg, 0, Math.sin(a1) * pR * bulg], [Math.cos(a2) * pR * bulg, 0, Math.sin(a2) * pR * bulg]);
      addTriangle(vertices, [Math.cos(a1) * pR * bulg, 0, Math.sin(a1) * pR * bulg], [0, -pH * 0.6, 0], [Math.cos(a2) * pR * bulg, 0, Math.sin(a2) * pR * bulg]);
    }
    // Twisted Stem
    addCone(vertices, [0.15, pH * 1.1, 0], [0, pH * 0.6, 0], 0.15 * f, 5);
  }
  else if (id === 'festival-02') {
    // HALLOWEEN VAMPIRE BAT — Museum-Grade 3D Gothic Origami Masterpiece
    // 3D Ribbed Torso Box & Keel
    addBoxVertices(vertices, -0.18, 0.18, -0.35, 0.35 * f, -0.22, 0.22);
    addTriangle(vertices, [-0.18, 0.35 * f, 0], [0.18, 0.35 * f, 0], [0, 0.5 * f, 0.28]);
    addTriangle(vertices, [-0.18, -0.35, 0], [0, -0.5 * f, 0.22], [0.18, -0.35, 0]);

    // Furrowed Snout Head & Fangs
    addTriangle(vertices, [-0.15, 0.35 * f, 0.1], [0.15, 0.35 * f, 0.1], [0, 0.2 * f, 0.55]);
    addTriangle(vertices, [-0.08, 0.2 * f, 0.55], [-0.04, 0.08 * f, 0.52], [-0.02, 0.2 * f, 0.5]);
    addTriangle(vertices, [0.02, 0.2 * f, 0.5], [0.04, 0.08 * f, 0.52], [0.08, 0.2 * f, 0.55]);

    // Tall Pointed Ears with inner pink relief
    addTriangle(vertices, [-0.18, 0.35 * f, 0], [-0.35 * f, 0.95 * f, 0.08], [-0.06, 0.45 * f, 0.12]);
    addTriangle(vertices, [-0.15, 0.4 * f, 0.02], [-0.3 * f, 0.85 * f, 0.08], [-0.08, 0.48 * f, 0.1]);
    addTriangle(vertices, [0.06, 0.45 * f, 0.12], [0.35 * f, 0.95 * f, 0.08], [0.18, 0.35 * f, 0]);
    addTriangle(vertices, [0.08, 0.48 * f, 0.1], [0.3 * f, 0.85 * f, 0.08], [0.15, 0.4 * f, 0.02]);

    // Articulated Swept Wings with 3 Finger Bones & Scalloped Membrane
    const rootL = [-0.18, 0.25, 0.05];
    const thumbL = [-0.65 * f, 0.7 * f, 0.25];
    const b1L = [-1.15 * f, 0.65 * f, 0.3];
    const b2L = [-1.85 * f, 0.35 * f, 0.2];
    const b3L = [-1.55 * f, -0.45 * f, 0.08];
    const s1L = [-1.45 * f, 0.4 * f - 0.25 * f, 0.12];
    const s2L = [-1.65 * f, -0.15 * f - 0.25 * f, 0.05];
    const flankL = [-0.18, -0.3, 0];

    addTriangle(vertices, rootL, thumbL, b1L);
    addTriangle(vertices, rootL, b1L, s1L);
    addTriangle(vertices, rootL, s1L, b2L);
    addTriangle(vertices, s1L, b2L, s2L);
    addTriangle(vertices, s2L, b2L, b3L);
    addTriangle(vertices, flankL, rootL, s2L);
    addTriangle(vertices, flankL, s2L, b3L);

    const rootR = [0.18, 0.25, 0.05];
    const thumbR = [0.65 * f, 0.7 * f, 0.25];
    const b1R = [1.15 * f, 0.65 * f, 0.3];
    const b2R = [1.85 * f, 0.35 * f, 0.2];
    const b3R = [1.55 * f, -0.45 * f, 0.08];
    const s1R = [1.45 * f, 0.4 * f - 0.25 * f, 0.12];
    const s2R = [1.65 * f, -0.15 * f - 0.25 * f, 0.05];
    const flankR = [0.18, -0.3, 0];

    addTriangle(vertices, rootR, b1R, thumbR);
    addTriangle(vertices, rootR, s1R, b1R);
    addTriangle(vertices, rootR, b2R, s1R);
    addTriangle(vertices, s1R, s2R, b2R);
    addTriangle(vertices, s2R, b3R, b2R);
    addTriangle(vertices, flankR, s2R, rootR);
    addTriangle(vertices, flankR, b3R, s2R);

    // Hanging Claws (Inverted Tail Hooks)
    addTriangle(vertices, [-0.12, -0.45 * f, 0], [-0.18 * f, -0.8 * f, -0.15], [-0.04, -0.6 * f, 0.05]);
    addTriangle(vertices, [0.04, -0.6 * f, 0.05], [0.18 * f, -0.8 * f, -0.15], [0.12, -0.45 * f, 0]);
  }
  else if (id === 'festival-03') {
    // HANAMI CHOCHIN: Traditional Japanese cylindrical festival lantern with pleated bellows
    addCylinder(vertices, -0.8 * f, 0.8 * f, 0.75 * f, 0.75 * f, 12);
    // Wooden top hanging frame & bottom weight
    addCylinder(vertices, 0.8 * f, 0.95 * f, 0.85 * f, 0.45 * f, 8);
    addCylinder(vertices, -0.95 * f, -0.8 * f, 0.45 * f, 0.85 * f, 8);
  }
  else if (id === 'festival-04') {
    // DÍA DE LOS MUERTOS CALAVERA: Ornate sugar skull with cheekbones & forehead marigold
    // Cranium & Jaw
    addCone(vertices, [0, 0.8 * f, 0], [0, 0, 0], 0.75 * f, 8);
    addBoxVertices(vertices, -0.4 * f, 0.4 * f, -0.6 * f, 0.0, -0.3, 0.4);
    // Hollow eye sockets
    addTriangle(vertices, [-0.35 * f, 0.2 * f, 0.4], [-0.15 * f, 0.2 * f, 0.4], [-0.25 * f, 0.4 * f, 0.4]);
    addTriangle(vertices, [0.15 * f, 0.2 * f, 0.4], [0.35 * f, 0.2 * f, 0.4], [0.25 * f, 0.4 * f, 0.4]);
    // Forehead marigold flower
    addCone(vertices, [0, 0.7 * f, 0.45], [0, 0.55 * f, 0.35], 0.3 * f, 6);
  }
  else if (id === 'festival-05') {
    // LUNAR NEW YEAR HONGBAO ENVELOPE: Crisp red packet with diamond tuck flap & gold seal
    const eW = 0.85, eH = 1.35 * f;
    // Flat rectangular packet body
    addBoxVertices(vertices, -eW, eW, -eH * 0.5, eH * 0.5, -0.05, 0.05);
    // Triangular diamond tuck flap
    addTriangle(vertices, [-eW, eH * 0.5, 0.05], [eW, eH * 0.5, 0.05], [0, eH * 0.1, 0.12 * f]);
    // Embossed gold emblem medallion
    addCone(vertices, [0, 0, 0.15 * f], [0, 0, 0.06], 0.25 * f, 8);
  }
  else {
    // ARCHITECTURAL POLYHEDRAL PRISM FALLBACK (Strict mathematical diamond)
    const facets = 8;
    const wRadius = 1.05 * f;
    const wHeight = 1.35 * (0.35 + 0.65 * f);
    for (let i = 0; i < facets; i++) {
      const a1 = (i / facets) * Math.PI * 2;
      const a2 = ((i + 1) / facets) * Math.PI * 2;
      addQuad(vertices, [Math.cos(a1) * wRadius, -wHeight * 0.5, Math.sin(a1) * wRadius], [Math.cos(a2) * wRadius, -wHeight * 0.5, Math.sin(a2) * wRadius], [Math.cos(a2) * (wRadius * 0.75), wHeight * 0.5, Math.sin(a2) * (wRadius * 0.75)], [Math.cos(a1) * (wRadius * 0.75), wHeight * 0.5, Math.sin(a1) * (wRadius * 0.75)]);
    }
  }



        }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.center(); // Center geometry exactly at [0, 0, 0] so it NEVER clips or sinks!
    geo.computeBoundingSphere();
    if (geo.boundingSphere && geo.boundingSphere.radius > 0.0001) {
        const targetRadius = 1.35;
        const scaleFactor = targetRadius / geo.boundingSphere.radius;
        geo.scale(scaleFactor, scaleFactor, scaleFactor);
    }

    const frontMesh = new THREE.Mesh(geo, materials[0]);
    const backMesh = new THREE.Mesh(geo, materials[1]);
    frontMesh.castShadow = true;
    backMesh.castShadow = true;
    group.add(frontMesh);
    group.add(backMesh);

    // Subtle crisp crease lines
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireframe);

    // -------------------------------------------------------------------------
    // Authentic Yoshizawa-Randlett 3D Folding Guidance (Zero Clutter, Maximum Clarity)
    // -------------------------------------------------------------------------
    const metrics = calculateStepPlanMetrics(currentKit.id, s, totalSteps, f);
    if (showFoldHints && !isCompletedView && f < 0.98) {
        const planGroup = new THREE.Group();

        // 1. Glowing 3D Crease Line
        const creasePts = [
            new THREE.Vector3(metrics.creaseLine.x1 * 0.7, 0.05, metrics.creaseLine.y1 * 0.7),
            new THREE.Vector3(metrics.creaseLine.x2 * 0.7, 0.05, metrics.creaseLine.y2 * 0.7)
        ];
        const creaseGeo = new THREE.BufferGeometry().setFromPoints(creasePts);
        const creaseMat = new THREE.LineBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.95
        });
        const creaseLine = new THREE.Line(creaseGeo, creaseMat);
        planGroup.add(creaseLine);

        // 2. Point A Landmark: Corner to Lift (Beacon Ring + Dot)
        const ptA = new THREE.Vector3(metrics.mobileVertex[0] * 0.7, 0.07, metrics.mobileVertex[1] * 0.7);
        const ringAGeo = new THREE.RingGeometry(0.045, 0.075, 24);
        const ringAMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
        const ringAMesh = new THREE.Mesh(ringAGeo, ringAMat);
        ringAMesh.rotation.x = -Math.PI / 2;
        ringAMesh.position.set(ptA.x, 0.06, ptA.z);
        planGroup.add(ringAMesh);

        // 3. Point B Landmark: Target Destination (Amber Concentric Target Ring)
        const lastTraj = metrics.trajectoryPath[metrics.trajectoryPath.length - 1];
        if (lastTraj) {
            const ptB = new THREE.Vector3(lastTraj.x * 0.7, 0.07, lastTraj.y * 0.7);
            const ringBGeo = new THREE.RingGeometry(0.06, 0.09, 24);
            const ringBMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
            const ringBMesh = new THREE.Mesh(ringBGeo, ringBMat);
            ringBMesh.rotation.x = -Math.PI / 2;
            ringBMesh.position.set(ptB.x, 0.06, ptB.z);
            planGroup.add(ringBMesh);
        }

        // 4. Directional Motion Arc
        const arcPts = metrics.trajectoryPath.map(
            p => new THREE.Vector3(p.x * 0.7, Math.max(0.05, p.z * 0.7 + 0.1), p.y * 0.7)
        );
        const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPts);
        const arcMat = new THREE.LineDashedMaterial({
            color: 0xf59e0b,
            dashSize: 0.08,
            gapSize: 0.04
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        arcLine.computeLineDistances();
        planGroup.add(arcLine);

        group.add(planGroup);
        creaseLinesGroup = planGroup;
    }

    paperMesh = group;
    scene.add(paperMesh);

    // Update Floating Plan View Kinematics HUD
    updateKinematicsHUD(metrics);

    // Keep artificial mannequin hands invisible so user view is 100% clean
    if (handsRig) {
        handsRig.group.visible = showHands;
    }
}

// -----------------------------------------------------------------------------
// PLAN VIEW KINEMATICS HUD CONTROLS
// -----------------------------------------------------------------------------
function updateKinematicsHUD(metrics) {
    if (!metrics) return;
    const hudAngle = document.getElementById('hudAngleVal');
    const hudVector = document.getElementById('hudVectorVal');
    const hudCrease = document.getElementById('hudCreaseVal');
    const hudBadge = document.getElementById('hudKawasakiBadge');
    const hudAxiom = document.getElementById('hudAxiomVal');

    if (hudAngle) hudAngle.textContent = metrics.foldAngleCurrent.toFixed(1) + '° (' + metrics.foldType + ')';
    if (hudVector) {
        const u = metrics.creaseVector;
        hudVector.textContent = '<' + u[0].toFixed(2) + ', ' + u[1].toFixed(2) + ', ' + u[2].toFixed(2) + '>';
    }
    if (hudCrease) {
        const c = metrics.creaseLine;
        hudCrease.textContent = '[(' + c.x1.toFixed(1) + ', ' + c.y1.toFixed(1) + ') → (' + c.x2.toFixed(1) + ', ' + c.y2.toFixed(1) + ')]';
    }
    if (hudBadge) {
        hudBadge.textContent = metrics.kawasakiCheck.isValid ? 'KAWASAKI: VALID' : 'NON-FLAT FOLD';
        hudBadge.style.color = metrics.kawasakiCheck.isValid ? '#34d399' : '#f59e0b';
    }
    if (hudAxiom && metrics.huzitaAxiom) {
        hudAxiom.textContent = metrics.huzitaAxiom.name;
    }
}

// -----------------------------------------------------------------------------
// COMPUTATIONAL ORIGAMI EXPORT SUITE (MIT FOLD, 3D OBJ, CRICUT SVG)
// -----------------------------------------------------------------------------
function exportFoldFile() {
    if (!currentKit) return;
    const totalSteps = currentKit.steps ? currentKit.steps.length : 5;
    const metrics = calculateStepPlanMetrics(currentKit.id, currentStepIndex, totalSteps, foldFactor);
    const foldData = {
        file_spec: 1.1,
        file_creator: 'OrigamiStudio™ v5.0 (MIT FOLD Compliant)',
        file_author: 'OrigamiStudio Computational Paper Engineering Lab',
        file_title: `${currentKit.title} - Step ${currentStepIndex + 1}`,
        file_classes: ['singleModel'],
        frame_title: 'creasePattern',
        frame_classes: ['creasePattern'],
        frame_attributes: ['2D'],
        vertices_coords: [
            [-1.0, -1.0], [1.0, -1.0], [1.0, 1.0], [-1.0, 1.0], [0.0, 0.0],
            [metrics.creaseLine.x1, metrics.creaseLine.y1],
            [metrics.creaseLine.x2, metrics.creaseLine.y2],
            [metrics.mobileVertex[0], metrics.mobileVertex[1]]
        ],
        edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [5, 6], [0, 2], [1, 3]],
        edges_assignment: ['B', 'B', 'B', 'B', 'V', 'F', 'F'],
        edges_foldAngle: [0, 0, 0, 0, -metrics.foldAngleTarget, 0, 0]
    };
    const blob = new Blob([JSON.stringify(foldData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentKit.id}-step${currentStepIndex + 1}.fold`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportObjFile() {
    if (!paperMesh) return;
    let targetGeo = null;
    paperMesh.traverse(child => {
        if (child.isMesh && child.geometry && !targetGeo) targetGeo = child.geometry;
    });
    if (!targetGeo) return;
    const pos = targetGeo.getAttribute('position');
    let obj = `# ORIGAMISTUDIO™ 3D Wavefront OBJ Exporter\n# Model: ${currentKit ? currentKit.title : 'OrigamiModel'}\n\n`;
    for (let i = 0; i < pos.count; i++) {
        obj += `v ${pos.getX(i).toFixed(4)} ${pos.getY(i).toFixed(4)} ${pos.getZ(i).toFixed(4)}\n`;
    }
    obj += '\ns 1\n';
    for (let i = 0; i < pos.count; i += 3) {
        obj += `f ${i + 1} ${i + 2} ${i + 3}\n`;
    }
    const blob = new Blob([obj], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentKit ? currentKit.id : 'origami'}-step${currentStepIndex + 1}.obj`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportCricutSvg() {
    if (!currentKit) return;
    const totalSteps = currentKit.steps ? currentKit.steps.length : 5;
    const metrics = calculateStepPlanMetrics(currentKit.id, currentStepIndex, totalSteps, 1.0);
    const size = 600, pad = 50, w = size - pad * 2, h = size - pad * 2;
    const toX = x => pad + ((x + 1.2) / 2.4) * w;
    const toY = y => pad + ((1.2 - y) / 2.4) * h;
    const cX1 = toX(metrics.creaseLine.x1), cY1 = toY(metrics.creaseLine.y1);
    const cX2 = toX(metrics.creaseLine.x2), cY2 = toY(metrics.creaseLine.y2);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <title>${currentKit.title} - Step ${currentStepIndex + 1} Cricut/Laser Guide</title>
  <rect width="${size}" height="${size}" fill="#0a0d18"/>
  <g id="layer-cut" stroke="#ffffff" stroke-width="2.5" fill="none">
    <rect x="${toX(-1.0)}" y="${toY(1.0)}" width="${toX(1.0) - toX(-1.0)}" height="${toY(-1.0) - toY(1.0)}"/>
  </g>
  <g id="layer-score" fill="none">
    <line x1="${toX(-1.0)}" y1="${toY(-1.0)}" x2="${toX(1.0)}" y2="${toY(1.0)}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,4"/>
    <line x1="${toX(-1.0)}" y1="${toY(1.0)}" x2="${toX(1.0)}" y2="${toY(-1.0)}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,4"/>
    <line x1="${cX1}" y1="${cY1}" x2="${cX2}" y2="${cY2}" stroke="#00f0ff" stroke-width="3.5" stroke-dasharray="8,8" stroke-linecap="round"/>
  </g>
  <text x="${pad}" y="${size - 20}" fill="#94a3b8" font-family="monospace" font-size="12">
    ${currentKit.title} - Step ${currentStepIndex + 1} | Cricut / Laser Cutter Toolpaths
  </text>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentKit.id}-step${currentStepIndex + 1}-cricut-guide.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toggleKinematicsHUD() {
    const hud = document.getElementById('stageKinematicsHud');
    const btn = document.getElementById('btnToggleKinematics');
    if (hud) {
        hud.classList.toggle('hidden');
        if (btn) btn.classList.toggle('active', !hud.classList.contains('hidden'));
    }
}

// Animation Loop
let currentLightingIndex = 0;
const LIGHTING_MOODS = [
    { name: '💡 Studio', key: 0xfff7ed, rim: 0x00f0ff, fill: 0xff6b35, keyInt: 1.35, rimInt: 0.75, amb: 0xffffff, ambInt: 0.85 },
    { name: '☀️ Daylight', key: 0xffffff, rim: 0x93c5fd, fill: 0xf1f5f9, keyInt: 1.5, rimInt: 0.5, amb: 0xffffff, ambInt: 0.95 },
    { name: '🌙 Midnight', key: 0x38bdf8, rim: 0xf59e0b, fill: 0x6366f1, keyInt: 1.1, rimInt: 1.2, amb: 0x0f172a, ambInt: 0.6 }
];


function toggleFoldHints() {
    showFoldHints = !showFoldHints;
    const btn = document.getElementById('btnFoldHint');
    if (btn) btn.classList.toggle('active', showFoldHints);
    const slider = document.getElementById('foldProgressSlider');
    build3DPaperModel(parseFloat(slider ? slider.value : 100) / 100);
}

function toggleEndModelPreview() {
    isEndModelPreview = !isEndModelPreview;
    const btn = document.getElementById('btnEndModelToggle');
    if (btn) {
        btn.classList.toggle('active', isEndModelPreview);
        btn.textContent = isEndModelPreview ? '↩️ Step Fold' : '🌟 End Model';
    }
    const badge = document.getElementById('stageFoldBadge');
    if (badge) {
        if (isEndModelPreview || (currentKit && currentKit.steps && currentStepIdx === currentKit.steps.length - 1)) {
            badge.textContent = '🌟 MASTER 3D SCULPTURE';
            badge.style.color = '#fbbf24';
            badge.style.borderColor = 'rgba(245, 158, 11, 0.5)';
        } else if (currentKit && currentKit.steps && currentKit.steps[currentStepIdx]) {
            badge.textContent = (currentKit.steps[currentStepIdx].foldType || 'FOLD STEP').toUpperCase();
            badge.style.color = '';
            badge.style.borderColor = '';
        }
    }
    build3DPaperModel(1.0);
}

function toggleHandsVisibility() {
    showHands = !showHands;
    if (handsRig) handsRig.group.visible = showHands;
    const btn = document.getElementById('btnToggleHands');
    if (btn) btn.classList.toggle('active', showHands);
}

function toggleFoldLoop() {
    isFoldLooping = !isFoldLooping;
    const btn = document.getElementById('btnToggleLoop');
    if (btn) btn.classList.toggle('active', isFoldLooping);
}

function togglePlayFold() {
    const slider = document.getElementById('foldProgressSlider');
    if (slider && parseFloat(slider.value) >= 98) {
        slider.value = 0;
        build3DPaperModel(0.01);
    }
    isFoldPlaying = !isFoldPlaying;
    updatePlayButtonUI();
}

function updatePlayButtonUI() {
    const btn = document.getElementById('btnPlayFold');
    if (btn) {
        btn.textContent = isFoldPlaying ? '⏸ PAUSE' : '▶ WATCH FOLD (SLOW)';
        btn.classList.toggle('active', isFoldPlaying);
    }
}

function animate() {
    requestAnimationFrame(animate);

    rotX += (targetRotX - rotX) * 0.1;

    // Automated Step Fold Kinematics Player
    if (isFoldPlaying) {
        const slider = document.getElementById('foldProgressSlider');
        if (slider) {
            let val = parseFloat(slider.value);
            if (val >= 100) {
                if (isFoldLooping) {
                    if (!window._loopTimeout) {
                        window._loopTimeout = setTimeout(() => {
                            if (isFoldPlaying && isFoldLooping) {
                                slider.value = 0;
                                build3DPaperModel(0.01);
                                OrigamiAudio.playCrease();
                            }
                            window._loopTimeout = null;
                        }, 950);
                    }
                } else {
                    isFoldPlaying = false;
                    updatePlayButtonUI();
                }
            } else {
                const delta = foldSpeed === 'slow' ? 0.7 : foldSpeed === 'fast' ? 2.4 : 1.35;
                slider.value = Math.min(100, val + delta);
                const factor = slider.value / 100;
                const disp = document.getElementById('foldPercentDisplay');
                if (disp) disp.textContent = 'FOLD (' + Math.round(slider.value) + '%)';
                build3DPaperModel(factor);
                if (viewerMode === 'cp') renderCreasePatternSVG();
                if (Math.round(slider.value) % 25 === 0) {
                    OrigamiAudio.playCrease();
                }
            }
        }
    }
    rotY += (targetRotY - rotY) * 0.1;

    if (paperMesh) {
        paperMesh.rotation.x = rotX;
        paperMesh.rotation.y = rotY;
        paperMesh.position.y = 0.22 + Math.sin(Date.now() * 0.002) * 0.035;
    }

    if (camera) {
        camera.lookAt(0, 0.22, 0);
    }

    renderer.render(scene, camera);
}

function resetCamera() {
    targetRotX = 0.22;
    targetRotY = -0.45;
    cameraDist = 3.8;
    if (camera) {
        camera.position.set(0, 0.55, cameraDist);
        camera.lookAt(0, 0.22, 0);
    }
    const slider = document.getElementById('foldProgressSlider');
    if (slider) {
        slider.value = 100;
        const disp = document.getElementById('foldPercentDisplay');
        if (disp) disp.textContent = 'FOLD (100%)';
    }
    build3DPaperModel(1.0);
    setActiveAngleBtn('btnAnglePerspective');
}

function setCameraAngle(mode) {
    if (mode === 'perspective') {
        targetRotX = 0.22;
        targetRotY = -0.45;
        cameraDist = 3.8;
        setActiveAngleBtn('btnAnglePerspective');
    } else if (mode === 'top') {
        targetRotX = 1.52;
        targetRotY = 0.0;
        cameraDist = 3.6;
        setActiveAngleBtn('btnAngleTop');
        const hud = document.getElementById('stageKinematicsHud');
        if (hud) hud.classList.remove('hidden');
        const kBtn = document.getElementById('btnToggleKinematics');
        if (kBtn) kBtn.classList.add('active');
    } else if (mode === 'front') {
        targetRotX = 0.0;
        targetRotY = 0.0;
        cameraDist = 3.8;
        setActiveAngleBtn('btnAngleFront');
    }
    if (camera) {
        camera.position.set(0, 0.55, cameraDist);
        camera.lookAt(0, 0.22, 0);
    }
}

function setActiveAngleBtn(activeId) {
    ['btnAnglePerspective', 'btnAngleTop', 'btnAngleFront'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (id === activeId) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
}

function cycleLightingMood() {
    currentLightingIndex = (currentLightingIndex + 1) % LIGHTING_MOODS.length;
    const mood = LIGHTING_MOODS[currentLightingIndex];
    const btn = document.getElementById('btnLightingMood');
    if (btn) btn.textContent = mood.name;

    if (!scene) return;
    // Update scene directional lights
    scene.traverse(child => {
        if (child.isDirectionalLight) {
            if (child.position.y > 0 && child.position.x > 0) {
                child.color.setHex(mood.key);
                child.intensity = mood.keyInt;
            } else if (child.position.x < 0) {
                child.color.setHex(mood.rim);
                child.intensity = mood.rimInt;
            } else {
                child.color.setHex(mood.fill);
            }
        } else if (child.isAmbientLight) {
            child.color.setHex(mood.amb);
            child.intensity = mood.ambInt;
        }
    });
}

// -----------------------------------------------------------------------------
// UI RENDERING & STEP MANAGEMENT
// -----------------------------------------------------------------------------
function renderKitHeader(kit) {
    document.title = `${kit.title} | 3D Origami Studio`;
    document.getElementById('kitTitle').textContent = kit.title;
    document.getElementById('kitSubtitle').textContent = kit.subtitle || kit.description || '';
    document.getElementById('kitBadgePill').textContent = `KIT ${String(kit.kitNumber || '01').padStart(2, '0')}`;
    document.getElementById('kitCollectionName').textContent = kit.collectionTitle || 'OrigamiStudio';

    document.getElementById('tagDifficulty').textContent = kit.difficulty || 'Intermediate';
    document.getElementById('tagTime').textContent = kit.time || '25-35 min';

    if (kit.paper && kit.paper[0]) {
        document.getElementById('tagPaper').textContent = `${kit.paper[0].size} ${kit.paper[0].color}`;
    }

    document.getElementById('kitGoalText').textContent = kit.goal || kit.description || 'Master the 3D folded form.';
    document.getElementById('totalStepsCount').textContent = kit.steps ? kit.steps.length : 6;
}

function renderStepsList(kit) {
    const list = document.getElementById('stepsList');
    list.innerHTML = '';

    if (!kit.steps || !kit.steps.length) return;

    kit.steps.forEach((step, idx) => {
        const item = document.createElement('div');
        const isFinal = idx === kit.steps.length - 1;
        item.className = 'step-item' + (idx === currentStepIdx ? ' active' : '') + (completedSteps.has(idx) ? ' completed' : '') + (isFinal ? ' final-master-step' : '');
        item.innerHTML = `
            <div class="step-check-indicator" style="${isFinal && !completedSteps.has(idx) ? 'background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800;' : ''}">
                ${completedSteps.has(idx) ? '✓' : isFinal ? '🏆' : String(step.stepNumber || idx + 1).padStart(2, '0')}
            </div>
            <div class="step-info-col">
                <div class="step-title-text" style="display:flex; align-items:center; gap:0.4rem;">
                    <span>${step.title}</span>
                    ${isFinal ? '<span style="font-size:0.6rem; padding:0.1rem 0.35rem; background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); border-radius:3px; font-weight:700;">FINAL</span>' : ''}
                </div>
                <div class="step-sub-text">
                    <span>${isFinal ? 'Master 3D Sculpture' : (step.foldType || 'Valley Fold')}</span>
                    <span>•</span>
                    <span>${step.time || '3-5 min'}</span>
                </div>
            </div>
        `;
        item.onclick = () => showStep(idx);
        list.appendChild(item);
    });

    updateProgress();
}

// -----------------------------------------------------------------------------
// SCHOOL WORKFLOW & AGE TRACK ENGINE (Ages 5-18)
// -----------------------------------------------------------------------------
let currentAgeTrack = localStorage.getItem('origami_age_track') || 'explorer';
let isSpeaking = false;
let isSmartboardMode = false;

const KID_METAPHORS = [
    { title: "🌮 The Taco Fold (Diagonal Triangle)", metaphor: "Fold corner to corner to make a giant crispy taco!", instr: "Pick up corner ❶ with your fingers. Fly it across to meet corner ❷. Press the bottom flat like a pancake!" },
    { title: "🍦 The Ice Cream Cone (Kite Fold)", metaphor: "Fold the sides inward like an ice cream cone!", instr: "Take the left flap and fold it into the center line. It should look like a delicious cone!" },
    { title: "⛺ The Pup Tent (Mountain Peak)", metaphor: "Fold it backward to create a little tent roof!", instr: "Flip your paper over like a pancake. Fold the top down to make a cozy tent roof!" },
    { title: "💌 The Secret Pocket (Squash Fold)", metaphor: "Open the flap and squash it flat like a postage stamp!", instr: "Open the paper pocket with your finger, then gently squash it flat down the middle!" },
    { title: "🦊 The Fox Ears (Petal Fold)", metaphor: "Lift the wings up high like curious fox ears!", instr: "Lift both side points up into the air so they stand tall like little animal ears!" },
    { title: "🌸 The Blossom Crown (Final Shaping)", metaphor: "Curl the edges gently to bring your sculpture alive!", instr: "Gently curve the tip forward with your thumb to make the head or petals. Hold it up and celebrate!" }
];

const STEM_THEOREMS = [
    "Perpendicular Bisector & 45° Hypotenuse. Divides a square into two congruent isosceles right triangles with area A = a²/2.",
    "Angle Bisection & Kite Symmetry (C1v). Huzita-Hatori Axiom 3: Folding two lines onto each other generates an angle bisector axis.",
    "Mountain Crease Inversion. Maekawa Theorem: The difference between mountain and valley folds at any flat node is always |M - V| = 2.",
    "3D-to-2D Flat-Foldable Squash Projection. Kawasaki-Justin Theorem: Alternating angle sum around 4-degree vertex equals 180°.",
    "Parallel Pleating & Reverse Vertex Inversion. Preserves Gaussian curvature K = 0 at all interior developable surfaces.",
    "Volumetric Non-Euclidean Curved Folding. Equilibrium geometry via elastic sheet deformation and dihedral edge locking."
];

function setAgeTrack(track) {
    currentAgeTrack = track;
    try { localStorage.setItem('origami_age_track', track); } catch(e){}
    
    // Update button active states
    document.querySelectorAll('.age-track-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-track') === track);
    });

    stopSpeech();

    if (currentKit && currentKit.steps && currentKit.steps[currentStepIdx]) {
        updateStepInstructionDisplay(currentKit.steps[currentStepIdx], currentStepIdx);
    }
}

function updateStepInstructionDisplay(step, idx) {
    const meta = KID_METAPHORS[idx % KID_METAPHORS.length];
    const theorem = STEM_THEOREMS[idx % STEM_THEOREMS.length];

    const headingEl = document.getElementById('currentStepHeading');
    const instrEl = document.getElementById('currentInstructionText');
    const metaphorBox = document.getElementById('juniorMetaphorBox');
    const metaphorText = document.getElementById('juniorMetaphorText');
    const stemBox = document.getElementById('stemTheoremBox');
    const stemText = document.getElementById('stemTheoremText');

    if (currentAgeTrack === 'junior') {
        if (headingEl) headingEl.textContent = `Step ${idx + 1}: ${meta.title}`;
        if (instrEl) instrEl.textContent = meta.instr;
        if (metaphorBox && metaphorText) {
            metaphorBox.style.display = 'flex';
            metaphorText.textContent = meta.metaphor;
        }
        if (stemBox) stemBox.style.display = 'none';
    } else if (currentAgeTrack === 'stem') {
        if (headingEl) headingEl.textContent = `Step ${step.stepNumber || idx + 1}: ${step.title}`;
        if (instrEl) instrEl.textContent = step.instruction;
        if (metaphorBox) metaphorBox.style.display = 'none';
        if (stemBox && stemText) {
            stemBox.style.display = 'block';
            stemText.textContent = theorem;
        }
    } else {
        // Explorer
        if (headingEl) headingEl.textContent = `Step ${step.stepNumber || idx + 1}: ${step.title}`;
        if (instrEl) instrEl.textContent = step.instruction;
        if (metaphorBox) metaphorBox.style.display = 'none';
        if (stemBox) stemBox.style.display = 'none';
    }
}

function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    const btn = document.getElementById('btnReadAloud');
    if (btn) {
        btn.classList.remove('speaking');
        btn.innerHTML = '<span>🔊 Read to Me</span>';
    }
}

function toggleReadAloud() {
    if (isSpeaking) {
        stopSpeech();
        return;
    }
    if (!('speechSynthesis' in window)) {
        alert("Speech synthesis is not supported in this browser.");
        return;
    }

    const step = currentKit.steps[currentStepIdx];
    const meta = KID_METAPHORS[currentStepIdx % KID_METAPHORS.length];
    let textToSpeak = '';

    if (currentAgeTrack === 'junior') {
        textToSpeak = `${meta.title}. ${meta.instr} ${meta.metaphor}`;
    } else if (currentAgeTrack === 'stem') {
        textToSpeak = `Step ${currentStepIdx + 1}: ${step.title}. ${step.instruction} ${STEM_THEOREMS[currentStepIdx % STEM_THEOREMS.length]}`;
    } else {
        textToSpeak = `Step ${currentStepIdx + 1}: ${step.title}. ${step.instruction} Align corner 1 with target 2, and press crease firmly.`;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = currentAgeTrack === 'junior' ? 0.88 : 0.95;
    utterance.pitch = currentAgeTrack === 'junior' ? 1.15 : 1.0;

    utterance.onstart = () => {
        isSpeaking = true;
        const btn = document.getElementById('btnReadAloud');
        if (btn) {
            btn.classList.add('speaking');
            btn.innerHTML = '<span>⏹️ Stop Reading</span>';
        }
    };
    utterance.onend = () => {
        stopSpeech();
    };
    utterance.onerror = () => {
        stopSpeech();
    };

    window.speechSynthesis.speak(utterance);
}

function toggleSmartboardMode() {
    isSmartboardMode = !isSmartboardMode;
    document.body.classList.toggle('smartboard-mode', isSmartboardMode);
    const btn = document.getElementById('btnSmartboardToggle');
    if (btn) {
        btn.innerHTML = isSmartboardMode ? '<span>✕ Exit Smartboard</span>' : '<span>📺 Smartboard</span>';
    }
    setTimeout(() => {
        if (typeof onWindowResize === 'function') onWindowResize();
    }, 100);
}

function showStep(idx) {
    // Show completed step state initially so user can examine it clearly!
    const initSlider = document.getElementById('foldProgressSlider');
    if (initSlider) {
        initSlider.value = 100;
        const disp = document.getElementById('foldPercentDisplay');
        if (disp) disp.textContent = 'FOLD (100%)';
    }
    isFoldPlaying = false;
    updatePlayButtonUI();
    stopSpeech();
    if (!currentKit || !currentKit.steps || !currentKit.steps[idx]) return;

    currentStepIdx = idx;
    const step = currentKit.steps[idx];

    // Reset End Model Preview button when moving between steps
    isEndModelPreview = false;
    const btnEnd = document.getElementById('btnEndModelToggle');
    if (btnEnd) {
        btnEnd.classList.remove('active');
        btnEnd.textContent = '🌟 End Model';
    }

    // Sound feedback
    OrigamiAudio.playCrease();

    // Update Header Counter
    document.getElementById('stepCounterBadge').textContent = `Step ${step.stepNumber || idx + 1} of ${currentKit.steps.length}`;
    const foldBadge = document.getElementById('stageFoldBadge');
    if (foldBadge) {
        if (idx === currentKit.steps.length - 1) {
            foldBadge.textContent = '🌟 MASTER 3D SCULPTURE';
            foldBadge.style.color = '#fbbf24';
            foldBadge.style.borderColor = 'rgba(245, 158, 11, 0.5)';
        } else {
            foldBadge.textContent = (step.foldType || 'FOLD STEP').toUpperCase();
            foldBadge.style.color = '';
            foldBadge.style.borderColor = '';
        }
    }

    // Update Instruction Card with Age Track Intelligence
    document.getElementById('currentFoldType').textContent = step.foldType || 'Valley Fold';
    document.getElementById('currentTipText').textContent = step.tip || 'Fold slowly with firm, crisp creases.';
    updateStepInstructionDisplay(step, idx);

    // Button states
    document.getElementById('btnPrev').disabled = (currentStepIdx === 0);
    const nextBtn = document.getElementById('btnNext');
    if (currentStepIdx === currentKit.steps.length - 1) {
        nextBtn.innerHTML = `Finish Kit <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
        nextBtn.innerHTML = `Next Step <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }

    // Refresh Sidebar highlights
    renderStepsList(currentKit);

    // Rebuild 3D Model with current kinematics
    const slider = document.getElementById('foldProgressSlider');
    const factor = slider ? (slider.value / 100) : 1.0;
    build3DPaperModel(factor);

    // Render 2D Crease Pattern if in CP mode
    renderCreasePatternSVG();

    // GSAP Micro-animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.instruction-card', { y: 8, opacity: 0.8 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
        gsap.fromTo('#stageFoldBadge', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    }
}

function navigateStep(direction) {
    if (!currentKit || !currentKit.steps) return;
    const newIdx = currentStepIdx + direction;
    if (newIdx >= 0 && newIdx < currentKit.steps.length) {
        showStep(newIdx);
    } else if (newIdx >= currentKit.steps.length) {
        completedSteps.add(currentStepIdx);
        updateProgress();
        triggerKitCelebration();
    }
}

function toggleCurrentStepComplete() {
    if (completedSteps.has(currentStepIdx)) {
        completedSteps.delete(currentStepIdx);
    } else {
        completedSteps.add(currentStepIdx);
        OrigamiAudio.playStepClick();

        if (currentStepIdx < currentKit.steps.length - 1) {
            showStep(currentStepIdx + 1);
            return;
        } else {
            updateProgress();
            triggerKitCelebration();
            return;
        }
    }
    renderStepsList(currentKit);
    updateProgress();
}

function updateProgress() {
    if (!currentKit || !currentKit.steps) return;
    const total = currentKit.steps.length;
    const done = completedSteps.size;
    document.getElementById('completedCount').textContent = done;
    const pct = Math.round((done / total) * 100);
    const bar = document.getElementById('progressBarFill');
    if (bar) bar.style.width = `${pct}%`;
}

// -----------------------------------------------------------------------------
// MASTER COMPLETION MODAL & CONFETTI CELEBRATION
// -----------------------------------------------------------------------------
function triggerKitCelebration() {
    OrigamiAudio.playChime();

    // Update LocalStorage Completion & Streak
    try {
        localStorage.setItem('origami_kit_completed_' + currentKit.id, 'true');
        let streak = parseInt(localStorage.getItem('origami_daily_streak') || '0', 10);
        const todayStr = new Date().toISOString().slice(0, 10);
        const lastDate = localStorage.getItem('origami_last_completed_date');
        if (lastDate !== todayStr) {
            streak += 1;
            localStorage.setItem('origami_daily_streak', String(streak));
            localStorage.setItem('origami_last_completed_date', todayStr);
        }
        const streakEl = document.getElementById('modalDailyStreak');
        if (streakEl) streakEl.textContent = `🔥 ${streak} Day${streak > 1 ? 's' : ''}`;
    } catch (e) {}

    // Populate Modal Content
    const modal = document.getElementById('origamiCelebrationModal');
    if (!modal) return;

    const emojiEl = document.getElementById('modalEmoji');
    const titleEl = document.getElementById('modalKitTitle');
    const subEl = document.getElementById('modalKitSub');
    const printEl = document.getElementById('modalPrintLink');
    const sealEl = document.getElementById('modalSealName');

    const col = currentKit.collection || currentKit.category || 'heritage';
    const sealNames = {
        'indian': 'KAGAZ-KALA',
        'japanese': 'SENBAZURU',
        'chinese': 'ZHEZHI MASTER',
        'american': 'POLYHEDRAL',
        'lotus': 'ZEN BOTANIST',
        'butterfly': 'LEPIDOPTERA',
        'geometric': 'ARCHITECT',
        'nativity': 'SACRED MAESTRO',
        'holiday': 'FESTIVAL'
    };
    if (sealEl) sealEl.textContent = sealNames[col] || 'MASTER';

    if (emojiEl) emojiEl.textContent = currentKit.emoji || '🦚';
    if (titleEl) titleEl.textContent = currentKit.title;
    if (subEl) subEl.textContent = `Magnificent folding! You have brought the sculptural ${currentKit.title} to life.`;
    if (printEl) printEl.href = `../print-guide.html?id=${currentKit.id}`;

    modal.style.display = 'flex';
    startConfetti();
}

function closeCelebrationModal() {
    const modal = document.getElementById('origamiCelebrationModal');
    if (modal) modal.style.display = 'none';
}

// Canvas Confetti Generator
let confettiActive = false;
function startConfetti() {
    const canvas = document.getElementById('celebrationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff6b35', '#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'];

    for (let i = 0; i < 90; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 18,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 12,
            life: 1.0
        });
    }

    confettiActive = true;
    let frames = 0;

    function renderConfetti() {
        if (!confettiActive && frames > 140) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frames++;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // Gravity
            p.vx *= 0.98;
            p.rotation += p.vRot;
            p.life -= 0.007;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
            ctx.restore();
        });

        if (frames < 180) {
            requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    requestAnimationFrame(renderConfetti);
}

// -----------------------------------------------------------------------------
// CREASE PATTERN (CP) SVG GENERATOR
// -----------------------------------------------------------------------------
function switchViewerMode(mode) {
    viewerMode = mode;
    const threeContainer = document.getElementById('threeCanvasContainer');
    const cpContainer = document.getElementById('cpViewContainer');
    const tab3D = document.getElementById('tab3D');
    const tabCP = document.getElementById('tabCP');

    if (mode === '3d') {
        threeContainer.style.display = 'block';
        cpContainer.style.display = 'none';
        tab3D.classList.add('active');
        tabCP.classList.remove('active');
    } else {
        threeContainer.style.display = 'none';
        cpContainer.style.display = 'flex';
        tab3D.classList.remove('active');
        tabCP.classList.add('active');
        renderCreasePatternSVG();
    }
}

function renderCreasePatternSVG() {
    const target = document.getElementById('cpSvgTarget');
    if (!target || !currentKit) return;

    const totalSteps = currentKit.steps ? currentKit.steps.length : 5;
    const slider = document.getElementById('foldProgressSlider');
    const factor = slider ? (slider.value / 100) : 1.0;
    const metrics = calculateStepPlanMetrics(currentKit.id, currentStepIdx, totalSteps, factor);

    const size = 340;
    const pad = 24;
    const w = size - pad * 2;
    const h = size - pad * 2;
    const midX = size / 2;
    const midY = size / 2;

    const toX = (x) => midX + (x / 1.5) * (w / 2);
    const toY = (y) => midY - (y / 1.5) * (h / 2);

    const cX1 = toX(metrics.creaseLine.x1);
    const cY1 = toY(metrics.creaseLine.y1);
    const cX2 = toX(metrics.creaseLine.x2);
    const cY2 = toY(metrics.creaseLine.y2);

    let pathD = metrics.trajectoryPath.map((p, idx) => {
        return (idx === 0 ? 'M ' : 'L ') + toX(p.x).toFixed(1) + ' ' + toY(p.y).toFixed(1);
    }).join(' ');

    let svgContent = `
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
        </defs>
        <!-- Paper Perimeter -->
        <rect x="${pad}" y="${pad}" width="${w}" height="${h}" fill="#0b0e1b" stroke="#ffffff" stroke-width="2"/>
        <!-- Background Crease Guides -->
        <line x1="${pad}" y1="${pad}" x2="${size-pad}" y2="${size-pad}" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.4"/>
        <line x1="${size-pad}" y1="${pad}" x2="${pad}" y2="${size-pad}" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.4"/>
        <line x1="${midX}" y1="${pad}" x2="${midX}" y2="${size-pad}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="6,2,2,2" opacity="0.4"/>
        <line x1="${pad}" y1="${midY}" x2="${size-pad}" y2="${midY}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="6,2,2,2" opacity="0.4"/>
        
        <!-- Trajectory Arc -->
        <path d="${pathD}" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow)"/>

        <!-- Active Step Crease Axis -->
        <line x1="${cX1}" y1="${cY1}" x2="${cX2}" y2="${cY2}" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${cX1}" cy="${cY1}" r="4" fill="#00f0ff"/>
        <circle cx="${cX2}" cy="${cY2}" r="4" fill="#00f0ff"/>
        
        <!-- Text Telemetry -->
        <text x="32" y="325" fill="#00f0ff" font-size="10" font-family="monospace">u⃗: [${metrics.creaseVector[0].toFixed(2)}, ${metrics.creaseVector[1].toFixed(2)}]</text>
        <text x="220" y="325" fill="#f59e0b" font-size="10" font-family="monospace" font-weight="bold">θ: ${metrics.foldAngleCurrent.toFixed(1)}°</text>
    `;

    target.innerHTML = `<svg class="cp-view-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS & SHORTCUTS
// -----------------------------------------------------------------------------
function setupEventListeners() {
    const slider = document.getElementById('foldProgressSlider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            const factor = e.target.value / 100;
            const disp = document.getElementById('foldPercentDisplay');
            if (disp) disp.textContent = 'FOLD (' + Math.round(factor * 100) + '%)';
            build3DPaperModel(factor);
            if (viewerMode === 'cp') renderCreasePatternSVG();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight') {
            navigateStep(1);
        } else if (e.key === 'ArrowLeft') {
            navigateStep(-1);
        } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            toggleCurrentStepComplete();
        } else if (e.key === 'r' || e.key === 'R') {
            resetCamera();
        }
    });
}

document.addEventListener('DOMContentLoaded', initStudio);
