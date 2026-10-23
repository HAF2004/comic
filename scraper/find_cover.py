import re

for chunk in ['_nuxt/C3591o4d.js', '_nuxt/CfE0pqJa.js', '_nuxt/Bg17DEuf.js', '_nuxt/koeOL3k0.js']:
    try:
        with open('d:/Project/HBD/TiffaHBD/' + chunk, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'title cover' in content.lower():
                print(f"Found 'title cover' in {chunk}")
                idx = content.lower().find('title cover')
                print(content[max(0, idx-200):min(len(content), idx+200)])
    except Exception as e:
        print(f"Error reading {chunk}: {e}")
