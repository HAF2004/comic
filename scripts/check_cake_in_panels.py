import cv2, os
from PIL import Image

panels = [
    ('c4b5p1', 'assets_v5/c4b5p1-background.png'),
    ('c4b5p2', 'assets_v5/c4b5p2-delighted-reaction.png'),
    ('c4b6p1', 'assets_v5/c4b6p1-cake-hero.png'),
    ('c4b7p1', 'assets_v5/c4b7p1-friends-surprise.png'),
    ('c4b7p2', 'assets_v5/c4b7p2-tifa-emotional.png'),
    ('c4b7p3', 'assets_v5/c4b7p3-friends-cake.png'),
    ('c4b8p1', 'assets_v5/c4b8p1-keepsake.png'),
    ('c4b8p1_bg', 'assets_v5/c4b8p1-background.png'),
]

for name, p in panels:
    if os.path.exists(p):
        im = Image.open(p)
        print(f"{name}: {p} -> size={im.size}, mode={im.mode}")
    else:
        print(f"{name}: {p} NOT FOUND")
