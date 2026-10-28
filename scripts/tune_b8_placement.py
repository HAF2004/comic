from PIL import Image
import numpy as np

bg = Image.open('assets_v4/c4b8p1-background.png').convert('RGBA')
user_im = Image.open('C:/Users/wawes/.gemini/antigravity-ide/brain/6ca816d8-71e2-4b75-9187-efc917e2f57e/.user_uploaded/media_1793171632924.png').convert('RGBA')

# Tight crop of user character
u_arr = np.array(user_im)
u_alpha = u_arr[:, :, 3]
y_idx, x_idx = np.where(u_alpha > 5)
tifa = user_im.crop((x_idx.min(), y_idx.min(), x_idx.max() + 1, y_idx.max() + 1))
tw, th = tifa.size

# Let's test a few fine-tuned placements:
# 1. scale with height 740, shifted slightly left (pos_x = 480 - sw//2)
# 2. scale with height 730, pos_x = 475 - sw//2
# 3. scale with height 750, pos_x = 470 - sw//2

configs = [
    {'h': 730, 'cx': 475, 'top_y': 105, 'name': 'h730_cx475'},
    {'h': 740, 'cx': 470, 'top_y': 105, 'name': 'h740_cx470'},
    {'h': 750, 'cx': 465, 'top_y': 100, 'name': 'h750_cx465'},
    {'h': 720, 'cx': 480, 'top_y': 110, 'name': 'h720_cx480'},
]

for cfg in configs:
    target_h = cfg['h']
    scale = target_h / th
    scaled = tifa.resize((int(tw * scale), target_h), Image.Resampling.LANCZOS)
    sw, sh = scaled.size
    
    pos_x = cfg['cx'] - sw // 2
    pos_y = cfg['top_y']
    
    test_comp = bg.copy()
    test_comp.paste(scaled, (pos_x, pos_y), scaled)
    test_comp.convert('RGB').save(f'continuity_evidence/comp_{cfg["name"]}.png')
    print(f"Saved comp_{cfg['name']}.png at ({pos_x}, {pos_y}), size: {sw}x{sh}")

