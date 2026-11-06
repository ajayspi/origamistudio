# Original Multicolored 3D Architectural Origami Nativity Set

A completely original, sculptural nativity scene with architectural depth, multicolored jewel tones, and unique folded forms. Not copied from existing tutorials - designed from scratch with 3D architecture and rich detailing.

## Quick Start

For the full experience, read in this order:
1. **[ORIGINAL-DESIGNS.md](ORIGINAL-DESIGNS.md)** - Design philosophy, color palette, and concept
2. **[UNIQUE-FOLDING-GUIDE.md](UNIQUE-FOLDING-GUIDE.md)** - Step-by-step for original folds
3. **[SCENE-ASSEMBLY.md](SCENE-ASSEMBLY.md)** - Composition and assembly
4. **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Quick specs and materials

## Materials Needed

### Paper
- **Stable/Architecture**: Brown kraft/textured paper (6" squares, 2-3 sheets)
- **Holy Family**: Deep royal blue (4"), burgundy/wine (4.5"), cream/ivory (1.25")
- **Shepherd**: Olive/tan with warm accents (4")
- **Wise Men**: Imperial purple (5"), deep crimson (4.75"), emerald (4.5") - jewel tones
- **Angel**: Pearlescent white/ivory (4")
- **Star**: Heavy gold foil paper (3-4")
- **Animals**: Cream (2.5-3"), warm grey/brown (3-3.5")
- **Ground/Details**: Light tan (4-6"), gold foil strips for accents

### Tools & Display
- Bone folder (highly recommended for crisp folds)
- Small tray/display base (8-10")
- Tweezers for detail work

## Key Features

- **Architectural Stable** - Angled walls, recessed alcove, layered roof (not a simple box)
- **Sculptural Figures** - Real 3D forms with drapery, volume, and movement
- **Rich Royal Palette** - Deep jewel tones with gold accents
- **Original Designs** - Each figure uniquely folded with its own character
- **Dramatic Composition** - Depth, varied poses, storytelling through placement
- **Multicolored 3D Architecture** - Layered construction creating shadows and dimension

## Required Models

| Piece | Paper Size | Difficulty | Notes |
|---|---|---|---|
| Stable/Manger | 6" square (or 2x) | Easy | Use [Origami Box](https://origami.me/box/) - lidless |
| Baby Jesus | 1.5-2" square | Very Easy | Swaddled fold below |
| Mary | 3" square (blue) | Very Easy | Robe figure below |
| Joseph | 4" square (brown/olive) | Very Easy | Robe figure below |
| Angel | 3" square (white) | Very Easy | [Origami Angel](https://origami.me/angel/) |
| Star | 3-4" square (gold/foil) | Very Easy | [5-Pointed Star](https://origami.me/5-pointed-star/) |
| Shepherd | 3-4" square (earth tones) | Very Easy | Robe figure |
| Wise Men (3) | 4" squares (red/purple/gold) | Very Easy | Robe figures, vary colors/sizes |
| Sheep (2-4) | 2-3" squares (white) | Very Easy | Simple animal fold below |
| Donkey/Ox (optional) | 3" squares (grey/brown) | Easy | Use [Origami Animals](https://origami.me/origami-animals/) |

## Step-by-Step Instructions

### 1. Stable (Manger)
Use the [Masu Box](https://origami.me/box/) tutorial. Make it lidless - this becomes your open stable.

*Optional:* Make a much smaller box to use as the actual manger inside it.

### 2. Baby Jesus (Swaddled)
*Paper: 1.5-2" square, white/cream*

1. Start white/color side up. Fold in half diagonally, unfold.
2. Fold both bottom corners up to top point → diamond shape.
3. Fold top point down ~1/3 of the way.
4. Flip over. Done. Place in crumpled yellow/tan paper in manger.

### 3. Robe Figures (Mary, Joseph, Shepherd, Wise Men)
*Paper: 3-4" square. Use 4" for taller figures (Joseph, Wise Men), 3" for shorter (Mary, Shepherd)*

Uses principles from [beginners guide](https://origami.me/beginners-guide/) (blintz fold, valley/mountain folds).

1. **Start:** Color side down. Fold in half diagonally both ways, unfold.
2. **Blintz:** Fold all four corners to center point. Flip over.
3. **Form body:** Fold top point down ~halfway to form head/hood.
4. **Base:** Fold bottom point up to create a flat standing base. Adjust until stable.
5. **Finish:** Shape gently. Done.

*Tips:* For Wise Men, fold head less (taller turban). For shepherd, keep looser.

### 4. Sheep
*Paper: 2-3" square, white/cream*

1. Start white side up. Fold in half diagonally, unfold.
2. Fold bottom two corners to center → kite base ([Kite Base](https://origami.me/beginners-guide/#kite-base)).
3. Fold top point down ~halfway.
4. Flip over. Fold side points slightly inward to round body.
5. Fold bottom point up slightly for stability. Done.

### 5. Angel
Follow [Origami Angel](https://origami.me/angel/) tutorial. Place above stable or star.

### 6. Star
Follow [5-Pointed Star](https://origami.me/5-pointed-star/) tutorial. Use gold/foil paper for best effect.

## Assembly
1. Fold lidless box as stable. Add small box + crumpled paper as manger if desired.
2. Place Baby Jesus in manger. Add Mary and Joseph nearby.
3. Position Shepherd and sheep around/outside stable.
4. Place Wise Men approaching from other side.
5. Add Angel above, Star on top or above stable.
6. Arrange on display tray.

## Tips
- Scale consistently - people similar size, animals smaller
- Foil for star really pops
- Generous base fold on robe figures for stability (especially on carpet)
- Get kids to do box, sheep, robe figures; adults do trickier stars
- Imperfect = charming!


--------------------------------------------------------------------------------

## Interface
- `web/index.html` [web/index.html]: Exhibition gallery interface for the 10-piece nativity architectural assembly.
- `tutorials/interactive-tutorial.html` [tutorials/interactive-tutorial.html]: Step-by-step interactive folding guide.
- `tutorials/kit-data.json` [tutorials/kit-data.json]: Structured piece metadata and folding step sequences.
- `print-guides/` [print-guides/]: High-resolution printable pattern guides for physical construction.

## Invariants
- Each figure must maintain proportional scaling (Stable: 6" base; Robe figures: 3-4" squares; Baby Jesus: 1.5-2" squares) [README.md:Materials].
- Robe figures require a bottom base fold to ensure freestanding tabletop balance [README.md:Robe Figures].

## Side Effects
- None: Pure static client-side documentation, HTML presentations, and JSON asset catalogs.

## Verification
- Run: Open `nativity-set/web/index.html` in browser.
