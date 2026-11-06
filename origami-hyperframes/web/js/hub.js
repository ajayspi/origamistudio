// ORIGAMISTUDIO™ — Hub & Global Collections Controller
// Manages 62+ Master Kits across 9 World Collections, Live Search, and Dynamic Filter Matrix

const collections = [
    { 
        id: 'indian', 
        emoji: '🦚', 
        title: 'Royal Indian Origami Heritage', 
        subtitle: 'Sacred Kagaz-Kala & Royal Courtyard Masterworks',
        description: 'Monumental cultural origami celebrating Indian heritage: Imperial Peacock with 18-pleat fan tail, Mysore procession elephant, Bengal tiger, marigold garlands, and Diwali diyas.',
        meta: ['8 KITS', '18 PIECES', '4-5 HRS'],
        details: {
            includes: ['Mayura (Imperial Peacock)', 'Gajendra (Mysore Elephant)', 'Royal Bengal Tiger', 'Genda Phool Garland', 'Deepavali Diya', 'Kathakali Crown', 'Sacred Kamalam Lotus', 'The Royal Durbar Assembly'],
            colors: ['Peacock Turquoise', 'Emerald Green', 'Saffron Yellow', 'Terracotta Brown', 'Padmaraga Pink', 'Mirror Gold Foil'],
            difficulty: 'Intermediate to Advanced'
        }
    },
    { 
        id: 'japanese', 
        emoji: '⛩️', 
        title: 'Japanese Master Origami', 
        subtitle: 'Edo Period & Classical Zen Heritage',
        description: 'Authentic Japanese masterworks: Sacred Orizuru Peace Crane with volumetric chest, Samurai Kabuto helmet, Hanami Sakura blossom, Minogame longevity tortoise, and Koinobori carp.',
        meta: ['6 KITS', '14 PIECES', '3-4 HRS'],
        details: {
            includes: ['Orizuru (Peace Crane)', 'Kabuto (Samurai Helmet)', 'Sakura (5-Petal Blossom)', 'Minogame (Sacred Tortoise)', 'Koinobori (Flying Carp)', 'Nihon-Ryu (Rising Dragon)'],
            colors: ['Cherry Blossom Pink', 'Cherry Red', 'Pure White', 'Navy Blue', 'Olive Jade', 'Gold Leaf'],
            difficulty: 'Beginner to Advanced'
        }
    },
    { 
        id: 'chinese', 
        emoji: '🏮', 
        title: 'Chinese Heritage & Lunar Festivals', 
        subtitle: 'Ancient Zhezhi & Spring Festival Auspicious Icons',
        description: 'Auspicious Lunar New Year and festival designs: Yuanbao golden wealth ingot, ribbed red palace lantern, celestial Loong dragon, Empress Fenghuang phoenix, and Mid-Autumn Jade Rabbit.',
        meta: ['6 KITS', '16 PIECES', '3-4.5 HRS'],
        details: {
            includes: ['Yuanbao (Golden Ingot)', 'Denglong (Palace Lantern)', 'Loong (Imperial Dragon)', 'Fenghuang (Empress Phoenix)', 'Mid-Autumn Jade Rabbit', 'Fu Chuan (Junk Ship)'],
            colors: ['Imperial Vermillion', 'Mirror Gold Foil', 'Jade Green', 'Ruby Red', 'Pearl White', 'Teak Kraft'],
            difficulty: 'Beginner to Advanced'
        }
    },
    { 
        id: 'american', 
        emoji: '🦅', 
        title: 'American Modern Computational', 
        subtitle: 'Action Origami & Modern Engineering Innovations',
        description: 'Cutting-edge Western origami: American Bald Eagle with duo color-change cowl, Prairie Bison, Robert Lang-inspired 32-grid Hercules beetle, kinetic jumping frog, and Golden Gate Bridge.',
        meta: ['6 KITS', '15 PIECES', '3-4.5 HRS'],
        details: {
            includes: ['American Bald Eagle', 'American Prairie Bison', 'Kinetic Jumping Frog', 'Hercules Beetle (32-Grid)', 'July 4th Starburst', 'Golden Gate Suspension Span'],
            colors: ['International Orange', 'Eagle Blue', 'Chocolate Brown', 'Spring Green', 'Patriotic Red & White'],
            difficulty: 'Beginner to Master'
        }
    },
    { 
        id: 'lotus', 
        emoji: '🪷', 
        title: 'Lotus Garden & Water Pavilion', 
        subtitle: 'Multi-layered blooms in botanical harmony',
        description: 'Modular lotus flowers with graduated petal layers, buoyant lily pads, S-curve swimming koi fish, and rippled water pavilion staging.',
        meta: ['6 KITS', '12 PIECES', '2.5-3.5 HRS'],
        details: {
            includes: ['Lotus Base & Calyx', 'Blooming Lotus (12-Petal)', 'Inner Core & Gold Stamen', 'Multi-Layered Lily Pads', 'Sculptural 3D Koi Fish', 'Aquatic Water Setting'],
            colors: ['Lotus Magenta', 'Soft Blush', 'Forest Jade', 'Saffron Yellow', 'Aquamarine Cyan', 'Deep Indigo'],
            difficulty: 'Intermediate'
        }
    },
    { 
        id: 'butterfly', 
        emoji: '🦋', 
        title: 'Butterfly Mandala Wall Installation', 
        subtitle: 'High-dihedral soaring wings & geometric armature',
        description: 'Intricately detailed butterflies with patterned multi-layered wings, elevation standoffs, and a tiered octagonal mandala frame for museum wall displays.',
        meta: ['7 KITS', '16 PIECES', '2.5-3.5 HRS'],
        details: {
            includes: ['Swallowtail Monarch', 'Emerald Morpho', 'Golden Birdwing (6-Inch)', 'Pygmy Azure Trio', 'Radial Mandala Armature', 'Concentric Petal Ring', 'Grand Mandala Wall Mount'],
            colors: ['Tangerine Orange', 'Emerald Foil', 'Jet Black & Mirror Gold', 'Turquoise Cyan', 'Deep Plum Violet'],
            difficulty: 'Intermediate to Advanced'
        }
    },
    { 
        id: 'geometric', 
        emoji: '🏺', 
        title: 'Geometric Modular Polyhedral Vase', 
        subtitle: 'Isometric interlocking prisms & Miura-ori skin',
        description: 'Thirty interlocking modular diamond units create striking faceted architectural vases. Reinforced with copper corner brackets and a weighted plinth.',
        meta: ['8 KITS', '30 PIECES', '3.5-4.5 HRS'],
        details: {
            includes: ['Tri-Faceted Base Unit', 'Diamond Honeycomb Module', 'Fluted Neck Collar', 'Hexagonal Waist Ring', 'Metallic Corner Brackets', 'Miura-Ori Spiral Skin', 'Weighted Plinth', '30-Piece Master Assembly'],
            colors: ['Architectural Navy', 'Brushed Copper Foil', 'Matte Charcoal', 'Deep Cobalt', 'Mirror Gold'],
            difficulty: 'Advanced'
        }
    },
    { 
        id: 'nativity', 
        emoji: '🏛️', 
        title: '3D Architectural Nativity', 
        subtitle: 'Rich jewel-toned sculptural holiday diorama',
        description: 'Complete nativity scene with 105-degree angled stable, recessed manger alcove, layered robes, soaring 3D angel wings, and royal Wise Men.',
        meta: ['10 KITS', '14 PIECES', '4-6 HRS'],
        details: {
            includes: ['Architectural Stable', 'Holy Family (Mary, Joseph, Jesus)', 'Angel with 3D Wings', 'Star of Bethlehem', 'Shepherd & Sheep', 'Wise Man 1 (Melchior)', 'Wise Man 2 (Balthazar)', 'Wise Man 3 (Gaspar)', 'Donkey & Ox', 'Complete Scene Assembly'],
            colors: ['Royal Blue', 'Burgundy Wine', 'Imperial Purple', 'Deep Crimson', 'Emerald Green', 'Gold Foil'],
            difficulty: 'Intermediate to Advanced'
        }
    },
    { 
        id: 'holiday', 
        emoji: '🎃', 
        title: 'World Festival Traditions', 
        subtitle: 'Halloween, Hanami, and Día de los Muertos Celebrations',
        description: 'Iconic holiday folk traditions: 3D box-pleated Jack-o\'-Lantern with color-change grin, vampire bat, Hanami cherry blossom lantern, and Mexican sugar skull.',
        meta: ['5 KITS', '10 PIECES', '2-3 HRS'],
        details: {
            includes: ['Halloween Jack-o\'-Lantern', 'Halloween Vampire Bat', 'Hanami Chochin Lantern', 'Día de los Muertos Calavera', 'Lunar New Year Hongbao'],
            colors: ['Pumpkin Orange', 'Midnight Black', 'Cherry Pink', 'Sugar White & Lilac', 'Festive Red'],
            difficulty: 'Beginner to Advanced'
        }
    }
];

