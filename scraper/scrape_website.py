import os
import re
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter

DEST_DIR = r"d:\Project\HBD\TiffaHBD"
BASE_URL = "https://ponpon-mania.com"
R2_URL = "https://r2.ponpon-mania.com"
ASSETS_URL = "https://assets.ponpon-mania.com"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Referer': 'https://ponpon-mania.com/'
}

def fetch_bytes(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if attempt == max_retries - 1:
                return None
            time.sleep(0.5 * (attempt + 1))
        except Exception as e:
            if attempt == max_retries - 1:
                return None
            time.sleep(0.5 * (attempt + 1))
    return None

def save_file(rel_path, data):
    # rel_path e.g. "textures/common/arrow.png" or "index.html"
    rel_path = rel_path.lstrip('/')
    full_path = os.path.join(DEST_DIR, rel_path.replace('/', os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'wb') as f:
        f.write(data)

def main():
    print("=== STARTING FULL PONPON-MANIA SCRAPER ===")
    
    # 1. HTML Pages to scrape
    html_pages = [
        ('/', 'index.html'),
        ('/about', 'about/index.html'),
        ('/chapters', 'chapters/index.html'),
        ('/legal', 'legal/index.html'),
        ('/chapter/1', 'chapter/1/index.html'),
        ('/chapter/2', 'chapter/2/index.html'),
        ('/chapter/3', 'chapter/3/index.html'),
        ('/fr', 'fr/index.html'),
        ('/fr/about', 'fr/about/index.html'),
        ('/fr/chapters', 'fr/chapters/index.html'),
        ('/fr/legal', 'fr/legal/index.html'),
        ('/fr/chapter/1', 'fr/chapter/1/index.html'),
        ('/fr/chapter/2', 'fr/chapter/2/index.html'),
        ('/fr/chapter/3', 'fr/chapter/3/index.html'),
    ]
    
    print("\n--- 1. Downloading HTML Pages ---")
    for route, save_as in html_pages:
        url = BASE_URL + route
        data = fetch_bytes(url)
        if data:
            save_file(save_as, data)
            print(f"  [OK] {route} -> {save_as} ({len(data)} bytes)")
        else:
            print(f"  [FAIL] {url}")

    # 2. Nuxt Bundles & Static files
    static_files = [
        # Nuxt bundles
        '_nuxt/CfE0pqJa.js',
        '_nuxt/entry.C48-i2yD.css',
        '_nuxt/koeOL3k0.js',
        '_nuxt/index.6hPW0Tbw.css',
        '_nuxt/demhRTyb.js',
        '_nuxt/BRU4-Z4F.js',
        '_nuxt/about.CBqnUVXW.css',
        '_nuxt/Bg17DEuf.js',
        '_nuxt/chapters.BkdKDT0r.css',
        '_nuxt/C3591o4d.js',
        '_nuxt/_id_.Dio0s6sI.css',
        '_nuxt/DXexkJEA.js',
        '_nuxt/ChapterTip.DNeo1dNC.css',
        '_nuxt/WxOdUsO3.js',
        '_nuxt/legal.B6iJ9GfA.css',
        '_nuxt/kRp8jEf0.js',
        '_nuxt/FKj1pruU.js',
        '_nuxt/builds/latest.json',
        '_nuxt/builds/meta/5b086939-97f9-473d-b59b-fcacc3677d59.json',
        # Basis Transcoder
        'basis/BasisWorker.js',
        'basis/basis_transcoder.js',
        'basis/basis_transcoder.wasm',
        # Assets & Images
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'share-fb.jpg',
        'share-tw.jpg',
        'images/error.png',
        'images/ponpon-head-1.png',
        'images/ponpon-head-2.png',
        'sitemap.xml',
        'sitemap_index.xml',
        '__sitemap__/en-US.xml',
        '__sitemap__/fr-FR.xml',
        'robots.txt'
    ]

    print("\n--- 2. Downloading Static & Nuxt Bundle Files ---")
    for rel in static_files:
        url = BASE_URL + '/' + rel
        data = fetch_bytes(url)
        if data:
            save_file(rel, data)
            print(f"  [OK] {rel} ({len(data)} bytes)")
        else:
            print(f"  [FAIL] {url}")

    # 3. Parse all textures from entry JS
    print("\n--- 3. Extracting All Texture Paths from JS ---")
    entry_path = os.path.join(DEST_DIR, "_nuxt", "CfE0pqJa.js")
    with open(entry_path, 'r', encoding='utf-8', errors='ignore') as f:
        entry_content = f.read()

    vars_dict = {
        'Z': '/textures/chapters/1/',
        'Md': '/textures/chapters/1/',
        'ce': '/textures/chapters/2/',
        'Xx': '/textures/chapters/2/',
        '_e': '/textures/chapters/3/',
        'ti': '/textures/home/',
        'ro': '/textures/common/',
        'vs': '/textures/about/'
    }

    var_matches = re.findall(r'([a-zA-Z0-9_$]+)=["\'](/textures/[^"\']+)["\']', entry_content)
    for v, p in var_matches:
        vars_dict[v] = p.rstrip('/') + '/'

    all_items = re.findall(r'\{id:"([^"]+)",url:(`[^`]+`|"[^"]+")(?:,locale:(!0|!1|true|false))?[^}]*\}', entry_content)
    print(f"Found {len(all_items)} texture declarations in JS")

    base_textures = set()
    for tid, turl, is_loc in all_items:
        clean_url = turl.strip('`"')
        for v, p in vars_dict.items():
            clean_url = clean_url.replace(f'${{{v}}}', p)
            clean_url = clean_url.replace(f'/{p}', p)
        clean_url = re.sub(r'/+', '/', clean_url)
        base_textures.add(clean_url)
        if is_loc in ['!0', 'true']:
            base_textures.add(clean_url.replace('-en', '-fr'))

    print(f"Total distinct base texture paths: {len(base_textures)}")

    # 4. For each texture, generate all possible variants:
    # - Original (e.g. .png / .jpg / .json)
    # - Basis (e.g. /ktx/...basis)
    # - Small Basis (e.g. /ktx/...-small.basis)
    all_download_targets = set()

    for p in base_textures:
        all_download_targets.add(p)
        if p.endswith('.png') or p.endswith('.jpg') or p.endswith('.webp'):
            # basis variant: /dir/ktx/filename.basis
            parts = p.rsplit('/', 1)
            dir_part = parts[0]
            file_part = parts[1]
            base_name = file_part.rsplit('.', 1)[0]
            
            basis_url = f"{dir_part}/ktx/{base_name}.basis"
            basis_small_url = f"{dir_part}/ktx/{base_name}-small.basis"
            
            all_download_targets.add(basis_url)
            all_download_targets.add(basis_small_url)

    print(f"Total potential asset targets (original + basis + small basis): {len(all_download_targets)}")

    # 5. Download all textures concurrently
    print("\n--- 4. Concurrently Downloading All Textures & Assets ---")
    
    # We can try R2 first, then BASE_URL
    def download_asset(rel_path):
        # rel_path starts with /textures/...
        rel_clean = rel_path.lstrip('/')
        local_full = os.path.join(DEST_DIR, rel_clean.replace('/', os.sep))
        if os.path.exists(local_full) and os.path.getsize(local_full) > 0:
            return rel_path, True, 'cached', os.path.getsize(local_full)
        
        # Try R2
        r2_url = R2_URL + rel_path
        data = fetch_bytes(r2_url)
        if not data:
            # Try Base URL
            base_target = BASE_URL + rel_path
            data = fetch_bytes(base_target)
        if not data:
            # Try Assets URL
            assets_target = ASSETS_URL + rel_path
            data = fetch_bytes(assets_target)
            
        if data:
            save_file(rel_clean, data)
            return rel_path, True, 'downloaded', len(data)
        else:
            return rel_path, False, 'not_found', 0

    downloaded_count = 0
    not_found_count = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(download_asset, target): target for target in all_download_targets}
        for future in as_completed(futures):
            path, success, status, size = future.result()
            if success:
                downloaded_count += 1
                total_bytes += size
                if downloaded_count % 50 == 0 or downloaded_count == len(all_download_targets):
                    print(f"  Progress: {downloaded_count} assets acquired ({total_bytes / (1024*1024):.2f} MB total)...")
            else:
                not_found_count += 1

    print(f"\nAsset download summary:")
    print(f"  Successfully acquired: {downloaded_count} files ({total_bytes / (1024*1024):.2f} MB)")
    print(f"  Not found / optional variants: {not_found_count} files")

    # 6. Patch CfE0pqJa.js to use local assets ALWAYS (set this.useRemote = false)
    print("\n--- 5. Configuring Local Asset Loading ---")
    patched = entry_content.replace('this.useRemote=window.location.hostname!=="localhost"', 'this.useRemote=false')
    # Also ensure useR2 doesn't override local
    patched = patched.replace('h(this,"useR2",aee)', 'h(this,"useR2",!1)')
    
    with open(entry_path, 'w', encoding='utf-8') as f:
        f.write(patched)
    print("  [OK] Patched CfE0pqJa.js so that Loader always loads from local /textures directory!")

    print("\n=== PONPON-MANIA SCRAPE COMPLETE! ===")

if __name__ == '__main__':
    main()
