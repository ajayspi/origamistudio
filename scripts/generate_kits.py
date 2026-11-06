# -*- coding: utf-8 -*-
import json
import os

kits = {}

# 1. NATIVITY (Read existing nativity kits from existing file to keep exact details intact, then enrich)
with open("origami-hyperframes/web/studio/kit-data.json", "r", encoding="utf-8") as f:
    existing = json.load(f)

for k_id, k_val in existing.items():
    k_val["collection"] = "nativity"
    k_val["collectionTitle"] = "3D Architectural Nativity"
    k_val["tools"] = ["Bone Folder", "Ruler", "Precision Tweezers"]
    kits[k_id] = k_val

# 2. LOTUS GARDEN COLLECTION (6 kits)
lotus_kits = {
    "lotus-01": {
        "id": "lotus-01",
        "kitNumber": 1,
        "title": "Lotus Base & Calyx",
        "subtitle": "Foundation waterbomb-blintz hybrid • 8-point calyx locking",
        "description": "The waterproof architectural foundation of the lotus bloom. Creates a sturdy, freestanding 8-leaf calyx with recessed interlocking sockets for petal tiers.",
        "difficulty": "Intermediate",
        "time": "20-25 min",
        "category": "nature",
        "collection": "lotus",
        "collectionTitle": "Lotus Garden Collection",
        "accent": "#10b981",
        "goal": "A freestanding, cupped green calyx with 8 flared sepal leaves and interlocking center socket",
        "paper": [
            { "color": "Forest Green / Jade", "size": "6\" x 6\"", "qty": 1, "gsm": "70 gsm" },
            { "color": "Olive Kraft (reinforcement)", "size": "4\" x 4\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Radial symmetry from blintz", "Locking sockets for tiers", "Curved sepals for buoyancy"],
        "steps": [
            {
                "stepNumber": 1,
                "title": "Quadruple Blintz Creasing",
                "time": "4-5 min",
                "foldType": "Blintz Fold",
                "instruction": "Take 6\" forest green square, white side up. Fold diagonally both ways, then fold all four corners precisely to center point. Flip and repeat corner fold.",
                "tip": "Align corner points exactly without overlapping to prevent center bunching.",
                "diagramType": "blintz"
            },
            {
                "stepNumber": 2,
                "title": "Waterbomb Collapse & Calyx Pockets",
                "time": "5-6 min",
                "foldType": "Waterbomb Collapse",
                "instruction": "Push in side midpoints while bringing top and bottom creases together, collapsing into an 8-pocket waterbomb star.",
                "tip": "Crease valley lines firmly so the star snaps effortlessly into shape.",
                "diagramType": "waterbomb"
            },
            {
                "stepNumber": 3,
                "title": "Calyx Sepal Leaf Extrusion",
                "time": "4-5 min",
                "foldType": "Inside Reverse Fold",
                "instruction": "Invert each of the 4 outer corner tips upward into pointed sepals. Spread petals evenly to form an 8-point radial perimeter.",
                "tip": "Keep sepal widths uniform for balanced flotation stability.",
                "diagramType": "sepals"
            },
            {
                "stepNumber": 4,
                "title": "Radial Tension Rim",
                "time": "4-5 min",
                "foldType": "Valley Fold Lock",
                "instruction": "Tuck side flaps into adjacent pockets to lock the calyx into a rigid hexagonal cup with self-tensioning walls.",
                "tip": "Friction between layers eliminates any need for adhesive.",
                "diagramType": "lock"
            },
            {
                "stepNumber": 5,
                "title": "Outer Flotation Curving",
                "time": "3-4 min",
                "foldType": "Organic Sculpting",
                "instruction": "Using gentle thumb pressure, curve sepal tips softly downward. Verify that base rests flat and level on working surface.",
                "tip": "A downward curl creates shadow depth beneath the floating flower.",
                "diagramType": "sculpt"
            }
        ]
    },
    "lotus-02": {
        "id": "lotus-02",
        "kitNumber": 2,
        "title": "Blooming Lotus Blossom",
        "subtitle": "Triple-tiered cupped petals • Graduated volume • Organic curvature",
        "description": "The crowning blossom. Generates 12 flared, spoon-shaped petals organized in three concentric tiers with natural paper drapery.",
        "difficulty": "Intermediate-Advanced",
        "time": "30-40 min",
        "category": "nature",
        "collection": "lotus",
        "collectionTitle": "Lotus Garden Collection",
        "accent": "#ec4899",
        "goal": "A rich 3D hemispherical blossom with layered translucent petals curling outwards",
        "paper": [
            { "color": "Lotus Pink / Magenta Duo", "size": "7\" x 7\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Soft Rose / Blush", "size": "5.5\" x 5.5\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Round Shaping Dowel / Pencil"],
        "principles": ["Graduated layer heights", "Organic double-curved petals", "Tension dome inversion"],
        "steps": [
            {
                "stepNumber": 1,
                "title": "16-Segment Accordion Star Base",
                "time": "6-8 min",
                "foldType": "Accordion Pre-Creasing",
                "instruction": "Take 7\" magenta square. Fold horizontal, vertical, and both diagonals. Subdivide each quadrant into 4 equal segments to form a 16-facet star grid.",
                "tip": "Sharp, razor-thin creases are crucial for smooth petal popping later.",
                "diagramType": "star-grid"
            },
            {
                "stepNumber": 2,
                "title": "Tier 1 Outer Petal Inversion",
                "time": "7-9 min",
                "foldType": "Inside-Out Petal Pull",
                "instruction": "Carefully pull bottom layer points upward and outward, turning paper inside-out to reveal the softer rose-colored petal underlayer.",
                "tip": "Support the center point with your index finger to avoid tearing.",
                "diagramType": "petal-inversion"
            },
            {
                "stepNumber": 3,
                "title": "Petal Fluting & Double-Curving",
                "time": "6-8 min",
                "foldType": "Wet-Folding / Roll-Shaping",
                "instruction": "Roll each petal margin around a pencil to form a delicate concave spoon shape. Flare tips outward slightly.",
                "tip": "Slight dampness on fingertips allows paper fibers to set permanently in curved form.",
                "diagramType": "fluting"
            },
            {
                "stepNumber": 4,
                "title": "Tier 2 Mid-Petal Elevation",
                "time": "5-7 min",
                "foldType": "Squash & Reverse Fold",
                "instruction": "Pull intermediate layer flaps up at a 60-degree angle, staggering petal tips halfway between Tier 1 points.",
                "tip": "Staggering prevents petals from blocking one another and creates lush fullness.",
                "diagramType": "tier2"
            },
            {
                "stepNumber": 5,
                "title": "Tension Dome Inversion",
                "time": "3-4 min",
                "foldType": "Inversion Pop",
                "instruction": "Push center underside firmly upward until the entire blossom pops into a stable 3D hemisphere.",
                "tip": "Listen for the paper tension click indicating the dome is locked.",
                "diagramType": "dome"
            },
            {
                "stepNumber": 6,
                "title": "Calyx Socket Integration",
                "time": "3-4 min",
                "foldType": "Tab Interlock",
                "instruction": "Mount blossom base into Kit 01 green calyx. Rotate 22.5 degrees to interlock tabs securely into calyx pockets.",
                "tip": "Check profile from water level; blossom should sit proud above green leaves.",
                "diagramType": "mount"
            }
        ]
    },
    "lotus-03": {
        "id": "lotus-03",
        "kitNumber": 3,
        "title": "Inner Lotus Core & Golden Stamen",
        "subtitle": "Micro-pleated pollen seedpod • Miniature rose bud center",
        "description": "Intricate jewel-like core representing the sacred lotus seed receptacle, surrounded by shimmering gold foil stamens.",
        "difficulty": "Advanced",
        "time": "25-30 min",
        "category": "nature",
        "collection": "lotus",
        "collectionTitle": "Lotus Garden Collection",
        "accent": "#f59e0b",
        "goal": "A faceted hexagonal seedpod crowned with gold micro-pleated stamen fringe",
        "paper": [
            { "color": "Gold Foil / Metallic Brass", "size": "3\" x 3\"", "qty": 1, "gsm": "50 gsm" },
            { "color": "Sunburst Yellow / Saffron", "size": "3.5\" x 3.5\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Precision Tweezers", "Needle Tool / Toothpick"],
        "principles": ["Micro-pleating for texture", "Hexagonal dome collapse", "High contrast focal center"],
        "steps": [
            {
                "stepNumber": 1,
                "title": "Miniature Blintz Core",
                "time": "4-5 min",
                "foldType": "Micro-Blintz",
                "instruction": "Take 3\" gold foil square. Fold all 4 corners to center twice to create a compact, heavy 8-ply core pad.",
                "tip": "Foil holds creases without spring-back; burnish edges with fingernail.",
                "diagramType": "micro-blintz"
            },
            {
                "stepNumber": 2,
                "title": "Stamen Micro-Fringe Pleating",
                "time": "8-10 min",
                "foldType": "Accordion Pleat",
                "instruction": "Make 1mm alternating mountain/valley micro-pleats along perimeter flaps to simulate radiant pollen stamens.",
                "tip": "Use tweezers to manipulate tiny pleats without crushing paper.",
                "diagramType": "fringe"
            },
            {
                "stepNumber": 3,
                "title": "Hexagonal Seedpod Dome",
                "time": "6-8 min",
                "foldType": "Squash Collapse",
                "instruction": "Fold saffron yellow square into a raised hexagonal pyramid with a flattened upper seed disc.",
                "tip": "Make 7 tiny dimple depressions on top disc representing lotus seed pods.",
                "diagramType": "seedpod"
            },
            {
                "stepNumber": 4,
                "title": "Spiral Bud Enclosure",
                "time": "4-5 min",
                "foldType": "Swirl Fold",
                "instruction": "Surround seedpod with 4 curled inner petal slips, wrapping tightly like an unfurling bud.",
                "tip": "Twist tips gently clockwise to create natural spiral energy.",
                "diagramType": "swirl"
            },
            {
                "stepNumber": 5,
                "title": "Nesting into Blooming Lotus",
                "time": "3-4 min",
                "foldType": "Nesting Anchor",
                "instruction": "Insert assembled stamen core into center socket of Kit 02 blossom. Press down until seated flush.",
                "tip": "Gold stamen should peek out catching ambient light at the heart of the flower.",
                "diagramType": "nest"
            }
        ]
    },
    "lotus-04": {
        "id": "lotus-04",
        "kitNumber": 4,
        "title": "Multi-Layered Lily Pads",
        "subtitle": "Radiating vein micro-pleats • Organic floating cleft",
        "description": "Architectural water lily leaves featuring crisp radiating veins, characteristic V-notch cleft, and raised water-repellent rim.",
        "difficulty": "Beginner-Intermediate",
        "time": "18-22 min",
        "category": "nature",
        "collection": "lotus",
        "collectionTitle": "Lotus Garden Collection",
        "accent": "#059669",
        "goal": "Two organic floating lily pads of graduated size with realistic vein architecture",
        "paper": [
            { "color": "Deep Olive / Moss Green", "size": "6.5\" x 6.5\"", "qty": 1, "gsm": "80 gsm" },
            { "color": "Emerald Green", "size": "5\" x 5\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler"],
        "principles": ["Radiating vein lines", "Cleft asymmetry", "Elevated floating posture"],
        "steps": [
            {
                "stepNumber": 1,
                "title": "Octagonal Disc Preparation",
                "time": "3-4 min",
                "foldType": "Corner Miter",
                "instruction": "Take 6.5\" olive green square. Fold corners inward by 1.25\" to transform square into a smooth, proportional octagon.",
                "tip": "Ensure all 4 corner trims are equal for true radial symmetry.",
                "diagramType": "octagon"
            },
            {
                "stepNumber": 2,
                "title": "Radiating Vein Pleat Matrix",
                "time": "6-8 min",
                "foldType": "Ray Pleating",
                "instruction": "Fold 16 fine mountain rays emanating from an off-center origin point towards outer rim. Press sharply.",
                "tip": "An off-center leaf stalk origin gives an authentic organic appearance.",
                "diagramType": "veins"
            },
            {
                "stepNumber": 3,
                "title": "The Floating Cleft V-Notch",
                "time": "3-4 min",
                "foldType": "Inside Reverse Fold",
                "instruction": "Make a narrow triangular valley fold along one radius from rim to center stem, forming the classic water lily leaf cleft.",
                "tip": "Angle the cleft at roughly 18-20 degrees for perfect proportion.",
                "diagramType": "cleft"
            },
            {
                "stepNumber": 4,
                "title": "Raised Perimeter Lip",
                "time": "3-4 min",
                "foldType": "Mountain Crimp",
                "instruction": "Gently curl outer margin upward all around leaf circumference to produce the raised boundary rim.",
                "tip": "In nature, this rim repels waves and traps dew droplets.",
                "diagramType": "rim"
            },
            {
                "stepNumber": 5,
                "title": "Underside Air Pocket Chamber",
                "time": "3-4 min",
                "foldType": "Reverse Tuck",
                "instruction": "Fold small tabs on underside to form a 1/4\" concealed riser, allowing pad to float elevated off display tray.",
                "tip": "Elevation casts soft shadows underneath, multiplying the water illusion.",
                "diagramType": "pocket"
            }
        ]
    },
    "lotus-05": {
        "id": "lotus-05",
        "kitNumber": 5,
        "title": "Sculptural 3D Koi Fish",
        "subtitle": "Dynamic S-curve swimming pose • Flowing pleated caudal fin",
        "description": "Graceful Japanese koi carp folded in a fluid swimming curve with delicate pleated pectoral fins and articulated tail.",
        "difficulty": "Advanced",
        "time": "30-38 min",
        "category": "nature",
        "collection": "lotus",
        "collectionTitle": "Lotus Garden Collection",
        "accent": "#f97316",
        "goal": "A three-dimensional curving koi fish poised mid-stroke beneath the water surface",
        "paper": [
            { "color": "Orange / White Duo or Calico Print", "size": "6\" x 6\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Pearl White (fins accent)", "size": "2\" x 2\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["S-curve swimming gesture", "Volumetric body inflation", "Translucent fanned tail"],
        "steps": [
            {
                "stepNumber": 1,
                "title": "Modified Fish Base",
                "time": "6-8 min",
                "foldType": "Fish Base Variant",
                "instruction": "Start with 6\" duo paper. Fold diagonal kite creases and collapse twin lateral flaps into standard fish base flaps.",
                "tip": "Keep the spine crease laser-sharp for clean dorsal alignment.",
                "diagramType": "fish-base"
            },
            {
                "stepNumber": 2,
                "title": "Head & Sensory Barbels",
                "time": "5-6 min",
                "foldType": "Crimp & Rabbit Ear",
                "instruction": "Crimp snout downward at 30 degrees. Rabbit-ear fold the tiny cheek flaps into slender whisker barbels.",
                "tip": "Angle barbels backward along cheeks to indicate forward momentum.",
                "diagramType": "head"
            },
            {
                "stepNumber": 3,
                "title": "Pectoral Fin Splitting & Pleats",
                "time": "6-8 min",
                "foldType": "Accordion Pleat",
                "instruction": "Split lateral flaps and accordion-pleat each wing into 4 delicate ridges fanning out from body.",
                "tip": "Curve one fin forward and one backward to accentuate banking turn.",
                "diagramType": "fins"
            },
            {
                "stepNumber": 4,
                "title": "Dorsal S-Curve Body Arc",
                "time": "5-7 min",
                "foldType": "Wet-Fold Curvature",
                "instruction": "Gently bend spine into an expressive S-curve: head turning left, mid-body bowing right, tail sweeping back.",
                "tip": "Avoid creasing across body; mold with warm palms for smooth muscular curve.",
                "diagramType": "body-arc"
            },
            {
                "stepNumber": 5,
                "title": "Flowing Caudal (Tail) Fin",
                "time": "5-6 min",
                "foldType": "Inside Reverse Fan",
                "instruction": "Spread rear tail flap, reverse-fold upwards, and accordion-pleat into a wide, undulating butterfly tail.",
                "tip": "Fluff tail edges slightly to simulate fin silk in moving water.",
                "diagramType": "tail"
            },
            {
                "stepNumber": 6,
                "title": "Belly Volume Inflation",
                "time": "3-4 min",
                "foldType": "Volume Shaping",
                "instruction": "Gently separate belly flaps underneath to inflate the torso into a solid, buoyant 3D volume.",
                "tip": "Pinch along dorsal ridge to lock inflated curve into place.",
                "diagramType": "inflate"
            }
        ]
    },
    "lotus-06": {
        "id": "lotus-06",
        "kitNumber": 6,
        "title": "Aquatic Garden Water & Stone Setting",
        "subtitle": "Stepped ripple platform • Smooth river stones • Staged composition",
        "description": "Complete diorama stage. Unifies blooming lotus, lily pads, swimming koi, and faceted river pebbles into a museum-quality display.",
        "difficulty": "Intermediate",
        "time": "25-30 min",
        "category": "nature",
        "collection": "lotus",
        "collectionTitle": "Lotus Garden Collection",
        "accent": "#06b6d4",
        "goal": "A balanced, tranquil aquatic diorama creating the illusion of deep, rippling pond water",
        "paper": [
            { "color": "Deep Indigo / Navy", "size": "10\" x 10\"", "qty": 1, "gsm": "120 gsm" },
            { "color": "Aquamarine / Cyan", "size": "8\" x 8\"", "qty": 1, "gsm": "80 gsm" },
            { "color": "Slate Grey / Jade (pebbles)", "size": "3\" x 3\"", "qty": 4, "gsm": "90 gsm" }
        ],
        "tools": ["Ruler", "Cutting Mat", "Double-Sided Tape (optional)"],
        "principles": ["Triangular focal staging", "Concentric water gradient", "Asymmetric natural balance"],
        "steps": [
            {
                "stepNumber": 1,
                "title": "Concentric Ripple Base",
                "time": "6-8 min",
                "foldType": "Concentric Ridge Fold",
                "instruction": "Take 10\" deep indigo sheet. Fold stepped concentric circular terraces in aquamarine paper to represent water ripples.",
                "tip": "Offset ripple circles to suggest koi movement disturbance.",
                "diagramType": "water-base"
            },
            {
                "stepNumber": 2,
                "title": "Faceted River Stone Modules",
                "time": "6-8 min",
                "foldType": "Hexagonal Pebble Fold",
                "instruction": "From four 3\" grey/jade squares, fold rounded smooth river stones with soft tucked corners.",
                "tip": "Vary stone dimensions slightly; cluster 3 together and place 1 isolated.",
                "diagramType": "pebbles"
            },
            {
                "stepNumber": 3,
                "title": "Primary Lotus Anchor",
                "time": "3-4 min",
                "foldType": "Staging Anchor",
                "instruction": "Seat assembled Blooming Lotus (Kit 01-03) at upper-right golden ratio node on the pond surface.",
                "tip": "Angle flower head slightly toward the viewing axis.",
                "diagramType": "place-lotus"
            },
            {
                "stepNumber": 4,
                "title": "Lily Pad & Stone Grounding",
                "time": "4-5 min",
                "foldType": "Composition Balancing",
                "instruction": "Place large lily pad mid-ground left, partially overlapping ripple terrace. Cluster 3 river stones near pond margin.",
                "tip": "Leave open negative water space in foreground for dramatic tranquility.",
                "diagramType": "place-pads"
            },
            {
                "stepNumber": 5,
                "title": "Koi Fish Swimming Trajectory",
                "time": "3-4 min",
                "foldType": "Kinetic Staging",
                "instruction": "Position 3D Koi Fish along diagonal flow line, diving beneath lotus petal toward clear water in foreground.",
                "tip": "Rest fish on hidden clear paper riser to create floating suspension.",
                "diagramType": "place-koi"
            },
            {
                "stepNumber": 6,
                "title": "Final Display Lighting Check",
                "time": "3-4 min",
                "foldType": "Lighting Alignment",
                "instruction": "Test under warm spotlight at 45 degrees. Verify petal shadows fall gracefully across rippled water surface.",
                "tip": "The interplay of light on gold stamen and glossy paper completes the illusion.",
                "diagramType": "final-scene"
            }
        ]
    }
}
kits.update(lotus_kits)

# 3. GEOMETRIC MODULAR VASE COLLECTION (8 kits)
geometric_kits = {
    "geometric-01": {
        "id": "geometric-01",
        "kitNumber": 1,
        "title": "Tri-Faceted Base Unit",
        "subtitle": "60-degree isometric grid • Precision tab-and-pocket friction lock",
        "description": "Foundational triangular prism modules with integrated male/female friction connectors. Forms the load-bearing base ring of the geometric vase.",
        "difficulty": "Intermediate",
        "time": "20-25 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#3b82f6",
        "goal": "Six rigid triangular interlocking modules with zero-adhesive friction tabs",
        "paper": [
            { "color": "Architectural Navy / Slate", "size": "6\" x 6\"", "qty": 6, "gsm": "120 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Scoring Stylus"],
        "principles": ["60-degree isometric geometry", "Self-locking friction tabs", "Structural rigidity under compression"],
        "steps": [
            { "stepNumber": 1, "title": "Isometric Grid Division", "time": "4-5 min", "foldType": "Grid Pre-Creasing", "instruction": "Fold 6\" square in half, then fold 60-degree diagonal angle bisectors to establish an equilateral triangular grid.", "tip": "Use bone folder for crisp scoring; precision here ensures clean joints.", "diagramType": "iso-grid" },
            { "stepNumber": 2, "title": "Rhombus Mountain Creases", "time": "4-5 min", "foldType": "Mountain Fold", "instruction": "Form crisp mountain creases along primary diagonal diamond axes, creating an alternating faceted face.", "tip": "Burnish both sides of each crease.", "diagramType": "rhombus" },
            { "stepNumber": 3, "title": "Male Locking Tab Extrusion", "time": "4-5 min", "foldType": "Tab Fold", "instruction": "Fold 45-degree reinforced tongue on left edge. Double-fold edge for maximum shear strength.", "tip": "Keep tab corner sharp so it glides into receiver slot smoothly.", "diagramType": "male-tab" },
            { "stepNumber": 4, "title": "Female Slot Inversion", "time": "4-5 min", "foldType": "Inside Pocket Fold", "instruction": "Reverse-fold right edge into an internal receiving sleeve matched precisely to male tab dimensions.", "tip": "Open pocket slightly with bone folder before joining.", "diagramType": "female-slot" },
            { "stepNumber": 5, "title": "Module Interlock Validation", "time": "4-5 min", "foldType": "Connection Test", "instruction": "Slide male tab of Unit 1 into pocket of Unit 2 at 120-degree angle until tab clicks flush.", "tip": "Joint should resist 50g tensile pull without separating.", "diagramType": "test-lock" }
        ]
    },
    "geometric-02": {
        "id": "geometric-02",
        "kitNumber": 2,
        "title": "Diamond Honeycomb Module",
        "subtitle": "Dual-creased rhombic prism • High-rigidity vertical stacking",
        "description": "Primary modular building blocks for the vase walls. 3D diamond facets that interlock vertically and horizontally into a honeycomb grid.",
        "difficulty": "Intermediate",
        "time": "25-30 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#6366f1",
        "goal": "Twelve identical diamond prism modules ready for vertical matrix assembly",
        "paper": [
            { "color": "Matte Charcoal / Deep Navy", "size": "5\" x 5\"", "qty": 12, "gsm": "100 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler"],
        "principles": ["Rhombic prism stability", "Vertical keying channels", "Modular repeatability"],
        "steps": [
            { "stepNumber": 1, "title": "Parallelogram Crease Layout", "time": "5-6 min", "foldType": "Pre-Creasing", "instruction": "Pre-crease 5\" square into 2:1 rhombic facets using alternating mountain and valley diagonals.", "tip": "Fold in batches of 4 to ensure uniform dimensions.", "diagramType": "rhomb-grid" },
            { "stepNumber": 2, "title": "Central Facet 3D Inversion", "time": "5-6 min", "foldType": "Pop-Out Inversion", "instruction": "Push center diamond outward while collapsing surrounding valley creases, popping diamond facet into 3D relief.", "tip": "Support vertices with finger tips to prevent paper buckling.", "diagramType": "facet-pop" },
            { "stepNumber": 3, "title": "Vertical Keying Tabs", "time": "5-6 min", "foldType": "Keying Flaps", "instruction": "Fold upper and lower connector tongues that will interlock with adjacent tier modules.", "tip": "Crease tabs at exact 90 degrees to facet plane.", "diagramType": "key-tabs" },
            { "stepNumber": 4, "title": "Lateral Wing Compression", "time": "5-6 min", "foldType": "Tension Lock", "instruction": "Pinch side vertices together to form rigid self-standing triangular prism column.", "tip": "Each module must stand upright on tabletop unsupported.", "diagramType": "prism-stand" },
            { "stepNumber": 5, "title": "Batch Inspection & Sorting", "time": "5-6 min", "foldType": "Quality Control", "instruction": "Inspect all 12 modules side-by-side. Verify facet angles and tab tolerances match within 0.5mm.", "tip": "High consistency here guarantees straight vertical vase walls.", "diagramType": "batch-check" }
        ]
    },
    "geometric-03": {
        "id": "geometric-03",
        "kitNumber": 3,
        "title": "Fluted Neck Collar",
        "subtitle": "Tapered reverse-fold ring • Architectural flared rim",
        "description": "Architectural collar that crowns the vase, gathering lower wall facets into an elegant, fluted geometric rim.",
        "difficulty": "Advanced",
        "time": "22-28 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#d97706",
        "goal": "A tapered 24-facet fluted rim ring with metallic copper highlights",
        "paper": [
            { "color": "Brushed Copper Foil", "size": "3\" x 12\"", "qty": 1, "gsm": "120 gsm" },
            { "color": "Navy Kraft (liner)", "size": "2.75\" x 11.5\"", "qty": 1, "gsm": "80 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Rotary Trimmer"],
        "principles": ["Herringbone chevron pleating", "Torsional neck constriction", "Flared petal rim crown"],
        "steps": [
            { "stepNumber": 1, "title": "Accordion Strip Pre-Creasing", "time": "5-6 min", "foldType": "Accordion Pleat", "instruction": "Divide 3\"x12\" copper foil strip into 24 equal 0.5\" accordion pleats. Press sharply.", "tip": "Measure carefully with ruler; uniform pleat width is vital.", "diagramType": "accordion-strip" },
            { "stepNumber": 2, "title": "Herringbone Chevron Creasing", "time": "6-8 min", "foldType": "Chevron Fold", "instruction": "Score 45-degree diagonal creases across pleats in alternating zigzag pattern.", "tip": "Chevron lines allow strip to expand into cylinder while contracting in center.", "diagramType": "chevron" },
            { "stepNumber": 3, "title": "Cylindrical Ring Join", "time": "4-5 min", "foldType": "Seam Interlock", "instruction": "Overlap terminal 2 pleats and tuck inner tabs to form a continuous 24-facet cylindrical ring.", "tip": "Double-check seam lies flat without bulging.", "diagramType": "cylinder-join" },
            { "stepNumber": 4, "title": "Neck Constriction Torque", "time": "4-5 min", "foldType": "Twist Collapse", "instruction": "Twist center waist inward by 15 degrees, compressing the neck into a narrow waist.", "tip": "Ease pleats simultaneously from both top and bottom.", "diagramType": "neck-constrict" },
            { "stepNumber": 5, "title": "Rim Flaring & Burnishing", "time": "3-4 min", "foldType": "Rim Curl", "instruction": "Curl upper chevron tips outward to form an architectural flared rim. Burnish foil edges.", "tip": "Copper sheen catches overhead lighting brilliantly.", "diagramType": "rim-flare" }
        ]
    },
    "geometric-04": {
        "id": "geometric-04",
        "kitNumber": 4,
        "title": "Hexagonal Waist Assembly",
        "subtitle": "Torque-folded junction ring • Connecting upper & lower chambers",
        "description": "Crucial structural load-bearing ring. Bridges the lower expanding base with the upper tapered neck, handling vertical shear forces.",
        "difficulty": "Advanced",
        "time": "25-30 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#8b5cf6",
        "goal": "A rigid 6-sided torque-folded junction ring with 12 bidirectional locking sockets",
        "paper": [
            { "color": "Dark Indigo Card", "size": "8\" x 8\"", "qty": 1, "gsm": "140 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Scoring Stylus"],
        "principles": ["Rotational torque fold", "Vertical compression resistance", "Bidirectional sockets"],
        "steps": [
            { "stepNumber": 1, "title": "Hexagonal Perimeter Scoring", "time": "5-6 min", "foldType": "Polygon Scoring", "instruction": "Score exact regular hexagon inside 8\" square. Crease radial mountain spines from vertices to center.", "tip": "Hexagon side length should be exactly 3.5\".", "diagramType": "hex-score" },
            { "stepNumber": 2, "title": "Center Twist Collapse", "time": "6-8 min", "foldType": "Twist Fold", "instruction": "Simultaneously push vertices inward while rotating center hub counter-clockwise, collapsing into a 3D torque waist.", "tip": "Allow paper to naturally spiral into the twist without forcing corners.", "diagramType": "twist-waist" },
            { "stepNumber": 3, "title": "Lower Tab Extrusion", "time": "5-6 min", "foldType": "Downward Tabs", "instruction": "Extrude 6 downward locking tabs spaced evenly around bottom edge for connection to lower tier.", "tip": "Fold tabs inward at 45 degrees for self-centering alignment.", "diagramType": "down-tabs" },
            { "stepNumber": 4, "title": "Upper Socket Expansion", "time": "5-6 min", "foldType": "Upward Pockets", "instruction": "Open 6 upward-facing receiving pockets along upper rim to receive upper tier diamond modules.", "tip": "Check that each pocket can accommodate 2 adjacent module tabs.", "diagramType": "up-pockets" },
            { "stepNumber": 5, "title": "Load-Bearing Integrity Check", "time": "4-5 min", "foldType": "Compression Test", "instruction": "Place flat book on waist ring; verify it supports 200g weight without collapsing.", "tip": "A rock-solid waist ensures the finished 30-piece vase will never sag.", "diagramType": "load-check" }
        ]
    },
    "geometric-05": {
        "id": "geometric-05",
        "kitNumber": 5,
        "title": "Metallic Accent Corner Brackets",
        "subtitle": "2-inch copper foil caps • Structural vertex reinforcement",
        "description": "Exquisite copper/gold foil brackets that snap over external facet vertices, locking seams while creating stunning metallic contrast.",
        "difficulty": "Intermediate",
        "time": "18-22 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#f59e0b",
        "goal": "Twelve precision copper foil corner brackets that clamp over modular vertices",
        "paper": [
            { "color": "Mirror Copper Foil", "size": "2\" x 2\"", "qty": 12, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Corner mitering", "Friction clamping channel", "Jewel-toned metallic highlights"],
        "steps": [
            { "stepNumber": 1, "title": "Diagonal Mitre Creasing", "time": "4-5 min", "foldType": "Diagonal Crease", "instruction": "Fold 2\" copper foil square corner to corner, then fold 90-degree corner blintz to create an arrow point.", "tip": "Work on clean cloth so foil mirror finish does not scratch.", "diagramType": "bracket-crease" },
            { "stepNumber": 2, "title": "Double Clamp Inversion", "time": "5-6 min", "foldType": "Channel Fold", "instruction": "Invert outer flaps inward to form a 1mm channel that acts as a tight spring clip.", "tip": "Test channel gap against double-ply paper thickness.", "diagramType": "clamp-channel" },
            { "stepNumber": 3, "title": "Vertex Angle Tuning", "time": "4-5 min", "foldType": "Angle Shaping", "instruction": "Adjust bracket interior angle to 60 or 120 degrees depending on target vertex position.", "tip": "6 brackets tuned to 60 degrees, 6 tuned to 120 degrees.", "diagramType": "angle-tune" },
            { "stepNumber": 4, "title": "Installation Dry Run", "time": "5-6 min", "foldType": "Snap-On Test", "instruction": "Slide bracket over sample diamond vertex; ensure it clicks and holds firmly without glue.", "tip": "The copper contrast against deep navy paper is stunning.", "diagramType": "bracket-snap" }
        ]
    },
    "geometric-06": {
        "id": "geometric-06",
        "kitNumber": 6,
        "title": "Spiral Pleat Exterior Skin",
        "subtitle": "Miura-ori inspired expandable skin • Dynamic shadow play",
        "description": "An architectural origami tessellation wrap based on the Miura-ori fold. Wraps around the vase core for hypnotic helical texture.",
        "difficulty": "Advanced",
        "time": "30-36 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#0ea5e9",
        "goal": "A flexible, expandable Miura-ori tessellation skin tailored to wrap the vase body",
        "paper": [
            { "color": "Midnight Blue / Cobalt Duo", "size": "7\" x 14\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Drafting Triangle"],
        "principles": ["Miura-ori negative Poisson ratio", "Bi-axial fold collapse", "Helical wrap dynamics"],
        "steps": [
            { "stepNumber": 1, "title": "Parallelogram Crease Matrix", "time": "8-10 min", "foldType": "Tessellation Scoring", "instruction": "Score 6 parallel horizontal lines and 12 angled 84-degree zig-zag diagonals across 7\"x14\" sheet.", "tip": "Accuracy within 0.2mm is essential for Miura-ori collapse.", "diagramType": "miura-grid" },
            { "stepNumber": 2, "title": "Bi-Axial Compression Collapse", "time": "8-10 min", "foldType": "Miura Collapse", "instruction": "Push opposing corners diagonally. The entire sheet will simultaneously collapse into a compact, pleated bundle.", "tip": "If a facet resists, gently pinch mountain line until it snaps.", "diagramType": "miura-collapse" },
            { "stepNumber": 3, "title": "Helical Cylindrical Curving", "time": "5-6 min", "foldType": "Spiral Forming", "instruction": "Gently expand the pleated sheet while curling it into a cylindrical helical wrap.", "tip": "Miura-ori naturally expands and contracts around curved contours.", "diagramType": "helical-wrap" },
            { "stepNumber": 4, "title": "Seam Concealment & Friction Lock", "time": "5-6 min", "foldType": "Tessellation Seam", "instruction": "Interleave the terminal zig-zag teeth of both ends to close the sleeve invisibly.", "tip": "Friction between overlapping facets holds seam closed seamlessly.", "diagramType": "miura-seam" },
            { "stepNumber": 5, "title": "Tension Tuning over Vase Body", "time": "4-5 min", "foldType": "Fit Adjustment", "instruction": "Slip sleeve over assembled vase core; adjust tension so pleats cradle diamond facets perfectly.", "tip": "Under raking light, the sharp angular ridges create dramatic chiaroscuro.", "diagramType": "skin-fit" }
        ]
    },
    "geometric-07": {
        "id": "geometric-07",
        "kitNumber": 7,
        "title": "Weighted Architectural Plinth",
        "subtitle": "Rigid multi-layer stepped foot • Concealed ballast chamber",
        "description": "Heavyweight architectural pedestal providing rock-solid foundation stability. Conceals an internal ballast pocket to keep the tall vase upright.",
        "difficulty": "Intermediate",
        "time": "20-25 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#475569",
        "goal": "A heavy, stepped hexagonal pedestal with concealed ballast well and zero wobble",
        "paper": [
            { "color": "Extra Heavy Black Kraft", "size": "8.5\" x 8.5\"", "qty": 1, "gsm": "200 gsm" },
            { "color": "Copper Foil (accent border)", "size": "0.5\" x 24\"", "qty": 1, "gsm": "60 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Flat Washer / Weight (optional)"],
        "principles": ["Stepped elevation for gravitas", "Concealed center-of-gravity ballast", "Double-wall box pleat rigidity"],
        "steps": [
            { "stepNumber": 1, "title": "Double-Wall Box Scoring", "time": "5-6 min", "foldType": "Box Pleat Scoring", "instruction": "Score 1.5\" double border around 8.5\" heavy black card. Crease mitered corners.", "tip": "Heavy 200 gsm paper requires firm scoring with bone folder.", "diagramType": "plinth-score" },
            { "stepNumber": 2, "title": "Stepped Platform Elevation", "time": "5-6 min", "foldType": "Box Wall Fold", "instruction": "Fold walls upward and double inward over themselves, forming rigid 1\" tall reinforced platform walls.", "tip": "Double-wall construction provides extreme resistance to buckling.", "diagramType": "plinth-walls" },
            { "stepNumber": 3, "title": "Concealed Ballast Well", "time": "4-5 min", "foldType": "Ballast Chamber", "instruction": "Fold internal center retaining ring sized to nest a heavy washer or coin to lower center of gravity.", "tip": "Adding 50g ballast prevents tall vases from tipping accidentally.", "diagramType": "ballast-well" },
            { "stepNumber": 4, "title": "Mitered Corner Lock", "time": "3-4 min", "foldType": "Miter Lock", "instruction": "Tuck corner flaps inside walls and lock under base tabs. Apply copper accent border trim.", "tip": "Thin copper pinstripe around plinth base ties into copper collar above.", "diagramType": "corner-lock" },
            { "stepNumber": 5, "title": "Planar Leveling Test", "time": "3-4 min", "foldType": "Leveling Inspection", "instruction": "Place on level surface; tap all 4 corners to confirm 100% planar contact with zero wobble.", "tip": "If corner lifts, press opposite diagonal firmly with palm.", "diagramType": "level-check" }
        ]
    },
    "geometric-08": {
        "id": "geometric-08",
        "kitNumber": 8,
        "title": "Full Modular Vase Synthesis",
        "subtitle": "Complete 30-piece interlock sequence • Structural integrity lock",
        "description": "The master assembly tutorial. Integrates all 30 folded components into a breathtaking, museum-quality geometric architectural vase.",
        "difficulty": "Advanced",
        "time": "40-50 min",
        "category": "decor",
        "collection": "geometric",
        "collectionTitle": "Geometric Modular Vase",
        "accent": "#1e293b",
        "goal": "A fully interlocked, freestanding 30-piece sculptural vase with flawless facet alignment",
        "paper": [
            { "color": "Complete Component Callset (Kits 01-07)", "size": "Pre-folded", "qty": 30, "gsm": "Various" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers", "Soft Cloth"],
        "principles": ["Progressive tier stabilization", "Torsional symmetry validation", "Architectural balance"],
        "steps": [
            { "stepNumber": 1, "title": "Plinth Base Attachment", "time": "6-8 min", "foldType": "Anchor Lock", "instruction": "Seat 6 Tri-Faceted units (Kit 01) into Plinth pedestal (Kit 07), sliding base tabs into plinth receiving sockets.", "tip": "Work in circle; verify base ring is perfectly circular before advancing.", "diagramType": "plinth-anchor" },
            { "stepNumber": 2, "title": "Lower Honeycomb Tier Stacking", "time": "8-10 min", "foldType": "Module Interlock", "instruction": "Lock first 6 Diamond modules (Kit 02) into base ring, sliding side wings together until tabs click flush.", "tip": "Support wall from inside with non-dominant hand while pressing tabs.", "diagramType": "tier1-stack" },
            { "stepNumber": 3, "title": "Hexagonal Waist Lock", "time": "8-10 min", "foldType": "Waist Ring Lock", "instruction": "Lower Hexagonal Waist Ring (Kit 04) over lower tier. Engage all 6 downward tabs simultaneously.", "tip": "Twist waist ring clockwise 5 degrees to lock tabs in bayonet fashion.", "diagramType": "waist-lock" },
            { "stepNumber": 4, "title": "Upper Tier Staggering", "time": "8-10 min", "foldType": "Helical Stagger", "instruction": "Insert upper 6 Diamond modules into waist ring with 30-degree rotation, creating dramatic helical facet twist.", "tip": "Staggered facets catch light dynamically from all viewing angles.", "diagramType": "tier2-stack" },
            { "stepNumber": 5, "title": "Fluted Neck Collar Crown", "time": "6-8 min", "foldType": "Crown Seat", "instruction": "Seat Fluted Neck Collar (Kit 03) into top module rim. Align 24 chevron pleats over upper diamond peaks.", "tip": "Press firmly along rim circumference until collar seats securely.", "diagramType": "collar-crown" },
            { "stepNumber": 6, "title": "Metallic Brackets & Final Truing", "time": "4-6 min", "foldType": "Finishing Polish", "instruction": "Snap 12 Copper Brackets (Kit 05) over primary vertices. Wipe surfaces with soft cloth. Inspect vertical plumb line.", "tip": "Step back 2 meters and admire the bold geometric presence of your sculpture.", "diagramType": "final-vase" }
        ]
    }
}
kits.update(geometric_kits)

# 4. BUTTERFLY MANDALA COLLECTION (7 kits)
butterfly_kits = {
    "butterfly-01": {
        "id": "butterfly-01",
        "kitNumber": 1,
        "title": "Swallowtail Monarch",
        "subtitle": "Dual-layer wing spread • Scalloped trailing edges • 3D arched thorax",
        "description": "Grand display butterfly featuring broad elongated forewings, scalloped hindwings with swallowtail spurs, and an arched 3D thorax.",
        "difficulty": "Intermediate-Advanced",
        "time": "25-32 min",
        "category": "nature",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#f97316",
        "goal": "A soaring 3D butterfly with wide 7-inch wingspan and scalloped trailing edges",
        "paper": [
            { "color": "Tangerine Orange / Black Duo", "size": "5.5\" x 5.5\"", "qty": 1, "gsm": "60 gsm" },
            { "color": "Gold Foil (wing veins)", "size": "Tiny accents", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Dihedral wing elevation", "Scalloped trailing pleats", "Curved leading edge aerodynamics"],
        "steps": [
            { "stepNumber": 1, "title": "Diagonal Offset Waterbomb", "time": "5-6 min", "foldType": "Waterbomb Base", "instruction": "Start with 5.5\" orange/black duo paper, orange face up. Crease diagonals and horizontal, collapsing into offset waterbomb.", "tip": "Keep top flap slightly longer to yield wider forewing spread.", "diagramType": "offset-wb" },
            { "stepNumber": 2, "title": "Forewing Elongation Squash", "time": "5-6 min", "foldType": "Squash Fold", "instruction": "Squash fold upper layers diagonally outward, extending forewing tips past the base perimeter.", "tip": "Maintain identical 40-degree angles on left and right wings.", "diagramType": "forewing-squash" },
            { "stepNumber": 3, "title": "Hindwing Scallop Pleats", "time": "6-8 min", "foldType": "Accordion Pleat", "instruction": "Create 3 alternating 2mm micro-pleats along lower trailing edge, revealing black underlayer along wing margins.", "tip": "Fine pleats replicate the delicate chitin structure of natural wings.", "diagramType": "scallop-pleat" },
            { "stepNumber": 4, "title": "Swallowtail Filament Tails", "time": "4-5 min", "foldType": "Reverse Fold Spur", "instruction": "Inside reverse fold trailing edge tips to form slender protruding swallowtail tails.", "tip": "Pinch tails between fingernails to sharpen pointed filaments.", "diagramType": "swallow-tails" },
            { "stepNumber": 5, "title": "Thorax & Head 3D Pinch", "time": "3-4 min", "foldType": "Center Mountain Pinch", "instruction": "Pinch dorsal centerline mountain fold, popping body into 3D volume while angling head slightly downward.", "tip": "A volumetric body elevates wings off flat background.", "diagramType": "thorax-pinch" },
            { "stepNumber": 6, "title": "Dihedral Wing Arc Adjustment", "time": "2-3 min", "foldType": "Wing Sweeping", "instruction": "Set wings at 45-degree upward dihedral angle. Gently thumb-curve leading edges for natural flight posture.", "tip": "Viewed head-on, wings form an elegant open V-shape.", "diagramType": "dihedral-lift" }
        ]
    },
    "butterfly-02": {
        "id": "butterfly-02",
        "kitNumber": 2,
        "title": "Emerald Morpho",
        "subtitle": "Radiating dorsal ridges • Deep jewel tone sheen • Poised hover pose",
        "description": "Exquisite jewel-toned butterfly folded with micro-corrugated dorsal ridges that catch light with metallic iridescence.",
        "difficulty": "Intermediate-Advanced",
        "time": "24-30 min",
        "category": "nature",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#10b981",
        "goal": "An iridescent green butterfly with 5 radiating ridges per wing and curled antennae",
        "paper": [
            { "color": "Emerald Green Foil / Duo", "size": "4.5\" x 4.5\"", "qty": 1, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Needle Tool / Pin"],
        "principles": ["Bird base transformation", "Dorsal ray corrugation", "Curved micro-antennae"],
        "steps": [
            { "stepNumber": 1, "title": "Elongated Bird Base", "time": "6-8 min", "foldType": "Bird Base", "instruction": "Take 4.5\" emerald foil. Fold preliminary square base, then petal-fold front and back into standard bird base.", "tip": "Make petal fold creases razor sharp for clean wing flaps.", "diagramType": "bird-base" },
            { "stepNumber": 2, "title": "Accordion Dorsal Pleats", "time": "6-8 min", "foldType": "Radiating Pleats", "instruction": "Fold 5 fine radiating accordion pleats across each wing surface, fanning outward from body to wing margin.", "tip": "Pleat spacing should expand towards wing tips.", "diagramType": "dorsal-pleats" },
            { "stepNumber": 3, "title": "Curved Leading Edge", "time": "4-5 min", "foldType": "Edge Roll", "instruction": "Roll leading wing margins over needle tool to produce a smooth, convex forward edge.", "tip": "Foil holds curled shape permanently without adhesive.", "diagramType": "curved-lead" },
            { "stepNumber": 4, "title": "Fine Curled Antennae", "time": "4-5 min", "foldType": "Split Reverse Fold", "instruction": "Micro-split head apex and reverse fold into twin delicate antennae. Curl tips outward with pin.", "tip": "Curled antennae add lifelike realism at close inspection.", "diagramType": "antennae" },
            { "stepNumber": 5, "title": "Abdominal Hover Arc", "time": "4-5 min", "foldType": "Body Arc", "instruction": "Curve abdomen gently downward while wing roots remain elevated, creating hovering tension.", "tip": "Model appears frozen in mid-air flight.", "diagramType": "hover-arc" }
        ]
    },
    "butterfly-03": {
        "id": "butterfly-03",
        "kitNumber": 3,
        "title": "Golden Birdwing",
        "subtitle": "Grand 6-inch focal centerpiece • Radiant gold foil underwing exposure",
        "description": "The monumental centerpiece of the mandala. High-contrast black and gold foil construction with dramatic open underwing reveal.",
        "difficulty": "Advanced",
        "time": "32-38 min",
        "category": "nature",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#eab308",
        "goal": "A striking 6-inch master butterfly displaying radiant gold core against velvet black frame",
        "paper": [
            { "color": "Jet Black / Mirror Gold Foil Duo", "size": "6\" x 6\"", "qty": 1, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers", "Ruler"],
        "principles": ["Dramatic color-change reveal", "Slender segmented waist", "Underbelly flight lock"],
        "steps": [
            { "stepNumber": 1, "title": "Black/Gold Blintz Waterbomb", "time": "6-8 min", "foldType": "Blintz Waterbomb", "instruction": "Fold 6\" black/gold duo square into blintz base, then collapse into heavy 8-ply waterbomb.", "tip": "Ensure gold foil faces interior so it reveals on fold-back.", "diagramType": "gold-blintz" },
            { "stepNumber": 2, "title": "Geometric Underwing Reveal", "time": "8-10 min", "foldType": "Color-Change Fold", "instruction": "Fold black outer cowl layers backward at 45-degree angle, unveiling the brilliant mirror gold core beneath.", "tip": "Sharp contrast between jet black and gold creates royal drama.", "diagramType": "wing-reveal" },
            { "stepNumber": 3, "title": "Broad Wing Flange Pleating", "time": "6-8 min", "foldType": "Flange Pleat", "instruction": "Accordion-fold trailing wing flanges in staggered 3mm steps to create rich feathered fringes.", "tip": "Mirror pleats precisely across dorsal spine.", "diagramType": "flange-pleats" },
            { "stepNumber": 4, "title": "Slender Wasp Waist Crimp", "time": "6-8 min", "foldType": "Double Reverse Crimp", "instruction": "Double reverse-fold body midsection to narrow the waist to 3mm, separating thorax and abdomen.", "tip": "Exaggerated waist gives sculpted insectoid elegance.", "diagramType": "wasp-waist" },
            { "stepNumber": 5, "title": "Underbelly Flight Lock", "time": "6-8 min", "foldType": "Friction Lock Tab", "instruction": "Fold hidden tab beneath belly that locks wings securely at dramatic 35-degree dihedral angle.", "tip": "Wings will never droop over time thanks to the mechanical lock.", "diagramType": "flight-lock" }
        ]
    },
    "butterfly-04": {
        "id": "butterfly-04",
        "kitNumber": 4,
        "title": "Pygmy Azure Trio",
        "subtitle": "Minimalist 8-fold gem butterflies • Dynamic swarm accents",
        "description": "Three swift, jewel-toned miniature butterflies. Minimalist geometry designed to create swirling movement around mandala perimeter.",
        "difficulty": "Beginner-Intermediate",
        "time": "15-20 min",
        "category": "nature",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#06b6d4",
        "goal": "Three miniature turquoise butterflies folded in dynamic ascending flight poses",
        "paper": [
            { "color": "Turquoise Foil / Cyan", "size": "2.5\" x 2.5\"", "qty": 3, "gsm": "50 gsm" }
        ],
        "tools": ["Bone Folder", "Precision Tweezers"],
        "principles": ["Minimalist 8-fold efficiency", "Dynamic swarm grouping", "Scale contrast against focal center"],
        "steps": [
            { "stepNumber": 1, "title": "Kite Foundation Base", "time": "3-4 min", "foldType": "Kite Base", "instruction": "Take 2.5\" turquoise square. Fold diagonal valley, then fold side corners to center crease to form kite base.", "tip": "Fold 3 sheets simultaneously to save time.", "diagramType": "kite-trio" },
            { "stepNumber": 2, "title": "Scissorless Wing Separation", "time": "4-5 min", "foldType": "Squash Separation", "instruction": "Make single horizontal reverse-squash fold, dividing the single lateral flap into distinct upper and lower wings.", "tip": "Pure origami geometry produces 4 distinct wings with zero cuts.", "diagramType": "wing-split" },
            { "stepNumber": 3, "title": "Micro-Pleat Edge Flare", "time": "3-4 min", "foldType": "Micro-Pleat", "instruction": "Make tiny valley tuck at each wing corner to flare outer wing margins outward.", "tip": "Small flares catch light with every change in viewer angle.", "diagramType": "trio-flare" },
            { "stepNumber": 4, "title": "3D Body Mountain Pinch", "time": "2-3 min", "foldType": "Center Pinch", "instruction": "Pinch center spine firmly between tweezers, forming sharp 3D body cavity.", "tip": "Pinch tighter at tail end for natural taper.", "diagramType": "trio-pinch" },
            { "stepNumber": 5, "title": "Trio Flight Staggering", "time": "3-4 min", "foldType": "Pose Variation", "instruction": "Shape one butterfly banking left, one soaring straight, one banking right.", "tip": "Staggered wing postures make the trio look like a living swarm.", "diagramType": "trio-swarm" }
        ]
    },
    "butterfly-05": {
        "id": "butterfly-05",
        "kitNumber": 5,
        "title": "Radial Mandala Armature",
        "subtitle": "8-point geometric frame • Multi-tier elevation mounting anchors",
        "description": "Architectural skeletal frame that provides the structural foundation for the entire 16-piece wall mandala.",
        "difficulty": "Intermediate-Advanced",
        "time": "25-30 min",
        "category": "decor",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#8b5cf6",
        "goal": "A rigid 12-inch octagonal armature with 3-tiered elevation standoff risers",
        "paper": [
            { "color": "Heavy Plum / Violet Card", "size": "4\" x 4\"", "qty": 8, "gsm": "160 gsm" }
        ],
        "tools": ["Bone Folder", "Ruler", "Double-Sided Craft Tape"],
        "principles": ["Octagonal rotational symmetry", "Tiered depth risers (0.5\", 1\", 1.5\")", "Zero-sag structural armature"],
        "steps": [
            { "stepNumber": 1, "title": "Octagonal Rib Modules", "time": "6-8 min", "foldType": "Rib Unit Fold", "instruction": "Fold 8 identical interlocking structural struts from 4\" heavy violet card squares.", "tip": "Double-layer folded struts resist bending under butterfly weight.", "diagramType": "rib-unit" },
            { "stepNumber": 2, "title": "Ring Connection Joints", "time": "6-8 min", "foldType": "Socket Interlock", "instruction": "Slide strut tabs into adjacent sockets to assemble a rigid 12\" octagonal structural ring.", "tip": "Test on flat table; all 8 points should lie in identical plane.", "diagramType": "octa-ring" },
            { "stepNumber": 3, "title": "Tiered Elevation Standoffs", "time": "6-8 min", "foldType": "Riser Fold", "instruction": "Fold triangular standoffs at each vertex: Tier 1 (0.5\"), Tier 2 (1.0\"), and Center Hub (1.5\").", "tip": "Staggered elevations allow butterflies to overlap in 3D space.", "diagramType": "standoffs" },
            { "stepNumber": 4, "title": "Center Hub Locking Plate", "time": "4-5 min", "foldType": "Hub Plate Lock", "instruction": "Interlock 8-pointed star hub in center to lock radial ribs and eliminate planar flex.", "tip": "Hub plate provides stable anchor for Kit 03 Golden Birdwing.", "diagramType": "hub-plate" },
            { "stepNumber": 5, "title": "Wall Hanging Anchor Loop", "time": "3-4 min", "foldType": "Hanger Tab", "instruction": "Fold reinforced rear hanging loop centered on upper vertical rib.", "tip": "Loop supports easy mounting onto a single picture nail.", "diagramType": "hang-loop" }
        ]
    },
    "butterfly-06": {
        "id": "butterfly-06",
        "kitNumber": 6,
        "title": "Concentric Petal Ring",
        "subtitle": "8 jewel-toned petal modules • Intermediate elevation layer",
        "description": "Vibrant secondary ring of folded botanical petals providing contrast, depth, and color transitions behind the hovering butterflies.",
        "difficulty": "Intermediate",
        "time": "20-25 min",
        "category": "decor",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#d946ef",
        "goal": "Eight curved botanical petals forming an organic rosette layer on Tier 2 of the armature",
        "paper": [
            { "color": "Magenta / Fuchsia Duo", "size": "3.5\" x 3.5\"", "qty": 8, "gsm": "70 gsm" }
        ],
        "tools": ["Bone Folder", "Shaping Dowel / Pencil"],
        "principles": ["Concentric color layering", "Botanical petal curvature", "Shadow projection onto armature"],
        "steps": [
            { "stepNumber": 1, "title": "Petal Module Pre-Creasing", "time": "5-6 min", "foldType": "Petal Base", "instruction": "Fold 8 identical kite-derived petal leaves in rich magenta duo paper.", "tip": "Fold in pairs for uniform leaf symmetry.", "diagramType": "petal-mod" },
            { "stepNumber": 2, "title": "Curved Petal Fluting", "time": "5-6 min", "foldType": "Roll Shaping", "instruction": "Roll petal edges outward over a round pencil to create an organic cupped leaf silhouette.", "tip": "Gentle curve catches ambient wall lighting.", "diagramType": "petal-flute" },
            { "stepNumber": 3, "title": "Armature Tier 2 Mounting", "time": "5-6 min", "foldType": "Socket Insertion", "instruction": "Slide petal stem tabs into the 1.0\" elevation standoffs on the armature frame.", "tip": "Stems lock with friction; align petals radially.", "diagramType": "petal-mount" },
            { "stepNumber": 4, "title": "Radial Symmetry Alignment", "time": "5-6 min", "foldType": "Inspection Check", "instruction": "Rotate frame and verify petal tips create an unbroken circular rosette backdrop.", "tip": "The fuchsia backdrop makes green and orange butterflies pop vividly.", "diagramType": "petal-align" }
        ]
    },
    "butterfly-07": {
        "id": "butterfly-07",
        "kitNumber": 7,
        "title": "Grand Mandala Wall Installation",
        "subtitle": "16-piece spatial choreography • Depth staging • Final lighting alignment",
        "description": "The ultimate assembly masterclass. Orchestrates all 16 folded butterflies and petals into a jaw-dropping 3D architectural wall sculpture.",
        "difficulty": "Intermediate-Advanced",
        "time": "30-40 min",
        "category": "decor",
        "collection": "butterfly",
        "collectionTitle": "Butterfly Mandala Set",
        "accent": "#f43f5e",
        "goal": "A synchronized 16-piece 3D wall art mandala with breathtaking geometric shadow depth",
        "paper": [
            { "color": "Completed Butterfly & Armature Callset", "size": "16 pre-folded units", "qty": 16, "gsm": "Various" }
        ],
        "tools": ["Level / Ruler", "Mounting Hook / Adhesive Pads", "Spotlight"],
        "principles": ["Golden spiral kinetic dispersal", "Multi-tier shadow interplay", "Museum-quality wall presentation"],
        "steps": [
            { "stepNumber": 1, "title": "Mount Armature & Petal Rosette", "time": "5-6 min", "foldType": "Wall Anchoring", "instruction": "Mount assembled Radial Armature (Kit 05) with Petal Ring (Kit 06) onto display wall using center anchor.", "tip": "Use bubble level to verify horizontal axis is true.", "diagramType": "wall-anchor" },
            { "stepNumber": 2, "title": "Epicenter Anchor: Golden Birdwing", "time": "5-6 min", "foldType": "Centerpiece Mount", "instruction": "Mount the large Golden Birdwing (Kit 03) onto the central 1.5\" standoff, hovering proud of the rosette.", "tip": "The gold underwing catches direct front lighting.", "diagramType": "birdwing-mount" },
            { "stepNumber": 3, "title": "Cardinal Anchors: 4 Monarchs", "time": "6-8 min", "foldType": "Cardinal Axis Mount", "instruction": "Mount 4 Swallowtail Monarchs (Kit 01) at 0°, 90°, 180°, and 270° on 1.0\" elevation standoffs.", "tip": "Angle wings toward center point to create inward visual tension.", "diagramType": "monarch-mount" },
            { "stepNumber": 4, "title": "Intercardinal Accents: 4 Morphos", "time": "6-8 min", "foldType": "Diagonal Axis Mount", "instruction": "Mount 4 Emerald Morphos (Kit 02) at 45°, 135°, 225°, and 315° on 0.5\" elevation standoffs.", "tip": "Staggering heights creates rich 3D overlap without crowding.", "diagramType": "morpho-mount" },
            { "stepNumber": 5, "title": "Perimeter Swarm: Pygmy Azure Trios", "time": "5-6 min", "foldType": "Spiral Swarm Mount", "instruction": "Arrange Pygmy Azure Trios (Kit 04) in an expanding logarithmic spiral trailing off outer wing tips.", "tip": "The miniature butterflies introduce dynamic kinetic flight motion.", "diagramType": "azure-swarm" },
            { "stepNumber": 6, "title": "Spatial Lighting & Shadow Check", "time": "3-4 min", "foldType": "Lighting Staging", "instruction": "Illuminate from 45-degree overhead angle. Observe the intricate multi-tier cast shadows on wall.", "tip": "Your museum-quality 3D Origami Mandala is complete!", "diagramType": "mandala-final" }
        ]
    }
}
kits.update(butterfly_kits)

# Write to origami-hyperframes/web/studio/kit-data.json
out_path = "origami-hyperframes/web/studio/kit-data.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(kits, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(kits)} kits in {out_path}!")
