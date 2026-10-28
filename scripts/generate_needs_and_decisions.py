import json

needs = [
    {
        "need_id": "NEED-01",
        "panel_id": "c4b1p1",
        "description": "Drifting nocturnal flower petals beneath the streetlights to enhance the atmosphere of the walk home.",
        "target_size_px": [32, 32],
        "target_size_2x_px": [64, 64],
        "perspective": "flat frontal 2.5D floating plane",
        "light_grade_required": "night_bible exterior zone (#EB8DB7 with 15% dusky aubergine multiply)",
        "is_animated": True,
        "motion_spec": "gentle sinusoidal float and rotation, amplitude 8px, period 3.2s"
    },
    {
        "need_id": "NEED-02",
        "panel_id": "c4b2p2",
        "description": "Tactile comic pop-in micro-animation for the 'CLICK!' lock sound effect.",
        "target_size_px": [180, 110],
        "target_size_2x_px": [360, 220],
        "perspective": "starburst SFX sticker parallel to camera",
        "light_grade_required": "high-contrast warm light burst #FEECE3 fill with #171717 outline",
        "is_animated": True,
        "motion_spec": "instant pop-in with back.out(1.8) on focus enter"
    },
    {
        "need_id": "NEED-03",
        "panel_id": "c4b3p1",
        "description": "Warm ambient breathing glow on the bedside/desk lamp to enrich the quiet midnight room.",
        "target_size_px": [240, 240],
        "target_size_2x_px": [480, 480],
        "perspective": "isometric desk angle",
        "light_grade_required": "night_bible interior_desk_bedroom (#FFDA88)",
        "is_animated": True,
        "motion_spec": "subtle breathing luminance oscillation sin(t * 1.6) * 0.03"
    },
    {
        "need_id": "NEED-04",
        "panel_id": "c4b4p2",
        "description": "Magical golden sparkle particles and drifting petals radiating outward from the laptop display.",
        "target_size_px": [48, 48],
        "target_size_2x_px": [96, 96],
        "perspective": "laptop screen emissive cone",
        "light_grade_required": "magical gold #F7C704 and peony pink #EB8DB7",
        "is_animated": True,
        "motion_spec": "outward radial drift with scale pulse 0.7 -> 1.1 -> 0.0"
    },
    {
        "need_id": "NEED-05",
        "panel_id": "c4b6p1",
        "description": "Candlelight micro-flicker on the 23 candles of the birthday cake hero splash.",
        "target_size_px": [600, 300],
        "target_size_2x_px": [1200, 600],
        "perspective": "straight-on hero centerpiece view",
        "light_grade_required": "warm golden candlelight #FFAE42 with core highlight #FFF8EF",
        "is_animated": True,
        "motion_spec": "organic candlelight shimmer, multi-frequency sin(t*7.1) + sin(t*13.3) * 0.02"
    },
    {
        "need_id": "NEED-06",
        "panel_id": "c4b8p1",
        "description": "Subtle emotional heartbeat pulse on the keepsake letter card held by Tifa.",
        "target_size_px": [280, 160],
        "target_size_2x_px": [560, 320],
        "perspective": "held forward in hands, facing reader",
        "light_grade_required": "warm cream paper #FFF8EF with pink heart accent #EB8DB7",
        "is_animated": True,
        "motion_spec": "heartbeat rhythm: double-pulse scale (1.0 -> 1.018 -> 1.008 -> 1.0) every 2.6s"
    }
]

with open('reuse_needs.json', 'w', encoding='utf-8') as f:
    json.dump(needs, f, indent=2)
print("Saved reuse_needs.json")

