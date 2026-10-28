import re

with open('_nuxt/CfE0pqJa.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r"\{\s*id:\s*'([^']*)',\s*url:\s*'([^']*)'", text)
for mid, murl in matches:
    if any(k in mid for k in ['c4b5', 'c4b6', 'c4b7', 'c4b8']):
        print(f"{mid} -> {murl}")
