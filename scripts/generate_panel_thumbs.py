import cv2, os

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

# Save 400x300 thumbnails of each panel to continuity_evidence/
os.makedirs('continuity_evidence/panel_thumbs', exist_ok=True)
for name, p in panels:
    img = cv2.imread(p)
    thumb = cv2.resize(img, (400, int(img.shape[0] * (400 / img.shape[1]))))
    cv2.imwrite(f'continuity_evidence/panel_thumbs/{name}.jpg', thumb)
    print(f"Saved thumbnail for {name}")
