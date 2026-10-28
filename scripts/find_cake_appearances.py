import json, glob, os
from PIL import Image

with open('panel_inventory.json', 'r', encoding='utf-8') as f:
    panels = json.load(f)

cake_panels = []
for p in panels:
    desc = json.dumps(p)
    if 'cake' in desc.lower():
        cake_panels.append(p)

print(f"Total cake panels found in panel_inventory: {len(cake_panels)}")
for p in cake_panels:
    print(f"- {p['id']}: {p.get('props')}")

# Also let's check manifest.json
with open('manifest.json', 'r', encoding='utf-8') as f:
    m = json.load(f)

for pid, pdata in m.get('panels', {}).items():
    s = json.dumps(pdata)
    if 'cake' in s.lower() and pid not in [x['id'] for x in cake_panels]:
        print(f"- From manifest {pid}: {pdata.get('layers')}")

# Let's inspect all files in assets_v5 and see where cake appears
print("\nInspecting assets_v5 files for cake:")
for img_path in sorted(glob.glob('assets_v5/*.png') + glob.glob('assets_v5/*.jpg')):
    bname = os.path.basename(img_path)
    if 'cake' in bname.lower():
        print(f"  {bname}")
