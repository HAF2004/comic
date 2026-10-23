import os
import re

found = set()
for root, dirs, files in os.walk('d:/Project/HBD/TiffaHBD'):
    for f in files:
        if f.endswith(('.js', '.css', '.html', '.json')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
                matches = re.findall(r'["\'](/images/[^"\'\s>]+)["\']', c)
                for m in matches:
                    found.add(m)
                matches_tmpl = re.findall(r'`(/images/[^`]+)`', c)
                for m in matches_tmpl:
                    found.add(m)

print(f"All referenced /images/: {len(found)}")
for m in sorted(found):
    print(" ", m)
