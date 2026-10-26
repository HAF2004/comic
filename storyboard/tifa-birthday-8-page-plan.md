# Tifa’s 23rd Birthday — 8-page comic plan

**Format:** 8 pages, 17 panels total. Each page has 1–3 panels (within the requested 1–4 range). Create final artwork as individual panel assets, then arrange them in the website’s comic panels.

## Continuity and art direction

- Draw Tifa as a short chibi character in the site’s loose hand-drawn comic style: bold, slightly uneven black ink lines; simple flat color; light paper grain; warm pink, orange, cream, and dark-blue palette.
- Preserve her recognizable features: long dark hair, round glasses, gentle expression, navy jacket over a dark top, pleated black skirt, white socks, and Mary Jane shoes.
- Keep front-facing poses looking straight toward the viewer. No phone in any panel.
- Keep scenes graphic and illustrative, never photorealistic or 3D-rendered. Keep backgrounds simple enough that each panel reads clearly at website size.
- Any full view of the birthday cake must show **exactly 23 separate, countable candles**. Keep candles upright, spaced apart, and unobstructed; use the same count in later cake scenes.

## Page 1 — The walk home (2 panels)

1. Wide rear view: Tifa walks alone beneath warm streetlights on a quiet evening street; a few pink petals drift by.
2. Medium side/front view: she looks a little tired but calm, her bag over one shoulder; keep the expression and round glasses readable.

## Page 2 — Home (3 panels)

1. Tifa reaches her front door at night, seen from the softly lit entryway.
2. Close-up of her hand unlocking and opening the door; warm light spills into the darker hall.
3. Inside, she sets down her bag and exhales, framed by a few homey plants and simple decor.

## Page 3 — A quiet desk (2 panels)

1. Tifa settles at her desk in a cozy room, resting her chin in her hands; a closed laptop is in front of her.
2. Over-the-shoulder view as she opens the laptop correctly: keyboard directly in front of Tifa, hinge beyond the keyboard, and the inner display facing her. Keep the screen plain and dark at first.

## Page 4 — The first sign (3 panels)

1. A tiny golden mark glows on the otherwise dark laptop screen.
2. The mark brightens as pink petals and a few hand-drawn sparkles float out from the screen.
3. Close-up of Tifa peeking over the laptop, surprised and looking straight ahead; keep the glasses and face centered.

## Page 5 — A birthday appears (2 panels)

1. A small, stylized cake begins to emerge from the glowing screen amid petals and simple sparkle shapes.
2. Tifa covers her mouth in delighted surprise as the cake’s flowers and candlelight become visible.

## Page 6 — The cake (1 splash panel)

1. Hero view of the cake on the desk, surrounded by pink peonies and drifting petals, with Tifa’s laptop behind it. Show exactly 23 distinct candles, in clear rows with visible gaps; don’t let petals, flames, or decorations obscure the count.

## Page 7 — Surprise (3 panels)

1. Tifa’s friends pop into view behind her with a hand-lettered “HAPPY BIRTHDAY, TIFA!” banner.
2. Close-up of Tifa smiling with happy, teary eyes; her face looks forward.
3. Tifa and her friends gather around the cake. Keep all 23 candles visible and countable if the cake is fully in frame.

## Page 8 — A keepsake (1 splash panel)

1. Warm final scene: Tifa sits beside the cake and peony bouquet, opening a handwritten birthday letter/envelope. Leave calm open space for a short closing caption. If the cake is visible, retain exactly 23 countable candles.

## Asset-generation notes

Generated 17 standalone panel PNGs in `textures/chapters/4/`, named by board and panel ID. Their order and captions are listed in `textures/chapters/4/asset-manifest.json`. The original composite panel PNGs are retained as reliable fallbacks. Matching background plates now exist for all 17 panels, and transparent Tifa/group cutouts exist for the 13 panels with characters. A shared vector sprite sheet covers petals, sparkles, and candle flames. Some generated layers have different source dimensions and need fit/position adjustments before enabling layered rendering. Depth maps, Basis compression, and runtime registration remain pending.



## Focus behaviour

Dialogue and banner text live in separate localized overlay assets. Every panel dialogue, caption, birthday banner, and closing letter is a separate EN/FR SVG overlay marked focused_only: hide on blur and show the selected locale on focus. The text script is in storyboard/chapter4-text-script.md; composite fallbacks remain text-free.