decisions = [
    {
        "need_id": "NEED-01",
        "panel": "c4b1p1",
        "candidate_evaluated": "textures/chapters/1/c1b10p1-leafs.png",
        "candidate_rights": "RESTRICTED (scraped 3rd-party asset by Justine Soulié & Patrick Heng)",
        "rights_gate_pass": False,
        "rejection_reason": "Violates ATURAN KERAS 2 (third-party scraped asset). Also leaves are green daylight foliage, not nocturnal cherry/peony petals.",
        "decision": "ADAPT_CLEARED",
        "cleared_source": "assets_v4/c4-effects-sprites.svg (#petal-pink-1, #petal-pink-2)",
        "scores": {
            "semantic_fit": 9.5,
            "style_fit": 9.5,
            "perspective_scale": 9.0,
            "resolution_2x": 10.0,
            "night_adaptability": 9.5,
            "anti_collage_risk": 9.5,
            "performance_overhead": 9.8
        },
        "total_score": 9.54,
        "resolution_summary": "Adapted CLEARED Chapter 4 vector petal sprites with nocturnal palette grade (#EB8DB7 with night ambient) and sinusoidal GSAP float."
    },
    {
        "need_id": "NEED-02",
        "panel": "c4b2p2",
        "candidate_evaluated": "textures/chapters/1/c1b5p1-toot.png",
        "candidate_rights": "RESTRICTED (scraped 3rd-party asset by Justine Soulié & Patrick Heng)",
        "rights_gate_pass": False,
        "rejection_reason": "Violates ATURAN KERAS 2 (third-party scraped asset). 'TOOT' audio context is horn sound, not door lock turning.",
        "decision": "ADAPT_CLEARED",
        "cleared_source": "assets_v4/text/en/c4b2p2-text.svg (custom CLICK! starburst bubble)",
        "scores": {
            "semantic_fit": 10.0,
            "style_fit": 9.8,
            "perspective_scale": 9.5,
            "resolution_2x": 10.0,
            "night_adaptability": 9.5,
            "anti_collage_risk": 9.8,
            "performance_overhead": 9.9
        },
        "total_score": 9.79,
        "resolution_summary": "Leverage existing CLEARED vector starburst SFX mesh, enhanced with tactile pop-in scale curve on panel focus."
    },
    {
        "need_id": "NEED-03",
        "panel": "c4b3p1",
        "candidate_evaluated": "_atlas_unpacked/chapters/2/c2b1p1/lamp-in.png",
        "candidate_rights": "RESTRICTED (scraped 3rd-party asset by Justine Soulié & Patrick Heng)",
        "rights_gate_pass": False,
        "rejection_reason": "Violates ATURAN KERAS 2 (third-party scraped asset). Bar lamp fixture style does not match Tifa's cozy bedroom decor.",
        "decision": "GENERATE_BARU",
        "cleared_source": "Procedural shader uniform pulse (uIntensity modulation) in WebGL / GSAP timeline",
        "scores": {
            "semantic_fit": 9.0,
            "style_fit": 9.5,
            "perspective_scale": 9.5,
            "resolution_2x": 10.0,
            "night_adaptability": 10.0,
            "anti_collage_risk": 10.0,
            "performance_overhead": 10.0
        },
        "total_score": 9.71,
        "resolution_summary": "Implemented procedural ambient lamp breathe via WebGL uniform modulation. Zero asset payload increase, 100% style coherence."
    },
    {
        "need_id": "NEED-04",
        "panel": "c4b4p2",
        "candidate_evaluated": "textures/home/night-star.png",
        "candidate_rights": "RESTRICTED (scraped 3rd-party asset by Justine Soulié & Patrick Heng)",
        "rights_gate_pass": False,
        "rejection_reason": "Violates ATURAN KERAS 2 (third-party scraped asset). Static 4-point star lacks magical screen emissive dynamism.",
        "decision": "ADAPT_CLEARED",
        "cleared_source": "assets_v4/c4-effects-sprites.svg (#sparkle-gold, #petal-cluster)",
        "scores": {
            "semantic_fit": 9.5,
            "style_fit": 9.6,
            "perspective_scale": 9.2,
            "resolution_2x": 10.0,
            "night_adaptability": 9.4,
            "anti_collage_risk": 9.6,
            "performance_overhead": 9.7
        },
        "total_score": 9.57,
        "resolution_summary": "Utilized CLEARED Chapter 4 vector sparkles with multi-plane depth emission."
    },
    {
        "need_id": "NEED-05",
        "panel": "c4b6p1",
        "candidate_evaluated": "_atlas_unpacked/chapters/2/c2b1p1/lamp-out.png",
        "candidate_rights": "RESTRICTED (scraped 3rd-party asset by Justine Soulié & Patrick Heng)",
        "rights_gate_pass": False,
        "rejection_reason": "Violates ATURAN KERAS 2 (third-party scraped asset). Non-candlelight lighting geometry.",
        "decision": "GENERATE_BARU",
        "cleared_source": "High-frequency organic candlelight flicker shader uniform on Board 6 hero plane",
        "scores": {
            "semantic_fit": 10.0,
            "style_fit": 9.8,
            "perspective_scale": 9.8,
            "resolution_2x": 10.0,
            "night_adaptability": 10.0,
            "anti_collage_risk": 10.0,
            "performance_overhead": 9.9
        },
        "total_score": 9.93,
        "resolution_summary": "Shader-driven candlelight shimmer applied cleanly across the 23 candles. Retains verified 23-candle count with zero visual obstruction."
    },
    {
        "need_id": "NEED-06",
        "panel": "c4b8p1",
        "candidate_evaluated": "textures/chapters/1/c1b3p3-stickers.png",
        "candidate_rights": "RESTRICTED (scraped 3rd-party asset by Justine Soulié & Patrick Heng)",
        "rights_gate_pass": False,
        "rejection_reason": "Violates ATURAN KERAS 2 (third-party scraped asset). Sticker graphics are Ponpon sheep stickers, completely discordant with Tifa's birthday letter.",
        "decision": "ADAPT_CLEARED",
        "cleared_source": "textures/chapters/4/text/en/c4b8p1-letter.svg overlay",
        "scores": {
            "semantic_fit": 10.0,
            "style_fit": 9.8,
            "perspective_scale": 9.8,
            "resolution_2x": 10.0,
            "night_adaptability": 9.8,
            "anti_collage_risk": 10.0,
            "performance_overhead": 10.0
        },
        "total_score": 9.91,
        "resolution_summary": "Gentle 2.4s sine heartbeat scale modulation applied to the letter card overlay. Creates an emotional, living keepsake feel without distraction."
    }
]

