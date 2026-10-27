import os
from PIL import Image, ImageDraw

files = [f'artifacts_captures/desktop_board{i}.png' for i in range(1, 9)]
sheet = Image.new('RGB', (1600, 1050), (20, 20, 24))
draw = ImageDraw.Draw(sheet)

for idx, f in enumerate(files):
    if os.path.exists(f):
        im = Image.open(f).convert('RGB')
        thumb = im.resize((380, 237), Image.Resampling.LANCZOS)
        col = idx % 4
        row = idx // 4
        x = 15 + col * 395
        y = 35 + row * 260
        sheet.paste(thumb, (x, y))
        draw.text((x + 5, y - 18), f'Board {idx+1}', fill=(220, 220, 220))

sheet.save('continuity_evidence/contact_sheet_ch4_after.png')
print('Saved updated contact sheet: continuity_evidence/contact_sheet_ch4_after.png')
