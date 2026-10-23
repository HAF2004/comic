import os
import urllib.request

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Referer': 'https://ponpon-mania.com/'
}

os.makedirs('d:/Project/HBD/TiffaHBD/images', exist_ok=True)

for i in range(1, 7):
    url = f'https://ponpon-mania.com/images/album-{i}-sm.jpg'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            out = f'd:/Project/HBD/TiffaHBD/images/album-{i}-sm.jpg'
            with open(out, 'wb') as f:
                f.write(data)
            print(f"Downloaded: {url} ({len(data)} bytes)")
    except Exception as e:
        print(f"Fail {url}: {e}")
