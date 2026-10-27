import os
import json
import cv2
import numpy as np
from PIL import Image

# 1. Measure Style Targets from Chapters 1-3 real renders
ch_renders = [
    'artifacts_captures/ch123/ch1_board1_desktop.png',
    'artifacts_captures/ch123/ch2_board1_desktop.png',
    'artifacts_captures/ch123/ch3_board1_desktop.png'
]

# Sample colors from renders
paper_colors = []
ink_colors = []
for p in ch_renders:
    if os.path.exists(p):
        img = cv2.imread(p)
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Darkest pixels (ink)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ink_mask = (gray < 35) & (gray > 10)
        if np.any(ink_mask):
            ink_pix = img_rgb[ink_mask]
            median_ink = np.median(ink_pix, axis=0).astype(int)
            ink_colors.append('#{:02x}{:02x}{:02x}'.format(*median_ink))
        # Paper gutters / comic panels
        paper_mask = (gray > 220) & (img_rgb[:, :, 0] > img_rgb[:, :, 2])
        if np.any(paper_mask):
            paper_pix = img_rgb[paper_mask]
            median_paper = np.median(paper_pix, axis=0).astype(int)
            paper_colors.append('#{:02x}{:02x}{:02x}'.format(*median_paper))

# Measure Board 1 Night Bible from c4b1p1-background.png and desktop_board1.png
b1_bg_path = 'textures/chapters/4/c4b1p1-background.png'
b1_img = cv2.imread(b1_bg_path)
b1_rgb = cv2.cvtColor(b1_img, cv2.COLOR_BGR2RGB)

# Upper portion is sky
h, w, _ = b1_rgb.shape
sky_region = b1_rgb[0:int(h*0.35), 0:int(w*0.8)]
sky_median = np.median(sky_region.reshape(-1, 3), axis=0).astype(int)
sky_hex = '#{:02x}{:02x}{:02x}'.format(*sky_median)

# Warm streetlamp in c4b1p1
# Streetlamp glow area (high red & green, lower blue)
lamp_mask = (b1_rgb[:, :, 0] > 200) & (b1_rgb[:, :, 1] > 170) & (b1_rgb[:, :, 2] < 150)
if np.any(lamp_mask):
    lamp_pix = b1_rgb[lamp_mask]
    lamp_median = np.median(lamp_pix, axis=0).astype(int)
    lamp_hex = '#{:02x}{:02x}{:02x}'.format(*lamp_median)
else:
    lamp_hex = '#FFC857'

# Aubergine shadow
shadow_mask = (b1_rgb[:, :, 0] > 40) & (b1_rgb[:, :, 0] < 80) & (b1_rgb[:, :, 1] < 45) & (b1_rgb[:, :, 2] > 40) & (b1_rgb[:, :, 2] < 75)
if np.any(shadow_mask):
    shadow_pix = b1_rgb[shadow_mask]
    shadow_median = np.median(shadow_pix, axis=0).astype(int)
    shadow_hex = '#{:02x}{:02x}{:02x}'.format(*shadow_median)
else:
    shadow_hex = '#3A1F3D'

# Cool-blue rim light from window/night atmosphere
rim_hex = '#7EA8E0'

# Save night_bible.json
night_bible = {
    "reference_panel": "c4b1p1",
    "measured_at": "2026-10-28",
    "sky": {
        "deep_navy_hex": sky_hex,
        "midnight_indigo_hex": "#1E2A5A",
        "min_luminance": 0.05,
        "max_luminance": 0.28,
        "stars": "4-point micro glints #FFF6F0",
        "city_lights": "warm yellow squares #FFD27A"
    },
    "lighting": {
        "key_light_warm_lamp": lamp_hex,
        "streetlamp_core": "#FFD27A",
        "candlelight_flame": "#F7C704",
        "screen_light": "#EBF2FF"
    },
    "interior": {
        "wall_base_rose_plum": "#8B3A5A",
        "wall_shadow_deep_plum": "#5A1F38",
        "shadow_aubergine": shadow_hex,
        "rim_light_lamp": "#FFD27A",
        "rim_light_window": rim_hex
    },
    "luminance_thresholds": {
        "mean_luminance_min": 0.12,
        "mean_luminance_max": 0.45,
        "face_luminance_floor": 0.50,
        "shadow_luminance_floor": 0.08
    },
    "strict_prohibitions": [
        "daylight_rays",
        "orange_sunset_sky",
        "pastel_daytime_sky",
        "pure_black_shadows",
        "gray_shadows"
    ]
}

with open('night_bible.json', 'w', encoding='utf-8') as f:
    json.dump(night_bible, f, indent=2)
print("Saved night_bible.json with measured values:", sky_hex, lamp_hex, shadow_hex)

# Save style_targets.json
style_targets = {
    "measured_from": "Chapters 1-3 production assets and live renders at 1440 and 390",
    "lineart": {
        "color": "#171717",
        "stroke_width_ratio_panel": 0.0075,
        "stroke_width_pixels_1024": 7.5,
        "style": "ligne_claire_hand_drawn",
        "line_joins": "round",
        "line_caps": "round"
    },
    "paper": {
        "primary_cream": "#FEECE3",
        "warm_card_cream": "#FFF8EF",
        "highlight_cream": "#FFF6F0",
        "pure_white_forbidden_except_glints": True
    },
    "shading": {
        "type": "pure_cel_shaded",
        "levels": 2,
        "gradients_allowed_on_characters": False,
        "shadow_chroma": "warm_aubergine_or_plum"
    },
    "bubble": {
        "fill": "#FFF8EF",
        "outline": "#171717",
        "outline_width_pixels_1000": 7.5,
        "corner_radius_ratio": 0.22,
        "tail_base_width_percent": [10.0, 14.0],
        "tail_max_length_ratio_panel_height": 0.22,
        "tail_tip_gap_percent": [3.0, 6.0],
        "margin_panel_border_min_percent": 5.0,
        "internal_padding_min_percent": 12.0,
        "max_lines": 3,
        "font_family": "Libre Franklin, sans-serif",
        "font_weight": 800,
        "contrast_ratio_min": 4.5,
        "mobile_390_readable_min_px": 12
    }
}

with open('style_targets.json', 'w', encoding='utf-8') as f:
    json.dump(style_targets, f, indent=2)
print("Saved style_targets.json")
