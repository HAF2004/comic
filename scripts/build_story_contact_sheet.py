import os
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
EVID_DIR = os.path.join(ROOT, 'continuity_evidence')
os.makedirs(EVID_DIR, exist_ok=True)

def build_story_contact_sheet():
    desktop_dir = os.path.join(ROOT, 'before_after', 'audit_initial', 'desktop')
    board_files = [os.path.join(desktop_dir, f'board{i}.png') for i in range(1, 9)]
    
    loaded = []
    for f in board_files:
        if os.path.exists(f):
            loaded.append(Image.open(f))
    
    if len(loaded) == 8:
        # 4 cols x 2 rows
        thumb_w, thumb_h = 360, 225
        sheet = Image.new('RGB', (thumb_w * 4, thumb_h * 2), (20, 20, 25))
        for idx, im in enumerate(loaded):
            t = im.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            c = idx % 4
            r = idx // 4
            sheet.paste(t, (c * thumb_w, r * thumb_h))
        out_p = os.path.join(EVID_DIR, 'story_contact_sheet_desktop.png')
        sheet.save(out_p)
        print(f"Saved {out_p}")

def build_ch4_vs_ch13_comparison():
    # Compare Chapter 1, 2, 3 against Chapter 4 hero boards
    samples = [
        ("Ch1 Stage", os.path.join(ROOT, 'textures/chapters/1/c1b1p4-stage.png')),
        ("Ch2 Bar", os.path.join(ROOT, 'textures/chapters/2/c2b1p1-jl-bar.png')),
        ("Ch3 Farm", os.path.join(ROOT, 'textures/chapters/3/c3b1p1-walls.png')),
        ("Ch4 Night B1", os.path.join(ROOT, 'assets_v5/c4b1p1-background.png')),
        ("Ch4 Cake B6", os.path.join(ROOT, 'assets_v5/c4b6p1-cake-hero.png')),
        ("Ch4 Keepsake B8", os.path.join(ROOT, 'assets_v5/c4b8p1-keepsake.png'))
    ]
    
    target_w, target_h = 320, 240
    comp_sheet = Image.new('RGB', (target_w * 3, target_h * 2), (25, 20, 30))
    for idx, (title, p) in enumerate(samples):
        if os.path.exists(p):
            im = Image.open(p).convert('RGB')
            im.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
            c = idx % 3
            r = idx // 3
            px = c * target_w + (target_w - im.width) // 2
            py = r * target_h + (target_h - im.height) // 2
            comp_sheet.paste(im, (px, py))
    out_p = os.path.join(EVID_DIR, 'ch4_vs_ch13_comparison.png')
    comp_sheet.save(out_p)
    print(f"Saved {out_p}")

if __name__ == '__main__':
    build_story_contact_sheet()
    build_ch4_vs_ch13_comparison()
