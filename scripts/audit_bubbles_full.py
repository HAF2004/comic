import json
import os
import re

# Load script
script_path = 'storyboard/chapter4-text-script.md'
with open(script_path, 'r', encoding='utf-8') as f:
    script_lines = f.readlines()

script_map = {}
for line in script_lines:
    if line.startswith('| B'):
        parts = [p.strip() for p in line.split('|')[1:-1]]
        if len(parts) >= 3:
            p_label = parts[0]
            en_text = parts[1]
            fr_text = parts[2]
            # Map B1 · panel 1 -> c4b1p1
            m = re.match(r'B(\d+)\s*·\s*panel\s*(\d+)(?:\s*\((.*?)\))?', p_label)
            if m:
                b = m.group(1)
                p = m.group(2)
                sub = m.group(3) or ''
                key = f"c4b{b}p{p}"
                if sub:
                    key = f"c4b{b}p{p}_{sub}"
                script_map[key] = {
                    "label": p_label,
                    "en": en_text,
                    "fr": fr_text
                }

# Load bubbles.json
with open('bubbles.json', 'r', encoding='utf-8') as f:
    bubbles = json.load(f)

bubble_audit = {}

for key, entry in bubbles.items():
    # Compare with script
    script_entry = script_map.get(key)
    if not script_entry and key.startswith('c4b7p1'):
        script_entry = script_map.get('c4b7p1_banner')
    elif not script_entry and key == 'c4b8p1_caption':
        script_entry = script_map.get('c4b8p1_caption')
    elif not script_entry and key == 'c4b8p1_letter':
        script_entry = script_map.get('c4b8p1_letter')
        
    text_matches_en = False
    text_matches_fr = False
    diff_en = ""
    diff_fr = ""
    
    if script_entry:
        text_matches_en = (entry['text']['en'].strip() == script_entry['en'].strip())
        text_matches_fr = (entry['text']['fr'].strip() == script_entry['fr'].strip())
        if not text_matches_en:
            diff_en = f"Expected: '{script_entry['en']}', Got: '{entry['text']['en']}'"
        if not text_matches_fr:
            diff_fr = f"Expected: '{script_entry['fr']}', Got: '{entry['text']['fr']}'"
    else:
        diff_en = "Key not found in script mapping"

    # Tail length calculation
    tail_len = None
    tail_base_w = None
    tip_gap = None
    
    b_box = entry.get('bubble', {})
    t_target = entry.get('tailTarget')
    
    if t_target and b_box:
        # Distance from bottom of bubble to tailTarget
        bx = b_box['x'] + b_box['w'] / 2
        by = b_box['y'] + b_box['h']
        tx = t_target['x']
        ty = t_target['y']
        tail_len = round(((tx - bx)**2 + (ty - by)**2)**0.5, 2)
        tail_base_w = round(b_box['w'] * 0.12, 2)

    # Check margin to border
    margin_x = min(b_box.get('x', 0), 100 - (b_box.get('x', 0) + b_box.get('w', 0)))
    margin_y = min(b_box.get('y', 0), 100 - (b_box.get('y', 0) + b_box.get('h', 0)))

    # Issues detection
    issues = []
    if not text_matches_en:
        issues.append(f"EN text mismatch: {diff_en}")
    if not text_matches_fr:
        issues.append(f"FR text mismatch: {diff_fr}")
    if margin_x < 5.0 or margin_y < 5.0:
        issues.append(f"Margin too close to panel border ({margin_x}%, {margin_y}%)")
    if tail_len and tail_len > 25.0:
        issues.append(f"Tail length excessive ({tail_len}% of panel)")

    bubble_audit[key] = {
        "board": entry.get('board'),
        "panel": entry.get('panel'),
        "type": entry.get('type'),
        "speaker": entry.get('speaker'),
        "text_en": entry['text']['en'],
        "text_matches_en": text_matches_en,
        "text_matches_fr": text_matches_fr,
        "bubble_box": b_box,
        "tail_target": t_target,
        "tail_curve": entry.get('tailCurve'),
        "tail_length_est": tail_len,
        "margin_panel_min": min(margin_x, margin_y),
        "issues": issues
    }

with open('bubble_audit.json', 'w', encoding='utf-8') as f:
    json.dump(bubble_audit, f, indent=2)

print(f"Bubble audit complete for {len(bubble_audit)} bubbles. Issues found:")
for k, v in bubble_audit.items():
    if v['issues']:
        print(f"  {k}: {v['issues']}")
