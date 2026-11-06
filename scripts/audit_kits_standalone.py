import json
from pathlib import Path

# Resolved from the repo root so it runs from anywhere.
path = Path(__file__).resolve().parent.parent / "origamistudio" / "src" / "data" / "kits.json"
with open(path, 'r', encoding='utf-8') as f:
    kits = json.load(f)

print(f"Total kits: {len(kits)}")

pavilions = {
    'japanese': lambda k: k.get('collection') == 'japanese',
    'indian': lambda k: k.get('collection') == 'indian' or k.get('category') == 'cultural',
    'chinese': lambda k: k.get('collection') == 'chinese',
    'american': lambda k: k.get('collection') == 'american',
    'botanica': lambda k: k.get('collection') in ['lotus', 'butterfly'],
    'polyhedra': lambda k: k.get('collection') in ['geometric', 'nativity', 'holiday']
}

pavilion_counts = {p: 0 for p in pavilions}
kit_pavilion_map = {}
unmatched = []
multi_matched = []

for kit_id, kit in kits.items():
    matched = []
    for p_id, fn in pavilions.items():
        if fn(kit):
            matched.append(p_id)
    if len(matched) == 0:
        unmatched.append(kit_id)
    elif len(matched) > 1:
        # Check if indian vs polyhedra/botanica overlaps
        multi_matched.append((kit_id, matched))
    else:
        pavilion_counts[matched[0]] += 1
        kit_pavilion_map[kit_id] = matched[0]

print("Pavilion Counts:")
for p, c in pavilion_counts.items():
    print(f"  {p}: {c} kits")
print(f"Total matched uniquely: {sum(pavilion_counts.values())}")
print(f"Unmatched kits: {unmatched}")
print(f"Multi-matched kits: {multi_matched}")

# Grade Tier counts
grade_counts = {'sprouts': 0, 'explorers': 0, 'stem': 0}
for kit_id, kit in kits.items():
    diff = kit.get('difficulty', '')
    if diff in ['Beginner', 'Beginner-Intermediate']:
        grade_counts['sprouts'] += 1
    if diff in ['Beginner', 'Beginner-Intermediate', 'Intermediate']:
        grade_counts['explorers'] += 1
    if any(x in diff for x in ['Intermediate-Advanced', 'Advanced', 'Master']):
        grade_counts['stem'] += 1

print("\nGrade Tier Counts (Explorers includes Sprouts + Intermediate):")
print(f"  Sprouts (K-3): {grade_counts['sprouts']} kits")
print(f"  Explorers (4-8): {grade_counts['explorers']} kits")
print(f"  STEM Champions (9-12): {grade_counts['stem']} kits")

# Check step validity
step_issues = []
for kit_id, kit in kits.items():
    steps = kit.get('steps', [])
    if not steps:
        step_issues.append((kit_id, 'No steps'))
    for idx, s in enumerate(steps):
        if not s.get('title') or not s.get('instruction') or not s.get('foldType'):
            step_issues.append((kit_id, f"Step {idx+1} missing fields"))

print(f"\nStep integrity issues across 434 steps: {len(step_issues)}")
