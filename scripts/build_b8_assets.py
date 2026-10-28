import os
from PIL import Image
import numpy as np

# Paths
bg_path = 'assets_v4/c4b8p1-background.png'
user_img_path = 'C:/Users/wawes/.gemini/antigravity-ide/brain/6ca816d8-71e2-4b75-9187-efc917e2f57e/.user_uploaded/media_1793171632924.png'

bg = Image.open(bg_path).convert('RGBA')
bg_w, bg_h = bg.size
assert (bg_w, bg_h) == (1448, 1086), f"Unexpected bg size: {bg.size}"

user_im = Image.open(user_img_path).convert('RGBA')

# Tight crop of user character
u_arr = np.array(user_im)
u_alpha = u_arr[:, :, 3]
y_idx, x_idx = np.where(u_alpha > 5)
tifa = user_im.crop((x_idx.min(), y_idx.min(), x_idx.max() + 1, y_idx.max() + 1))
tw, th = tifa.size
print(f"Tight character size: {tw} x {th}")

# Optimal placement: height 740, cx = 470, top_y = 105
target_h = 740
scale = target_h / th
sw = int(tw * scale)
scaled_tifa = tifa.resize((sw, target_h), Image.Resampling.LANCZOS)
print(f"Scaled character size: {sw} x {target_h}")

pos_x = 470 - sw // 2
pos_y = 105
print(f"Placement coordinates on 1448x1086: ({pos_x}, {pos_y})")

# 1. Create transparent foreground canvas (1448 x 1086 RGBA)
fg_canvas = Image.new('RGBA', (bg_w, bg_h), (0, 0, 0, 0))
fg_canvas.paste(scaled_tifa, (pos_x, pos_y), scaled_tifa)

# 2. Create composite keepsake canvas (1448 x 1086 RGB)
ks_canvas = bg.copy()
ks_canvas.paste(scaled_tifa, (pos_x, pos_y), scaled_tifa)
ks_rgb = ks_canvas.convert('RGB')

# Save to assets_v4/
fg_dest_v4 = 'assets_v4/c4b8p1-foreground.png'
ks_dest_v4 = 'assets_v4/c4b8p1-keepsake.png'

fg_canvas.save(fg_dest_v4, 'PNG', optimize=True)
ks_rgb.save(ks_dest_v4, 'PNG', optimize=True)
print(f"Saved {fg_dest_v4} and {ks_dest_v4}")

# Sync to textures/chapters/4/
fg_dest_tex = 'textures/chapters/4/c4b8p1-foreground.png'
ks_dest_tex = 'textures/chapters/4/c4b8p1-keepsake.png'

if os.path.exists(os.path.dirname(fg_dest_tex)):
    fg_canvas.save(fg_dest_tex, 'PNG', optimize=True)
    ks_rgb.save(ks_dest_tex, 'PNG', optimize=True)
    print(f"Synced to {fg_dest_tex} and {ks_dest_tex}")

print("Production assets generation complete!")
