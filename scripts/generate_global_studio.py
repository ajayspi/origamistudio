# -*- coding: utf-8 -*-
"""
ORIGAMISTUDIO Global Kit Database Generator
Compiles all 62 Master Kits across:
1. 3D Architectural Nativity (Holiday) [10 Kits]
2. Lotus Garden & Water Pavilion (Nature / Zen) [6 Kits]
3. Geometric Modular Polyhedral Vase (Decor / Architectural) [8 Kits]
4. Butterfly Mandala Wall Installation (Nature / Decor) [7 Kits]
5. Royal Indian Origami Heritage (Cultural Heritage) [8 Kits]
6. Japanese Master Origami (Edo & Classical Heritage) [6 Kits]
7. Chinese Heritage & Spring Festival (Zhezhi & Lunar New Year) [6 Kits]
8. American Modern Computational & Action (Modern Innovations) [6 Kits]
9. World Festival Traditions (Halloween, Hanami, Día de Muertos) [5 Kits]
"""

import json

# Load existing 39 kits
with open("origami-hyperframes/web/studio/kit-data.json", "r", encoding="utf-8") as f:
    kits = json.load(f)

# 6. JAPANESE MASTER ORIGAMI (6 Kits)
japanese_kits = {
    "japanese-01": {
        "id": "japanese-01",
        "kitNumber": 1,
        "title": "Orizuru — Sacred Peace Crane",
        "subtitle": "Senbazuru classical heritage • Volumetric chest • Arching wings",
        "description": "The quintessential symbol of Japanese origami, peace, and longevity (Senbazuru). Features an inflated volumetric chest cavity, graceful arching wings, and a delicate tapered beak.",
        "difficulty": "Beginner-Intermediate",
        "time": "15-20 min",
        "category": "japanese",
        "collection": "japanese",
        "collectionTitle": "Japanese Master Origami",
        "accent": "#ef4444",
        "goal": "A classical 3D paper crane with puffed aerodynamic chest and sweeping wings",
        "paper": [
            { "color": "Japanese Washi / Cherry Red", "size": "6\" x 6\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Petal fold symmetry", "Volumetric chest inflation via gentle wing pull", "Graceful neck reverse fold"],
        "steps": [
            { "stepNumber": 1, "title": "Preliminary Square Base", "time": "3-4 min", "foldType": "Square Base", "instruction": "Fold 6\" square in half diagonally both ways, flip to white side, fold horizontal and vertical creases, and collapse into a 4-flap square preliminary base.", "tip": "Crease edges firmly with bone folder so petal fold opens smoothly.", "diagramType": "prelim-base" },
            { "stepNumber": 2, "title": "Bilateral Petal Folds (Bird Base)", "time": "4-5 min", "foldType": "Petal Fold", "instruction": "Fold side edges to center crease, fold top triangle down, unfold, and pull bottom point upward into an elongated diamond petal fold. Flip and repeat on back.", "tip": "Ensure the side edges align flush along the vertical center axis.", "diagramType": "bird-base" },
            { "stepNumber": 3, "title": "Slender Leg Inversion", "time": "3-4 min", "foldType": "Side Taper Valley", "instruction": "Valley fold outer lower flaps inward to narrow the two bottom spikes that will form neck and tail.", "tip": "Tapering creates a more elegant, slender silhouette.", "diagramType": "taper-legs" },
            { "stepNumber": 4, "title": "Neck & Tail Reverse Folds", "time": "3-4 min", "foldType": "Inside Reverse Fold", "instruction": "Inside reverse fold both bottom spikes upward at 65-degree angles between the body layers.", "tip": "Set neck slightly steeper than the tail for dynamic posture.", "diagramType": "reverse-neck" },
            { "stepNumber": 5, "title": "Beak Crimp & Chest Inflation", "time": "2-3 min", "foldType": "Inside Reverse & Volume Inflation", "instruction": "Inside reverse fold neck tip downward to form beak. Gently grasp both wing roots and pull outward to puff the diamond back into a rounded 3D chest.", "tip": "Do not pull from wing tips; pull close to body to avoid tearing.", "diagramType": "crane-final" }
        ]
    },
    "japanese-02": {
        "id": "japanese-02",
        "kitNumber": 2,
        "title": "Kabuto — Samurai Warlord Helmet",
        "subtitle": "Faceted defensive horns (Kuwagata) • Tiered neck guard (Shikoro)",
        "description": "Traditional helmet worn by ancient samurai warlords and folded for Tango no Sekku (Boys' Day / Children's Day). Features flared horns and a wearable hollow dome.",
        "difficulty": "Beginner-Intermediate",
        "time": "15-20 min",
        "category": "japanese",
        "collection": "japanese",
        "collectionTitle": "Japanese Master Origami",
        "accent": "#f59e0b",
        "goal": "A wearable 3D samurai helmet with flared Kuwagata horns and folded brow crest",
        "paper": [
            { "color": "Navy Blue / Gold Foil Duo Washi", "size": "8\" x 8\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Triangular blintz mechanics", "Faceted Kuwagata horn flare", "Hollow wearable helmet crown"],
        "steps": [
            { "stepNumber": 1, "title": "Diagonal Triangle & Corner Blintz", "time": "3-4 min", "foldType": "Triangle Fold", "instruction": "Fold 8\" square diagonally to form triangle with apex pointing down. Fold upper left and right corners down to meet bottom apex.", "tip": "Ensure points touch exactly at the bottom apex.", "diagramType": "kabuto-tri" },
            { "stepNumber": 2, "title": "Apex Elevation Folds", "time": "3-4 min", "foldType": "Valley Fold", "instruction": "Fold both lower flaps upward to the top point, forming a diamond with a center split.", "tip": "Crease firmly along lower edges.", "diagramType": "kabuto-diamond" },
            { "stepNumber": 3, "title": "Kuwagata (Horns) Flaring", "time": "3-4 min", "foldType": "Diagonal Wing Flare", "instruction": "Fold top flaps diagonally outward and upward, creating twin flared horns (kuwagata) that protrude beyond helmet crown.", "tip": "Angle horns symmetrically at roughly 45 degrees.", "diagramType": "kuwagata" },
            { "stepNumber": 4, "title": "Brow Rim & Band Layering", "time": "3-4 min", "foldType": "Double Valley Fold", "instruction": "Fold upper layer bottom point upward towards center, then fold a 0.5\" cuff upward to form the forehead crest band.", "tip": "Burnish band with bone folder to lock front layers.", "diagramType": "kabuto-brow" },
            { "stepNumber": 5, "title": "Base Tuck & Dome Opening", "time": "3-4 min", "foldType": "Interior Pocket Lock", "instruction": "Fold rear bottom flap upward into interior cavity. Open bottom rim to expand into a hollow 3D helmet.", "tip": "Fold from newspaper or large wrapping paper to create a wearable size!", "diagramType": "kabuto-final" }
        ]
    },
    "japanese-03": {
        "id": "japanese-03",
        "kitNumber": 3,
        "title": "Sakura — 5-Petal Cherry Blossom",
        "subtitle": "Pentagonal radial division • Scalloped petal clefts • Hanami spring icon",
        "description": "Symbol of spring, renewal, and the fleeting beauty of life. Features five identical radial petals with delicate V-cleft notches folded from a single pentagonal paper blank.",
        "difficulty": "Intermediate",
        "time": "20-25 min",
        "category": "japanese",
        "collection": "japanese",
        "collectionTitle": "Japanese Master Origami",
        "accent": "#f472b6",
        "goal": "A delicate 5-petal cherry blossom with concave cupped petals and central pistil cleft",
        "paper": [
            { "color": "Soft Cherry Blossom Pink Duo", "size": "6\" x 6\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Scissors (for initial pentagon trim only)"],
        "principles": ["72-degree pentagonal folding", "Radially staggered petal tucks", "Organic petal fluting"],
        "steps": [
            { "stepNumber": 1, "title": "Pentagonal Base Folding", "time": "5-6 min", "foldType": "Golden Ratio Angle Bisector", "instruction": "Fold 6\" square in half, find intersection landmark to fold 72-degree angle, folding into a 5-fold radial wedge.", "tip": "Check that all 5 folded sections align with identical angular width.", "diagramType": "pentagon-fold" },
            { "stepNumber": 2, "title": "Petal Outline Fold & Trim", "time": "3-4 min", "foldType": "Angle Fold", "instruction": "Fold wedge edge at an arc to establish petal curvature, trim excess to yield a perfect regular pentagon blank.", "tip": "Keep cuts minimal; authentic folding creates petal curvature.", "diagramType": "pentagon-blank" },
            { "stepNumber": 3, "title": "Radial Petal Inversions", "time": "5-6 min", "foldType": "Valley Crimp", "instruction": "Fold mountain creases along all 5 radii from center to petal tips; fold valley creases along inner valleys.", "tip": "The blossom naturally begins cupping into 3D form.", "diagramType": "sakura-valleys" },
            { "stepNumber": 4, "title": "Petal Notch (Cleft) Formation", "time": "4-5 min", "foldType": "Inside Reverse Notch", "instruction": "Make a tiny inside reverse fold at the tip of each of the 5 petals to create the signature cherry blossom notch.", "tip": "A 2mm notch captures botanical authenticity.", "diagramType": "petal-notch" },
            { "stepNumber": 5, "title": "Petal Cupping & Center Dimple", "time": "3-4 min", "foldType": "Thumb Sculpting", "instruction": "Gently press center point downward with round pencil end while curling petals slightly inward.", "tip": "Scatter multiple sakura blossoms across a dark lacquer tray for Hanami display.", "diagramType": "sakura-final" }
        ]
    },
    "japanese-04": {
        "id": "japanese-04",
        "kitNumber": 4,
        "title": "Minogame — Longevity Sacred Tortoise",
        "subtitle": "Hexagonal carapace • Articulated clawed flippers • Fringed moss tail",
        "description": "The legendary Japanese sea turtle believed to live 10,000 years, carrying a flowing train of seaweed (mino) on its shell. An auspicious gift of long life and prosperity.",
        "difficulty": "Advanced",
        "time": "30-38 min",
        "category": "japanese",
        "collection": "japanese",
        "collectionTitle": "Japanese Master Origami",
        "accent": "#059669",
        "goal": "A volumetric 3D turtle with faceted hexagonal shell, head, flippers, and fanned moss tail",
        "paper": [
            { "color": "Dark Olive Green / Pale Gold Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Box-pleated carapace volume", "Reverse-folded flippers", "Accordion-pleated seaweed tail"],
        "steps": [
            { "stepNumber": 1, "title": "Modified Fish Base with Tail Flap", "time": "6-8 min", "foldType": "Fish Base Variant", "instruction": "Take 7\" olive duo paper. Fold diagonal kite lines and collapse into an elongated fish base with extra lower flap for tail.", "tip": "Keep center spine crease sharp for shell facet alignment.", "diagramType": "turtle-base" },
            { "stepNumber": 2, "title": "Faceted Hexagonal Carapace", "time": "8-10 min", "foldType": "Box-Pleat Shell Dome", "instruction": "Fold mountain creases across shell zone and tuck perimeter flaps under to create an elevated hexagonal dome.", "tip": "Press dome from underside with thumb to establish 3D height.", "diagramType": "shell-dome" },
            { "stepNumber": 3, "title": "Flipper Articulation & Claws", "time": "6-8 min", "foldType": "Rabbit-Ear Flipper", "instruction": "Rabbit-ear fold the 4 lateral flaps outward into swimming flippers with small crimped claws.", "tip": "Angle front flippers forward and rear flippers back.", "diagramType": "flippers" },
            { "stepNumber": 4, "title": "Reptilian Head & Neck Crimp", "time": "5-6 min", "foldType": "Inside Reverse Fold", "instruction": "Inside reverse fold front flap upward and forward to form turtle head and neck reaching forward.", "tip": "Pinch snout slightly for blunt aquatic profile.", "diagramType": "turtle-head" },
            { "stepNumber": 5, "title": "Accordion Seaweed Tail (Mino)", "time": "5-6 min", "foldType": "Micro-Accordion Pleats", "instruction": "Accordion pleat the trailing tail flap into fine 1mm ridges, fanning out behind shell like flowing green moss.", "tip": "Fluff pleats with tweezers to suggest floating underwater currents.", "diagramType": "turtle-final" }
        ]
    },
    "japanese-05": {
        "id": "japanese-05",
        "kitNumber": 5,
        "title": "Koinobori — Children's Day Flying Carp",
        "subtitle": "Hollow windsock body • Scalloped scale texture • Aerodynamic mouth hoop",
        "description": "Flown on May 5th in Japan to celebrate children's strength and courage. A hollow cylindrical carp that inflates when held in a breeze, with folded scales and articulated fins.",
        "difficulty": "Intermediate",
        "time": "20-26 min",
        "category": "japanese",
        "collection": "japanese",
        "collectionTitle": "Japanese Master Origami",
        "accent": "#2563eb",
        "goal": "A hollow cylindrical carp windsock with open mouth hoop and pleated swimming tail",
        "paper": [
            { "color": "Cobalt Blue / White Duo", "size": "6\" x 10\" (1:1.6 Ratio)", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler"],
        "principles": ["Cylindrical air cavity", "Herringbone scale folds", "Mouth hoop friction lock"],
        "steps": [
            { "stepNumber": 1, "title": "Scale Chevron Pre-Creasing", "time": "5-6 min", "foldType": "Chevron Scale Grid", "instruction": "Pre-crease diagonal zigzags along body zone of 6\"x10\" rectangle to establish fish scale pattern.", "tip": "Light folds create texture without puncturing paper.", "diagramType": "scale-grid" },
            { "stepNumber": 2, "title": "Pectoral & Dorsal Fin Fold", "time": "4-5 min", "foldType": "Fin Inversion", "instruction": "Fold small triangular side fins along mid-line, pointing backward towards tail.", "tip": "Ensure fins flare outward at 30 degrees.", "diagramType": "carp-fins" },
            { "stepNumber": 3, "title": "Cylindrical Seam Tuck", "time": "4-5 min", "foldType": "Seam Lock", "instruction": "Bring long edges together and double-fold seam to form an open hollow tube.", "tip": "Double fold creates rigid seam that holds shape without adhesive.", "diagramType": "hollow-tube" },
            { "stepNumber": 4, "title": "Mouth Hoop Ring Fold", "time": "3-4 min", "foldType": "Collar Crimp", "instruction": "Fold front opening outward over itself twice to form a rigid circular mouth hoop.", "tip": "The hoop stays permanently open to catch wind currents.", "diagramType": "mouth-hoop" },
            { "stepNumber": 5, "title": "Fanned Tail Fin Collapse", "time": "4-6 min", "foldType": "Inside Reverse Fan", "instruction": "Flatten rear opening horizontally, crimp and fan out into a deeply notched bifurcated caudal fin.", "tip": "Attach thread to mouth hoop to fly your koinobori!", "diagramType": "koinobori-final" }
        ]
    },
    "japanese-06": {
        "id": "japanese-06",
        "kitNumber": 6,
        "title": "Nihon-Ryu — Imperial Rising Dragon",
        "subtitle": "Sinuous serpentine body • Horned dragon head • Articulated claw feet",
        "description": "The sacred benevolent water dragon of Japanese mythology. Features a long sinuous spine, bearded jaws, deer-like horns, and 4 grasping talons.",
        "difficulty": "Advanced",
        "time": "42-50 min",
        "category": "japanese",
        "collection": "japanese",
        "collectionTitle": "Japanese Master Origami",
        "accent": "#0d9488",
        "goal": "A dynamic serpentine dragon coiled in rising spiral with horned head and whiskers",
        "paper": [
            { "color": "Jade Green / Gold Duo", "size": "8\" x 8\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers", "Shaping Pin"],
        "principles": ["Multi-tier spine crimping", "Facial split folds for horns and whiskers", "Serpentine 3D spiral posturing"],
        "steps": [
            { "stepNumber": 1, "title": "Blintz Bird Base Framework", "time": "8-10 min", "foldType": "Blintz Bird Base", "instruction": "Fold 8\" square into blintz base, then execute bird base petal folds on both sides to yield 8 independent flaps.", "tip": "The extra flaps from blintzing provide paper for all 4 legs, horns, and whiskers.", "diagramType": "blintz-bird" },
            { "stepNumber": 2, "title": "Horned Dragon Head & Whiskers", "time": "10-12 min", "foldType": "Crimp & Split Reverse", "instruction": "Crimp head forward. Split upper flaps into twin backward horns; split lower flaps into long forward whiskers.", "tip": "Use tweezers to curl whiskers in dynamic spiral arcs.", "diagramType": "dragon-head" },
            { "stepNumber": 3, "title": "Four Clawed Talons", "time": "8-10 min", "foldType": "Rabbit-Ear Legs", "instruction": "Fold lateral flaps into 4 slender legs, rabbit-ear folding each foot into 3 sharp curved talons.", "tip": "Angle front legs forward and rear legs backward.", "diagramType": "dragon-claws" },
            { "stepNumber": 4, "title": "Serpentine S-Curve Spine Crimping", "time": "8-10 min", "foldType": "Spine Crimp Matrix", "instruction": "Make 6 staggered inside reverse crimps along spine, bending body into a rising vertical spiral.", "tip": "Vary crimp directions to create dramatic 3D ascending energy.", "diagramType": "dragon-spine" },
            { "stepNumber": 5, "title": "Tail Flare & Display Posture", "time": "8-10 min", "foldType": "Tail Fan & Balance", "instruction": "Fan tail tip into flame-like flutes. Adjust leg stance so dragon balances upright in coiled rising posture.", "tip": "A true masterwork of traditional Japanese paper engineering.", "diagramType": "dragon-final" }
        ]
    }
}
kits.update(japanese_kits)

# 7. CHINESE HERITAGE & FESTIVALS (6 Kits)
chinese_kits = {
    "chinese-01": {
        "id": "chinese-01",
        "kitNumber": 1,
        "title": "Yuanbao — Auspicious Golden Ingot",
        "subtitle": "Boat-shaped Spring Festival talisman • Elevated central crown • Wealth & prosperity",
        "description": "The traditional silver/gold sycee ingot used in Imperial China and displayed during Lunar New Year to welcome wealth and good fortune.",
        "difficulty": "Beginner-Intermediate",
        "time": "12-16 min",
        "category": "chinese",
        "collection": "chinese",
        "collectionTitle": "Chinese Heritage & Festivals",
        "accent": "#eab308",
        "goal": "A dimensional boat-shaped golden ingot with elevated central dome and flared curved ends",
        "paper": [
            { "color": "Mirror Gold Foil Paper", "size": "6\" x 6\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Inverted boat fold mechanics", "Central dome elevation", "Friction locking rim"],
        "steps": [
            { "stepNumber": 1, "title": "Horizontal & Diagonal Base Folds", "time": "2-3 min", "foldType": "Pre-Creases", "instruction": "Take 6\" gold foil square. Fold in half horizontally and vertically, crease both diagonals, unfold.", "tip": "Gold foil holds crisp lines; fold on clean surface.", "diagramType": "yuanbao-grid" },
            { "stepNumber": 2, "title": "Cup Formation & Side Inversion", "time": "3-4 min", "foldType": "Valley Fold", "instruction": "Fold bottom and top edges to center crease. Fold corners inward at 45 degrees.", "tip": "Corner folds establish the tapered ends of the boat.", "diagramType": "yuanbao-corners" },
            { "stepNumber": 3, "title": "Flanged Rim Folding", "time": "3-4 min", "foldType": "Cuff Fold", "instruction": "Fold outer flaps backward over corners, locking the angled edges into rigid double rims.", "tip": "Burnish rim to ensure it does not unroll.", "diagramType": "yuanbao-rim" },
            { "stepNumber": 4, "title": "Inside-Out Inversion (The Boat Pop)", "time": "2-3 min", "foldType": "Inside-Out Inversion", "instruction": "Carefully pull center edges outward while pushing center underside upward with thumbs, turning ingot 3D.", "tip": "Ease sides out smoothly so gold foil does not wrinkle.", "diagramType": "yuanbao-pop" },
            { "stepNumber": 5, "title": "Central Crown Shaping", "time": "2-3 min", "foldType": "Dome Sculpting", "instruction": "Pinch the center mound into an elevated oval dome with twin boat tips curving upward.", "tip": "Display in groups of 3 or 8 for supreme Lunar New Year feng shui.", "diagramType": "yuanbao-final" }
        ]
    },
    "chinese-02": {
        "id": "chinese-02",
        "kitNumber": 2,
        "title": "Denglong — Royal Palace Red Lantern",
        "subtitle": "3D ribbed accordion sphere • Gold trim collars • Flowing silk tassel",
        "description": "Essential celebration icon for Chinese New Year, Lantern Festival, and Mid-Autumn Festival. A spherical red lantern with ribbed facets, gold caps, and a delicate paper tassel.",
        "difficulty": "Intermediate",
        "time": "22-28 min",
        "category": "chinese",
        "collection": "chinese",
        "collectionTitle": "Chinese Heritage & Festivals",
        "accent": "#dc2626",
        "goal": "A spherical red lantern with 12 curved ribbed vertical facets and gold foil tassel",
        "paper": [
            { "color": "Imperial Festive Red Kraft", "size": "6\" x 10\" (1:1.67 Ratio)", "qty": 1, "gsm": "70 gsm" },
            { "color": "Mirror Gold Foil (Caps & Tassel)", "size": "3\" x 6\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Double-Sided Tape"],
        "principles": ["Accordion barrel expansion", "Curved rib compression", "Concentric gold collar locking"],
        "steps": [
            { "stepNumber": 1, "title": "12-Pleat Accordion Pre-Creasing", "time": "5-6 min", "foldType": "Accordion Pleat", "instruction": "Divide 6\"x10\" red sheet into 12 equal vertical accordion pleats.", "tip": "Measure pleats evenly with ruler for smooth circular expansion.", "diagramType": "lantern-pleats" },
            { "stepNumber": 2, "title": "Diamond Rib Scoring", "time": "5-6 min", "foldType": "Diagonal Scoring", "instruction": "Score diamond mountain creases across center of each pleat to allow barrel swelling.", "tip": "Diamonds buckle outward when top and bottom rims are compressed.", "diagramType": "lantern-diamonds" },
            { "stepNumber": 3, "title": "Cylindrical Seam Join", "time": "4-5 min", "foldType": "Seam Interlock", "instruction": "Join terminal pleats to form closed ribbed cylinder. Press ends inward to pop center into a sphere.", "tip": "Support interior with fingers while pushing ends together.", "diagramType": "lantern-sphere" },
            { "stepNumber": 4, "title": "Gold Collar Caps", "time": "4-5 min", "foldType": "Collar Rings", "instruction": "Fold twin gold foil strips into circular rings and attach to top and bottom lantern rims.", "tip": "Gold collars hold the lantern in permanent compressed spherical tension.", "diagramType": "lantern-collars" },
            { "stepNumber": 5, "title": "Fringed Paper Tassel Attachment", "time": "4-6 min", "foldType": "Tassel Fringe", "instruction": "Micro-slit remaining gold foil into 1mm fringe, roll into hanging tassel and suspend from bottom rim.", "tip": "Hang near entrance doors to usher in joy and illumination.", "diagramType": "lantern-final" }
        ]
    },
    "chinese-03": {
        "id": "chinese-03",
        "kitNumber": 3,
        "title": "Loong — Imperial Celestial Dragon",
        "subtitle": "Five-clawed imperial majesty • Segmented dorsal ridge • Coiled serpentine flight",
        "description": "Embodiment of cosmic power, rain, and good fortune. Features a fierce dragon head with beard, five-toed imperial claws, and an undulating segmented spine.",
        "difficulty": "Advanced",
        "time": "40-48 min",
        "category": "chinese",
        "collection": "chinese",
        "collectionTitle": "Chinese Heritage & Festivals",
        "accent": "#b91c1c",
        "goal": "A three-dimensional coiling celestial dragon with articulated jaws, horns, and spines",
        "paper": [
            { "color": "Vermillion Red / Gold Duo Washi", "size": "8\" x 8\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers", "Shaping Needle"],
        "principles": ["Box-pleated dorsal spine ridges", "Double-split facial claws and whiskers", "Dynamic celestial flight pose"],
        "steps": [
            { "stepNumber": 1, "title": "32-Grid Diagonal Pre-Crease", "time": "8-10 min", "foldType": "Box-Pleat Matrix", "instruction": "Score 32x32 diagonal grid across 8\" vermillion square to allocate paper for head, 4 legs, and dorsal spines.", "tip": "Extreme scoring precision ensures all spikes align along spine.", "diagramType": "grid-32" },
            { "stepNumber": 2, "title": "Head & Open Jaws Collapse", "time": "10-12 min", "foldType": "Box-Pleat Head Collapse", "instruction": "Collapse front quadrant into dragon snout with open upper/lower jaws, dual backward horns, and long whiskers.", "tip": "Pinch whiskers forward and horns backward for dynamic facial expression.", "diagramType": "loong-head" },
            { "stepNumber": 3, "title": "Five-Toed Imperial Claws", "time": "8-10 min", "foldType": "Micro-Split Reverse", "instruction": "Split each of the 4 leg points into 5 tiny sharp claws using precision tweezers.", "tip": "In imperial China, 5 claws were reserved exclusively for the Emperor.", "diagramType": "loong-claws" },
            { "stepNumber": 4, "title": "Dorsal Spines Accordion Pleats", "time": "8-10 min", "foldType": "Ridge Spines", "instruction": "Along spine axis, pinch 12 triangular mountain peaks that simulate sharp dorsal scales.", "tip": "Gold backing reveals along spine tips, creating fiery flame highlights.", "diagramType": "loong-spines" },
            { "stepNumber": 5, "title": "Coiled Flight Staging", "time": "6-8 min", "foldType": "Serpentine Arc", "instruction": "Bend body through a dramatic aerial loop with head raised high and tail whipping in aerodynamic arc.", "tip": "Mount on black display base to simulate flying among festival clouds.", "diagramType": "loong-final" }
        ]
    },
    "chinese-04": {
        "id": "chinese-04",
        "kitNumber": 4,
        "title": "Fenghuang — Empress Phoenix",
        "subtitle": "Queen of birds • Tri-crested crown • Cascading tail plumage ribbons",
        "description": "The immortal celestial phoenix representing virtue, duty, and celestial harmony. Partner to the dragon, featuring crown plumes and sweeping tail streamers.",
        "difficulty": "Advanced",
        "time": "35-42 min",
        "category": "chinese",
        "collection": "chinese",
        "collectionTitle": "Chinese Heritage & Festivals",
        "accent": "#d97706",
        "goal": "A soaring 3D phoenix with 3 crest plumes, arching wings, and 3 long flowing tail ribbons",
        "paper": [
            { "color": "Imperial Gold Foil / Ruby Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Bird base elongation", "Tail ribbon triple split", "Dihedral soaring wing sweep"],
        "steps": [
            { "stepNumber": 1, "title": "Elongated Bird Base Foundation", "time": "6-8 min", "foldType": "Bird Base", "instruction": "Take 7\" gold/ruby foil. Fold square preliminary base, followed by deep petal folds on both sides.", "tip": "Make petal folds narrow to maximize tail length.", "diagramType": "fenghuang-base" },
            { "stepNumber": 2, "title": "Tri-Feather Crown Crest", "time": "6-8 min", "foldType": "Crown Split Reverse", "instruction": "Inside reverse fold neck upward; split crown into 3 elegant plumes curling upward like flame tips.", "tip": "Curve center plume tallest with outer plumes flaring symmetrically.", "diagramType": "fenghuang-crown" },
            { "stepNumber": 3, "title": "Layered Feathery Wing Pleats", "time": "8-10 min", "foldType": "Accordion Wing Rays", "instruction": "Fold 6 radiating pleats across each wing, rolling leading edge forward in proud soaring sweep.", "tip": "Ruby underlayer shines through pleat gaps for celestial glow.", "diagramType": "fenghuang-wings" },
            { "stepNumber": 4, "title": "Triple Tail Streamer Separation", "time": "8-10 min", "foldType": "Tail Ribbon Split", "instruction": "Carefully split tail into 3 slender ribbons. Accordion-pleat each ribbon and thumb-curve into undulating waves.", "tip": "The undulating tail ribbons convey ethereal airborne floating.", "diagramType": "fenghuang-tail" },
            { "stepNumber": 5, "title": "Dynamic Flight Stance", "time": "7-8 min", "foldType": "Dihedral Lift", "instruction": "Angle wings at 45-degree upward sweep, arc spine into graceful climb, and arrange tail feathers trailing downward.", "tip": "Display beside the Imperial Dragon for yin-yang celestial balance.", "diagramType": "fenghuang-final" }
        ]
    },
    "chinese-05": {
        "id": "chinese-05",
        "kitNumber": 5,
        "title": "Mid-Autumn Jade Rabbit",
        "subtitle": "Chubby moon rabbit • Long upright ears • Pounding elixir of immortality",
        "description": "Companion to the Moon Goddess Chang'e in Chinese legend. A rounded, volumetric white rabbit with long ears, folded in reverence to the Mid-Autumn harvest moon.",
        "difficulty": "Beginner-Intermediate",
        "time": "18-24 min",
        "category": "chinese",
        "collection": "chinese",
        "collectionTitle": "Chinese Heritage & Festivals",
        "accent": "#38bdf8",
        "goal": "A cute, rounded 3D white rabbit with long upright ears and hollow volumetric body",
        "paper": [
            { "color": "Pure White / Pearl Washi", "size": "6\" x 6\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Waterbomb base inflation", "Rabbit-ear fold mechanics", "Hollow spherical body volume"],
        "steps": [
            { "stepNumber": 1, "title": "Waterbomb Base & Ear Flaps", "time": "3-4 min", "foldType": "Waterbomb Base", "instruction": "Fold 6\" white square diagonally both ways, horizontally, and collapse into triangular waterbomb base.", "tip": "Ensure creases are crisp to allow easy inflation later.", "diagramType": "rabbit-wb" },
            { "stepNumber": 2, "title": "Front Point Elevation", "time": "3-4 min", "foldType": "Valley Fold", "instruction": "Fold bottom front corners up to top apex, then fold side vertices to center vertical line.", "tip": "Tuck top flaps into triangular pockets to lock front face.", "diagramType": "rabbit-face" },
            { "stepNumber": 3, "title": "Long Upright Ear Shaping", "time": "4-5 min", "foldType": "Rabbit-Ear Fold", "instruction": "On rear flaps, fold long slender triangles upward and squash fold along center to open hollow ears.", "tip": "Spread ears slightly in classic alert listening posture.", "diagramType": "rabbit-ears" },
            { "stepNumber": 4, "title": "The Magic Breath Inflation", "time": "3-4 min", "foldType": "Blow Inflation", "instruction": "Locate small blowhole at rabbit's nose/base. Gently blow air into opening to inflate body into a rounded 3D sphere.", "tip": "Support sides with cupped palms while inflating.", "diagramType": "rabbit-puff" },
            { "stepNumber": 5, "title": "Cheek Pinch & Moon Gazing Stance", "time": "5-7 min", "foldType": "Facial Sculpting", "instruction": "Pinch cheeks gently to define snout; tilt ears back so rabbit looks upward towards the harvest moon.", "tip": "Place beside paper mooncake models during Mid-Autumn Festival celebrations.", "diagramType": "rabbit-final" }
        ]
    },
    "chinese-06": {
        "id": "chinese-06",
        "kitNumber": 6,
        "title": "Fu Chuan — Traditional Chinese Junk Ship",
        "subtitle": "Ribbed battened sails • Watertight hull geometry • Maritime Silk Road heritage",
        "description": "Historic vessel of Chinese maritime exploration and merchant trade. Features an angled watertight hull, elevated stern castle, and iconic ribbed battened sails.",
        "difficulty": "Intermediate-Advanced",
        "time": "25-32 min",
        "category": "chinese",
        "collection": "chinese",
        "collectionTitle": "Chinese Heritage & Festivals",
        "accent": "#9a3412",
        "goal": "A freestanding 3D Chinese junk ship with ribbed sails and raised aft-deck",
        "paper": [
            { "color": "Teak Wood Kraft / Warm Tan", "size": "7\" x 7\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler"],
        "principles": ["Watertight boat pocket folds", "Ribbed sail batten pleats", "Flat-bottom maritime stability"],
        "steps": [
            { "stepNumber": 1, "title": "Hull Grid & Keel Scoring", "time": "5-6 min", "foldType": "Grid Pre-Creasing", "instruction": "Fold 7\" kraft square into 4x4 grid; crease diagonal keel folds across center two quadrants.", "tip": "Crisp folds ensure the boat stands upright without tipping.", "diagramType": "junk-grid" },
            { "stepNumber": 2, "title": "Stern & Bow Elevation Pockets", "time": "6-8 min", "foldType": "Inside Reverse Hull", "instruction": "Fold ends inward and lock corners with squash folds to elevate the raised stern and tapered bow.", "tip": "Keep the stern taller than the bow as in authentic Ming dynasty junks.", "diagramType": "junk-hull" },
            { "stepNumber": 3, "title": "Battened Sail Accordion Folds", "time": "6-8 min", "foldType": "Batten Pleats", "instruction": "From center upright flap, accordion pleat horizontally in 4mm steps to simulate wooden sail battens.", "tip": "Battened sails are the defining signature of Chinese junk rigging.", "diagramType": "junk-sails" },
            { "stepNumber": 4, "title": "Hull Cavity Expansion", "time": "4-5 min", "foldType": "Hull Opening", "instruction": "Gently pull gunwales outward to expand hollow cargo hold while flattening bottom keel.", "tip": "Ensure flat bottom makes 100% planar contact with tabletop.", "diagramType": "junk-expand" },
            { "stepNumber": 5, "title": "Rudder Crimp & Final Truing", "time": "4-5 min", "foldType": "Rudder Fold", "instruction": "Crimp rear hull tab into vertical stern rudder. Flare sails slightly to catch imaginary trade winds.", "tip": "The completed ship sails proudly across any tabletop ocean.", "diagramType": "junk-final" }
        ]
    }
}
kits.update(chinese_kits)

# 8. AMERICAN & MODERN COMPUTATIONAL ORIGAMI (6 Kits)
american_kits = {
    "american-01": {
        "id": "american-01",
        "kitNumber": 1,
        "title": "American Bald Eagle",
        "subtitle": "Color-change white cowl & tail • Broad 8-inch wingspan • Hooked talons",
        "description": "Emblem of freedom and American wildlife. Uses sophisticated color-change origami geometry where dark brown paper folds back to reveal white head feathers and white tail.",
        "difficulty": "Advanced",
        "time": "35-45 min",
        "category": "american",
        "collection": "american",
        "collectionTitle": "American Modern Origami",
        "accent": "#0369a1",
        "goal": "A magnificent 3D bald eagle with pure white head/tail, dark wings, and hooked yellow beak",
        "paper": [
            { "color": "Dark Chocolate / Pure White Duo Paper", "size": "8\" x 8\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Bilateral color-change cowl", "Wing feather crimping", "Sculpted predatory hooked beak"],
        "steps": [
            { "stepNumber": 1, "title": "Color-Change Bird Base Setup", "time": "8-10 min", "foldType": "Duo Bird Base", "instruction": "Start with 8\" brown/white duo, brown side up. Crease preliminary base with top flap folded white, collapsing into bird base.", "tip": "The white corner will become the eagle's iconic white head.", "diagramType": "eagle-base" },
            { "stepNumber": 2, "title": "White Head Cowl & Hooked Beak", "time": "8-10 min", "foldType": "Inside Reverse & Beak Crimp", "instruction": "Reverse fold front white flap upward. Crimp tip downward into sharp hooked beak, tucking cheeks into white cowl.", "tip": "A sharp downward beak angle conveys predatory intensity.", "diagramType": "eagle-head" },
            { "stepNumber": 3, "title": "Broad Wingspan Primary Feathers", "time": "8-10 min", "foldType": "Feather Pleat Rays", "instruction": "Spread brown wing flaps outward and accordion pleat 4 stepped primary flight feathers along trailing edge.", "tip": "Stagger feather lengths to replicate raptor wings in soaring flight.", "diagramType": "eagle-wings" },
            { "stepNumber": 4, "title": "White Tail Fan Color Change", "time": "5-6 min", "foldType": "Tail Color Flip", "instruction": "Flip rear flap to reveal white underlayer, fanning into broad wedge tail.", "tip": "The stark contrast between brown body and white tail is unmistakable.", "diagramType": "eagle-tail" },
            { "stepNumber": 5, "title": "Underbelly Talons & Perch Stance", "time": "6-8 min", "foldType": "Talon Reverse Folds", "instruction": "Reverse fold tiny underside flaps into clutching talons. Set wings at 30-degree upward dihedral angle.", "tip": "Perch upon a small wooden branch for an extraordinary display piece.", "diagramType": "eagle-final" }
        ]
    },
    "american-02": {
        "id": "american-02",
        "kitNumber": 2,
        "title": "American Prairie Bison",
        "subtitle": "Volumetric massive shoulder hump • Curved horn crimps • Shaggy forequarters",
        "description": "Symbol of the American Great Plains. Engineered with an enormous shoulder hump, lowered head with sharp horns, and thick muscular front legs.",
        "difficulty": "Advanced",
        "time": "32-40 min",
        "category": "american",
        "collection": "american",
        "collectionTitle": "American Modern Origami",
        "accent": "#78350f",
        "goal": "A heavy 3D bison with pronounced muscular hump, curved horns, and solid 4-point stance",
        "paper": [
            { "color": "Textured Brown Kraft / Espresso", "size": "7\" x 7\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Box-pleated shoulder mass", "Lowered defensive head angle", "Volumetric hollow torso"],
        "steps": [
            { "stepNumber": 1, "title": "Kite Base with Hump Allocation", "time": "6-8 min", "foldType": "Asymmetric Kite Base", "instruction": "Take 7\" brown kraft. Fold off-center kite creases allocating 60% of paper to front shoulders and head.", "tip": "Bison anatomy requires far more front-end volume than rear.", "diagramType": "bison-base" },
            { "stepNumber": 2, "title": "Shoulder Hump Box Pleat", "time": "8-10 min", "foldType": "Hump Elevation Pleat", "instruction": "Pinch dual mountain ridges across midsection, elevating paper into an imposing 3D shoulder hump.", "tip": "Burnish pleats so the hump stays permanently proud of spine.", "diagramType": "bison-hump" },
            { "stepNumber": 3, "title": "Lowered Head & Horn Crimps", "time": "6-8 min", "foldType": "Double Reverse Horns", "instruction": "Crimp head downward in grazing/charging pose. Split forehead flaps and curve outward into sharp horns.", "tip": "Use tweezers to bend horns slightly inward at tips.", "diagramType": "bison-horns" },
            { "stepNumber": 4, "title": "Stocky Columnar Legs", "time": "6-8 min", "foldType": "Inside Reverse Legs", "instruction": "Fold front legs thick and heavy; fold hind legs slender and tucked beneath flanks.", "tip": "Keep front legs wider to support the heavy shoulder mass.", "diagramType": "bison-legs" },
            { "stepNumber": 5, "title": "Body Cavity Inflation & Truing", "time": "6-7 min", "foldType": "Torso Inflation", "instruction": "Separate belly seams to inflate barrel torso. Inspect on flat surface; ensure all 4 hooves make firm contact.", "tip": "A monumental sculpture celebrating North American wilderness.", "diagramType": "bison-final" }
        ]
    },
    "american-03": {
        "id": "american-03",
        "kitNumber": 3,
        "title": "Kinetic Action Jumping Frog",
        "subtitle": "Spring-loaded mechanical pleat • Jumps when tapped • Classic action origami",
        "description": "The world's most famous kinetic action origami. Folded with a double spring pleat on the hind legs that launches the frog leaping through the air when tapped.",
        "difficulty": "Beginner",
        "time": "10-15 min",
        "category": "american",
        "collection": "american",
        "collectionTitle": "American Modern Origami",
        "accent": "#16a34a",
        "goal": "A compact 3D frog that jumps 12+ inches forward when finger-tapped on back spring",
        "paper": [
            { "color": "Spring Green Stiff Origami Paper", "size": "5\" x 5\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Mechanical spring pleat elasticity", "Waterbomb foundation", "Elastic energy storage in paper fibers"],
        "steps": [
            { "stepNumber": 1, "title": "Top Waterbomb Triangle", "time": "2-3 min", "foldType": "Waterbomb Collapse", "instruction": "Fold top half of 5\" green square diagonally both ways and collapse into a triangular waterbomb head.", "tip": "Sharp creases maximize mechanical spring power.", "diagramType": "frog-wb" },
            { "stepNumber": 2, "title": "Front Leg Flaring", "time": "2-3 min", "foldType": "Diagonal Leg Fold", "instruction": "Fold side flaps of waterbomb upward and outward to form twin front swimming legs.", "tip": "Angle legs outward at 45 degrees.", "diagramType": "frog-frontlegs" },
            { "stepNumber": 3, "title": "Bottom Half Tapering", "time": "2-3 min", "foldType": "Side Valley Tucks", "instruction": "Fold lower sides inward to center line, forming a narrow rectangular waist for the hind legs.", "tip": "Keep center seam clean and flat.", "diagramType": "frog-waist" },
            { "stepNumber": 4, "title": "Mechanical Spring Z-Pleat", "time": "2-3 min", "foldType": "Elastic Z-Pleat", "instruction": "Fold entire lower half up in half (valley), then fold bottom legs back down in half (mountain), forming a tight Z-spring.", "tip": "This double pleat acts as the kinetic launch spring.", "diagramType": "frog-spring" },
            { "stepNumber": 5, "title": "Test Launch & Distance Tuning", "time": "2-3 min", "foldType": "Kinetic Test", "instruction": "Place frog on smooth table. Lightly press and slide index finger backward off the spring pleat to watch frog leap!", "tip": "Crisper paper produces higher and longer acrobatic jumps.", "diagramType": "frog-final" }
        ]
    },
    "american-04": {
        "id": "american-04",
        "kitNumber": 4,
        "title": "Computational Hercules Beetle",
        "subtitle": "Robert Lang-inspired 32-box pleat • Massive thoracic horn • 6 articulated legs",
        "description": "Inspired by American computational origami pioneers (Robert Lang & Tom Hull). Uses a 32x32 box-pleating grid to allocate paper for massive pincer horns and 6 jointed legs without cuts.",
        "difficulty": "Master",
        "time": "45-60 min",
        "category": "american",
        "collection": "american",
        "collectionTitle": "American Modern Origami",
        "accent": "#4f46e5",
        "goal": "A museum-grade 3D Hercules beetle with pincer horns, armored elytra shell, and 6 legs",
        "paper": [
            { "color": "Dark Olive / Glossy Black Duo", "size": "9\" x 9\"", "qty": 1, "gsm": "50 gsm (Thin Kraft / Tissue-foil)" }
        ],
        "tools": ["Bone Folder", "Ruler", "Precision Tweezers", "Micro Shaping Clips"],
        "principles": ["32x32 Box-pleat circle packing", "Grafting for extra horn length", "Multi-jointed insect leg crimping"],
        "steps": [
            { "stepNumber": 1, "title": "32x32 Pre-Crease Matrix", "time": "12-15 min", "foldType": "Binary Grid Division", "instruction": "Subdivide 9\" thin sheet into 32 equal vertical and horizontal grid rows with bone folder.", "tip": "Use a metal ruler for laser-accurate grid lines.", "diagramType": "grid-32-beetle" },
            { "stepNumber": 2, "title": "Circle Packing Base Collapse", "time": "12-15 min", "foldType": "Box-Pleat Collapse", "instruction": "Simultaneously collapse grid into flat insect base allocating 6 leg flaps, 2 horn flaps, and center shell.", "tip": "Work inward from the corners toward the center.", "diagramType": "beetle-collapse" },
            { "stepNumber": 3, "title": "Massive Thoracic & Head Horns", "time": "8-10 min", "foldType": "Horn Elongation Crimp", "instruction": "Narrow front flaps with rabbit-ear folds; curve upper thoracic horn downward and lower head horn upward.", "tip": "Twin horns oppose each other like giant pincer jaws.", "diagramType": "beetle-horns" },
            { "stepNumber": 4, "title": "Six Jointed Leg Articulations", "time": "8-10 min", "foldType": "Crimp Joint Folds", "instruction": "Crimp each of the 6 legs with coxa, femur, and tibia joints, angling claws outward.", "tip": "Use precision tweezers to bend tiny foot claws.", "diagramType": "beetle-legs" },
            { "stepNumber": 5, "title": "Elytra Shell Dome & Final Polish", "time": "5-7 min", "foldType": "Carapace Sculpting", "instruction": "Curve rear elytra shell over abdomen. Wet-fold leg joints with tiny drop of water to set pose permanently.", "tip": "An awe-inspiring demonstration of mathematical computational origami.", "diagramType": "beetle-final" }
        ]
    },
    "american-05": {
        "id": "american-05",
        "kitNumber": 5,
        "title": "Fourth of July Pyrotechnic Starburst",
        "subtitle": "Modular explosive rosette • Red, white & blue facets • Independence Day star",
        "description": "An explosive multi-faceted dimensional starburst celebrating Independence Day. Modular interlocking points that create a vibrant 3D fireworks display.",
        "difficulty": "Intermediate",
        "time": "25-30 min",
        "category": "american",
        "collection": "american",
        "collectionTitle": "American Modern Origami",
        "accent": "#dc2626",
        "goal": "An 8-pointed dimensional fireworks rosette with interlocking patriotic facets",
        "paper": [
            { "color": "Patriotic Red", "size": "4\" x 4\"", "qty": 4, "gsm": "70 gsm" },
            { "color": "Navy Blue", "size": "4\" x 4\"", "qty": 4, "gsm": "70 gsm" },
            { "color": "Pure White", "size": "4\" x 4\"", "qty": 4, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Modular tab-and-pocket ring lock", "Diamond facet pop-out", "Rotational fireworks burst"],
        "steps": [
            { "stepNumber": 1, "title": "Pyrotechnic Star Unit Folding", "time": "6-8 min", "foldType": "Modular Unit", "instruction": "Fold 4\" square diagonally, fold side edges to center, then valley fold in half to create pointed burst module with connector tabs.", "tip": "Fold 8 identical units: 4 red, 4 blue.", "diagramType": "starburst-mod" },
            { "stepNumber": 2, "title": "White Core Highlight Inserts", "time": "5-6 min", "foldType": "Accent Insert", "instruction": "Fold 4 small white diamond units that will nest inside the outer star points to create burst rays.", "tip": "White rays add high-contrast pyrotechnic brilliance.", "diagramType": "starburst-core" },
            { "stepNumber": 3, "title": "Circular Interlock Ring Assembly", "time": "6-8 min", "foldType": "Ring Lock", "instruction": "Slide tab of Module 1 into pocket of Module 2, alternating red and blue units in a closed 8-point circular star.", "tip": "Friction between tabs locks the star securely without glue.", "diagramType": "starburst-ring" },
            { "stepNumber": 4, "title": "Dimensional Ray Inversion", "time": "4-5 min", "foldType": "Facet Pop", "instruction": "Push center underside upward until starburst points pop outward into an explosive 3D dome.", "tip": "Listen for the paper tension click as the facets lock.", "diagramType": "starburst-pop" },
            { "stepNumber": 5, "title": "Wall Hanging Anchor Loop", "time": "4-5 min", "foldType": "Hanger Tab", "instruction": "Tuck small rear loop between seam layers for wall hanging or holiday window display.", "tip": "A festive celebration of American holiday spirit.", "diagramType": "starburst-final" }
        ]
    },
    "american-06": {
        "id": "american-06",
        "kitNumber": 6,
        "title": "Golden Gate Architectural Span",
        "subtitle": "Modular suspension bridge towers • Catenary cable swags • Modern civil engineering",
        "description": "Tribute to American civil engineering and San Francisco's world-famous Golden Gate Bridge. Features two Art Deco suspension towers and sweeping catenary cable folds.",
        "difficulty": "Advanced",
        "time": "35-45 min",
        "category": "american",
        "collection": "american",
        "collectionTitle": "American Modern Origami",
        "accent": "#ea580c",
        "goal": "A freestanding architectural model of the Golden Gate suspension tower and road deck",
        "paper": [
            { "color": "International Orange Cardstock", "size": "8\" x 8\"", "qty": 2, "gsm": "120 gsm" },
            { "color": "Charcoal Grey (Road Deck)", "size": "3\" x 12\"", "qty": 1, "gsm": "100 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Precision Tweezers"],
        "principles": ["Art Deco stepped tower box pleats", "Catenary curve suspension cables", "Structural bridge truss rigidity"],
        "steps": [
            { "stepNumber": 1, "title": "Art Deco Tower Column Scoring", "time": "8-10 min", "foldType": "Column Box Pleat", "instruction": "Score vertical double columns with stepped horizontal cross-struts across 8\" International Orange card.", "tip": "Stepped cross-struts capture the iconic Art Deco tower portals.", "diagramType": "tower-score" },
            { "stepNumber": 2, "title": "Tower 3D Box Compression", "time": "8-10 min", "foldType": "Pillar Box Fold", "instruction": "Fold column edges 90 degrees back into rigid hollow rectangular pillars that stand vertical unsupported.", "tip": "Verify pillars stand perpendicular to table surface.", "diagramType": "tower-3d" },
            { "stepNumber": 3, "title": "Catenary Cable Swags", "time": "6-8 min", "foldType": "Curved Valley Pleat", "instruction": "Fold twin curved cables in orange strip, draping from tower summit to road deck anchor points.", "tip": "A parabolic curve accurately mirrors real suspension physics.", "diagramType": "cable-swags" },
            { "stepNumber": 4, "title": "Suspended Road Deck Truss", "time": "6-8 min", "foldType": "Truss Box Deck", "instruction": "Fold 3\"x12\" charcoal grey card into rigid U-channel road deck with side safety barriers.", "tip": "U-channel profile gives the bridge deck high resistance to sagging.", "diagramType": "road-deck" },
            { "stepNumber": 5, "title": "Bridge Synthesis & Pier Anchor", "time": "7-9 min", "foldType": "Tower-Deck Interlock", "instruction": "Slot road deck through portal arches of both suspension towers; lock cable ends into deck anchors.", "tip": "An iconic symbol of American architectural ambition.", "diagramType": "goldengate-final" }
        ]
    }
}
kits.update(american_kits)

# 9. WORLD FESTIVALS & CELEBRATIONS (5 Kits)
festival_kits = {
    "festival-01": {
        "id": "festival-01",
        "kitNumber": 1,
        "title": "Halloween Jack-o'-Lantern",
        "subtitle": "3D ribbed pumpkin volume • Color-change grin & eyes • Twisted green vine stem",
        "description": "Essential Halloween centerpiece. A plump 3D box-pleated pumpkin with an origami color-change face that reveals a menacing black or yellow carved grin without cuts.",
        "difficulty": "Intermediate-Advanced",
        "time": "25-32 min",
        "category": "holiday",
        "collection": "holiday",
        "collectionTitle": "World Festival Traditions",
        "accent": "#f97316",
        "goal": "A rounded, ribbed orange pumpkin with folded jack-o'-lantern face and twisted green stem",
        "paper": [
            { "color": "Pumpkin Orange / Black Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "70 gsm" },
            { "color": "Forest Green (Stem)", "size": "2\" x 2\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Pumpkin rib box pleating", "Color-change carved facial features", "Top crown stem lock"],
        "steps": [
            { "stepNumber": 1, "title": "Pumpkin Rib Pre-Creasing", "time": "5-6 min", "foldType": "Rib Grid Scoring", "instruction": "Take 7\" orange/black duo paper. Crease 8 radial mountain ribs curving from top crown to base.", "tip": "Curved creases give the pumpkin its plump organic girth.", "diagramType": "pumpkin-ribs" },
            { "stepNumber": 2, "title": "Color-Change Facial Feature Folds", "time": "7-9 min", "foldType": "Color-Change Pleats", "instruction": "Invert triangular pleats on front face to reveal black backing for triangle eyes, nose, and jagged toothy grin.", "tip": "Pinch each tooth cleanly to maintain sharp grin geometry.", "diagramType": "pumpkin-face" },
            { "stepNumber": 3, "title": "Barrel Body Compression", "time": "5-7 min", "foldType": "Circumference Seam Lock", "instruction": "Bring side edges together and tuck locking flaps to form closed hollow barrel.", "tip": "Tuck base flaps inside to close bottom opening securely.", "diagramType": "pumpkin-barrel" },
            { "stepNumber": 4, "title": "Twisted Green Vine Stem", "time": "4-5 min", "foldType": "Spiral Vine Twist", "instruction": "Roll 2\" green square into tight tapered cone, then twist with tweezers into a curled pumpkin vine stem.", "tip": "A whimsical curly stem brings the pumpkin to life.", "diagramType": "pumpkin-stem" },
            { "stepNumber": 5, "title": "Crown Lock & Display Staging", "time": "4-5 min", "foldType": "Crown Socket Insertion", "instruction": "Insert green stem into top crown socket. Slightly depress top and bottom to create squat pumpkin silhouette.", "tip": "Place an LED tea-light inside for spooky nighttime glow!", "diagramType": "pumpkin-final" }
        ]
    },
    "festival-02": {
        "id": "festival-02",
        "kitNumber": 2,
        "title": "Halloween Vampire Bat",
        "subtitle": "Scalloped membrane wings • 3D perched ears • Interlocking claw hooks",
        "description": "Creature of the autumn night. Features wide scalloped wings with folded finger struts, pointed ears, and claws that allow it to hang upside-down from string.",
        "difficulty": "Beginner-Intermediate",
        "time": "15-20 min",
        "category": "holiday",
        "collection": "holiday",
        "collectionTitle": "World Festival Traditions",
        "accent": "#64748b",
        "goal": "A hanging 3D vampire bat with wide scalloped wings and upside-down hanging hooks",
        "paper": [
            { "color": "Midnight Black Kraft / Slate", "size": "6\" x 6\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Wing strut accordion pleats", "Hanging talon hook folds", "Sculpted triangular ears"],
        "steps": [
            { "stepNumber": 1, "title": "Diagonal Triangle & Head Crimp", "time": "3-4 min", "foldType": "Triangle Base", "instruction": "Fold 6\" black square diagonally, fold top point downward and crimp forward into pointed bat head.", "tip": "Crimp point slightly past bottom edge to define snout.", "diagramType": "bat-head" },
            { "stepNumber": 2, "title": "Pointed Ear Reverse Folds", "time": "3-4 min", "foldType": "Ear Reverse Folds", "instruction": "Inside reverse fold twin lateral head flaps upward into tall triangular vampire ears.", "tip": "Pointed ears add instant gothic personality.", "diagramType": "bat-ears" },
            { "stepNumber": 3, "title": "Wing Strut Accordion Pleats", "time": "4-5 min", "foldType": "Wing Bone Pleats", "instruction": "Accordion pleat both wide wings in 3 stepped folds simulating the elongated finger bones of bat anatomy.", "tip": "Crisp pleats allow wings to flex open and closed.", "diagramType": "bat-wings" },
            { "stepNumber": 4, "title": "Scalloped Wing Trailing Edge", "time": "3-4 min", "foldType": "Valley Scallops", "instruction": "Make 3 small valley crimps along bottom wing edge to create scalloped flying membrane.", "tip": "Curved scallops give authentic bat wing silhouette.", "diagramType": "bat-scallops" },
            { "stepNumber": 5, "title": "Hanging Foot Claws", "time": "2-3 min", "foldType": "Hook Reverse Folds", "instruction": "Fold bottom tail apex into twin curved hooks that allow the bat to hang upside down from cords.", "tip": "Suspend a swarm of bats across a Halloween doorway!", "diagramType": "bat-final" }
        ]
    },
    "festival-03": {
        "id": "festival-03",
        "kitNumber": 3,
        "title": "Hanami Chochin — Cherry Blossom Festival Lantern",
        "subtitle": "Concentric cylindrical paper ribs • Hanami spring pink • Bamboo rim cuff",
        "description": "The festive paper lantern hung along riverbanks in Japan during cherry blossom season (Hanami). Casts warm, romantic ambient light among blooming sakura branches.",
        "difficulty": "Intermediate",
        "time": "18-24 min",
        "category": "holiday",
        "collection": "holiday",
        "collectionTitle": "World Festival Traditions",
        "accent": "#ec4899",
        "goal": "A glowing cylindrical paper lantern with pleated ribs and bamboo hanger cuff",
        "paper": [
            { "color": "Cherry Blossom Translucent Pink", "size": "6\" x 9\"", "qty": 1, "gsm": "50 gsm" },
            { "color": "Bamboo Black Kraft (Rims)", "size": "1\" x 9\"", "qty": 2, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler"],
        "principles": ["Horizontal accordion rib expansion", "Translucent paper light transmission", "Bamboo rim structural hoops"],
        "steps": [
            { "stepNumber": 1, "title": "Horizontal Lantern Accordion Ribs", "time": "4-5 min", "foldType": "Accordion Pleat", "instruction": "Fold 6\"x9\" pink sheet into 12 horizontal accordion pleats spaced at 0.5\" intervals.", "tip": "Sharp folds ensure lantern compresses and expands like an accordion.", "diagramType": "chochin-pleats" },
            { "stepNumber": 2, "title": "Diagonal Diamond Swells", "time": "4-5 min", "foldType": "Facet Pop", "instruction": "Crease diamond mountain lines along ribs to allow cylindrical barrel to swell outward.", "tip": "Lightly pinch each diamond point.", "diagramType": "chochin-diamonds" },
            { "stepNumber": 3, "title": "Cylinder Closure & Bamboo Rims", "time": "4-5 min", "foldType": "Seam Interlock", "instruction": "Roll sheet into cylinder and overlap ends. Wrap black kraft hoops around top and bottom rims.", "tip": "Black hoops provide dramatic contrast against soft pink paper.", "diagramType": "chochin-cylinder" },
            { "stepNumber": 4, "title": "Expansion & Form Truing", "time": "3-4 min", "foldType": "Barrel Expansion", "instruction": "Expand ribs to create a round, gently swelling barrel lantern.", "tip": "Ensure cylinder remains plumb and level.", "diagramType": "chochin-expand" },
            { "stepNumber": 5, "title": "Branch Hanger Wire Loop", "time": "3-4 min", "foldType": "Wire Hanger Tab", "instruction": "Fold small top hanger arch to suspend lantern from sakura branch display.", "tip": "Pair with Kit japanese-03 (Sakura Blossom) for a complete Hanami festival setting.", "diagramType": "chochin-final" }
        ]
    },
    "festival-04": {
        "id": "festival-04",
        "kitNumber": 4,
        "title": "Día de los Muertos Calavera",
        "subtitle": "Sacred Mexican sugar skull • Deep hollow eye sockets • Marigold flower crown",
        "description": "Celebration of love and memory for Mexico's Day of the Dead. A sculptural sugar skull with deep faceted eye sockets, toothy grin, and a crown of folded orange marigolds.",
        "difficulty": "Advanced",
        "time": "32-40 min",
        "category": "holiday",
        "collection": "holiday",
        "collectionTitle": "World Festival Traditions",
        "accent": "#a855f7",
        "goal": "A striking 3D calavera sugar skull with faceted sunken eye sockets and floral crown",
        "paper": [
            { "color": "Pure White / Pastel Lilac Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "70 gsm" },
            { "color": "Marigold Orange & Magenta Scraps (Flowers)", "size": "2\" x 2\"", "qty": 3, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Recessed socket box folds", "Skeletal cranium dome", "Festive Mexican folk art floral adornment"],
        "steps": [
            { "stepNumber": 1, "title": "Cranium & Jaw Hexagonal Layout", "time": "6-8 min", "foldType": "Hexagonal Skull Base", "instruction": "Take 7\" white duo paper. Crease hexagonal cranium outline with lower tapered jaw zone.", "tip": "Keep cranium wide and jaw narrow for proportional human skull shape.", "diagramType": "skull-grid" },
            { "stepNumber": 2, "title": "Recessed Eye Socket Squash Folds", "time": "8-10 min", "foldType": "Inside Recessed Sockets", "instruction": "Execute twin square squash folds on mid-face, inverting paper inward to form deep dark hollow eye sockets.", "tip": "Lilac underlayer peeks through, creating shadowed socket depth.", "diagramType": "skull-eyes" },
            { "stepNumber": 3, "title": "Teeth Pleat Matrix & Cheekbones", "time": "6-8 min", "foldType": "Accordion Grin Pleats", "instruction": "Fold small vertical accordion pleats along jaw to form smiling teeth. Pinch sharp cheekbone ridges.", "tip": "Día de los Muertos calaveras always smile warmly in celebration of life.", "diagramType": "skull-teeth" },
            { "stepNumber": 4, "title": "Cranium 3D Dome Inflation", "time": "6-7 min", "foldType": "Cranium Rounding", "instruction": "Tuck rear corner flaps inward to give cranium rounded volumetric depth that stands freestanding.", "tip": "Check that base of jaw rests firmly on table.", "diagramType": "skull-dome" },
            { "stepNumber": 5, "title": "Marigold Flower Crown Mount", "time": "6-7 min", "foldType": "Floral Crown Attachment", "instruction": "Fold 3 miniature marigold rosettes in orange and magenta; attach across brow of skull.", "tip": "A heartfelt, museum-worthy Mexican folk art sculpture.", "diagramType": "calavera-final" }
        ]
    },
    "festival-05": {
        "id": "festival-05",
        "kitNumber": 5,
        "title": "Lunar New Year Hongbao Envelope",
        "subtitle": "Traditional auspicious red packet • Interlocking gold foil seal • Spring blessings",
        "description": "The lucky red envelope gifted during Lunar New Year and weddings to bestow blessings and prosperity. Features an interlocking origami pocket and a folded golden seal.",
        "difficulty": "Beginner",
        "time": "12-16 min",
        "category": "holiday",
        "collection": "holiday",
        "collectionTitle": "World Festival Traditions",
        "accent": "#dc2626",
        "goal": "A traditional festive red envelope with functional money pocket and interlocking seal",
        "paper": [
            { "color": "Imperial Red / Gold Foil Duo", "size": "6\" x 6\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder"],
        "principles": ["Functional envelope pocket geometry", "Interlocking flap lock without glue", "Auspicious red-and-gold color symbolism"],
        "steps": [
            { "stepNumber": 1, "title": "Diamond Flap Pre-Creases", "time": "2-3 min", "foldType": "Diagonal Creases", "instruction": "Place 6\" red/gold paper diamond orientation, red side down. Fold top and bottom points to center line.", "tip": "Ensure creases are razor-sharp with bone folder.", "diagramType": "hongbao-crease" },
            { "stepNumber": 2, "title": "Side Flap Overlap", "time": "3-4 min", "foldType": "Valley Fold Overlap", "instruction": "Fold left and right corners inward by 1.75\", overlapping slightly along the vertical center axis.", "tip": "Overlap width determines envelope width.", "diagramType": "hongbao-sides" },
            { "stepNumber": 3, "title": "Bottom Pocket Lock", "time": "3-4 min", "foldType": "Upward Pocket Fold", "instruction": "Fold bottom point upward and tuck flap into side seams, creating a secure, sealed money pocket.", "tip": "Double-check pocket is deep enough to hold currency notes.", "diagramType": "hongbao-pocket" },
            { "stepNumber": 4, "title": "Top Flap Gold Border Reveal", "time": "2-3 min", "foldType": "Cuff Reveal", "instruction": "Fold top flap downward; fold tiny 2mm cuff to reveal shimmering gold foil along triangular envelope flap.", "tip": "Gold border frames the red packet with royal distinction.", "diagramType": "hongbao-cuff" },
            { "stepNumber": 5, "title": "Interlocking Tongue Lock", "time": "2-3 min", "foldType": "Tongue Insertion", "instruction": "Slide tip of top flap into bottom horizontal slit to close envelope without any adhesive.", "tip": "Gift to family and friends with new banknotes for auspicious Lunar New Year blessings!", "diagramType": "hongbao-final" }
        ]
    }
}
kits.update(festival_kits)

# Save back to JSON
with open("origami-hyperframes/web/studio/kit-data.json", "w", encoding="utf-8") as f:
    json.dump(kits, f, indent=2, ensure_ascii=False)

# Save back to JS files
js_content = "window.ORIGAMI_KITS = " + json.dumps(kits, indent=2, ensure_ascii=False) + ";\n"
with open("origami-hyperframes/web/studio/kit-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)
with open("origami-hyperframes/web/js/kit-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"COMPLETE! Global ORIGAMISTUDIO now has {len(kits)} Master Kits across all world traditions!")
