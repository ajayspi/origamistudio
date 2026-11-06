# -*- coding: utf-8 -*-
import json

with open("origami-hyperframes/web/studio/kit-data.json", "r", encoding="utf-8") as f:
    kits = json.load(f)

indian_kits = {
    "indian-01": {
        "id": "indian-01",
        "kitNumber": 1,
        "title": "Mayura — Imperial Indian Peacock",
        "subtitle": "Radiant 18-pleat fan tail • Articulated 3D neck • Eyelet chandrika folds",
        "description": "National bird of India and symbol of royal grace. Sculpted 3D turquoise body with arched neck, crowned crest (kalgi), and an expansive radiating tail with concentric eyelets.",
        "difficulty": "Advanced",
        "time": "35-42 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#0284c7",
        "goal": "A majestic freestanding 3D peacock displaying an arched 18-pleat radiant tail fan",
        "paper": [
            { "color": "Peacock Blue / Emerald Green Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Mirror Gold Foil / Royal Blue (Tail)", "size": "6\" x 6\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers", "Shaping Pin"],
        "principles": ["Tripod stability using tail fan", "Concentric chandrika eyelet squash", "Sinuous S-curve neck posture"],
        "steps": [
            { "stepNumber": 1, "title": "Diagonal Elongated Bird Base", "time": "6-8 min", "foldType": "Bird Base Variant", "instruction": "Take 7\" peacock blue duo square. Fold preliminary base, then petal-fold front and back flaps into an elongated bird base.", "tip": "Keep creases razor-sharp along dorsal spine for slender body alignment.", "diagramType": "bird-base" },
            { "stepNumber": 2, "title": "Articulated S-Curve Neck & Head", "time": "6-8 min", "foldType": "Double Reverse Fold", "instruction": "Make first inside reverse fold upward at 60 degrees, followed by a forward reverse fold at head height to create the proud arched neck.", "tip": "Curve neck softly with thumb pressure to avoid stiff angles.", "diagramType": "neck-arc" },
            { "stepNumber": 3, "title": "Kalgi (Head Crest) Plumes", "time": "4-5 min", "foldType": "Split Reverse Fold", "instruction": "Micro-split the crown apex into 3 delicate feather plumes. Curl plume tips slightly forward with shaping pin.", "tip": "In Indian classical art, the Kalgi represents divine royalty.", "diagramType": "kalgi" },
            { "stepNumber": 4, "title": "Radiating Fan Tail Pleating", "time": "8-10 min", "foldType": "Accordion Fan Pleat", "instruction": "From 6\" gold/blue sheet, accordion-pleat into 18 radiating ribs fanning from bottom stem to outer perimeter.", "tip": "Uniform pleat spacing is vital for symmetric fan expansion.", "diagramType": "tail-pleats" },
            { "stepNumber": 5, "title": "Chandrika Eyelet Inversions", "time": "6-8 min", "foldType": "Squash Eyelet Fold", "instruction": "Squash fold each pleat tip into an almond-shaped eyelet, revealing the gold foil core surrounded by blue iridescence.", "tip": "Use tweezers to spread each eyelet symmetrically.", "diagramType": "eyelets" },
            { "stepNumber": 6, "title": "Tail Arch & Tripod Stance", "time": "5-6 min", "foldType": "Structural Lock", "instruction": "Slot tail fan into lower dorsal pocket of peacock body. Flare bottom tail rim so peacock stands balanced on legs and tail tip.", "tip": "A self-standing tripod design eliminates any need for external display stands.", "diagramType": "mayura-final" }
        ]
    },
    "indian-02": {
        "id": "indian-02",
        "kitNumber": 2,
        "title": "Gajendra — Royal Elephant of Mysore",
        "subtitle": "Volumetric hollow body • Raised blessing trunk • Embroidered howdah saddle",
        "description": "Inspired by the magnificent Mysore Dasara procession. A sturdy volumetric elephant with columnar legs, tusks, and a raised trunk in abhyamudra blessing.",
        "difficulty": "Advanced",
        "time": "35-45 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#475569",
        "goal": "A heavy, freestanding 3D elephant with volumetric rounded flanks and ornate howdah saddle",
        "paper": [
            { "color": "Slate Charcoal Kraft", "size": "7.5\" x 7.5\"", "qty": 1, "gsm": "90 gsm" },
            { "color": "Saffron Yellow / Gold Foil (Howdah)", "size": "3.5\" x 3.5\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "White Kraft (Tusks)", "size": "1\" x 2\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Precision Tweezers"],
        "principles": ["Slitless 4-leg separation", "Volumetric hollow flank inflation", "Abhyamudra blessing gesture"],
        "steps": [
            { "stepNumber": 1, "title": "Blintz Box Foundation", "time": "6-8 min", "foldType": "Blintz Grid Fold", "instruction": "Start with 7.5\" charcoal kraft. Fold all 4 corners to center, flip and crease 4x4 grid to build multi-layer leg thickness.", "tip": "Heavy kraft paper ensures legs do not bow under body weight.", "diagramType": "blintz-box" },
            { "stepNumber": 2, "title": "Four-Leg Separation", "time": "8-10 min", "foldType": "Inside Squash Separation", "instruction": "Pull 4 outer corner flaps downward into columnar legs, collapsing central diamond into underbelly support.", "tip": "Check that all 4 leg lengths are identical to prevent limping wobble.", "diagramType": "legs-split" },
            { "stepNumber": 3, "title": "Trunk Abhyamudra Blessing Curl", "time": "5-6 min", "foldType": "Accordion Trunk Pleats", "instruction": "Crimp trunk flap forward and accordion-pleat upward into a proud curled salute.", "tip": "In Indian tradition, a raised elephant trunk brings auspicious fortune and prosperity.", "diagramType": "trunk-curl" },
            { "stepNumber": 4, "title": "Flared Fan Ears & Folded Tusks", "time": "5-6 min", "foldType": "Ear Flare & Tusk Lock", "instruction": "Reverse fold wide temple ears outward. Tuck folded white tusk slips beneath cheeks flanking trunk.", "tip": "Curve ear margins slightly forward for realistic profile depth.", "diagramType": "ears-tusks" },
            { "stepNumber": 5, "title": "Royal Howdah (Ambari) Saddle", "time": "6-8 min", "foldType": "Howdah Box Fold", "instruction": "Fold saffron/gold foil sheet into ornate draped saddle cloth with stepped golden howdah canopy.", "tip": "Drape saddle flaps evenly over elephant's back flanks.", "diagramType": "howdah-fold" },
            { "stepNumber": 6, "title": "Flank Inflation & Planar Truing", "time": "4-5 min", "foldType": "Volume Inflation", "instruction": "Gently inflate hollow body cavity from underside. Position on flat surface, pressing back until all 4 feet plant firmly.", "tip": "The finished model has an imposing architectural presence.", "diagramType": "elephant-final" }
        ]
    },
    "indian-03": {
        "id": "indian-03",
        "kitNumber": 3,
        "title": "Royal Bengal Tiger",
        "subtitle": "Color-change stripe geometry • Sculpted shoulder muscles • Prowling stance",
        "description": "India's apex sovereign predator. Masterclass in color-change folding: amber ochre paper reveals alternating black backing stripes along spine without cuts.",
        "difficulty": "Advanced",
        "time": "38-46 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#ea580c",
        "goal": "A three-dimensional crouching tiger with realistic natural stripe patterns and muscular shoulders",
        "paper": [
            { "color": "Amber Ochre / Jet Black Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Slitless color-change stripe pleats", "Shoulder muscle squash volume", "Predatory kinetic crouch"],
        "steps": [
            { "stepNumber": 1, "title": "Elongated Diagonal Kite Base", "time": "6-8 min", "foldType": "Kite Base Variant", "instruction": "Take 7\" amber/black duo, amber side up. Crease diagonal valley, fold side corners to center line to form sharp kite base.", "tip": "Sharp creases along diagonal prevent paper shifting during stripe folds.", "diagramType": "kite-spine" },
            { "stepNumber": 2, "title": "Color-Change Stripe Pleating", "time": "10-12 min", "foldType": "Z-Pleat Color Change", "instruction": "Fold 6 alternating Z-pleats across dorsal flank, flipping black backing layer forward to form authentic tiger stripes.", "tip": "Taper stripe widths: narrower near neck, wider across ribs.", "diagramType": "stripe-pleats" },
            { "stepNumber": 3, "title": "Prowling Shoulder Musculature", "time": "6-8 min", "foldType": "Shoulder Squash", "instruction": "Squash fold front leg joints to create elevated, bunched shoulder blades characteristic of a stalking big cat.", "tip": "Angle shoulders slightly forward to imply imminent spring.", "diagramType": "tiger-shoulders" },
            { "stepNumber": 4, "title": "Feline Muzzle & Rounded Ears", "time": "6-8 min", "foldType": "Box Muzzle Crimp", "instruction": "Crimp snout into broad squared jaw. Inside reverse fold ear points and cup forward into rounded tiger ears.", "tip": "Pinch chin slightly to reveal white underlayer on jaw.", "diagramType": "tiger-head" },
            { "stepNumber": 5, "title": "Arched Hindquarters & S-Tail", "time": "5-6 min", "foldType": "Tail Curve & Crouch", "instruction": "Crimp rear legs into low crouching tension. Mold tail into an expressive S-curve with tip curled upward.", "tip": "An elevated tail tip signals alert territorial stance.", "diagramType": "tiger-tail" },
            { "stepNumber": 6, "title": "Dynamic Stance Truing", "time": "4-5 min", "foldType": "Prowling Balance", "instruction": "Adjust paw angles so all 4 paws grip surface. Check profile: tiger should appear coiled to leap.", "tip": "The color-change stripes look astonishing under directional lighting.", "diagramType": "tiger-final" }
        ]
    },
    "indian-04": {
        "id": "indian-04",
        "kitNumber": 4,
        "title": "Genda Phool — Sacred Marigold Garland",
        "subtitle": "Dense multi-petaled rosette • Saffron & orange hues • Festival toran assembly",
        "description": "The quintessential Indian festival flower, celebrated in weddings, Diwali, and temple pujas. Ruffled spherical blooms that assemble into decorative door garlands.",
        "difficulty": "Intermediate",
        "time": "25-30 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#f59e0b",
        "goal": "Six ruffled marigold blooms (3 saffron, 3 orange) strung into an auspicious festival toran",
        "paper": [
            { "color": "Bright Saffron Yellow", "size": "4\" x 4\"", "qty": 3, "gsm": "70 gsm" },
            { "color": "Deep Marigold Orange", "size": "4\" x 4\"", "qty": 3, "gsm": "70 gsm" },
            { "color": "Emerald Green (Leaves & Stem)", "size": "1\" x 18\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Round Shaping Needle / Pencil"],
        "principles": ["Radial rosette compression", "Two-tone petal layering", "Modular festival garland stringing"],
        "steps": [
            { "stepNumber": 1, "title": "16-Ray Radial Pre-Creasing", "time": "5-6 min", "foldType": "Radial Ray Fold", "instruction": "Take 4\" saffron square. Fold horizontal, vertical, both diagonals, and subdivide each quadrant into 16 ray lines.", "tip": "Crisp creases allow the flower to collapse effortlessly.", "diagramType": "marigold-rays" },
            { "stepNumber": 2, "title": "Ruffled Petal Tier Inversions", "time": "6-8 min", "foldType": "Accordion Inversion", "instruction": "Invert outer tips towards center, pinching alternating mountain ridges into dense ruffled petal clusters.", "tip": "Pinch tightly near base to give the bloom spherical fullness.", "diagramType": "marigold-ruffle" },
            { "stepNumber": 3, "title": "Concentric Color Nesting", "time": "5-6 min", "foldType": "Bloom Core Nest", "instruction": "Fold smaller orange center core; twist clockwise into saffron petal cup to create dual-tone depth.", "tip": "The darker center captures the botanical realism of Tagetes marigolds.", "diagramType": "core-nest" },
            { "stepNumber": 4, "title": "Leaf Calyx Attachment", "time": "4-5 min", "foldType": "Green Calyx Tuck", "instruction": "Fold small 4-point green calyx slip and attach to blossom underside, hiding fold seams.", "tip": "Calyx tabs also act as anchor sockets for garland stringing.", "diagramType": "leaf-calyx" },
            { "stepNumber": 5, "title": "Batch Production of 6 Blooms", "time": "6-8 min", "foldType": "Batch Assembly", "instruction": "Repeat sequence to complete 3 saffron yellow and 3 deep orange blossoms.", "tip": "Stack completed blooms in a bowl to admire their festive beauty.", "diagramType": "batch-blooms" },
            { "stepNumber": 6, "title": "Toran Garland Stringing", "time": "4-5 min", "foldType": "Garland Interlock", "instruction": "Thread completed marigolds onto green folded paper vine in alternating orange/yellow pattern.", "tip": "Hang above doorways as a traditional Indian welcoming talisman.", "diagramType": "toran-final" }
        ]
    },
    "indian-05": {
        "id": "indian-05",
        "kitNumber": 5,
        "title": "Deepavali Diya — Faceted Flame & Terracotta Lamp",
        "subtitle": "Cupped clay oil well • Radiant 3D teardrop flame • Auspicious Diwali light",
        "description": "Symbol of light over darkness and knowledge over ignorance. A traditional faceted clay lamp paired with a dimensional gold and ruby foil flame.",
        "difficulty": "Beginner-Intermediate",
        "time": "18-24 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#b45309",
        "goal": "A freestanding faceted terracotta lamp with an illuminated 3D flickering gold flame",
        "paper": [
            { "color": "Terracotta Brown / Clay Kraft", "size": "5\" x 5\"", "qty": 1, "gsm": "90 gsm" },
            { "color": "Mirror Gold / Ruby Red Foil Duo", "size": "3\" x 3\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Cupped polygonal oil well", "Teardrop volumetric flame inflation", "Symbol of auspicious illumination"],
        "steps": [
            { "stepNumber": 1, "title": "Hexagonal Diya Bowl", "time": "4-5 min", "foldType": "Polygonal Box Fold", "instruction": "Take 5\" terracotta square. Crease hexagonal boundary and fold walls upward into a stable cupped bowl.", "tip": "Flatten bottom hexagon so lamp rests with zero wobble.", "diagramType": "diya-bowl" },
            { "stepNumber": 2, "title": "Fluted Rim & Spout Crimp", "time": "4-5 min", "foldType": "Spout Crimp", "instruction": "Pinch front vertex into a narrow tapered wick spout. Gently flare outer rim edges outward.", "tip": "The pinched spout is where the cotton wick traditionally rests.", "diagramType": "diya-spout" },
            { "stepNumber": 3, "title": "3D Radiant Foil Flame", "time": "4-5 min", "foldType": "Waterbomb Teardrop", "instruction": "From 3\" gold/ruby foil, collapse into slender waterbomb and taper top point into a flickering teardrop.", "tip": "Ruby interior peeks out from center, mimicking hot embers.", "diagramType": "flame-fold" },
            { "stepNumber": 4, "title": "Flame Volume Inflation", "time": "3-4 min", "foldType": "Flame Puffing", "instruction": "Gently puff side facets outward to give flame three-dimensional flickering volume.", "tip": "Twist top tip slightly clockwise to mimic dancing fire in the breeze.", "diagramType": "flame-puff" },
            { "stepNumber": 5, "title": "Assembly & Sacred Display", "time": "3-4 min", "foldType": "Wick Slot Mounting", "instruction": "Slot base tab of gold flame into spout groove of terracotta diya. Align upright.", "tip": "Viewed in dim room under candlelight, the gold foil reflects genuine flame glow.", "diagramType": "diya-final" }
        ]
    },
    "indian-06": {
        "id": "indian-06",
        "kitNumber": 6,
        "title": "Kathakali Royal Crown (Kireetam)",
        "subtitle": "Architectural tiered crown • Kundalam ear discs • Prabhavali sun halo",
        "description": "The regal headdress of Kerala's classical Kathakali dance theatre. Features a stepped conical crown spire, circular sun halo (prabhavali), and ornate ear ornaments.",
        "difficulty": "Advanced",
        "time": "32-40 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#eab308",
        "goal": "A striking architectural royal headdress with radiating sun halo and jewel-faceted ear discs",
        "paper": [
            { "color": "Rich Gold Foil / Brass", "size": "6\" x 6\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Emerald Green / Gold Duo (Halo)", "size": "5\" x 5\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Ruby Red (Gems Accent)", "size": "2\" x 2\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Precision Tweezers"],
        "principles": ["Stepped conical crown architecture", "Radiating circular prabhavali halo", "Theatrical Kathakali grandeur"],
        "steps": [
            { "stepNumber": 1, "title": "Stepped Crown Spire (Kireetam)", "time": "8-10 min", "foldType": "Stepped Cone Fold", "instruction": "Take 6\" gold foil. Fold into tall conical tower with 3 distinct stepped horizontal tiers.", "tip": "Sharp horizontal mountain creases define the architectural levels.", "diagramType": "crown-spire" },
            { "stepNumber": 2, "title": "Prabhavali (Sun Halo) Disc", "time": "8-10 min", "foldType": "Radial Accordion Circle", "instruction": "From 5\" emerald/gold paper, accordion-pleat into circular sunburst ring that forms the halo backdrop.", "tip": "Join terminal pleats to form closed radiating sunburst disk.", "diagramType": "halo-disc" },
            { "stepNumber": 3, "title": "Kundalam (Ear Disc) Modules", "time": "6-8 min", "foldType": "Circular Squash Fold", "instruction": "Fold twin miniature circular disks with center gem squash folds in ruby red foil.", "tip": "Kundalams represent divine hearing in Kathakali iconography.", "diagramType": "ear-discs" },
            { "stepNumber": 4, "title": "Ruby Gem Facet Insets", "time": "4-5 min", "foldType": "Facet Inset", "instruction": "Fold tiny ruby triangle jewels and tuck into recesses along the golden crown tiers.", "tip": "Red and green contrast against gold creates royal South Indian jewelry aesthetics.", "diagramType": "gem-insets" },
            { "stepNumber": 5, "title": "Crown & Halo Synthesis", "time": "6-7 min", "foldType": "Architectural Join", "instruction": "Interlock halo disc to rear socket of crown spire. Attach kundalams flanking the lower rim.", "tip": "The completed crown stands upright as an imposing sculptural art object.", "diagramType": "kireetam-final" }
        ]
    },
    "indian-07": {
        "id": "indian-07",
        "kitNumber": 7,
        "title": "Sacred Kamalam Temple Lotus",
        "subtitle": "16-petal concentric mandala • Padmaraga pink duo • Sacred urli water vessel float",
        "description": "The sacred lotus of Indian temple architecture and Lakshmi iconography. 16 layered cupped petals forming a perfect geometric mandala.",
        "difficulty": "Intermediate-Advanced",
        "time": "28-35 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#ec4899",
        "goal": "A flawless 16-petal sacred pink lotus designed to float upon brass urli water bowls",
        "paper": [
            { "color": "Padmaraga Pink / Rose Duo", "size": "6.5\" x 6.5\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Leaf Green (Calyx)", "size": "5\" x 5\"", "qty": 1, "gsm": "70 gsm" },
            { "color": "Gold Foil (Stamen Core)", "size": "2\" x 2\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Shaping Dowel / Pencil"],
        "principles": ["16-segment sacred mandala geometry", "Double-tier petal inversion", "Flotation buoyancy balance"],
        "steps": [
            { "stepNumber": 1, "title": "16-Segment Double Blintz", "time": "6-8 min", "foldType": "Double Blintz Base", "instruction": "Take 6.5\" pink duo. Fold all 4 corners to center, flip and repeat to establish 16 radial petal pockets.", "tip": "Keep center meeting points perfectly square without overlapping.", "diagramType": "kamalam-blintz" },
            { "stepNumber": 2, "title": "Tier 1 Sacred Petal Pull", "time": "7-9 min", "foldType": "Inside-Out Petal Inversion", "instruction": "Gently pull 8 outer petal points inside-out, forming the first upward-curving chalice layer.", "tip": "Support center hub with thumb while turning petals inside out.", "diagramType": "kamalam-tier1" },
            { "stepNumber": 3, "title": "Tier 2 Alternating Petals", "time": "6-8 min", "foldType": "Intermediate Petal Inversion", "instruction": "Invert remaining 8 internal petal points, staggering them halfway between Tier 1 petals to form full 16-petal bloom.", "tip": "Roll petal tips softly outward over pencil for botanical realism.", "diagramType": "kamalam-tier2" },
            { "stepNumber": 4, "title": "Floating Leaf Calyx", "time": "5-6 min", "foldType": "Buoyant Calyx Fold", "instruction": "Fold 5\" green square into wide 8-pointed star calyx and attach beneath pink flower cup.", "tip": "Down-turned leaf tips trap air pockets when set on water.", "diagramType": "kamalam-calyx" },
            { "stepNumber": 5, "title": "Gold Stamen Core & Blessing", "time": "4-5 min", "foldType": "Center Pollen Nest", "instruction": "Tuck gold micro-pleated stamen into center receptacle. Place inside display bowl or brass urli.", "tip": "The sacred Kamalam radiates serene peace and cosmic balance.", "diagramType": "kamalam-final" }
        ]
    },
    "indian-08": {
        "id": "indian-08",
        "kitNumber": 8,
        "title": "The Royal Durbar — Complete Heritage Assembly",
        "subtitle": "Rangoli courtyard plinth • Staged sovereign tableau • Ambient festival lighting",
        "description": "The crowning masterwork of the Indian Heritage Collection. Assembles the Peacock, Mysore Elephant, Bengal Tiger, and Marigold garlands upon a geometric Rangoli courtyard.",
        "difficulty": "Intermediate-Advanced",
        "time": "30-40 min",
        "category": "cultural",
        "collection": "indian",
        "collectionTitle": "Royal Indian Origami Heritage",
        "accent": "#9333ea",
        "goal": "A magnificent 3D Indian royal courtyard diorama with deep dimensional storytelling",
        "paper": [
            { "color": "Sandstone Kraft (Rangoli Base)", "size": "12\" x 12\"", "qty": 1, "gsm": "140 gsm" },
            { "color": "Pre-folded Units Callset (Kits 01-07)", "size": "Complete Set", "qty": 7, "gsm": "Various" }
        ],
        "tools": ["Ruler", "Soft Cloth", "Warm Spotlights"],
        "principles": ["Royal courtyard hierarchical staging", "Rangoli geometric grounding", "Chiaroscuro shadow interplay"],
        "steps": [
            { "stepNumber": 1, "title": "Rangoli Geometric Courtyard Base", "time": "6-8 min", "foldType": "Rangoli Matrix Fold", "instruction": "Take 12\" sandstone sheet. Crease concentric octagonal geometric lines representing royal palace courtyard tiles.", "tip": "Crisp mountain lines reflect ambient lighting across the floor.", "diagramType": "rangoli-base" },
            { "stepNumber": 2, "title": "Anchor: Gajendra the Royal Elephant", "time": "5-6 min", "foldType": "Epicenter Anchor", "instruction": "Position Gajendra (Kit 02) at the central rear throne position, facing forward in royal majesty.", "tip": "Elephant acts as the anchoring monumental pillar of the scene.", "diagramType": "stage-elephant" },
            { "stepNumber": 3, "title": "Right Sovereign: Mayura with Fan Tail", "time": "5-6 min", "foldType": "Right Flank Placement", "instruction": "Place Mayura (Kit 01) at right mid-ground, angling its radiant 18-pleat fan tail towards center.", "tip": "The turquoise and gold tail creates a brilliant backdrop frame.", "diagramType": "stage-peacock" },
            { "stepNumber": 4, "title": "Left Sovereign: Royal Bengal Tiger", "time": "5-6 min", "foldType": "Left Flank Placement", "instruction": "Position Bengal Tiger (Kit 03) crouching along left diagonal leading line, prowling toward courtyard center.", "tip": "Balances the serene peacock with kinetic predatory energy.", "diagramType": "stage-tiger" },
            { "stepNumber": 5, "title": "Marigold Garland Toran & Diyas", "time": "6-8 min", "foldType": "Atmospheric Framing", "instruction": "Drape Genda Phool Garland (Kit 04) across background. Place Deepavali Diyas (Kit 05) at front courtyard corners.", "tip": "Float Kamalam Lotus (Kit 07) in center foreground between diyas.", "diagramType": "stage-toran" },
            { "stepNumber": 6, "title": "Final Royal Durbar Illumination", "time": "3-4 min", "foldType": "Lighting Verification", "instruction": "Direct warm 3000K spotlight from 45-degree angle. Verify that gold foil accents gleam across the tableau.", "tip": "Congratulations! You have brought the Royal Indian Durbar to life in pure origami paper engineering.", "diagramType": "durbar-final" }
        ]
    }
}

kits.update(indian_kits)

# Save back to JSON
with open("origami-hyperframes/web/studio/kit-data.json", "w", encoding="utf-8") as f:
    json.dump(kits, f, indent=2, ensure_ascii=False)

# Save back to JS files
js_content = "window.ORIGAMI_KITS = " + json.dumps(kits, indent=2, ensure_ascii=False) + ";\n"
with open("origami-hyperframes/web/studio/kit-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)
with open("origami-hyperframes/web/js/kit-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Total kits now in ORIGAMISTUDIO: {len(kits)}! (All 5 master collections active)")
