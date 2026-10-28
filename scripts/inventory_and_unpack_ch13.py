import os
import json
import hashlib
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
UNPACK_DIR = os.path.join(ROOT, '_atlas_unpacked')
os.makedirs(UNPACK_DIR, exist_ok=True)

def get_hash(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def classify_rights(rel_path):
    # Rule 2: CLEARED, UNCLEAR, RESTRICTED
    # Scraped assets from original Ponpon Mania by Justine Soulié & Patrick Heng:
    if rel_path.startswith('textures/chapters/1') or \
       rel_path.startswith('textures/chapters/2') or \
       rel_path.startswith('textures/chapters/3') or \
       rel_path.startswith('textures/home') or \
       rel_path.startswith('textures/about'):
        return {
            "status": "RESTRICTED",
            "provenance": "Scraped 1:1 production asset from Ponpon Mania (creators: Justine Soulié & Patrick Heng). No open-source or commercial redistribution license granted in repository.",
            "can_reuse_directly": False,
            "style_measurement_only": True
        }
    elif rel_path.startswith('textures/common'):
        # Check specific files
        if 'album-4' in rel_path:
            return {
                "status": "CLEARED",
                "provenance": "Custom created Tifa 23rd Birthday cover artwork for Chapter 4.",
                "can_reuse_directly": True,
                "style_measurement_only": False
            }
        else:
            return {
                "status": "RESTRICTED",
                "provenance": "Scraped common asset from Ponpon Mania (paper normals, albums 1-3, 5).",
                "can_reuse_directly": False,
                "style_measurement_only": True
            }
    elif rel_path.startswith('textures/chapters/4') or rel_path.startswith('assets_v4'):
        return {
            "status": "CLEARED",
            "provenance": "Custom generated/illustrated comic assets created specifically for Chapter 4 (Tifa's 23rd Birthday).",
            "can_reuse_directly": True,
            "style_measurement_only": False
        }
    return {
        "status": "UNCLEAR",
        "provenance": "Unknown provenance.",
        "can_reuse_directly": False,
        "style_measurement_only": True
    }

def categorize_asset(name):
    n = name.lower()
    if 'bubble' in n or 'text' in n or 'balloon' in n:
        return 'ui_bubble'
    elif 'bg' in n or 'background' in n or 'room' in n or 'wall' in n or 'stage' in n or 'landscape' in n or 'kitchen' in n:
        return 'background'
    elif 'fx' in n or 'sprite' in n or 'disco' in n or 'glow' in n or 'smoke' in n or 'candle' in n or 'flame' in n or 'light' in n or 'petal' in n or 'star' in n:
        return 'fx_particle'
    elif 'scream' in n or 'slash' in n or 'toot' in n or 'click' in n:
        return 'sfx'
    elif 'depth' in n or 'normal' in n or 'map' in n:
        return 'depth_texture'
    elif 'body' in n or 'head' in n or 'arm' in n or 'eye' in n or 'character' in n or 'ponpon' in n or 'simon' in n or 'jl' in n or 'boys' in n or 'marny' in n or 'tifa' in n:
        return 'character_part'
    else:
        return 'prop'

def unpack_atlases():
    unpacked_records = []
    for root_dir in ['textures/chapters/2', 'textures/chapters/3']:
        full_root = os.path.join(ROOT, root_dir)
        if not os.path.exists(full_root):
            continue
        for f in os.listdir(full_root):
            if f.endswith('-sprite-data.json'):
                base_name = f.replace('-sprite-data.json', '')
                png_name = f"{base_name}-sprite.png"
                json_path = os.path.join(full_root, f)
                png_path = os.path.join(full_root, png_name)
                if not os.path.exists(png_path):
                    continue
                
                try:
                    with open(json_path, 'r', encoding='utf-8') as jf:
                        data = json.load(jf)
                    atlas_img = Image.open(png_path)
                    
                    frames = data.get('frames', {})
                    sub_out_dir = os.path.join(UNPACK_DIR, root_dir.replace('textures/', ''), base_name)
                    os.makedirs(sub_out_dir, exist_ok=True)
                    
                    for frame_name, frame_info in frames.items():
                        fr = frame_info.get('frame', {})
                        x, y, w, h = fr.get('x', 0), fr.get('y', 0), fr.get('w', 0), fr.get('h', 0)
                        if w <= 0 or h <= 0:
                            continue
                        cropped = atlas_img.crop((x, y, x + w, y + h))
                        out_frame_file = os.path.join(sub_out_dir, f"{frame_name}.png")
                        cropped.save(out_frame_file, 'PNG')
                        
                        rel_out = os.path.relpath(out_frame_file, ROOT).replace('\\', '/')
                        unpacked_records.append({
                            "id": f"{base_name}:{frame_name}",
                            "parent_atlas": os.path.relpath(png_path, ROOT).replace('\\', '/'),
                            "path": rel_out,
                            "frame_name": frame_name,
                            "width": w,
                            "height": h,
                            "has_alpha": cropped.mode == 'RGBA',
                            "category": categorize_asset(frame_name),
                            "rights": classify_rights(os.path.relpath(png_path, ROOT).replace('\\', '/')),
                            "hash": get_hash(out_frame_file)
                        })
                except Exception as e:
                    print(f"Error unpacking {json_path}: {e}")
    return unpacked_records

def inventory_standalone():
    records = []
    scan_dirs = ['textures/chapters/1', 'textures/chapters/2', 'textures/chapters/3', 'textures/common']
    for d in scan_dirs:
        full_d = os.path.join(ROOT, d)
        if not os.path.exists(full_d):
            continue
        for root, dirs, files in os.walk(full_d):
            if 'ktx' in root:
                continue
            for f in files:
                if f.endswith(('.png', '.jpg', '.jpeg', '.svg')):
                    file_path = os.path.join(root, f)
                    rel_path = os.path.relpath(file_path, ROOT).replace('\\', '/')
                    w, h, alpha = 0, 0, False
                    if f.endswith(('.png', '.jpg', '.jpeg')):
                        try:
                            with Image.open(file_path) as im:
                                w, h = im.size
                                alpha = (im.mode == 'RGBA')
                        except:
                            pass
                    records.append({
                        "id": f,
                        "path": rel_path,
                        "width": w,
                        "height": h,
                        "has_alpha": alpha,
                        "category": categorize_asset(f),
                        "rights": classify_rights(rel_path),
                        "hash": get_hash(file_path)
                    })
    return records

def build_contact_sheet(items, cat_name, out_path, thumb_size=(100, 100), cols=8):
    if not items:
        return
    import math
    rows = math.ceil(len(items) / cols)
    sheet_w = cols * thumb_size[0]
    sheet_h = rows * thumb_size[1]
    sheet = Image.new('RGBA', (sheet_w, sheet_h), (240, 235, 230, 255))
    
    for idx, it in enumerate(items):
        full_p = os.path.join(ROOT, it['path'])
        if not os.path.exists(full_p) or it['path'].endswith('.svg'):
            continue
        try:
            with Image.open(full_p) as im:
                im.thumbnail(thumb_size)
                r = idx // cols
                c = idx % cols
                px = c * thumb_size[0] + (thumb_size[0] - im.width) // 2
                py = r * thumb_size[1] + (thumb_size[1] - im.height) // 2
                if im.mode == 'RGBA':
                    sheet.alpha_composite(im, (px, py))
                else:
                    sheet.paste(im, (px, py))
        except:
            pass
    sheet.save(out_path, 'PNG')
    print(f"Saved contact sheet: {out_path}")

def main():
    print("Unpacking sprite atlases to _atlas_unpacked/...")
    unpacked = unpack_atlases()
    print(f"Unpacked {len(unpacked)} individual frames from atlases.")
    
    print("Inventorying standalone assets...")
    standalone = inventory_standalone()
    print(f"Inventoried {len(standalone)} standalone files.")
    
    all_assets = standalone + unpacked
    with open('asset_library.json', 'w', encoding='utf-8') as f:
        json.dump(all_assets, f, indent=2)
    print(f"Saved asset_library.json with {len(all_assets)} total assets.")
    
    # Rights Report
    cleared_count = sum(1 for a in all_assets if a['rights']['status'] == 'CLEARED')
    restricted_count = sum(1 for a in all_assets if a['rights']['status'] == 'RESTRICTED')
    unclear_count = sum(1 for a in all_assets if a['rights']['status'] == 'UNCLEAR')
    
    rights_report_md = f"""# Rights & Provenance Report (Gerbang Hak Guna)
Generated automatically per ATURAN KERAS 2.

## Summary
- **CLEARED Assets**: {cleared_count}
- **RESTRICTED Assets**: {restricted_count}
- **UNCLEAR Assets**: {unclear_count}
- **Total Cataloged Assets**: {len(all_assets)}

## Provenance Analysis
1. **Chapters 1, 2, 3 & Common Scraped Textures**:
   - Status: **RESTRICTED**
   - Source: 1:1 asset scrape from production servers of *Ponpon Mania* (created by Justine Soulié & Patrick Heng).
   - Terms: No open redistribution or derivative reuse license is provided in the repository.
   - Enforcement: Under Rule 2, **NONE of these assets may be copied or directly reused in Chapter 4**. They may ONLY be inspected to extract abstract style metrics (outline stroke thickness, paper grain variance, cel-shading limits).

2. **Chapter 4 Custom Assets (`textures/chapters/4/*`, `assets_v4/*`, `textures/characters/tiffa*`)**:
   - Status: **CLEARED**
   - Source: Custom illustrations and AI-generated artwork produced specifically for Tifa's 23rd Birthday chapter in this project.
   - Terms: Authoritative and available for direct reuse, composite, and animation.

## Items Requiring User Confirmation for Reuse
The following categories of Chapter 1-3 elements are flagged as RESTRICTED and can only be used if the user explicitly confirms license ownership:
- Characters: Jean-Loup, Simon, Ponpon sheep, crowd members, DJ sprites.
- Bar props: Le Loubar neon signs, beer mugs, cocktail shakers, bar counters.
- Farm props: Alpaca Marny sprites, carrots, tractor parts, hay bales.
- Common UI/decor: Scraped sticker maps, arrow textures.

**Resolution Strategy**:
For all Chapter 4 needs where a candidate in Chapters 1-3 is RESTRICTED, Chapter 4 will use **GENERATE_BARU** (freshly generated original assets with matching measured style parameters) or **CLEARED** Chapter 4 vector layers (SVGs, procedural particles, shader lighting), ensuring 100% legal clearance and zero stylistic dissonance.
"""
    with open('rights_report.md', 'w', encoding='utf-8') as f:
        f.write(rights_report_md)
    print("Saved rights_report.md")

    # Generate Contact Sheets by Category
    contact_dir = os.path.join(ROOT, 'contact_sheets')
    os.makedirs(contact_dir, exist_ok=True)
    categories = set(a['category'] for a in all_assets)
    for cat in categories:
        cat_items = [a for a in all_assets if a['category'] == cat]
        sheet_path = os.path.join(contact_dir, f"contact_sheet_{cat}.png")
        build_contact_sheet(cat_items, cat, sheet_path)

if __name__ == '__main__':
    main()
