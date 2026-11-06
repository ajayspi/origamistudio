# Contributing to Project O2

Thank you for your interest in contributing to **Project O2**! We welcome contributions from researchers, software engineers, geometricians, and origami practitioners worldwide.

---

## 1. Development Principles & Code Standards

* **Simplicity & High Signal**: Write clean, concise code. Favor minimal, robust solutions over unnecessary abstractions or heavy dependencies.
* **Documentation & Preservation**: Preserve existing comments and docstrings. Document the *why* rather than the *what* when implementing non-trivial mathematics.
* **Strict Type Safety**: The project enforces strict TypeScript compilation. All code must compile with `tsc -b` without warnings or any type suppressions (`@ts-ignore`).
* **Open Source Under MIT**: All contributions submitted to Project O2 are released under the terms of the [MIT License](../LICENSE).

---

## 2. Setting Up Your Development Environment

### Prerequisites
* Node.js v20.0.0+
* pnpm v9.0.0+
* Git v2.30+

### Setup Commands
```bash
# Fork and clone your repository
git clone https://github.com/<your-username>/O2.git
cd O2

# Install workspace dependencies
pnpm install

# Start local development server
pnpm dev
```

The application will be available at `http://localhost:5175/`.

---

## 3. Contribution Workflow

1. **Create a Topic Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make Focused Changes**:
   Ensure each commit has a clear, descriptive message explaining the change.
3. **Verify Locally**:
   Run the full verification suite before submitting:
   ```bash
   # Run Vitest unit tests
   pnpm test

   # Run strict TypeScript and Vite production bundle compile
   pnpm build

   # Run automated kit geometric verification
   pnpm verify:kits
   ```
4. **Push and Open a Pull Request**:
   Push your branch to GitHub and open a Pull Request against the `main` branch of `ajayspi/O2`. Provide a clear summary of changes, motivation, and any visual or mathematical verification evidence.

---

## 4. Adding a New Origami Kit

To contribute a new origami model to the cultural catalog:

1. **Define Kit Metadata**:
   In `origamistudio/src/utils/schoolOrigami.ts` (or relevant catalog module), create an entry conforming to `OrigamiKit`:
   * Assign a unique ID (e.g. `geometric-10`).
   * Provide 1-based sequential step numbers.
   * Provide concise, physically intuitive instructions with crease orientation (Mountain, Valley, Crimp, Fold and Unfold).
2. **Parametric 3D Geometry**:
   In `origamistudio/src/utils/origamiGeometry.ts`, register the 3D folded geometry in `getCompletedGeometryForKit(kitId)`:
   * Provide an authentic, non-intersecting facet mesh with correctly computed face normals.
   * Verify contact ground plinth alignment (base sitting at $y = 0$).
3. **Validate**:
   Run `pnpm verify:kits` to ensure all 63+ kits pass automated schema and step connectivity checks.

---

## 5. Licensing

By contributing to Project O2, you agree that your contributions will be licensed under the project's [MIT License](../LICENSE).
