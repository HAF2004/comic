import os
import json
import cv2
import numpy as np

os.makedirs('continuity_evidence', exist_ok=True)

# 1. Door Continuity: B2 P1, B2 P2, B2 P3
# We crop the door area from each panel
p1_file = 'textures/chapters/4/c4b2p1-arrive-home.png'
p2_file = 'textures/chapters/4/c4b2p2-open-door-detail.png'
p3_file = 'textures/chapters/4/c4b2p3-set-down-bag.png'

door_crops = {}
if os.path.exists(p1_file):
    im1 = cv2.imread(p1_file)
    h, w, _ = im1.shape
    # Door is on right side
    door_p1 = im1[int(h*0.1):int(h*0.9), int(w*0.55):int(w*0.95)]
    cv2.imwrite('continuity_evidence/door_b2p1.png', door_p1)
    door_crops['b2p1'] = 'continuity_evidence/door_b2p1.png'

if os.path.exists(p2_file):
    im2 = cv2.imread(p2_file)
    # P2 is close-up of door handle
    cv2.imwrite('continuity_evidence/door_b2p2.png', im2)
    door_crops['b2p2'] = 'continuity_evidence/door_b2p2.png'

if os.path.exists(p3_file):
    im3 = cv2.imread(p3_file)
    h, w, _ = im3.shape
    # Door on right side
    door_p3 = im3[int(h*0.1):int(h*0.9), int(w*0.65):int(w*0.98)]
    cv2.imwrite('continuity_evidence/door_b2p3.png', door_p3)
    door_crops['b2p3'] = 'continuity_evidence/door_b2p3.png'

# Analyze dominant color of door in P1 vs P2 vs P3
def get_dominant_colors(crop, n=3):
    # Ignore pure black/white
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    mask = (rgb[:, :, 0] > 15) & (rgb[:, :, 0] < 240)
    if not np.any(mask):
        return []
    pixels = rgb[mask].reshape(-1, 3)
    # Quantize to 16
    quant = (pixels // 16) * 16
    unq, cnt = np.unique(quant, axis=0, return_counts=True)
    top = unq[np.argsort(-cnt)[:n]]
    return ['#{:02x}{:02x}{:02x}'.format(*c) for c in top]

door_analysis = {}
if 'door_p1' in locals():
    door_analysis['b2p1_colors'] = get_dominant_colors(door_p1)
if 'im2' in locals():
    door_analysis['b2p2_colors'] = get_dominant_colors(im2)
if 'door_p3' in locals():
    door_analysis['b2p3_colors'] = get_dominant_colors(door_p3)

# 2. Study Room: Board 5 P1 vs P2
b5p1_file = 'textures/chapters/4/c4b5p1-background.png'
b5p2_file = 'textures/chapters/4/c4b5p2-background.png'
b5p2_comp = 'textures/chapters/4/c4b5p2-delighted-reaction.png'

study_crops = {}
if os.path.exists(b5p1_file):
    im = cv2.imread(b5p1_file)
    cv2.imwrite('continuity_evidence/study_b5p1_bg.png', im)
    study_crops['b5p1'] = 'continuity_evidence/study_b5p1_bg.png'

if os.path.exists(b5p2_file):
    im = cv2.imread(b5p2_file)
    cv2.imwrite('continuity_evidence/study_b5p2_bg.png', im)
    study_crops['b5p2_bg'] = 'continuity_evidence/study_b5p2_bg.png'

if os.path.exists(b5p2_comp):
    im = cv2.imread(b5p2_comp)
    cv2.imwrite('continuity_evidence/study_b5p2_comp.png', im)
    study_crops['b5p2_comp'] = 'continuity_evidence/study_b5p2_comp.png'

# Also crop Board 3 P1, B3 P2, B4 P3, B6 P1, B8 P1 backgrounds for study room comparison
study_files = {
    "b3p1": 'textures/chapters/4/c4b3p1-background-night.png',
    "b3p2": 'textures/chapters/4/c4b3p2-background-night.png',
    "b4p3": 'textures/chapters/4/c4b4p3-background.png',
    "b6p1": 'textures/chapters/4/c4b6p1-background.png',
    "b8p1": 'textures/chapters/4/c4b8p1-background.png'
}
for k, f in study_files.items():
    if os.path.exists(f):
        im = cv2.imread(f)
        cv2.imwrite(f'continuity_evidence/study_{k}.png', im)

# 3. Character Outfits & Details
# Crop Tifa from B1 P2, B2 P1, B2 P3, B3 P1, B4 P3, B5 P1, B5 P2, B6 P1, B7 P2, B8 P1
tifa_panels = [
    ('b1p2', 'textures/chapters/4/c4b1p2-foreground.png'),
    ('b2p1', 'textures/chapters/4/c4b2p1-foreground.png'),
    ('b2p3', 'textures/chapters/4/c4b2p3-foreground.png'),
    ('b3p1', 'textures/chapters/4/c4b3p1-foreground.png'),
    ('b4p3', 'textures/chapters/4/c4b4p3-foreground.png'),
    ('b5p1', 'textures/chapters/4/c4b5p1-cake-emerges.png'),
    ('b5p2', 'textures/chapters/4/c4b5p2-foreground.png'),
    ('b6p1', 'textures/chapters/4/c4b6p1-cake-hero.png'),
    ('b7p2', 'textures/chapters/4/c4b7p2-tifa-emotional.png'),
    ('b8p1', 'textures/chapters/4/c4b8p1-foreground.png')
]

for name, path in tifa_panels:
    if os.path.exists(path):
        im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        cv2.imwrite(f'continuity_evidence/char_{name}.png', im)

# 4. Friends Outfits on Board 7: P1 vs P3
f_p1 = 'textures/chapters/4/c4b7p1-friends-surprise.png'
f_p3 = 'textures/chapters/4/c4b7p3-friends-cake.png'
if os.path.exists(f_p1):
    cv2.imwrite('continuity_evidence/friends_b7p1.png', cv2.imread(f_p1))
if os.path.exists(f_p3):
    cv2.imwrite('continuity_evidence/friends_b7p3.png', cv2.imread(f_p3))

print("Crops saved to continuity_evidence/")
print("Door colors analysis:", door_analysis)
