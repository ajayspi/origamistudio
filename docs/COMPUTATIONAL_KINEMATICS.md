# Project O2: Computational Kinematics & Mechanics Specification

This document details the mathematical theory, mechanical constraints, geometric axioms, and physics solvers powering **Project O2**.

---

## 1. Axiomatic Geometry: The Huzita-Hatori Axioms

Project O2 implements the complete set of 7 Huzita-Hatori geometric axioms that define all planar single-crease construction operations:

| Axiom | Geometric Construction | Mathematical Formulation |
| :--- | :--- | :--- |
| **Axiom 1** | Crease passing through two points $P_1, P_2$ | $L: P(t) = P_1 + t(P_2 - P_1), \quad t \in \mathbb{R}$ |
| **Axiom 2** | Crease placing point $P_1$ onto point $P_2$ (Perpendicular Bisector) | $L \perp \overline{P_1 P_2}, \quad M = \frac{P_1 + P_2}{2} \in L$ |
| **Axiom 3** | Crease placing line $L_1$ onto line $L_2$ (Angle Bisector) | $\vec{u}_L = \frac{\vec{u}_1 + \vec{u}_2}{\|\vec{u}_1 + \vec{u}_2\|}$ |
| **Axiom 4** | Crease perpendicular to line $L_1$ passing through point $P_1$ | $\vec{u}_L \cdot \vec{u}_1 = 0, \quad P_1 \in L$ |
| **Axiom 5** | Crease placing point $P_1$ onto line $L_1$ passing through point $P_2$ | Circle-Line intersection: $\|P - P_2\| = \|P_1 - P_2\|$ |
| **Axiom 6** | Crease placing two points $P_1, P_2$ onto two lines $L_1, L_2$ simultaneously | Solves cubic polynomial (permits angle trisection and cube duplication) |
| **Axiom 7** | Crease placing point $P_1$ onto line $L_1$ along a line perpendicular to $L_2$ | $\vec{u}_L \cdot \vec{u}_2 = 0, \quad \text{reflection of } P_1 \in L_1$ |

---

## 2. Flat-Foldability Theorems

### A. Kawasaki's Theorem (Alternating Sector Angles)
For any single-vertex crease pattern with $2n$ creases and consecutive radial angles $\theta_1, \theta_2, \dots, \theta_{2n}$ around the vertex:
A necessary and sufficient condition for flat-foldability is that the alternating sum of angles equals $180^\circ$:

$$\sum_{i=1}^n \theta_{2i-1} = \sum_{i=1}^n \theta_{2i} = 180^\circ = \pi\text{ rad}$$

### B. Maekawa's Parity Theorem (Mountain-Valley Parity)
At any interior flat-foldable vertex, the difference between the count of Mountain creases ($M$) and Valley creases ($V$) is strictly two:

$$|M - V| = 2$$

*Corollary: The total degree of any interior flat-foldable vertex is always even ($M + V \equiv 0 \pmod 2$).*

---

## 3. 3D Spatial Kinematics: Rodrigues' Rotation Formula

When rotating a rigid planar facet flap around a crease hinge axis, each vertex $\vec{v}$ is transformed by dihedral fold angle $\theta(t) = \theta_{\text{target}} \cdot t$ (where $t \in [0, 1]$ represents the dynamic fold factor):

$$\vec{v}_{\text{rot}} = \vec{v}\cos\theta + (\vec{u} \times \vec{v})\sin\theta + \vec{u}(\vec{u} \cdot \vec{v})(1 - \cos\theta)$$

Where:
* $\vec{u}$ is the normalized unit vector defining the spatial crease line direction ($\|\vec{u}\| = 1$).
* $\vec{v}$ is the vertex coordinate relative to an origin point on the crease axis.

---

## 4. Particle-Spring Dynamic Relaxation Engine

For models undergoing continuous multi-crease simultaneous folding, Project O2 employs a particle-spring dynamic relaxation solver (adapted from the research of Amanda Ghassaei and Erik Demaine).

### A. Governing Equations of Motion
The folding paper sheet is discretized into a planar mass-spring network of nodes $i \in \{1, \dots, N\}$ and edge constraints:

$$m_i \frac{d^2 \vec{x}_i}{dt^2} + c \frac{d \vec{x}_i}{dt} = \vec{F}_{\text{ext}} + \sum_{j \in \mathcal{N}(i)} \vec{F}_{\text{axial}}^{ij} + \sum_{k \in \mathcal{F}(i)} \vec{F}_{\text{dihedral}}^{k}$$

