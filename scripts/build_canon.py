import json

canon = {
    "door": {
        "canonical_panel_references": ["c4b2p2", "c4b2p3"],
        "outlier_to_fix": "c4b2p1",
        "spec": {
            "color": "#1E2B45 (Dark Navy Blue)",
            "material": "Painted wood with vertical recessed panels",
            "frame_trim": "Off-white / cream frame molding (#FFF6F0)",
            "plate": "Long vertical brass plate with rounded top and bottom ends",
            "handle": "Horizontal brass lever handle pointing inward toward hallway",
            "keyhole": "Yes, centered in lower half of brass plate below handle",
            "peephole": False,
            "hinge_side": "Right side",
            "opening_direction": "Swings inward into apartment from right to left"
        },
        "rationale": "P2 is the close-up macro detail of the door and handle, and P3 shows the interior door jamb with the identical navy door. P1 was the sole outlier showing brown wood and a round peephole."
    },
    "study_room": {
        "canonical_panel_references": ["c4b3p1", "c4b4p3", "c4b6p1", "c4b8p1"],
        "outliers_to_fix": ["c4b5p1", "c4b5p2"],
        "spec": {
            "window": "Multi-pane wooden frame, deep navy night sky (#08244A) with distant stars and city building silhouettes. Sill planter with pink blooming flowers lit from below.",
            "desk": "Warm oak/maple wood desk with smooth rounded edges.",
            "desk_lamp": "Brushed brass curved lamp on right rear desk corner casting warm amber key light (#FDB662).",
            "chair": "Comfortable pink upholstered fabric chair with scallop-fluted backrest.",
            "pencil_cup": "Pastel pink ceramic cup with debossed small heart containing colored pencils/pens on right side of desk.",
            "mug": "Cream white ceramic mug with soft pink peony print.",
            "bookshelf": "Floating wooden wall shelf behind desk with neatly stacked colorful books.",
            "framed_art": "Two small framed prints on rose-plum wall (pink flower, warm heart).",
            "laptop": "Silver thin MacBook with black keys, centered on desk facing Tifa."
        },
        "rationale": "B3 P1, B4 P3, B6 P1, and B8 P1 consistently feature the pink scalloped chair, pink heart pencil cup, and night window with city skyline. B5 P2's background had an inconsistent wooden slat chair and floral mug, and B5 P1 had sunset clouds."
    },
    "outfit": {
        "canonical_character": "Tifa",
        "outliers_to_fix": ["c4b5p1 (hoodie drawstrings in cake-startled variant)"],
        "spec": {
            "outerwear": "Fitted navy blue track jacket (#2B3C5E) with turn-down collar (STRICTLY NO HOOD, NO DRAWSTRINGS), white collar and front zipper piping, light-blue cuffs (#9AB5D9) rolled up at forearms.",
            "top": "Black inner round-neck t-shirt (#1E1E22).",
            "jewelry": "Delicate silver cord necklace with single circular white pendant (#FFFFFF) centered below collarbone.",
            "bottom": "High-waisted black pleated tennis / A-line skirt (#1E1E22).",
            "legwear": "White ruffled / scalloped ankle socks (#F6F5F2) and glossy black Mary Jane shoes (#191819) with buckles.",
            "bag": "Black crossbody bag with white four-leaf clover charm (#FFFFFF)."
        },
        "rationale": "Matches 9 of 10 panels and Character Lock Sheet. Drawstrings on B5 P1 are an anomaly to be removed."
    },
    "time_and_lighting": {
        "environment": "One continuous late night across all 8 boards.",
        "thresholds": {
            "sky_hue_range_deg": [200, 240],
            "sky_max_luminance": 0.28,
            "key_light_hue_deg": 35.0,
            "key_light_hue_tolerance_deg": 8.0,
            "face_min_luminance": 0.25,
            "shadow_color": "#36292A / #3A1F3D (warm aubergine)",
            "ambient_wall": "#8B3A5A / #B5546A (rose-plum)"
        },
        "prohibitions": ["daylight", "sunset", "orange_clouds", "gray_shadows", "pure_black_shadows"]
    },
    "bubble_spec": {
        "dialogue": {
            "shape": "organic rounded squircle capsule, corner radius 20-22px at 1000px height",
            "path": "one merged path body + tail (no seam)",
            "stroke": "#171717",
            "stroke_width": 7.5,
            "stroke_linejoin": "round",
            "stroke_linecap": "round",
            "fill": "#FFF8EF",
            "tail_base_width_percent": [10.0, 14.0],
            "tail_max_length_percent": 22.0,
            "tail_tip_gap_percent": [3.0, 6.0],
            "margin_min_percent": 5.0,
            "padding_min_percent": 12.0,
            "font_family": "Libre Franklin, 'Comic Neue', Arial, sans-serif",
            "font_weight": 800,
            "tail_rule": "Tail points toward speaker origin, stops 4-6% short of head/face side. NEVER touches hair parting, face, eyes, or forehead."
        },
        "narration_caption": {
            "shape": "rectangular card with corner radius 16px",
            "stroke": "#171717",
            "stroke_width": 7.5,
            "stroke_linejoin": "round",
            "fill": "#FFF8EF",
            "tail": "NONE",
            "text_transform": "uppercase",
            "font_weight": 800,
            "letter_spacing": 1.2
        },
        "inner_monologue": {
            "treatment": "rectangular caption card (consistent with narration spec, no tail)",
            "panels": ["c4b2p1"]
        },
        "sfx": {
            "shape": "vector starburst polygon with sharp peaks and rounded joints",
            "stroke": "#171717",
            "stroke_width": 8.0,
            "fill": "#FFF8EF",
            "text_fill": "#F87800",
            "text_stroke": "#171717",
            "font_style": "italic",
            "font_weight": 900,
            "pulse_animation": True
        },
        "in_scene_banner": {
            "treatment": "measured overlay matching ribbon curve, centered text",
            "panels": ["c4b7p1"]
        }
    }
}

with open('canon.json', 'w', encoding='utf-8') as f:
    json.dump(canon, f, indent=2)

print("Saved canon.json with all canonical design and continuity decisions.")
