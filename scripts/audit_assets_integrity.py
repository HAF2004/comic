import os
import json
import hashlib
from PIL import Image

def get_file_info(filepath):
    if not os.path.exists(filepath):
        return None
    size = os.path.getsize(filepath)
    mtime = os.path.getmtime(filepath)
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        hasher.update(f.read())
    sha = hasher.hexdigest()
    
    ext = os.path.splitext(filepath)[1].lower()
    dims = None
    aspect = None
    has_alpha = False
    
    if ext in ['.png', '.jpg', '.jpeg', '.webp']:
        try:
            with Image.open(filepath) as img:
                dims = [img.width, img.height]
                aspect = round(img.width / img.height, 3)
                has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
        except Exception as e:
            pass
    return {
        "path": filepath,
        "size_bytes": size,
        "mtime": mtime,
        "sha256": sha,
        "dimensions": dims,
        "aspect_ratio": aspect,
        "has_alpha": has_alpha
    }

# Assets loaded by CfE0pqJa.js
registered_assets = [
  {"id": 'c4b1p1-bg', "url": 'textures/chapters/4/c4b1p1-background.png', "panel": "c4b1p1", "expected_ratio": 2.1},
  {"id": 'c4b1p1-fg', "url": 'textures/chapters/4/c4b1p1-foreground.png', "panel": "c4b1p1", "expected_ratio": 2.1},
  {"id": 'c4b1p1-composite', "url": 'textures/chapters/4/c4b1p1-night-walk-rear.png', "panel": "c4b1p1", "expected_ratio": 2.1},
  {"id": 'c4b1p2-bg', "url": 'textures/chapters/4/c4b1p2-background.png', "panel": "c4b1p2", "expected_ratio": 2.1},
  {"id": 'c4b1p2-fg', "url": 'textures/chapters/4/c4b1p2-foreground.png', "panel": "c4b1p2", "expected_ratio": 2.1},
  {"id": 'c4b1p2-composite', "url": 'textures/chapters/4/c4b1p2-night-walk-front.png', "panel": "c4b1p2", "expected_ratio": 2.1},
  {"id": 'c4b2p1-bg', "url": 'textures/chapters/4/c4b2p1-background.png', "panel": "c4b2p1", "expected_ratio": 1.0},
  {"id": 'c4b2p1-fg', "url": 'textures/chapters/4/c4b2p1-foreground.png', "panel": "c4b2p1", "expected_ratio": 1.0},
  {"id": 'c4b2p1-composite', "url": 'textures/chapters/4/c4b2p1-arrive-home.png', "panel": "c4b2p1", "expected_ratio": 1.0},
  {"id": 'c4b2p2-bg', "url": 'textures/chapters/4/c4b2p2-background.png', "panel": "c4b2p2", "expected_ratio": 1.0},
  {"id": 'c4b2p2-fg', "url": 'textures/chapters/4/c4b2p2-foreground.png', "panel": "c4b2p2", "expected_ratio": 1.0},
  {"id": 'c4b2p2-composite', "url": 'textures/chapters/4/c4b2p2-open-door-detail.png', "panel": "c4b2p2", "expected_ratio": 1.0},
  {"id": 'c4b2p3-bg', "url": 'textures/chapters/4/c4b2p3-background.png', "panel": "c4b2p3", "expected_ratio": 2.1},
  {"id": 'c4b2p3-fg', "url": 'textures/chapters/4/c4b2p3-foreground.png', "panel": "c4b2p3", "expected_ratio": 2.1},
  {"id": 'c4b2p3-composite', "url": 'textures/chapters/4/c4b2p3-set-down-bag.png', "panel": "c4b2p3", "expected_ratio": 2.1},
  {"id": 'c4b3p1-bg', "url": 'textures/chapters/4/c4b3p1-background-night.png', "panel": "c4b3p1", "expected_ratio": 2.1},
  {"id": 'c4b3p1-fg', "url": 'textures/chapters/4/c4b3p1-foreground.png', "panel": "c4b3p1", "expected_ratio": 2.1},
  {"id": 'c4b3p1-composite', "url": 'textures/chapters/4/c4b3p1-settle-at-desk.png', "panel": "c4b3p1", "expected_ratio": 2.1},
  {"id": 'c4b3p2-bg', "url": 'textures/chapters/4/c4b3p2-background-night.png', "panel": "c4b3p2", "expected_ratio": 2.1},
  {"id": 'c4b3p2-fg', "url": 'textures/chapters/4/c4b3p2-foreground.png', "panel": "c4b3p2", "expected_ratio": 2.1},
  {"id": 'c4b3p2-composite', "url": 'textures/chapters/4/c4b3p2-open-macbook-correct.png', "panel": "c4b3p2", "expected_ratio": 2.1},
  {"id": 'c4b4p1-bg', "url": 'textures/chapters/4/c4b4p1-background.png', "panel": "c4b4p1", "expected_ratio": 1.0},
  {"id": 'c4b4p1-golden-mark', "url": 'textures/chapters/4/c4b4p1-golden-mark.png', "panel": "c4b4p1", "expected_ratio": 1.0},
  {"id": 'c4b4p2-bg', "url": 'textures/chapters/4/c4b4p2-background.png', "panel": "c4b4p2", "expected_ratio": 1.0},
  {"id": 'c4b4p2-petals', "url": 'textures/chapters/4/c4b4p2-petals-from-screen.png', "panel": "c4b4p2", "expected_ratio": 1.0},
  {"id": 'c4b4p3-bg', "url": 'textures/chapters/4/c4b4p3-background.png', "panel": "c4b4p3", "expected_ratio": 2.1},
  {"id": 'c4b4p3-fg', "url": 'textures/chapters/4/c4b4p3-foreground.png', "panel": "c4b4p3", "expected_ratio": 2.1},
  {"id": 'c4b4p3-composite', "url": 'textures/chapters/4/c4b4p3-tifa-curious.png', "panel": "c4b4p3", "expected_ratio": 2.1},
  {"id": 'c4b5p1-bg', "url": 'textures/chapters/4/c4b5p1-background.png', "panel": "c4b5p1", "expected_ratio": 2.1},
  {"id": 'c4b5p1-cake', "url": 'textures/chapters/4/c4b5p1-cake-emerges.png', "panel": "c4b5p1", "expected_ratio": 2.1},
  {"id": 'c4b5p2-bg', "url": 'textures/chapters/4/c4b5p2-background.png', "panel": "c4b5p2", "expected_ratio": 2.1},
  {"id": 'c4b5p2-fg', "url": 'textures/chapters/4/c4b5p2-foreground.png', "panel": "c4b5p2", "expected_ratio": 2.1},
  {"id": 'c4b5p2-composite', "url": 'textures/chapters/4/c4b5p2-delighted-reaction.png', "panel": "c4b5p2", "expected_ratio": 2.1},
  {"id": 'c4b6p1-bg', "url": 'textures/chapters/4/c4b6p1-background.png', "panel": "c4b6p1", "expected_ratio": 1.0},
  {"id": 'c4b6p1-hero', "url": 'textures/chapters/4/c4b6p1-cake-hero.png', "panel": "c4b6p1", "expected_ratio": 1.0},
  {"id": 'c4b7p1-bg', "url": 'textures/chapters/4/c4b7p1-background.png', "panel": "c4b7p1", "expected_ratio": 1.0},
  {"id": 'c4b7p1-fg', "url": 'textures/chapters/4/c4b7p1-foreground.png', "panel": "c4b7p1", "expected_ratio": 1.0},
  {"id": 'c4b7p1-composite', "url": 'textures/chapters/4/c4b7p1-friends-surprise.png', "panel": "c4b7p1", "expected_ratio": 1.0},
  {"id": 'c4b7p1-banner-v2', "url": 'textures/chapters/4/c4b7p1-banner-v2.svg', "panel": "c4b7p1", "expected_ratio": 1.0},
  {"id": 'c4b7p2-bg', "url": 'textures/chapters/4/c4b7p2-background.png', "panel": "c4b7p2", "expected_ratio": 1.0},
  {"id": 'c4b7p2-fg', "url": 'textures/chapters/4/c4b7p2-foreground.png', "panel": "c4b7p2", "expected_ratio": 1.0},
  {"id": 'c4b7p2-composite', "url": 'textures/chapters/4/c4b7p2-tifa-emotional.png', "panel": "c4b7p2", "expected_ratio": 1.0},
  {"id": 'c4b7p3-bg', "url": 'textures/chapters/4/c4b7p3-background.png', "panel": "c4b7p3", "expected_ratio": 2.1},
  {"id": 'c4b7p3-fg', "url": 'textures/chapters/4/c4b7p3-foreground.png', "panel": "c4b7p3", "expected_ratio": 2.1},
  {"id": 'c4b7p3-composite', "url": 'textures/chapters/4/c4b7p3-friends-cake.png', "panel": "c4b7p3", "expected_ratio": 2.1},
  {"id": 'c4b8p1-bg', "url": 'textures/chapters/4/c4b8p1-background.png', "panel": "c4b8p1", "expected_ratio": 1.0},
  {"id": 'c4b8p1-fg', "url": 'textures/chapters/4/c4b8p1-foreground.png', "panel": "c4b8p1", "expected_ratio": 1.0},
  {"id": 'c4b8p1-composite', "url": 'textures/chapters/4/c4b8p1-keepsake.png', "panel": "c4b8p1", "expected_ratio": 1.0}
]