Where:
* $\vec{x}_i$ is the position of vertex node $i$.
* $c$ is the numerical damping coefficient preventing oscillatory divergence.
* $\vec{F}_{\text{axial}}^{ij}$ represents axial spring elasticity preserving edge lengths:
  $$\vec{F}_{\text{axial}}^{ij} = -k_{\text{axial}} \left( \|\vec{x}_j - \vec{x}_i\| - L_0^{ij} \right) \frac{\vec{x}_j - \vec{x}_i}{\|\vec{x}_j - \vec{x}_i\|}$$
* $\vec{F}_{\text{dihedral}}^k$ represents rotational hinge stiffness driving the angle between adjacent faces toward target dihedral angle $\theta_k^*$:
  $$U_{\text{dihedral}} = \frac{1}{2} k_{\text{hinge}} (\theta_k - \theta_k^*)^2$$

### B. Numerical Integration (Verlet Scheme)
Position updates are computed using time-reversible Verlet integration offloaded to a dedicated Web Worker:
$$\vec{x}_i(t + \Delta t) = 2\vec{x}_i(t) - \vec{x}_i(t - \Delta t) + \frac{\vec{F}_i(t)}{m_i} \Delta t^2$$

---

## 5. Physical Paper Mechanics & Real-World Calibration

### A. Continuous Smoothstep Gusset Panel Clearance
Physical paper possesses finite thickness $t_p$ (typically $0.08\text{ mm}$ for Kami and $0.22\text{ mm}$ for cardstock). To prevent mathematical interpenetration when multiple layers stack, the gusset clearance $w(\theta)$ is modeled using a continuous cubic Hermite smoothstep function:

$$w(\theta) = 2 t_p \sin\left(\frac{\theta}{2}\right) \cdot \left(3\left(\frac{\theta}{\pi}\right)^2 - 2\left(\frac{\theta}{\pi}\right)^3\right)$$

This formulation ensures:
* $w(0) = 0$ (completely flat unfolded sheet).
* $\left.\frac{dw}{d\theta}\right|_{0} = 0$ (zero initial clearance offset at start of fold).
* $w(\pi) = 2 t_p$ (exact clearance accommodating doubled sheet thickness at $180^\circ$ flat fold).

### B. Directional Paper Grain Anisotropy
Machine-made washi and kami papers exhibit directional fiber orientation resulting in anisotropic flexural rigidity. Folding along the machine grain requires less force than folding perpendicular to the grain. The stiffness tensor $E(\theta)$ is defined as:

$$E(\theta) = E_\parallel \cos^2\theta + E_\perp \sin^2\theta, \quad \text{where } \frac{E_\perp}{E_\parallel} \approx 1.80$$

---

## 6. Layer-Order 2-SAT Non-Clipping Solver (Jason Ku Lineage)

When a model undergoes multiple overlapping folds, flat-foldability requires resolving non-crossing layer ordering constraints.

1. **Overlap Detection**: Faces $F_a$ and $F_b$ that share overlapping 2D projections in the folded state generate a binary relative elevation constraint:
   $$z(F_a) > z(F_b) \quad \text{or} \quad z(F_b) > z(F_a)$$
2. **Hinge Consistency**: If faces $F_a$ and $F_b$ are joined by a mountain crease, their layer order along the edge boundary is fixed by crease orientation.
3. **2-SAT Formulation**: All pairwise non-crossing constraints and boundary conditions are formulated as a 2-Satisfiability propositional logic problem:
   $$\bigwedge_{k} (x_i \lor x_j)$$
   Solved in linear time $O(V + E)$ using Kosaraju's or Tarjan's strongly connected components (SCC) algorithm.
4. **Elevation Assignment**: The resulting topological ordering assigns collision-free elevation offsets ($\Delta z = 0.006\text{ units}$) across all 3D mesh faces.

---

## 7. MIT FOLD v1.1 Serialization Specification

Project O2 natively imports and exports crease patterns and folded geometry using the **MIT FOLD v1.1 open format** (championed by Erik Demaine and OrigamiUSA):

```json
{
  "file_spec": 1.1,
  "file_creator": "Project O2 Kinematics Studio",
  "file_author": "Open Source Community",
  "file_classes": ["singleModel"],
  "frame_title": "Orizuru Peace Crane",
  "frame_classes": ["foldedForm"],
  "vertices_coords": [
    [0.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 1.0, 0.0]
  ],
  "edges_vertices": [
    [0, 1],
    [1, 2],
    [2, 0]
  ],
  "edges_assignment": [
    "B",
    "M",
    "V"
  ],
  "edges_foldAngle": [
    0,
    180,
    -180
  ],
  "faces_vertices": [
    [0, 1, 2]
  ]
}
```

Assignments:
* `B`: Boundary edge (outer sheet perimeter).
* `M`: Mountain fold crease ($\theta > 0$).
* `V`: Valley fold crease ($\theta < 0$).
* `F`: Flat uncreased interior edge.
* `U`: Unassigned crease line.