with open('reuse_decisions.json', 'w', encoding='utf-8') as f:
    json.dump(decisions, f, indent=2)
print("Saved reuse_decisions.json")

creative_proposals = """# Creative Proposals (Improvisasi Terkendali)
Compiled per FASE 6 & ATURAN KERAS.
Strict constraint: Max 3 subtle enhancements per panel, fully compatible with prefers-reduced-motion, toggleable via feature flags, 0 visual disruption to characters or text.

| Proposal ID | Target Panel | Proposed Enhancement | Story Value & Impact | Technical Effort | Collage Risk | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PROP-01** | B1 · P1 & P2 | Subtle streetlamp breathing glow & nocturnal petal drift | Enhances nocturnal solitude & atmospheric continuity with the night walk | Low (WebGL uniform + GSAP sine drift) | None (uses CLEARED Ch4 vector sprites & shaders) | **APPROVED & ACTIVE** |
| **PROP-02** | B2 · P2 | Tactile pop-in scale pulse for 'CLICK!' starburst | Provides auditory/tactile satisfaction as Tifa unlocks her door | Very Low (GSAP back.out ease on focus) | None (native SVG vector overlay) | **APPROVED & ACTIVE** |
| **PROP-03** | B3 · P1 | Ambient desk lamp luminance breathe | Establishes the cozy warmth of home after walking in the dark | Low (uniform `uIntensity` subtle oscillation) | None (shader uniform) | **APPROVED & ACTIVE** |
| **PROP-04** | B4 · P2 | Outward magical petal & sparkle radiance from screen | Visually signals the transition from reality into magical birthday celebration | Medium (vector sprite particle emission) | None (CLEARED Ch4 effect sprites) | **APPROVED & ACTIVE** |
| **PROP-05** | B6 · P1 | Organic candlelight shimmer across 23 candles | Gives warmth and vibrant life to the centerpiece cake without hiding candle count | Low (procedural highlight modulation) | None (shader uniform) | **APPROVED & ACTIVE** |
| **PROP-06** | B8 · P1 | Gentle heartbeat pulse on keepsake letter card (2.4s period, 1.8% scale) | Expresses deep personal emotion and gratitude as she reads the friends' letter | Very Low (GSAP timeline on letter overlay) | None (vector keepsake card) | **APPROVED & ACTIVE** |

### Rejected Proposals
1. **Adding Ponpon Sheep or Bar patrons to B7 party**:
   - *Reason for Rejection*: Fails Rights Gate (RESTRICTED 3rd-party assets) and breaks story canon (Chapter 4 is Tifa's personal circle of close human friends, not a crowd of sheep mascots).
2. **Aggressive camera shake on B2P2 CLICK!**:
   - *Reason for Rejection*: Disorienting on mobile viewports; violates Franco-Belgian ligne claire calm reading rhythm.
3. **Floating 3D confetti particles across all panels**:
   - *Reason for Rejection*: Creates visual clutter and occludes hand-lettered dialogue bubbles and character facial expressions.
"""

with open('creative_proposals.md', 'w', encoding='utf-8') as f:
    f.write(creative_proposals)
print("Saved creative_proposals.md")