results = []
missing = []
ratio_mismatches = []

for item in registered_assets:
    info = get_file_info(item["url"])
    if not info:
        missing.append(item["url"])
        continue
    item.update(info)
    results.append(item)
    if info["aspect_ratio"] and abs(info["aspect_ratio"] - item["expected_ratio"]) > 0.4:
        ratio_mismatches.append({
            "id": item["id"],
            "url": item["url"],
            "actual_aspect": info["aspect_ratio"],
            "expected_ratio": item["expected_ratio"]
        })

# Check orphan files in textures/chapters/4/
all_c4_files = [os.path.join('textures/chapters/4', f).replace('\\', '/') for f in os.listdir('textures/chapters/4') if os.path.isfile(os.path.join('textures/chapters/4', f))]
registered_urls = set([a["url"].replace('\\', '/') for a in registered_assets])
orphans = [f for f in all_c4_files if f not in registered_urls and not f.endswith('.json') and not f.endswith('.svg')]

report = {
    "total_registered_assets": len(registered_assets),
    "total_existing_assets": len(results),
    "missing_files": missing,
    "ratio_mismatches": ratio_mismatches,
    "orphan_files": orphans,
    "inventory": results
}

with open('asset_integrity_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2)

print(f"Asset Integrity Audit Complete:")
print(f"  Existing assets: {len(results)}/{len(registered_assets)}")
print(f"  Missing files: {len(missing)}")
print(f"  Ratio mismatches: {len(ratio_mismatches)}")
print(f"  Orphan files: {len(orphans)}")