let allKitsArray = [];
let currentFilter = 'all';
let searchQuery = '';

function initHub() {
    // 1. Compile all kits from window.ORIGAMI_KITS
    compileAllKits();

    // 2. Render Daily Spotlight & Collections & Kits
    renderDailySpotlight();
    renderCollections();
    renderKits();
    renderGuides();

    // 3. Setup Filter & Search Event Listeners
    initFilterTabs();
    initSearch();

    // 4. GSAP Scroll Animations
    initAnimations();
}

function renderDailySpotlight() {
    const banner = document.getElementById('spotlightBanner');
    if (!banner || !allKitsArray.length) return;

    // Deterministic daily index based on year and day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const dailyIdx = (now.getFullYear() * 37 + dayOfYear) % allKitsArray.length;
    const kit = allKitsArray[dailyIdx] || allKitsArray[0];

    // Read Streak
    let streak = 0;
    try {
        streak = parseInt(localStorage.getItem('origami_daily_streak') || '0', 10);
        const streakEl = document.getElementById('heroStreakDisplay');
        if (streakEl) streakEl.textContent = `🔥 ${streak}`;
    } catch (e) {}

    const isCompleted = localStorage.getItem('origami_kit_completed_' + kit.id) === 'true';
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const culture = getCultureLabel(kit);

    banner.innerHTML = `
        <div class="spotlight-info">
            <div class="section-label" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="label-dot"></span>
                <span>DAILY MASTER SPOTLIGHT • ${dateFormatted.toUpperCase()}</span>
                <span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-family: 'JetBrains Mono', monospace;">
                    ${isCompleted ? '✓ COMPLETED TODAY' : 'TODAY\'S CHALLENGE'}
                </span>
            </div>
            <h3>${kit.title}</h3>
            <p>${kit.description || kit.goal || 'Master this sculptural folding work with precision creases and mathematical origami logic.'}</p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                <a href="studio/kit.html?id=${kit.id}" class="cta-primary" style="padding: 0.8rem 1.5rem;">
                    <span class="cta-bg"></span>
                    <span class="cta-content">
                        <span>${isCompleted ? 'PRACTICE IN 3D STUDIO' : 'FOLD TODAY\'S CHALLENGE'}</span>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4.16666 10H15.8333M10 4.16667L15.8333 10L10 15.8333" stroke="currentColor" stroke-width="2"/></svg>
                    </span>
                </a>
                <a href="print-guide.html?id=${kit.id}" target="_blank" class="cta-ghost" style="padding: 0.8rem 1.5rem;">
                    <span>PRINT A4 GUIDE</span>
                </a>
            </div>
        </div>
        <div style="text-align: center; border: 1px solid var(--border-2); border-radius: 12px; background: rgba(0,0,0,0.6); padding: 1.5rem; min-width: 220px;">
            <div style="font-size: 4.5rem; margin-bottom: 0.5rem; filter: drop-shadow(0 10px 20px rgba(255, 107, 53, 0.4));">${kit.emoji || '🦚'}</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--cyan); margin-bottom: 0.25rem;">${culture} • KIT ${String(kit.kitNumber || '01').padStart(2, '0')}</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-tert);">${kit.difficulty || 'Intermediate'} • ${kit.time || '30 min'} • ${kit.paper && kit.paper[0] ? kit.paper[0].size : '6" x 6"'}</div>
        </div>
    `;
}

