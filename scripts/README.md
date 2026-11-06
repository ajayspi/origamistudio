# Origami Data & Kit Generation Scripts (`scripts`)

## Overview
Python utilities and automation scripts for generating, augmenting, auditing, and validating the 62-kit computational origami database used across OrigamiStudio and legacy web prototypes.

## Interface
- `generate_kits.py` [generate_kits.py]: Synthesizes baseline `kits.json` data containing paper specifications, step instructions, and cultural collection metadata.
- `add_indian_heritage.py` [add_indian_heritage.py]: Injects the Royal Indian Origami Heritage collection (Imperial Peacock, Mysore Elephant, Bengal Tiger, Diwali Diya, etc.) into the master kit dictionary.
- `audit_kits_standalone.py` [audit_kits_standalone.py]: Standalone validation runner verifying that all kits contain non-empty steps, valid difficulty classifications, and parseable step coordinates.
- `generate_global_studio.py` [generate_global_studio.py]: Compiles standalone single-file HTML distributions with embedded 3D Three.js viewers.

## Invariants
- Generated kit models must adhere to the `OrigamiKit` schema, requiring continuous 1-based step numbers (`stepNumber`) and non-empty instruction strings [audit_kits_standalone.py].
- Kit IDs must remain unique and follow kebab-case naming (`<culture>-<index>`) [generate_kits.py].

## Side Effects
- Local filesystem writes: Updates `origamistudio/src/data/kits.json` and `public/kits.json` during data regeneration [generate_kits.py, add_indian_heritage.py].

## Verification
- Run: `python scripts/audit_kits_standalone.py`
