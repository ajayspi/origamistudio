# Project O2: Prerequisites & System Requirements

This document provides complete technical specifications, hardware requirements, runtime dependencies, and environment setup instructions for running and developing **Project O2**.

---

## 1. System & Hardware Requirements

### Minimum Hardware
* **Processor (CPU)**: 4 cores, 2.0 GHz or higher (x86_64 or ARM64 / Apple Silicon).
* **System Memory (RAM)**: 8 GB minimum (16 GB recommended for concurrent kinematics simulation and WebGL debugging).
* **Graphics Processor (GPU)**: Hardware-accelerated GPU supporting **WebGL 2.0 (OpenGL ES 3.0 equivalent)**.
  * *Dedicated*: NVIDIA GeForce GTX 1050 / AMD Radeon RX 560 or newer.
  * *Integrated*: Intel Iris Xe / Apple M1 or newer / AMD Radeon 600M series.
* **Storage**: 1.5 GB available disk space for dependencies and build artifacts.
* **Display Resolution**: $1280 \times 720$ minimum ($1920 \times 1080$ or higher recommended for high-fidelity 3D showroom inspection).

### Recommended Hardware
* **Processor (CPU)**: 8 cores, 3.2 GHz or higher.
* **System Memory (RAM)**: 16 GB DDR4/DDR5 or unified memory.
* **Graphics Processor (GPU)**: NVIDIA RTX 2060 / AMD Radeon RX 6600 / Apple M1 Pro or higher.

---

## 2. Software & Runtime Dependencies

### Node.js
Project O2 requires **Node.js LTS v20.0.0 or higher** (tested up to Node.js v24.x).
To check your active version:
```bash
node --version
```
If you need to install or switch versions, we recommend using a version manager such as `nvm`, `fnm`, or `volta`:
```bash
# Using fnm
fnm install 20
fnm use 20

# Using nvm
nvm install 20
nvm use 20
```

### Package Manager: pnpm
The project uses **pnpm v9.0.0 or higher** (v11.x supported) as the primary package manager for strict dependency isolation and workspace linking.
To install or upgrade pnpm:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
Verify pnpm installation:
```bash
pnpm --version
```

### Git
A standard Git client (v2.30+) is required for version control:
```bash
git --version
```

---

## 3. WebGL 2.0 & Browser Compatibility Matrix

Project O2 relies on WebGL 2.0 compute shaders, `OES_element_index_uint`, floating-point textures, and `PCFSoftShadowMap` shadow rendering.

| Browser | Minimum Version | Recommended Version | WebGL 2.0 Support | Hardware Shadows |
| :--- | :--- | :--- | :--- | :--- |
| **Google Chrome** | 90+ | 120+ | Fully Supported | Supported |
| **Mozilla Firefox** | 90+ | 120+ | Fully Supported | Supported |
| **Apple Safari** | 16.0+ | 17.4+ | Fully Supported (Metal) | Supported |
| **Microsoft Edge** | 90+ | 120+ | Fully Supported | Supported |
| **Opera / Brave** | 76+ | Latest | Fully Supported | Supported |

### Verifying WebGL 2.0 in Your Browser
1. Open your browser and navigate to `chrome://gpu` (Chromium) or `about:support` (Firefox).
2. Ensure **WebGL 2.0** reports `Hardware accelerated`.
3. Alternatively, test your browser by visiting [webglreport.com/?v=2](https://webglreport.com/?v=2) and verifying that `Major Performance Caveat` is `No`.

---

## 4. Operating System Setup Guides

### Windows (10 / 11)
1. **Terminal**: Use PowerShell 7 or Windows Terminal.
2. **Execution Policy**: If running npm scripts throws a security error, enable local script execution:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
3. **GPU Drivers**: Ensure the latest WHQL drivers from NVIDIA, AMD, or Intel are installed to avoid WebGL context loss.

### macOS (Apple Silicon & Intel)
1. **Homebrew**: Install Homebrew if not already available:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Node & pnpm**:
   ```bash
   brew install node@20 pnpm
   ```
3. **Safari WebGL Configuration**: Safari enables WebGL 2.0 by default on macOS 13+. Ensure *Develop > Experimental Features > WebGL 2.0* is checked if on legacy versions.

### Linux (Ubuntu / Debian / Arch / Fedora)
1. **Ubuntu / Debian**:
   ```bash
   # Add NodeSource repository for Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Enable pnpm
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
2. **Arch Linux**:
   ```bash
   sudo pacman -S nodejs pnpm git
   ```
3. **Hardware Acceleration**: If running headless or inside Docker, ensure `mesa-utils` and Vulkan/OpenGL drivers are installed:
   ```bash
   sudo apt-get install -y libgl1-mesa-glx libgl1-mesa-dri
   ```

---

## 5. Development Workspace Quick Verification

Once dependencies are installed, run the verification harness from the repository root:

```bash
# Clone and enter repo
git clone https://github.com/ajayspi/O2.git
cd O2

# Install dependencies
pnpm install

# Run static type checks and bundle compile
pnpm run build

# Run Vitest unit suite
pnpm run test
```

If all 12 tests pass and the Vite build succeeds in $< 3\text{s}$, your environment is fully certified.