function compileAllKits() {
    if (window.ORIGAMI_KITS) {
        allKitsArray = Object.values(window.ORIGAMI_KITS);
    } else {
        allKitsArray = [];
    }
}

function renderCollections() {
    const grid = document.getElementById('collectionsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    collections.forEach((col, i) => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
            <div class="collection-card-content">
                <div class="collection-header">
                    <span class="collection-emoji">${col.emoji}</span>
                    <div class="collection-badge">VIEW DETAILS</div>
                </div>
                <h3 class="collection-title">${col.title}</h3>
                <p class="collection-subtitle">${col.subtitle}</p>
                <p class="collection-description">${col.description}</p>
                <div class="collection-meta">
                    ${col.meta.map(m => `<span class="meta-tag">${m}</span>`).join('')}
                </div>
                <div class="collection-details">
                    <div class="detail-row">
                        <span class="detail-label">Difficulty</span>
                        <span class="detail-value">${col.details.difficulty}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Palette</span>
                        <span class="detail-value">${col.details.colors.join(', ')}</span>
                    </div>
                    <div class="detail-section">
                        <span class="detail-label">Included Master Kits</span>
                        <ul class="detail-list">
                            ${col.details.includes.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
        grid.appendChild(card);
        if (typeof gsap !== 'undefined') {
            gsap.from(card, { y: 40, opacity: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out' });
        }
    });
}

function renderKits() {
    const grid = document.getElementById('kitsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // Filter Logic
    let filtered = allKitsArray.filter(kit => {
        // Category / Collection Filter
        let matchesCat = (currentFilter === 'all');
        if (currentFilter === 'indian') matchesCat = (kit.collection === 'indian' || kit.category === 'cultural');
        else if (currentFilter === 'japanese') matchesCat = (kit.collection === 'japanese' || kit.category === 'japanese');
        else if (currentFilter === 'chinese') matchesCat = (kit.collection === 'chinese' || kit.category === 'chinese');
        else if (currentFilter === 'american') matchesCat = (kit.collection === 'american' || kit.category === 'american');
        else if (currentFilter === 'nature') matchesCat = (kit.collection === 'lotus' || kit.category === 'nature');
        else if (currentFilter === 'butterfly') matchesCat = (kit.collection === 'butterfly');
        else if (currentFilter === 'decor') matchesCat = (kit.collection === 'geometric' || kit.category === 'decor');
        else if (currentFilter === 'holiday') matchesCat = (kit.collection === 'nativity' || kit.collection === 'holiday' || kit.category === 'holiday');

        // Search Query Filter
        let matchesSearch = true;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const textToSearch = `${kit.title} ${kit.subtitle || ''} ${kit.description || ''} ${kit.collectionTitle || ''} ${kit.category || ''}`.toLowerCase();
            matchesSearch = textToSearch.includes(q);
        }

        return matchesCat && matchesSearch;
    });

    if (!filtered.length) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-tert);">
                <p style="font-size: 1.25rem; font-family: 'Clash Display', sans-serif; margin-bottom: 0.5rem;">No origami kits match your search.</p>
                <p style="font-size: 0.85rem;">Try another search term or click "ALL (62)" above.</p>
            </div>
        `;
        return;
    }

    filtered.forEach((kit, i) => {
        const card = document.createElement('div');
        card.className = 'kit-card-enhanced';
        card.style.setProperty('--card-accent', kit.accent || '#ff6b35');

        const cultureLabel = getCultureLabel(kit);

        card.innerHTML = `
            <div>
                <div class="card-top-meta">
                    <span class="card-kit-num">KIT ${String(kit.kitNumber || '01').padStart(2, '0')}</span>
                    <span class="card-culture-badge">${cultureLabel}</span>
                </div>
                <h4 class="card-kit-title">${kit.title}</h4>
                <p class="card-kit-sub">${kit.subtitle || kit.description || ''}</p>
            </div>
            <div>
                <div class="card-footer-meta">
                    <span>⏱️ ${kit.time || '25 min'}</span>
                    <span>📊 ${kit.difficulty || 'Intermediate'}</span>
                    <span>📄 ${kit.paper && kit.paper[0] ? kit.paper[0].size : '6" x 6"'}</span>
                </div>
                <div class="card-actions-row">
                    <a href="studio/kit.html?id=${kit.id}" class="btn-card-action btn-card-studio">
                        3D FOLD
                    </a>
                    <a href="print-guide.html?id=${kit.id}" target="_blank" class="btn-card-action btn-card-guide">
                        A4 GUIDE
                    </a>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    if (typeof gsap !== 'undefined') {
        gsap.from('.kit-card-enhanced', { y: 20, opacity: 0, duration: 0.35, stagger: 0.02, ease: 'power2.out' });
    }
}

function getCultureLabel(kit) {
    if (kit.collection === 'indian' || kit.category === 'cultural') return '🇮🇳 INDIAN';
    if (kit.collection === 'japanese' || kit.category === 'japanese') return '🇯🇵 JAPANESE';
    if (kit.collection === 'chinese' || kit.category === 'chinese') return '🇨🇳 CHINESE';
    if (kit.collection === 'american' || kit.category === 'american') return '🇺🇸 AMERICAN';
    if (kit.collection === 'lotus') return '🪷 LOTUS';
    if (kit.collection === 'butterfly') return '🦋 BUTTERFLY';
    if (kit.collection === 'geometric') return '🏺 GEOMETRIC';
    if (kit.collection === 'nativity') return '🏛️ NATIVITY';
    if (kit.collection === 'holiday') return '🎃 FESTIVAL';
    return 'ORIGAMI';
}

function renderGuides() {
    const grid = document.getElementById('guidesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // Sample a selection of print guides across all collections
    const sampleGuides = allKitsArray.slice(0, 16);

    sampleGuides.forEach((kit, i) => {
        const card = document.createElement('a');
        card.className = 'guide-card';
        card.href = `print-guide.html?id=${kit.id}`;
        card.target = '_blank';
        card.innerHTML = `
            <svg class="guide-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <div class="guide-info">
                <div class="guide-title">${kit.title}</div>
                <div class="guide-meta">${kit.collectionTitle || 'OrigamiStudio'} • A4 PRINT READY</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initFilterTabs() {
    document.querySelectorAll('.culture-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.culture-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.cat;
            renderKits();
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('kitSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderKits();
    });
}

function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.section-header', {
        scrollTrigger: { trigger: '.collections', start: 'top 85%' },
        y: 35, opacity: 0, duration: 0.8
    });
}

document.addEventListener('DOMContentLoaded', initHub);
