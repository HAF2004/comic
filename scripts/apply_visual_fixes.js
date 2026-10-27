const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js');
let code = fs.readFileSync(bundlePath, 'utf8');

// 1. Add c4b7p1-banner-v2 to c4Assets
if (!code.includes('c4b7p1-banner-v2')) {
  code = code.replace(
    "{ id: 'c4b7p1-banner', url: '/textures/chapters/4/c4b7p1-bubble-en.svg', compress: false, locale: true },",
    "{ id: 'c4b7p1-banner', url: '/textures/chapters/4/c4b7p1-bubble-en.svg', compress: false, locale: true },\n  { id: 'c4b7p1-banner-v2', url: '/textures/chapters/4/c4b7p1-banner-v2.svg', compress: false, locale: true },"
  );
  console.log('Added c4b7p1-banner-v2 to c4Assets');
}

// 2. Fix Board 8 text overlay offsets (open space upper-right for caption, table alignment for letter)
const b8Old = `      if (props.id === 'c4b8p1') {
        if (index === 0) {
          bOffsetX = -0.16;
          bOffsetY = 0.35;
        } else {
          bOffsetX = 0.12;
          bOffsetY = -0.28;
        }
      }`;

const b8New = `      if (props.id === 'c4b8p1') {
        if (index === 0) {
          // Closing caption in dedicated open space in upper right with safe margin
          bOffsetX = 0.14;
          bOffsetY = 0.35;
        } else {
          // Letter card placed over letter without blocking cake candles or bottom border
          bOffsetX = -0.02;
          bOffsetY = -0.27;
        }
      }`;

const b8Previous = `      if (props.id === 'c4b8p1') {
        if (index === 0) {
          // Closing caption in the dedicated open space in upper right
          bOffsetX = 0.22;
          bOffsetY = 0.34;
        } else {
          // Letter card placed lower-center without blocking cake candles
          bOffsetX = 0.02;
          bOffsetY = -0.34;
        }
      }`;

if (code.includes(b8Old)) {
  code = code.replace(b8Old, b8New);
  console.log('Patched Board 8 text overlay positions (from original)');
} else if (code.includes(b8Previous)) {
  code = code.replace(b8Previous, b8New);
  console.log('Patched Board 8 text overlay positions (from intermediate)');
}

// 3. Fix Board 7 Panel 1 overlay banner position to align inside the illustrated curved ribbon
const bannerOld = `    if (overlayTexture) {
      this.overlayMesh = this.createMesh({
        meshId: \`\${props.id}-banner\`,
        id: 'map',
        params: { transparent: true, depthTest: false },
        uniforms: { tMap: { value: this.getTexture(overlayTexture) } }
      });
      const distBanner = 5 - 0.85;
      const frustumHeightBanner = 2 * Math.tan((45 * Math.PI) / 360) * distBanner;
      const frustumWidthBanner = frustumHeightBanner * props.ratio;
      this.overlayMesh.oPosition.z = 0.85;
      this.overlayMesh.oPosition.y = frustumHeightBanner * 0.28;
      this.overlayMesh.oScale.set(frustumWidthBanner * 0.92, frustumHeightBanner * 0.26, 1);
      this.overlayMesh.sync();
      this.overlayMesh.scale.set(0, 0, 0);
    }`;

const bannerNew = `    if (overlayTexture) {
      this.overlayMesh = this.createMesh({
        meshId: \`\${props.id}-banner\`,
        id: 'map',
        params: { transparent: true, depthTest: false },
        uniforms: { tMap: { value: this.getTexture(overlayTexture) } }
      });
      const distBanner = 5 - 0.85;
      const frustumHeightBanner = 2 * Math.tan((45 * Math.PI) / 360) * distBanner;
      const frustumWidthBanner = frustumHeightBanner * props.ratio;
      this.overlayMesh.oPosition.z = 0.85;
      // Positioned with precision to nestle inside the authentic cream ribbon
      this.overlayMesh.oPosition.y = frustumHeightBanner * 0.345;
      this.overlayMesh.oScale.set(frustumWidthBanner * 0.88, frustumHeightBanner * 0.17, 1);
      this.overlayMesh.sync();
      this.overlayMesh.scale.set(0, 0, 0);
    }`;

if (code.includes(bannerOld)) {
  code = code.replace(bannerOld, bannerNew);
  console.log('Patched overlay banner scale & position for Board 7');
}

// 4. Fix Board 2 Panel 1 (hand aligns with door handle) and Panel 2 (remove duplicate door handle)
const b2Old = `    this.topLeftPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b2p1',
      position: { x: -t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      bgTexture: 'c4b2p1-bg',
      fgTexture: 'c4b2p1-fg',
      compositeTexture: 'c4b2p1-composite',
      fgScale: 0.92,
      fgOffset: { x: 0, y: -0.04 },
      bubbleOffsetY: 0.32
    });
    this.addPanel(this.topLeftPanel);
    this.topRightPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b2p2',
      position: { x: t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      bgTexture: 'c4b2p2-bg',
      fgTexture: 'c4b2p2-fg',
      compositeTexture: 'c4b2p2-composite',
      fgScale: 1.0,
      bubbleOffsetY: 0.32
    });`;

