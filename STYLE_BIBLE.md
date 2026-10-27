# PONPON MANIA — OFFICIAL VISUAL DESIGN SYSTEM & STYLE BIBLE
*Reverse-engineered directly from Chapters 1, 2, and 3 source code, shader uniforms, CSS, and raster assets.*

---

## 1. PROJECT ARCHITECTURE & TECH STACK

- **Platform**: Single Page Application (SPA) Comic Reader built on Nuxt 3 / Vue 3, bundled with Vite.
- **Rendering Engine**: Custom WebGL 2.5D/3D comic viewer powered by **OGL** (lightweight WebGL library).
- **Animation Framework**: **GSAP** (`S.to`, `S.fromTo`, `this.createTL()`) with custom elastic, back, and exponential easing curves.
- **Texture & Compression Pipeline**: 
  - Source assets: High-resolution PNGs (RGB + RGBA) and JPEG depth maps.
  - Sprite Atlases: Packed via **Free Texture Packer (v0.6.7)** producing JSON frame manifests (`sprite-data.json`) with trimmed bounding boxes and normalized `pivot` coordinates (`{x, y}`).
  - GPU Texture Compression: **Basis Universal (.basis KTX)** files in standard and `-small.basis` variants for low-bandwidth mobile.
- **Typography Engine**: Google Fonts **Libre Franklin** (weights 100..900) for UI, paired with custom hand-lettered all-caps comic lettering for speech balloons and narration captions.
- **Asset Categories**:
  1. **MOTION Assets**: Separate articulated PNG cutout parts (heads, bodies, arms, eyes, props) animated via GSAP timelines or WebGL shader displacement.
  2. **STATIC Assets**: Full-panel background plates, architectural line drawings, and environmental layouts.
  3. **TEXT / SPEECH BUBBLES**: Hand-drawn balloons with cream fill (`#FEECE3`), black ink border (`#171717`), and localized text (`-en.png` / `-fr.png`).
  4. **DEPTH MAPS**: 8-bit grayscale parallax maps (`*-depth.png` / `*-depth.jpg`) driving 2.5D parallax displacement shaders (`id: 'depth-map'`).
  5. **SPRITE DATA**: JSON manifests (`*-sprite-data.json`) defining multi-part frame geometries, UV coordinates, and anchor pivots.

---

## 2. INVARIANTS (Universal Rules Across All Chapters)

These rules are non-negotiable and identical across Chapters 1, 2, and 3:

1. **Ligne Claire Ink Outline**:
   - Every character, object, panel border, and speech bubble MUST have an ink contour line.
   - Outline Color: Hex `#171717` (solid carbon black, never pure `#000000` and never gray).
   - Outline Thickness: Hand-drawn brush thickness of **6px to 12px** at 1024px canvas scale (averaging ~8px on bubbles, 10px on character contours, 4–6px on interior secondary details).
   - Line Quality: Expressive, slightly organic hand-drawn wobble; rounded line caps and smooth line joins. Zero digital pixel aliasing or mechanical vector stiffness.

2. **Paper / Cream Base Tone**:
   - Gutter, comic margins, paper overlays, and speech bubble fills ALWAYS use warm cream peach:
     - Primary Paper / Bubble Fill: `#FEECE3`
     - Light Cream Variant: `#FFF6F0`
     - Warm Light Yellow Accent: `#FFF8EF`
   - Pure white (`#FFFFFF`) is strictly forbidden for speech bubbles or paper panels; white is reserved exclusively for specular highlights (e.g., eye glints, tooth highlights).

3. **Coloring & Shading Model**:
   - Strictly **Cel-Shaded** (2-tone to 3-tone hard-edge shading).
   - Gradients on character anatomy are strictly forbidden. All shadow shapes are drawn with crisp, deliberate ink-like boundaries.
   - Shadows are warm, never desaturated gray. Shadow color is typically a deeper, warmer tint of the base hue (e.g. skin `#F9E7CA` shades to `#E5B58C`; sheep wool `#F8EFE4` shades to `#EEDBC8` / `#D9C4B0`).

4. **Speech Bubble Construction**:
   - Organic rectangular balloon with rounded corners (corner radius ~14–22px).
   - Tail is an organic, curved triangular beak pointing directly toward the speaker's mouth.
   - Bubble fill is `#FEECE3`; bubble outline is `#171717` (stroke-width: ~7.5px).
   - Lettering is centered, all-caps, with organic baseline variations, bold weights, and generous internal padding (safe margin: at least 18px horizontal, 14px vertical).

5. **Panel & Gutter Layout**:
   - Horizontal reading strip (`chapterScroll`), flowing left-to-right.
   - Default board aspect ratio is `1.0` (square board container, height ~0.74 of screen viewport).
   - Panels within boards follow strict harmonic ratios:
     - Full Square: `1.0` (1:1)
     - Panoramic Split: `2.1` (top panel y: `+squarePos`, bottom panel y: `-squarePos`)
     - 4-Panel Grid: Four `1.0` panels arranged at `{-t, +t}`, `{+t, +t}`, `{-t, -t}`, `{+t, -t}`.
   - All panels have white/cream borders separating them from the animated gradient background.

