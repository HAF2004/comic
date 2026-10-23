import urllib.request

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Referer': 'https://ponpon-mania.com/'
}

for i in range(1, 10):
    for ext in ['jpg', 'png', 'webp']:
        for pattern in [f'/images/album-{i}-sm.{ext}', f'/images/album-{i}.{ext}']:
            url = f'https://ponpon-mania.com{pattern}'
            req = urllib.request.Request(url, headers=headers)
            try:
                with urllib.request.urlopen(req) as resp:
                    print(f"FOUND: {pattern} ({resp.status}) size: {len(resp.read())}")
            except Exception:
                pass
