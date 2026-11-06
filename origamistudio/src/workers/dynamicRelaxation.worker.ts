/**
 * Dynamic Relaxation Particle-Spring Worker (Amanda Ghassaei / PRBM solver)
 * Simulates compliant sheet mechanics, axial/shear in-plane springs,
 * and PRBM torsional hinge creases with viscous damping integration.
 */

interface EdgeSpring {
  i: number;
  j: number;
  restLength: number;
  k: number;
}

interface CreaseHinge {
  vA: number;
  vB: number;
  vOpp1: number;
  vOpp2: number;
  targetAngle: number;
  stiffness: number;
}

let numParticles = 0;
let positions: Float32Array = new Float32Array(0);
let velocities: Float32Array = new Float32Array(0);
let forces: Float32Array = new Float32Array(0);
let edgeSprings: EdgeSpring[] = [];
let creaseHinges: CreaseHinge[] = [];

const C_DAMP = 0.08;
const DT = 0.016;

self.onmessage = (e: MessageEvent) => {
  const data = e.data;
  if (!data) return;

  if (data.type === 'init') {
    const rawPos = data.positions as Float32Array;
    numParticles = rawPos.length / 3;
    positions = new Float32Array(rawPos);
    velocities = new Float32Array(rawPos.length);
    forces = new Float32Array(rawPos.length);

    // Auto-extract triangle mesh edges as axial & shear springs
    edgeSprings = [];
    const edgeSet = new Set<string>();
    for (let i = 0; i < numParticles; i += 3) {
      const tri = [i, i + 1, i + 2];
      for (let k = 0; k < 3; k++) {
        const a = tri[k];
        const b = tri[(k + 1) % 3];
        const key = a < b ? `${a}_${b}` : `${b}_${a}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          const dx = positions[a * 3] - positions[b * 3];
          const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
          const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
          const rest = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;
          edgeSprings.push({ i: a, j: b, restLength: rest, k: 1000 });
        }
      }
    }

    if (data.creases) {
      creaseHinges = data.creases;
    }

    self.postMessage({ type: 'ready', numParticles });
  } else if (data.type === 'step') {
    const subSteps = data.subSteps || 4;
    const targetFold = data.foldFactor ?? 1.0;

    for (let s = 0; s < subSteps; s++) {
      forces.fill(0);

      // Axial edge spring forces Hooke's Law: F = -k * (dist - rest) * dir
      for (let e = 0; e < edgeSprings.length; e++) {
        const spring = edgeSprings[e];
        const i3 = spring.i * 3;
        const j3 = spring.j * 3;

        const dx = positions[j3] - positions[i3];
        const dy = positions[j3 + 1] - positions[i3 + 1];
        const dz = positions[j3 + 2] - positions[i3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-4;
        const delta = dist - spring.restLength;
        const fMag = spring.k * delta;

        const nx = (dx / dist) * fMag;
        const ny = (dy / dist) * fMag;
        const nz = (dz / dist) * fMag;

        forces[i3] += nx;
        forces[i3 + 1] += ny;
        forces[i3 + 2] += nz;
        forces[j3] -= nx;
        forces[j3 + 1] -= ny;
        forces[j3 + 2] -= nz;
      }

      // Crease torsional hinge restoring forces
      for (let c = 0; c < creaseHinges.length; c++) {
        const h = creaseHinges[c];
        const a3 = h.vA * 3;
        const b3 = h.vB * 3;
        const torque = h.stiffness * (targetFold - 1.0) * 0.05;
        forces[a3 + 1] += torque;
        forces[b3 + 1] -= torque;
      }

      // Viscous dynamic relaxation integration: v = (1 - c) * v + F * dt; p += v * dt
      for (let p = 0; p < positions.length; p++) {
        velocities[p] = (1 - C_DAMP) * velocities[p] + forces[p] * DT;
        positions[p] += velocities[p] * DT;
      }
    }

    // Double-buffering transferable buffer return
    const bufferCopy = new Float32Array(positions);
    (self as unknown as Worker).postMessage(
      { type: 'update', positions: bufferCopy, foldFactor: targetFold },
      [bufferCopy.buffer]
    );
  }
};
