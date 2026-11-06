let kitData = [];
let currentKitId = 'kit-01';
let currentKit = null;
let currentStepIndex = 0;
let completedSteps = new Set();

async function loadKitData() {
    try {
        const response = await fetch('kit-data.json');
        kitData = await response.json();
        init();
    } catch (error) {
        console.error('Error loading kit data:', error);
    }
}

function init() {
    buildKitSelector();
    loadKit(currentKitId);
    setupEventListeners();
}

function buildKitSelector() {
    const selector = document.getElementById('kitSelector');
    selector.innerHTML = '';
    
    kitData.forEach(kit => {
        const btn = document.createElement('button');
        btn.className = 'kit-btn';
        if (kit.id === currentKitId) btn.classList.add('active');
        btn.textContent = `Kit ${kit.kitNumber}`;
        btn.onclick = () => switchKit(kit.id);
        selector.appendChild(btn);
    });
}

function switchKit(kitId) {
    currentKitId = kitId;
    currentStepIndex = 0;
    completedSteps.clear();
    loadKit(kitId);
    buildKitSelector();
}

function loadKit(kitId) {
    currentKit = kitData.find(k => k.id === kitId);
    if (!currentKit) return;
    
    // Update header
    document.getElementById('kitBadge').textContent = currentKit.kitNumber;
    document.getElementById('kitTitle').textContent = currentKit.title;
    document.getElementById('kitSubtitle').textContent = currentKit.subtitle;
    document.getElementById('kitTime').textContent = currentKit.time;
    document.getElementById('kitDifficulty').textContent = currentKit.difficulty;
    document.getElementById('totalSteps').textContent = currentKit.steps.length;
    
    buildStepsList();
    loadCurrentStep();
    updateProgress();
}

function buildStepsList() {
    const list = document.getElementById('stepsList');
    list.innerHTML = '';
    
    currentKit.steps.forEach((step, index) => {
        const item = document.createElement('div');
        item.className = 'step-item';
        if (index === currentStepIndex) item.classList.add('active');
        if (completedSteps.has(index)) item.classList.add('completed');
        
        item.innerHTML = `
            <div class="step-checkbox">
                <svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3333 4L6 11.3333L2.66666 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="step-info">
                <div class="step-number">Step ${step.stepNumber}</div>
                <div class="step-title">${step.title}</div>
                <div class="step-time">${step.time}</div>
            </div>
        `;
        
        item.onclick = () => {
            currentStepIndex = index;
            buildStepsList();
            loadCurrentStep();
        };
        
        list.appendChild(item);
    });
}

function loadCurrentStep() {
    const step = currentKit.steps[currentStepIndex];
    
    document.getElementById('currentStepTitle').textContent = step.title;
    document.getElementById('currentStepSubtitle').textContent = `Kit ${currentKit.kitNumber}: ${currentKit.title}`;
    document.getElementById('currentStepNum').textContent = step.stepNumber;
    document.getElementById('currentStepTotal').textContent = currentKit.steps.length;
    document.getElementById('instructionText').textContent = step.instruction;
    document.getElementById('tipText').textContent = step.tip;
    
    // Animate 3D model
    animate3D();
    
    // Update buttons
    const btnComplete = document.getElementById('btnComplete');
    const btnNext = document.getElementById('btnNext');
    
    if (completedSteps.has(currentStepIndex)) {
        btnComplete.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Completed ✓</span>
        `;
        btnComplete.disabled = true;
    } else {
        btnComplete.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Mark Step Complete</span>
        `;
        btnComplete.disabled = false;
    }
    
    if (currentStepIndex === currentKit.steps.length - 1) {
        btnNext.innerHTML = `<span>Finish Kit ${currentKit.kitNumber}</span>`;
    } else {
        btnNext.innerHTML = `
            <span>Next Step</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16666 10H15.8333M10 4.16667L15.8333 10L10 15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
}

function animate3D() {
    const origami = document.getElementById('origami3d');
    gsap.killTweensOf(origami);
    
    // Reset and animate
    gsap.set(origami, { scale: 0.8, rotationY: 0 });
    gsap.to(origami, {
        scale: 1,
        rotationY: 360,
        duration: 1.5,
        ease: "power2.out"
    });
    
    // Animate paper layers
    const layers = origami.querySelectorAll('.paper-layer');
    layers.forEach((layer, i) => {
        gsap.fromTo(layer, 
            { scale: 0, opacity: 0 },
            { 
                scale: 1, 
                opacity: 1,
                duration: 0.6,
                delay: i * 0.1,
                ease: "back.out(1.7)"
            }
        );
    });
}

function setupEventListeners() {
    document.getElementById('btnComplete').onclick = () => {
        if (completedSteps.has(currentStepIndex)) {
            gsap.to('#btnComplete', {
                x: [-3, 3, -3, 3, 0],
                duration: 0.3,
                ease: 'power1.inOut'
            });
            return;
        }
        completedSteps.add(currentStepIndex);
        buildStepsList();
        updateProgress();
        loadCurrentStep();
        
        // Celebration animation
        gsap.timeline()
            .to('#btnComplete', {
                scale: 1.05,
                duration: 0.15,
                ease: 'back.out(2)'
            })
            .to('#btnComplete', {
                scale: 1,
                duration: 0.15
            });
        
        // Pulse the step item
        const stepItems = document.querySelectorAll('.step-item');
        if (stepItems[currentStepIndex]) {
            gsap.fromTo(stepItems[currentStepIndex], 
                { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
                { backgroundColor: 'rgba(255, 255, 255, 0.02)', duration: 0.6 }
            );
        }
        
        // Auto-advance hint - enable next step glow
        gsap.to('#btnNext', {
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    };
    
    document.getElementById('btnNext').onclick = () => {
        if (!completedSteps.has(currentStepIndex)) {
            // Add a small shake animation to prompt user
            gsap.to('#btnComplete', {
                x: [-5, 5, -5, 5, 0],
                duration: 0.4,
                ease: 'power1.inOut'
            });
            return;
        }
        
        if (currentStepIndex < currentKit.steps.length - 1) {
            currentStepIndex++;
            buildStepsList();
            loadCurrentStep();
            
            // Scroll to top of viewer
            const viewerPanel = document.querySelector('.viewer-panel');
            if (viewerPanel) {
                viewerPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            // Kit complete
            gsap.to('.viewer-card', {
                scale: 1.02,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
            setTimeout(() => {
                alert(`🎉 Kit ${currentKit.kitNumber} - ${currentKit.title} Complete!\n\nGreat work! Moving to next kit...`);
                const nextKitNum = currentKit.kitNumber + 1;
                if (nextKitNum <= 10) {
                    switchKit(`kit-${String(nextKitNum).padStart(2, '0')}`);
                } else {
                    alert('🎊 Congratulations! You\'ve completed all 10 kits of the 3D Architectural Origami Nativity Set!');
                }
            }, 400);
        }
    };
}

function updateProgress() {
    const total = currentKit.steps.length;
    const completed = completedSteps.size;
    const percentage = (completed / total) * 100;
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('completedCount').textContent = completed;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadKitData);
