import json
import os

# 1. Update manifest.json
with open('manifest.json', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"version": "3.0.0-regen"', '"version": "4.0.0-continuity"')
text = text.replace('textures/chapters/4/', 'assets_v4/')

with open('manifest.json', 'w', encoding='utf-8') as f:
    f.write(text)

# 2. Update assets_v4/asset-manifest.json
if os.path.exists('assets_v4/asset-manifest.json'):
    with open('assets_v4/asset-manifest.json', 'r', encoding='utf-8') as f:
        m_text = f.read()
    m_text = m_text.replace('/textures/chapters/4/', '/assets_v4/')
    with open('assets_v4/asset-manifest.json', 'w', encoding='utf-8') as f:
        f.write(m_text)

print('Updated manifest.json and assets_v4/asset-manifest.json.')
