// App.js for landing page
document.addEventListener('DOMContentLoaded', () => {
    loadKits();
    loadGuides();
    initScrollAnimations();
});

function loadKits() {
    try {
        const kits = typeof KIT_DATA !== 'undefined' ? KIT_DATA : [];
        const grid = document.getElementById('tutorialsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        
        kits.forEach(kit => {
            const card = document.createElement('div');
            card.className = 'tutorial-card';
            card.innerHTML = `
                <div class="tutorial-card-content">
                    <div class="tutorial-number">${kit.kitNumber}</div>
                    <h3 class="tutorial-title">${kit.title}</h3>
                    <p class="tutorial-desc">${kit.subtitle}</p>
                    <div class="tutorial-meta">
                        <span>⏱️ ${kit.time}</span>
                        <span>📊 ${kit.difficulty}</span>
                        <span>📝 ${kit.steps.length} steps</span>
                    </div>
                </div>
            `;
            card.onclick = () => {
                window.location.href = '../tutorials/interactive-tutorial.html?kit=' + kit.id;
            };
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading kits:', err);
    }
}

function loadGuides() {
    const grid = document.getElementById('guidesGrid');
    grid.innerHTML = '';
    
    const guides = [
        { num: 1, title: 'Architectural Stable', file: '../print-guides/guide-01-stable.html' },
        { num: 2, title: 'Holy Family', file: '#' },
        { num: 3, title: 'Angel', file: '#' },
        { num: 4, title: 'Star of Bethlehem', file: '#' },
        { num: 5, title: 'Shepherd & Sheep', file: '#' },
        { num: 6, title: 'Wise Man 1 - Melchior', file: '#' },
        { num: 7, title: 'Wise Man 2 - Balthazar', file: '#' },
        { num: 8, title: 'Wise Man 3 - Gaspar', file: '#' },
        { num: 9, title: 'Donkey & Ox', file: '#' },
        { num: 10, title: 'Complete Scene Assembly', file: '../print-guides/guide-10-complete-assembly.html' }
    ];
    
    guides.forEach(guide => {
        const card = document.createElement('a');
        card.className = 'guide-card';
        card.href = guide.file;
        card.target = '_blank';
        card.innerHTML = `
            <div class="guide-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="guide-info">
                <div class="guide-title">Guide ${guide.num} - ${guide.title}</div>
                <div class="guide-subtitle">Print-ready PDF</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        grid.appendChild(card);
    });
}

function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from('.tutorial-card', {
            scrollTrigger: {
                trigger: '.tutorials-grid',
                start: 'top 80%'
            },
            y: 60,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from('.guide-card', {
            scrollTrigger: {
                trigger: '.guides-grid',
                start: 'top 80%'
            },
            x: -40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out'
        });
    }
}