6. **Motion Easing & Physics**:
   - Pop-in transitions on board enter use **GSAP Back / Elastic** easing:
     - Primary pop-in: `back.out(1.6)` or `back.out(1.7)` (duration: 0.4s to 0.5s).
     - Bubble float / idle breathing: Oscillating sine-wave physics (`Math.sin(time * speed) * amplitude`).
     - Springy gestures: `elastic.out(1, 0.8)` or `elastic.out(1.2, 0.5)`.

---

## 3. CHAPTER VARIATIONS & PROGRESSION LOGIC

What intentionally changes across chapters:

| Dimension | Chapter 1 (The Big Stage) | Chapter 2 (The Bar Night) | Chapter 3 (Alpaca Marny) | Chapter 4 Design Spec (Tifa's Birthday) |
| :--- | :--- | :--- | :--- | :--- |
| **Theme / Setting** | Megalopolis concert stage & party | Late night bar ("Le Loubar") | Sunny daytime alpaca farm / outdoors | Cozy night walk to home & surprise party |
| **Shader uColor1** | `#F87800` (Warm Electric Orange) | `#F894C0` (Vibrant Bubblegum Pink) | `#7E7EFF` (Periwinkle Lavender Blue) | `#F87800` (Festive Birthday Orange) |
| **Shader uColor2** | `#EB8DB7` (Soft Rose Mauve) | `#7E7EFF` (Periwinkle Lavender Blue) | `#F87800` (Warm Electric Orange) | `#EB8DB7` (Celebratory Rose Pink) |
| **Board Count** | 10 Boards (`AK` to `GK`) | 10 Boards (`JK` to `lJ`) | 8 Boards (`vJ` to `zJ`) | 8 Boards (`Board4_1` to `Board4_8`) |
| **Asset Architecture** | Discrete sliced PNGs (142 files) | Free-Tex-Packer Atlases (95 files) | Free-Tex-Packer Atlases (75 files) | Aspect-ratio-fit WebGL meshes + Clean Plate |
| **Depth Maps** | 5 Parallax Depth Maps | 1 Parallax Depth Map (`c2b1p1`) | 0 (pure layered 2.5D cutouts) | Multi-plane 3D Z-depth planes (-0.72 to +0.85) |
| **Atmospheric FX** | Disco lights, floating confetti/notes | Smoke shaders, bar lamps, beer mugs | Sun rays, dust motes, farm props | Candlelight glow flicker, petal drift, party banner |

---

## 4. MASTER COLOR PALETTE (Exact Hex Sampled From Production Files)

### Primary Invariants
- **Carbon Ink Outline**: `#171717` (Used on 100% of line art and text)
- **Paper & Bubble Cream**: `#FEECE3` (Primary bubble background & comic paper)
- **Light Cream Highlight**: `#FFF6F0` (Gutter highlights, clean cards)
- **Warm Gold Paper**: `#FFF8EF` (Warm paper tone, keepsake cards)

### Character Palette (Ponpon & Cast)
- **Sheep Wool (Base)**: `#F8EFE4`
- **Sheep Wool (Shadow)**: `#EEDBC8`
- **Skin / Muzzle (Base)**: `#F9E7CA`
- **Skin (Shadow)**: `#E5B58C`
- **Inner Ear & Blush Pink**: `#F1ABBD` / `#EB8DB7`
- **Iconic Triangle Glasses**: `#F87800` (Frame) / `#231F20` (Dark Lenses)

### Accent & Environmental Highlights
- **Birthday Orange**: `#F87800` / `#F97802` / `#FC6E0A`
- **Celebration Pink**: `#EB8DB7` / `#F894C0` / `#FF3366`
- **Candle Flame & Golden Glow**: `#F7C704` / `#FFCC8E` / `#F5D259`
- **Periwinkle Blue / Night Sky**: `#7E7EFF` / `#063E7B` / `#14151F`
- **Festive Green / Foliage**: `#72DA7E` / `#5F6769`

---

## 5. STYLE FINGERPRINT & 15-ITEM CONSISTENCY CHECKLIST

### The Style Fingerprint
> *"Ponpon Mania is an authentic Franco-Belgian ligne claire interactive webcomic. Every visual asset features bold, expressive, hand-drawn carbon black ink contours (`#171717`) over warm peach-cream paper backgrounds (`#FEECE3`). Characters and props possess comical, stylized anatomy with flat 2-tone cel-shading and zero gradient airbrushing. Speech balloons are organic rounded boxes filled with creamy peach and hand-lettered bold comic caps. Motion parts are articulated cutouts animated with bouncy, energetic GSAP back/elastic eases that give the comic a tactile, living cartoon presence."*

### 15-Item Asset Quality Checklist
Every new or regenerated asset MUST score 10/10 against this checklist before production inclusion:

1. [ ] **Ink Outline Present**: Unbroken `#171717` black ink contour encompassing the entire silhouette.
2. [ ] **Correct Stroke Width**: Contour line is between 6px and 12px (average 8px) with organic hand-drawn tapering.
3. [ ] **No Mechanical Vectors**: Strokes exhibit subtle hand-drawn thickness variations, not sterile uniform vector strokes.
4. [ ] **Paper Base Adherence**: Speech bubbles and paper surfaces use `#FEECE3` / `#FFF8EF`, NEVER `#FFFFFF`.
5. [ ] **Pure Cel-Shading**: Exactly 1 to 2 levels of hard-edged shadow; NO airbrushed or diffuse gradients on character art.
6. [ ] **Warm Shadow Hues**: Shadows are warm, chromatic tints (peach/tan/rose), never muddy neutral gray.
7. [ ] **Hand-Lettered Typography**: Speech bubble text is bold, all-caps, comic-proportioned lettering with rounded terminals.
8. [ ] **Organic Balloon Beaks**: Tails are curved, tapering triangles pointing directly at character vocal origins.
9. [ ] **Tight Bounding Boxes**: PNG/SVG asset canvas tightly hugs the graphic with minimal transparent dead space.
10. [ ] **Correct Aspect Ratio**: Cutouts match their natural illustration ratio; zero horizontal or vertical squishing.
11. [ ] **Anti-Ghosting Separation**: Character cutouts are paired with CLEAN background plates that do NOT duplicate the character underneath.
12. [ ] **Alpha Channel Integrity**: Clean 8-bit alpha edges with zero white fringes, dark halos, or compression artifacts.
13. [ ] **Articulated Cutout Hierarchy**: Multi-part motion assets share identical scale, coordinate origin, and layer stacking logic.
14. [ ] **Bouncy Motion Timing**: Entrance tweens use `back.out(1.6)` or `elastic.out(1, 0.8)`; idle motions use gentle sine-wave bobbing.
15. [ ] **Bilingual Locale Support**: Every text-bearing asset has matching `-en` and `-fr` versions with identical visual balance.

---

## 6. REUSABLE ASSET GENERATION PROMPT TEMPLATE

Use this exact formula when producing new character art, backgrounds, or comic props:

```text
[SUBJECT & ACTION]:
A character / prop [describe character, clothing, pose, expression, props].

[STYLE FINGERPRINT]:
Authentic Franco-Belgian ligne claire comic book illustration, Ponpon Mania comic art style by Justine Soulié and Patrick Heng. Bold expressive hand-drawn black ink outlines, clean distinct line art, warm whimsical French indie comic graphic novel aesthetic.

[PALETTE HEX]:
Ink outline: #171717
Paper / Base: #FEECE3, #FFF8EF
Warm tones: #F87800, #EB8DB7, #F9E7CA, #E5B58C, #F7C704
Accents: #FF3366, #7E7EFF

[OUTLINE SPEC]:
Thick black ink contour outline 8px thickness, hand-inked line quality, rounded line endings, expressive tapered line weight, clear internal detail lines.

[SHADING & LIGHTING]:
Flat cel-shaded colors, maximum two-tone hard-edge shading, warm crisp shadow shapes, no airbrushing, no gradients on characters, no realistic 3D textures.

[COMPOSITION & PERSPECTIVE]:
Straight comic panel camera angle, clean eye-level perspective, tight framing.

[BACKGROUND & TRANSPARENCY]:
Isolated on transparent background (PNG), clean silhouette cut edges, zero background bleed, no white halo.

[TECHNICAL SPEC]:
Dimensions: [WIDTH]x[HEIGHT] pixels, 300 DPI, RGBA 8-bit uncompressed.

[NEGATIVE PROMPT]:
photorealistic, 3D render, CGI, glossy, gradient shading, airbrushed, blurred lines, thin scratchy lines, sketch, colored pencil, watercolor bleed, muddy shadows, gray outlines, pure white speech bubble, Comic Sans, mechanical CAD drawing, artifacts, noise, halos.
```

---

## 7. CONTRADICTIONS & CLARIFICATIONS

1. **Sprite Atlas Architecture vs. Individual PNGs**:
   - *Observation*: Chapter 1 used discrete PNG slices (142 assets), whereas Chapters 2 & 3 used Free-Tex-Packer sprite atlases with JSON manifests.
   - *Recommendation for Chapter 4*: Individual high-resolution PNGs paired with clean background plates and SVG speech bubbles provide higher visual fidelity without texture compression blur, while preserving the exact WebGL panel rendering logic.
2. **Speech Bubble Format**:
   - *Observation*: Chapters 1-3 used pre-rendered raster PNGs (`*-bubble-en.png`) compressed to `.basis`.
   - *Recommendation for Chapter 4*: Vector SVGs loaded with crisp WebGL textures allow responsive, razor-sharp typography at all display DPRs (Retina/4K) without memory bloat.

---
*Style Bible compiled by Senior Art Director & Front-End Engineer for Ponpon Mania.*
