import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('contact_sheets', exist_ok=True)
os.makedirs('continuity_evidence', exist_ok=True)
os.makedirs('before_after/phase9_ch4_cake', exist_ok=True)

# 1. Contact Sheet of all 4 cake appearances in story order
panels = [
    ('Board 5 Panel 1: Magical Emergence', 'assets_v6/c4b5p1-cake-emerges.png'),
    ('Board 6 Panel 1: Hero Desk Centerpiece', 'assets_v6/c4b6p1-cake-hero.png'),
    ('Board 7 Panel 3: Party Celebration with Friends', 'assets_v6/c4b7p3-friends-cake.png'),
    ('Board 8 Panel 1: Keepsake Memory Scene', 'assets_v6/c4b8p1-keepsake.png')
]

thumb_w, thumb_h = 724, 543
header_h = 60
margin = 20

sheet_w = thumb_w * 2 + margin * 3
sheet_h = (thumb_h + header_h) * 2 + margin * 3

sheet = Image.new('RGB', (sheet_w, sheet_h), '#FDFBF7')
draw = ImageDraw.Draw(sheet)

positions = [
    (margin, margin),
    (margin * 2 + thumb_w, margin),
    (margin, margin * 2 + thumb_h + header_h),
    (margin * 2 + thumb_w, margin * 2 + thumb_h + header_h)
]

for idx, (title, path) in enumerate(panels):
    x, y = positions[idx]
    img = Image.open(path).resize((thumb_w, thumb_h), Image.LANCZOS)
    sheet.paste(img, (x, y + header_h))
    
    # Header card
    draw.rectangle([x, y, x + thumb_w, y + header_h - 6], fill='#171717')
    draw.text((x + 16, y + 16), f"APPEARANCE {idx+1}: {title}", fill='#FFFFFF')

sheet.save('contact_sheets/cake_story_continuity_contact_sheet.png')
print('Saved contact_sheets/cake_story_continuity_contact_sheet.png')

# 2. Side-by-side zoomed crops of the cake in all 4 panels
cake_crops = [
    ('B5 P1 (Emergence)', Image.open('assets_v6/c4b5p1-cake-emerges.png').crop((600, 220, 1350, 950))),
    ('B6 P1 (Hero Desk)', Image.open('assets_v6/c4b6p1-cake-hero.png').crop((480, 220, 1380, 1000))),
    ('B7 P3 (Party Table)', Image.open('assets_v6/c4b7p3-friends-cake.png').crop((380, 320, 1100, 950))),
    ('B8 P1 (Keepsake Desk)', Image.open('assets_v6/c4b8p1-keepsake.png').crop((600, 260, 1300, 920)))
]

crop_target_w, crop_target_h = 400, 400
grid_cake = Image.new('RGB', (crop_target_w * 4 + 50, crop_target_h + 70), '#FDFBF7')
draw_cg = ImageDraw.Draw(grid_cake)

for i, (label, crop) in enumerate(cake_crops):
    c_res = crop.resize((crop_target_w, crop_target_h), Image.LANCZOS)
    cx = 10 + i * (crop_target_w + 10)
    grid_cake.paste(c_res, (cx, 55))
    draw_cg.rectangle([cx, 10, cx + crop_target_w, 48], fill='#2A1828')
    draw_cg.text((cx + 12, 22), label, fill='#FFF8EF')

grid_cake.save('continuity_evidence/cake_appearances_comparison.png')
print('Saved continuity_evidence/cake_appearances_comparison.png')

# 3. Candle "23" legibility 3x zoom grid across all 4 appearances
candles = [
    ('B5 P1: "23" Candles', 'continuity_evidence/b5_candle_zoom_3x.png'),
    ('B6 P1: "23" Candles', 'continuity_evidence/b6_candle_zoom_3x.png'),
    ('B7 P3: "23" Candles', 'continuity_evidence/b7_comp_candle_zoom_3x.png'),
    ('B8 P1: "23" Candles', 'continuity_evidence/b8_candle_zoom_3x.png')
]

cand_target_w, cand_target_h = 320, 320
cand_grid = Image.new('RGB', (cand_target_w * 4 + 50, cand_target_h + 70), '#FFF8EF')
draw_cand = ImageDraw.Draw(cand_grid)

for i, (label, path) in enumerate(candles):
    c_img = Image.open(path).resize((cand_target_w, cand_target_h), Image.LANCZOS)
    cx = 10 + i * (cand_target_w + 10)
    cand_grid.paste(c_img, (cx, 55))
    draw_cand.rectangle([cx, 10, cx + cand_target_w, 48], fill='#E85D75')
    draw_cand.text((cx + 12, 22), label, fill='#FFFFFF')

cand_grid.save('continuity_evidence/candle_23_legibility_grid.png')
print('Saved continuity_evidence/candle_23_legibility_grid.png')

# 4. Before & After comparison grid (assets_v5 vs assets_v6)
pairs = [
    ('B5 P1: Emerging Cake', 'assets_v5/c4b5p1-cake-emerges.png', 'assets_v6/c4b5p1-cake-emerges.png'),
    ('B6 P1: Hero Desk Cake', 'assets_v5/c4b6p1-cake-hero.png', 'assets_v6/c4b6p1-cake-hero.png'),
    ('B7 P3: Party Table', 'assets_v5/c4b7p3-friends-cake.png', 'assets_v6/c4b7p3-friends-cake.png'),
    ('B8 P1: Keepsake Scene', 'assets_v5/c4b8p1-keepsake.png', 'assets_v6/c4b8p1-keepsake.png')
]

pw, ph = 480, 360
ba_grid = Image.new('RGB', (pw * 2 + 30, (ph + 40) * 4 + 30), '#FDFBF7')
draw_ba = ImageDraw.Draw(ba_grid)

for row, (pname, p_old, p_new) in enumerate(pairs):
    ry = 15 + row * (ph + 40)
    im_old = Image.open(p_old).resize((pw, ph), Image.LANCZOS)
    im_new = Image.open(p_new).resize((pw, ph), Image.LANCZOS)
    
    ba_grid.paste(im_old, (10, ry + 30))
    ba_grid.paste(im_new, (pw + 20, ry + 30))
    
    draw_ba.rectangle([10, ry, 10 + pw, ry + 25], fill='#991B1B')
    draw_ba.text((20, ry + 6), f"BEFORE (v5): {pname} (Multiple candles)", fill='#FFFFFF')
    
    draw_ba.rectangle([pw + 20, ry, pw * 2 + 20, ry + 25], fill='#15803D')
    draw_ba.text((pw + 30, ry + 6), f"AFTER (v6): {pname} (Canon 2-tier + '23')", fill='#FFFFFF')

ba_grid.save('before_after/phase9_ch4_cake/before_after_comparison_grid.png')
print('Saved before_after/phase9_ch4_cake/before_after_comparison_grid.png')
