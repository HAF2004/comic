import os
from PIL import Image, ImageDraw, ImageFont
import numpy as np

os.makedirs('before_after', exist_ok=True)
os.makedirs('continuity_evidence', exist_ok=True)

def create_side_by_side(img_before_path, img_after_path, out_path, title_before='BEFORE', title_after='AFTER'):
    im_b = Image.open(img_before_path).convert('RGB')
    im_a = Image.open(img_after_path).convert('RGB')
    
    # target height
    h = 600
    w_b = int(im_b.width * (h / im_b.height))
    w_a = int(im_a.width * (h / im_a.height))
    
    im_b = im_b.resize((w_b, h), Image.Resampling.LANCZOS)
    im_a = im_a.resize((w_a, h), Image.Resampling.LANCZOS)
    
    header_h = 50
    total_w = w_b + w_a + 20
    total_h = h + header_h + 10
    
    canvas = Image.new('RGB', (total_w, total_h), (25, 25, 28))
    canvas.paste(im_b, (5, header_h))
    canvas.paste(im_a, (w_b + 15, header_h))
    
    draw = ImageDraw.Draw(canvas)
    draw.text((15, 15), title_before, fill=(255, 120, 120))
    draw.text((w_b + 25, 15), title_after, fill=(120, 255, 150))
    
    canvas.save(out_path)
    print(f'Saved side-by-side: {out_path}')

# 1. B2 P1 Door Before / After
create_side_by_side(
    'textures/chapters/4/c4b2p1-arrive-home.png',
    'assets_v4/c4b2p1-arrive-home.png',
    'before_after/b2p1_door_before_after.png',
    'BEFORE: Brown door + peephole (conflicting)',
    'AFTER: Canonical navy door (#1E2B45) + lever handle + keyhole'
)

# 2. B5 P1 Room & Lighting Before / After
create_side_by_side(
    'textures/chapters/4/c4b5p1-cake-emerges.png',
    'assets_v4/c4b5p1-cake-emerges.png',
    'before_after/b5p1_room_before_after.png',
    'BEFORE: Sunset dusk window + hoodie drawstrings',
    'AFTER: Relit night window (#08244A), 23 candles, collar jacket'
)

# 3. B5 P2 Room Continuity Before / After
create_side_by_side(
    'textures/chapters/4/c4b5p2-delighted-reaction.png',
    'assets_v4/c4b5p2-delighted-reaction.png',
    'before_after/b5p2_room_before_after.png',
    'BEFORE: Wooden slat chair + floral mug (inconsistent)',
    'AFTER: Pink scalloped chair + pink heart pencil cup + brass lamp'
)

# 4. B7 P3 Window Lighting Before / After
create_side_by_side(
    'textures/chapters/4/c4b7p3-friends-cake.png',
    'assets_v4/c4b7p3-friends-cake.png',
    'before_after/b7p3_window_before_after.png',
    'BEFORE: Peach dusk window hue',
    'AFTER: Deep navy night window with stars'
)

# 5. Door Continuity Crop across P1, P2, P3
im_p1 = Image.open('assets_v4/c4b2p1-arrive-home.png')
crop_p1 = im_p1.crop((950, 100, 1440, 1000)).resize((400, 600), Image.Resampling.LANCZOS)

im_p2 = Image.open('assets_v4/c4b2p2-open-door-detail.png')
crop_p2 = im_p2.crop((200, 100, 1200, 1000)).resize((400, 600), Image.Resampling.LANCZOS)

im_p3 = Image.open('assets_v4/c4b2p3-set-down-bag.png')
crop_p3 = im_p3.crop((950, 100, 1440, 1000)).resize((400, 600), Image.Resampling.LANCZOS)

door_sheet = Image.new('RGB', (1230, 650), (25, 25, 28))
door_sheet.paste(crop_p1, (10, 40))
door_sheet.paste(crop_p2, (420, 40))
door_sheet.paste(crop_p3, (830, 40))

draw = ImageDraw.Draw(door_sheet)
draw.text((20, 12), 'B2 P1 (Arrival - Canonical Navy Door)', fill=(255, 255, 255))
draw.text((430, 12), 'B2 P2 (Detail - Handle & Keyhole)', fill=(255, 255, 255))
draw.text((840, 12), 'B2 P3 (Hallway - Matching Door Jamb)', fill=(255, 255, 255))
door_sheet.save('continuity_evidence/doors_continuity_p1_p2_p3.png')
print('Saved door continuity sheet: continuity_evidence/doors_continuity_p1_p2_p3.png')

# 6. Study Room Continuity Sheet (B3 P1, B4 P3, B5 P1, B5 P2, B6 P1, B8 P1)
study_panels = [
    ('B3 P1 Settle', 'assets_v4/c4b3p1-settle-at-desk.png'),
    ('B4 P3 Curious', 'assets_v4/c4b4p3-tifa-curious.png'),
    ('B5 P1 Cake Emerges', 'assets_v4/c4b5p1-cake-emerges.png'),
    ('B5 P2 Delighted', 'assets_v4/c4b5p2-delighted-reaction.png'),
    ('B6 P1 Cake Hero', 'assets_v4/c4b6p1-cake-hero.png'),
    ('B8 P1 Keepsake', 'assets_v4/c4b8p1-keepsake.png')
]

study_sheet = Image.new('RGB', (1200, 850), (25, 25, 28))
draw = ImageDraw.Draw(study_sheet)
for idx, (label, pth) in enumerate(study_panels):
    im = Image.open(pth).convert('RGB')
    thumb = im.resize((380, 240), Image.Resampling.LANCZOS)
    col = idx % 3
    row = idx // 3
    x = 15 + col * 395
    y = 40 + row * 265
    study_sheet.paste(thumb, (x, y))
    draw.text((x + 5, y - 20), label, fill=(240, 240, 240))

study_sheet.save('continuity_evidence/study_room_continuity_b3_b4_b5_b6_b8.png')
print('Saved study room continuity sheet: continuity_evidence/study_room_continuity_b3_b4_b5_b6_b8.png')
