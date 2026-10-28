with open('_nuxt/CfE0pqJa.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Fix Board4_2 c4b2p1 duplication
old_b2p1 = """    this.topLeftPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b2p1',
      position: { x: -t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      bgTexture: 'c4b2p1-bg',
      fgTexture: 'c4b2p1-fg',
      compositeTexture: 'c4b2p1-composite',
      fgScale: 0.92,
      // Align Tifa hand directly onto front door handle
      fgOffset: { x: 0.12, y: -0.04 },
      bubbleOffsetY: 0.32
    });"""

new_b2p1 = """    this.topLeftPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b2p1',
      position: { x: -t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      bgTexture: 'c4b2p1-composite',
      compositeTexture: 'c4b2p1-composite',
      fgScale: 1.0,
      bubbleOffsetY: 0.32
    });"""

if old_b2p1 in code:
    code = code.replace(old_b2p1, new_b2p1)
    print('Fixed c4b2p1 in Board4_2!')
else:
    print('Warning: old_b2p1 not matched exactly')

# 2. Fix Board4_5 c4b5p2 duplication
old_b5p2 = """    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b5p2',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b5p2-bg',
      fgTexture: 'c4b5p2-fg',
      compositeTexture: 'c4b5p2-composite',
      fgScale: 0.95,
      fgOffset: { x: 0, y: -0.04 },
      bubbleOffsetY: 0.28
    });"""

new_b5p2 = """    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b5p2',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b5p2-composite',
      compositeTexture: 'c4b5p2-composite',
      fgScale: 1.0,
      bubbleOffsetY: 0.28
    });"""

if old_b5p2 in code:
    code = code.replace(old_b5p2, new_b5p2)
    print('Fixed c4b5p2 in Board4_5!')
else:
    print('Warning: old_b5p2 not matched exactly')

with open('_nuxt/CfE0pqJa.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Saved _nuxt/CfE0pqJa.js')
