from PIL import Image
import numpy as np

# Load background and user image
bg = Image.open('assets_v4/c4b8p1-background.png').convert('RGBA')
user_im = Image.open('C:/Users/wawes/.gemini/antigravity-ide/brain/6ca816d8-71e2-4b75-9187-efc917e2f57e/.user_uploaded/media_1793171632924.png').convert('RGBA')

# Background is 1448 x 1086
bg_w, bg_h = bg.size
u_w, u_h = user_im.size

# Let's crop user image to tight bounding box of character
u_arr = np.array(user_im)
u_alpha = u_arr[:, :, 3]
y_idx, x_idx = np.where(u_alpha > 5)
x_min, x_max = x_idx.min(), x_idx.max()
y_min, y_max = y_idx.min(), y_idx.max()

tifa_cropped = user_im.crop((x_min, y_min, x_max + 1, y_max + 1))
tc_w, tc_h = tifa_cropped.size
print(f"Tight character bbox: {tc_w} x {tc_h}")

# Let's inspect where old Tifa was in c4b8p1-keepsake.png
comp_old = Image.open('assets_v4/c4b8p1-keepsake.png')
# In comp_old (1448 x 1086):
# Old Tifa head was:
# Hair top: y ≈ 100 to 120
# Chin: y ≈ 420
# Face center: x ≈ 490 to 520
# Hands/letter: y ≈ 450 to 600, x ≈ 450 to 750
# Bottom of arms/table: y ≈ 680 to 720

# Let's test placing new Tifa with height matching the scene
# Try target heights: 720px, 750px, 780px
for target_h in [700, 740, 780, 820]:
    scale = target_h / tc_h
    target_w = int(tc_w * scale)
    tifa_scaled = tifa_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Position: Tifa is seated in the pink chair on the left/center
    # In bg, the pink chair back is at x ≈ 50 to 380, y ≈ 380 to 600
    # The table top is at y ≈ 680
    # Let's position bottom of Tifa at y ≈ 680 or 700
    pos_y = 690 - target_h + int(target_h * 0.12) # bottom aligns with table edge
    # Horizontal center of chair / desk opening is around x ≈ 480 - 520
    pos_x = int(500 - target_w / 2)
    
    test_comp = bg.copy()
    test_comp.paste(tifa_scaled, (pos_x, pos_y), tifa_scaled)
    test_comp.convert('RGB').save(f'continuity_evidence/test_comp_h{target_h}.png')
    print(f"Saved test_comp_h{target_h}.png at pos: ({pos_x}, {pos_y})")