const b2New = `    this.topLeftPanel = new Chapter4Panel(this.world, {
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
    });
    this.addPanel(this.topLeftPanel);
    this.topRightPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b2p2',
      position: { x: t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      // Eliminate duplicate door handle by using ground truth composite plate
      bgTexture: 'c4b2p2-composite',
      compositeTexture: 'c4b2p2-composite',
      fgScale: 1.0,
      bubbleOffsetY: 0.32
    });`;

if (code.includes(b2Old)) {
  code = code.replace(b2Old, b2New);
  console.log('Patched Board 2 Panel 1 & Panel 2 (duplicate handle eliminated)');
}

// 5. Fix Board 5 Panel 1 (bubble covers Tifa face)
const b5Old = `    this.topPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b5p1',
      position: { x: 0, y: t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      compositeTexture: 'c4b5p1-cake',
      bgTexture: 'c4b5p1-bg',
      bubbleOffsetY: 0.28
    });`;

const b5New = `    this.topPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b5p1',
      position: { x: 0, y: t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      compositeTexture: 'c4b5p1-cake',
      bgTexture: 'c4b5p1-bg',
      // Move bubble to the right above cake, leaving Tifa face completely unobstructed
      bubbleOffsetX: 0.15,
      bubbleOffsetY: 0.36
    });`;

if (code.includes(b5Old)) {
  code = code.replace(b5Old, b5New);
  console.log('Patched Board 5 Panel 1 bubble position');
}

// 6. Fix Board 6 (candleGlow glitch diagonal stripes + bubble covers hair)
const b6Old = `    this.heroPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b6p1',
      position: { x: 0, y: 0 },
      size: { x: 0.93, y: 0.93 },
      ratio: 1,
      bgTexture: 'c4b6p1-bg',
      compositeTexture: 'c4b6p1-hero',
      bubbleOffsetY: 0.35
    });

    this.heroPanel.candleGlow = this.heroPanel.createMesh({
      meshId: 'candle-glow',
      id: 'circle',
      params: { transparent: true, depthTest: false },
      uniforms: {
        uColor: { value: new A(1.0, 0.84, 0.38) },
        uRadius: { value: 0.5 },
        uBlur: { value: 0.4 },
        uAlpha: { value: 0.45 }
      }
    });
    this.heroPanel.candleGlow.oPosition.set(0, 0.22, 0.2);
    this.heroPanel.candleGlow.oScale.set(2.8, 1.2, 1);
    this.heroPanel.candleGlow.sync();

    this.addPanel(this.heroPanel);`;

const b6New = `    this.heroPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b6p1',
      position: { x: 0, y: 0 },
      size: { x: 0.93, y: 0.93 },
      ratio: 1,
      bgTexture: 'c4b6p1-bg',
      compositeTexture: 'c4b6p1-hero',
      // Position bubble above Tifa hair in clear sky area
      bubbleOffsetX: 0.16,
      bubbleOffsetY: 0.42
    });

    // Clean hand-drawn candle glow from master artwork preserved without diagonal shader artifacts
    this.addPanel(this.heroPanel);`;

if (code.includes(b6Old)) {
  code = code.replace(b6Old, b6New);
  console.log('Patched Board 6 candle glow shader glitch and bubble position');
}

// 7. Fix Board 7 Panel 1 (restore characters down to skirt/thighs, flower pillow, lamp, and banner-v2)
const b7Old = `    this.topLeftPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b7p1',
      position: { x: -t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      bgTexture: 'c4b7p1-bg',
      fgTexture: 'c4b7p1-fg',
      compositeTexture: 'c4b7p1-friends-surprise',
      overlayTexture: 'c4b7p1-banner',
      fgScale: 1.0,
      bubbleOffsetY: 0.32
    });`;

const b7New = `    this.topLeftPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b7p1',
      position: { x: -t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      // Restore authentic composition: characters visible to skirt/thighs, flower pillow, lamp
      bgTexture: 'c4b7p1-composite',
      compositeTexture: 'c4b7p1-composite',
      overlayTexture: 'c4b7p1-banner-v2',
      fgScale: 1.0,
      bubbleOffsetY: 0.32
    });`;

if (code.includes(b7Old)) {
  code = code.replace(b7Old, b7New);
  console.log('Patched Board 7 Panel 1 composition and banner-v2');
}

fs.writeFileSync(bundlePath, code, 'utf8');
console.log('Successfully applied visual fixes to _nuxt/CfE0pqJa.js!');
