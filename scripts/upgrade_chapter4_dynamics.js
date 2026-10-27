const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js');
let code = fs.readFileSync(bundlePath, 'utf8');

const startMarker = 'class Chapter4Panel extends me {';
const endMarker = 'cy.chapter4 = Chapter4;';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find Chapter 4 code boundaries!');
  process.exit(1);
}

const replacement = `class Chapter4Panel extends me {
  constructor(world, props) {
    props.usePerspective = true;
    props.fov = 45;
    super(world, props);
    const {
      bgTexture,
      fgTexture,
      compositeTexture,
      overlayTexture,
      zBg = -0.72,
      zFg = 0.35,
      fgScale = 0.95,
      fgOffset = { x: 0, y: 0 },
      bubbleOffsetY = 0.26,
      bubbleOffsetX = 0,
      hasBreathing = true
    } = props;

    this.hasBreathing = hasBreathing;
    this.timeAccumulator = Math.random() * 10;
    this.textOverlayMeshes = [];
    this.textOverlayTweens = [];

    // 1. Base Plate: anti-ghosting architecture
    // Always prefer clean background texture over composite when fg cutout is present
    const plateId = (fgTexture && bgTexture) ? bgTexture : (compositeTexture || bgTexture);
    if (plateId) {
      const bgTextureMap = this.getTexture(plateId);
      const bgImage = bgTextureMap && bgTextureMap.image;
      const bgWidth = bgImage && (bgImage.naturalWidth || bgImage.width);
      const bgHeight = bgImage && (bgImage.naturalHeight || bgImage.height);
      const bgAspect = bgWidth && bgHeight ? bgWidth / bgHeight : props.ratio;

      this.bgMesh = this.createMesh({
        meshId: \`\${props.id}-plate\`,
        id: 'map',
        uniforms: { tMap: { value: bgTextureMap } }
      });
      const distBg = 5 - zBg;
      const frustumHeightBg = 2 * Math.tan((45 * Math.PI) / 360) * distBg;
      const bgCoverScale = Math.max(1, props.ratio / bgAspect);
      this.bgMesh.oPosition.z = zBg;
      this.bgMesh.oScale.set(frustumHeightBg * bgAspect * bgCoverScale, frustumHeightBg * bgCoverScale, 1);
      this.bgMesh.sync();
    }

    // 2. Foreground Character Cutout with native aspect ratio fit
    if (fgTexture) {
      const fgTextureMap = this.getTexture(fgTexture);
      const fgImage = fgTextureMap && fgTextureMap.image;
      const fgWidth = fgImage && (fgImage.naturalWidth || fgImage.width);
      const fgHeight = fgImage && (fgImage.naturalHeight || fgImage.height);
      const fgAspect = fgWidth && fgHeight ? fgWidth / fgHeight : props.ratio;

      this.fgMesh = this.createMesh({
        meshId: \`\${props.id}-character\`,
        id: 'map',
        params: { transparent: true },
        uniforms: { tMap: { value: fgTextureMap } }
      });
      const distFg = 5 - zFg;
      const frustumHeightFg = 2 * Math.tan((45 * Math.PI) / 360) * distFg;
      const frustumWidthFg = frustumHeightFg * props.ratio;

      let meshW, meshH;
      if (fgAspect > props.ratio) {
        meshW = frustumWidthFg * fgScale;
        meshH = meshW / fgAspect;
      } else {
        meshH = frustumHeightFg * fgScale;
        meshW = meshH * fgAspect;
      }

      this.fgMesh.oPosition.z = zFg;
      this.fgMesh.oPosition.x = frustumWidthFg * (fgOffset.x || 0);
      this.fgMesh.oPosition.y = frustumHeightFg * (fgOffset.y || 0);
      this.fgMesh.oScale.set(meshW, meshH, 1);
      this.fgMesh.sync();
    }

    // 3. Speech Bubbles / Localized Overlays with authentic Ponpon Mania proportions
    const textTextures = [...(c4TextOverlays[props.id] || [])];
    textTextures.forEach((textureId, index) => {
      const textTextureMap = this.getTexture(textureId);
      const textImage = textTextureMap && textTextureMap.image;
      const textWidth = textImage && (textImage.naturalWidth || textImage.width);
      const textHeight = textImage && (textImage.naturalHeight || textImage.height);
      const textAspect = textWidth && textHeight ? textWidth / textHeight : 3.0;

      const textMesh = this.createMesh({
        meshId: \`\${props.id}-text-\${index}\`,
        id: 'map',
        params: { transparent: true, depthTest: false },
        uniforms: { tMap: { value: textTextureMap } }
      });
      const textZ = 0.82 + index * 0.003;
      const distText = 5 - textZ;
      const frustumHeightText = 2 * Math.tan((45 * Math.PI) / 360) * distText;
      const frustumWidthText = frustumHeightText * props.ratio;

      // Smart responsive sizing
      const maxBubbleWidth = frustumWidthText * (props.ratio > 1.5 ? 0.58 : 0.78);
      const targetHeight = frustumHeightText * (props.bubbleHeightScale || (props.ratio > 1.5 ? 0.25 : 0.22));
      let bubbleWidth = targetHeight * textAspect;
      let bubbleHeight = targetHeight;
      if (bubbleWidth > maxBubbleWidth) {
        bubbleWidth = maxBubbleWidth;
        bubbleHeight = bubbleWidth / textAspect;
      }

      // Panel-specific position tuning
      let bOffsetX = bubbleOffsetX;
      let bOffsetY = bubbleOffsetY;
      if (props.id === 'c4b8p1') {
        if (index === 0) {
          bOffsetX = -0.16;
          bOffsetY = 0.35;
        } else {
          bOffsetX = 0.12;
          bOffsetY = -0.28;
        }
      }

      textMesh.oPosition.z = textZ;
      textMesh.oPosition.x = frustumWidthText * bOffsetX;
      textMesh.oPosition.y = frustumHeightText * bOffsetY;
      textMesh.oScale.set(bubbleWidth, bubbleHeight, 1);
      textMesh.sync();
      textMesh.scale.set(0, 0, 0);
      this.textOverlayMeshes.push(textMesh);
    });

    // 4. Celebration Banner (Board 7)
    if (overlayTexture) {
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
    }
  }

  update(t, n) {
    super.update(t, n);
    this.timeAccumulator += (n || 16) * 0.001;

    // A. Idle breathing & subtle floating on character cutout
    if (this.fgMesh && this.fgMesh.mesh && this.hasBreathing) {
      const breath = Math.sin(this.timeAccumulator * 2.2);
      const bobY = Math.sin(this.timeAccumulator * 1.6) * 0.012;
      this.fgMesh.mesh.scale.y = this.fgMesh.oScale.y * (1 + breath * 0.008);
      this.fgMesh.mesh.position.y = this.fgMesh.oPosition.y + bobY;
    }

    // B. Subtle organic floating on text speech bubbles
    if (this.textOverlayMeshes && this.textOverlayMeshes.length > 0) {
      this.textOverlayMeshes.forEach((mesh, idx) => {
        if (mesh && mesh.mesh && mesh.mesh.visible) {
          const floatOffset = Math.sin(this.timeAccumulator * 2.2 + idx * 1.2) * 0.008;
          mesh.mesh.position.y = mesh.oPosition.y + floatOffset;
        }
      });
    }

    // C. Gentle festive sway on party banner
    if (this.overlayMesh && this.overlayMesh.mesh && this.overlayMesh.mesh.visible) {
      this.overlayMesh.mesh.rotation.z = Math.sin(this.timeAccumulator * 2.5) * 0.018;
    }
  }

  onEnterCb() {
    super.onEnterCb();
    this.textOverlayTweens.forEach(tween => tween.kill());
    this.textOverlayTweens = this.textOverlayMeshes.map((mesh, idx) => {
      mesh.mesh.visible = true;
      return S.to(mesh.scale, {
        x: mesh.oScale.x,
        y: mesh.oScale.y,
        z: mesh.oScale.z,
        duration: 0.42,
        delay: idx * 0.12,
        ease: 'back.out(1.6)'
      });
    });

    if (this.overlayMesh) {
      this.overlayMesh.mesh.visible = true;
      S.killTweensOf(this.overlayMesh.scale);
      S.to(this.overlayMesh.scale, {
        x: this.overlayMesh.oScale.x,
        y: this.overlayMesh.oScale.y,
        z: this.overlayMesh.oScale.z,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }

  onLeaveCb() {
    super.onLeaveCb();
    this.textOverlayTweens.forEach(tween => tween.kill());
    this.textOverlayTweens = this.textOverlayMeshes.map(mesh => S.to(mesh.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => { mesh.mesh.visible = false; }
    }));

    if (this.overlayMesh) {
      S.to(this.overlayMesh.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => { this.overlayMesh.mesh.visible = false; }
      });
    }
  }
}

class Board4_1 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    h(this, 'topPanel');
    h(this, 'bottomPanel');
    h(this, 'lamaClouds');
    this.initPanels();
    this.lamaClouds = new fJ(this.world, { scene: n.chapter, board: this });
    this.plane.addChild(this.lamaClouds.plane);
  }
  initPanels() {
    let t = this.squarePos, n = this.squareSize;
    this.topPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b1p1',
      position: { x: 0, y: t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b1p1-bg',
      fgTexture: 'c4b1p1-fg',
      compositeTexture: 'c4b1p1-composite',
      fgScale: 0.95,
      fgOffset: { x: 0.18, y: -0.04 },
      bubbleOffsetY: 0.28,
      bubbleOffsetX: -0.15
    });
    this.addPanel(this.topPanel);
    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b1p2',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b1p2-bg',
      fgTexture: 'c4b1p2-fg',
      compositeTexture: 'c4b1p2-composite',
      fgScale: 0.95,
      fgOffset: { x: -0.15, y: -0.04 },
      bubbleOffsetY: 0.28,
      bubbleOffsetX: 0.20
    });
    this.addPanel(this.bottomPanel);
  }
  onMouseMove(t) {
    super.onMouseMove(t);
    this.isInView && (this.lamaClouds.resetState = !1);
  }
  unbind() {
    super.unbind();
    this.lamaClouds.animateOut();
  }
  onEnterCb() {
    super.onEnterCb();
    this.lamaClouds.animateIn();
  }
  onLeaveCb() {
    super.onLeaveCb();
    this.lamaClouds.animateOut();
  }
  update(t, n) {
    super.update(t, n);
    this.lamaClouds.update(t, n);
  }
}

class Board4_2 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    this.initPanels();
  }
  initPanels() {
    let t = this.squarePos, n = this.squareSize;
    this.topLeftPanel = new Chapter4Panel(this.world, {
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
    });
    this.addPanel(this.topRightPanel);
    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b2p3',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b2p3-bg',
      fgTexture: 'c4b2p3-fg',
      compositeTexture: 'c4b2p3-composite',
      fgScale: 0.95,
      fgOffset: { x: 0.12, y: -0.04 },
      bubbleOffsetY: 0.28,
      bubbleOffsetX: -0.18
    });
    this.addPanel(this.bottomPanel);
  }
}

class Board4_3 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    this.initPanels();
  }
  initPanels() {
    let t = this.squarePos, n = this.squareSize;
    this.topPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b3p1',
      position: { x: 0, y: t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b3p1-bg',
      fgTexture: 'c4b3p1-fg',
      compositeTexture: 'c4b3p1-composite',
      fgScale: 0.95,
      fgOffset: { x: 0, y: -0.04 },
      bubbleOffsetY: 0.28
    });
    this.addPanel(this.topPanel);
    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b3p2',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b3p2-bg',
      fgTexture: 'c4b3p2-fg',
      compositeTexture: 'c4b3p2-composite',
      fgScale: 0.95,
      fgOffset: { x: 0, y: -0.04 },
      bubbleOffsetY: 0.28
    });
    this.addPanel(this.bottomPanel);
  }
}

class Board4_4 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    this.initPanels();
  }
  initPanels() {
    let t = this.squarePos, n = this.squareSize;
    this.topLeftPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b4p1',
      position: { x: -t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      compositeTexture: 'c4b4p1-golden-mark',
      bgTexture: 'c4b4p1-bg',
      bubbleOffsetY: 0.32
    });
    this.addPanel(this.topLeftPanel);
    this.topRightPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b4p2',
      position: { x: t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      compositeTexture: 'c4b4p2-petals',
      bgTexture: 'c4b4p2-bg',
      bubbleOffsetY: 0.32
    });
    this.addPanel(this.topRightPanel);
    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b4p3',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b4p3-bg',
      fgTexture: 'c4b4p3-fg',
      compositeTexture: 'c4b4p3-composite',
      fgScale: 0.95,
      fgOffset: { x: 0, y: -0.04 },
      bubbleOffsetY: 0.28
    });
    this.addPanel(this.bottomPanel);
  }
}

class Board4_5 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    this.initPanels();
  }
  initPanels() {
    let t = this.squarePos, n = this.squareSize;
    this.topPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b5p1',
      position: { x: 0, y: t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      compositeTexture: 'c4b5p1-cake',
      bgTexture: 'c4b5p1-bg',
      bubbleOffsetY: 0.28
    });
    this.addPanel(this.topPanel);
    this.bottomPanel = new Chapter4Panel(this.world, {
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
    });
    this.addPanel(this.bottomPanel);
  }
}

class Board4_6 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    h(this, 'heroPanel');
    this.initPanels();
  }
  initPanels() {
    this.heroPanel = new Chapter4Panel(this.world, {
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

    this.addPanel(this.heroPanel);
  }
  update(t, n) {
    super.update(t, n);
    if (this.heroPanel && this.heroPanel.candleGlow) {
      const flicker = Math.sin(t * 7.5) * 0.12 + Math.cos(t * 13.0) * 0.06;
      this.heroPanel.candleGlow.program.uniforms.uAlpha.value = 0.42 + flicker;
    }
  }
}

class Board4_7 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    this.initPanels();
  }
  initPanels() {
    let t = this.squarePos, n = this.squareSize;
    this.topLeftPanel = new Chapter4Panel(this.world, {
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
    });
    this.addPanel(this.topLeftPanel);
    this.topRightPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b7p2',
      position: { x: t, y: t },
      size: { x: n, y: n },
      ratio: 1,
      bgTexture: 'c4b7p2-bg',
      fgTexture: 'c4b7p2-fg',
      compositeTexture: 'c4b7p2-composite',
      fgScale: 1.0,
      bubbleOffsetY: 0.32
    });
    this.addPanel(this.topRightPanel);
    this.bottomPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b7p3',
      position: { x: 0, y: -t },
      size: { x: n * 2.1, y: n },
      ratio: 2.1,
      bgTexture: 'c4b7p3-bg',
      fgTexture: 'c4b7p3-fg',
      compositeTexture: 'c4b7p3-composite',
      fgScale: 0.95,
      fgOffset: { x: 0, y: -0.04 },
      bubbleOffsetY: 0.28
    });
    this.addPanel(this.bottomPanel);
  }
}

class Board4_8 extends St {
  constructor(t, n) {
    super(t, { chapter: n.chapter, ratio: 1, index: n.index });
    h(this, 'heroPanel');
    h(this, 'lamaClouds');
    this.initPanels();
    this.lamaClouds = new fJ(this.world, { scene: n.chapter, board: this });
    this.plane.addChild(this.lamaClouds.plane);
  }
  initPanels() {
    this.heroPanel = new Chapter4Panel(this.world, {
      ...this.defaultProps,
      id: 'c4b8p1',
      position: { x: 0, y: 0 },
      size: { x: 0.93, y: 0.93 },
      ratio: 1,
      bgTexture: 'c4b8p1-bg',
      fgTexture: 'c4b8p1-fg',
      compositeTexture: 'c4b8p1-composite',
      fgScale: 1.0,
      bubbleOffsetY: 0.34
    });
    this.addPanel(this.heroPanel);
  }
  onMouseMove(t) {
    super.onMouseMove(t);
    this.isInView && (this.lamaClouds.resetState = !1);
  }
  unbind() {
    super.unbind();
    this.lamaClouds.animateOut();
  }
  onEnterCb() {
    super.onEnterCb();
    this.lamaClouds.animateIn();
  }
  onLeaveCb() {
    super.onLeaveCb();
    this.lamaClouds.animateOut();
  }
  update(t, n) {
    super.update(t, n);
    this.lamaClouds.update(t, n);
  }
}

class Chapter4 extends Tp {
  constructor(t) {
    super(t, {
      boardConfig: [
        { component: Board4_1, ratio: 1 },
        { component: Board4_2, ratio: 1 },
        { component: Board4_3, ratio: 1 },
        { component: Board4_4, ratio: 1 },
        { component: Board4_5, ratio: 1 },
        { component: Board4_6, ratio: 1 },
        { component: Board4_7, ratio: 1 },
        { component: Board4_8, ratio: 1 }
      ],
      index: 3
    });
    h(this, 'bg');
    this.id = 'chapter4';
    dt(this);
    this.createBg();
  }
  createFluid() {
    this.fluid = CM(this.world);
  }
  createBg() {
    this.bg = new Chapter4Bg(this.world, this);
    this.group.addChild(this.bg.group);
  }
  setSize() {
    var t;
    super.setSize();
    (t = this.bg) == null || t.setSize();
  }
  update(t, n, s) {
    var o;
    super.update(t, n, s);
    (o = this.fluid) == null || o.update();
    this.bg.update(t, n);
  }
}

cy.chapter4 = Chapter4;`;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx + endMarker.length);
fs.writeFileSync(bundlePath, code, 'utf8');
console.log('Successfully upgraded Chapter 4 dynamics and layout in _nuxt/CfE0pqJa.js!');
