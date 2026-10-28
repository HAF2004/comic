import os

bundle_path = '_nuxt/CfE0pqJa.js'
with open(bundle_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Switch assets_v4 to assets_v5 in c4Assets table
target = 'const c4Assets = ['
start = code.find(target)
if start == -1:
    print('Error: const c4Assets = [ not found')
else:
    end = code.find('];', start) + 2
    c4_section = code[start:end]
    new_c4_section = c4_section.replace("'/assets_v4/", "'/assets_v5/")
    code = code[:start] + new_c4_section + code[end:]
    print('Switched c4Assets to /assets_v5/')

# 2. Add heartbeat pulse to Board4_8 in CfE0pqJa.js
# Look for Board4_8 update method
old_b8_update = """  update(t, n) {
    super.update(t, n);
    this.lamaClouds.update(t, n);
  }"""

new_b8_update = """  update(t, n) {
    super.update(t, n);
    this.lamaClouds.update(t, n);
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && this.heroPanel && this.heroPanel.textOverlayMeshes && this.heroPanel.textOverlayMeshes.length > 1) {
      const letterMesh = this.heroPanel.textOverlayMeshes[1];
      if (letterMesh && letterMesh.mesh) {
        const beat = Math.sin(t * 2.6);
        const pulse = beat > 0.5 ? Math.sin((beat - 0.5) * Math.PI * 2) * 0.016 : 0;
        letterMesh.mesh.scale.set(1 + pulse, 1 + pulse, 1);
      }
    }
  }"""

if old_b8_update in code:
    code = code.replace(old_b8_update, new_b8_update, 1)
    print('Added subtle keepsake heartbeat to Board4_8')
else:
    print('Note: Exact old_b8_update string not found, checking alternative pattern...')
    # Let's find class Board4_8
    b8_idx = code.find('class Board4_8 extends St {')
    if b8_idx != -1:
        end_b8 = code.find('class Chapter4 extends Tp {', b8_idx)
        b8_code = code[b8_idx:end_b8]
        if 'this.lamaClouds.update(t, n);' in b8_code:
            target_str = 'this.lamaClouds.update(t, n);'
            replacement_str = """this.lamaClouds.update(t, n);
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && this.heroPanel && this.heroPanel.textOverlayMeshes && this.heroPanel.textOverlayMeshes.length > 1) {
      const letterMesh = this.heroPanel.textOverlayMeshes[1];
      if (letterMesh && letterMesh.mesh) {
        const beat = Math.sin(t * 2.6);
        const pulse = beat > 0.5 ? Math.sin((beat - 0.5) * Math.PI * 2) * 0.016 : 0;
        letterMesh.mesh.scale.set(1 + pulse, 1 + pulse, 1);
      }
    }"""
            b8_code = b8_code.replace(target_str, replacement_str, 1)
            code = code[:b8_idx] + b8_code + code[end_b8:]
            print('Successfully injected heartbeat into Board4_8!')

with open(bundle_path, 'w', encoding='utf-8') as f:
    f.write(code)
print('Saved changes to _nuxt/CfE0pqJa.js!')
