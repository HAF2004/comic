const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js');
let code = fs.readFileSync(bundlePath, 'utf8');

console.log('Original bundle size:', code.length);

// 1. Patch lockedIndex
const target1 = 'h(this,"lockedIndex",2)';
const target2 = 'this.lockedIndex=2,this.chapterDir=1';

if (!code.includes(target1) || !code.includes(target2)) {
  console.error('Could not find lockedIndex in bundle!');
  process.exit(1);
}

code = code.replace(target1, 'h(this,"lockedIndex",3)');
code = code.replace(target2, 'this.lockedIndex=3,this.chapterDir=1');
console.log('Patched lockedIndex to 3');

// 2. Add Chapter 4 implementation before export or at end of file
const chapter4Code = `
// ==========================================
// Chapter 4: A Birthday for Tifa Implementation
// ==========================================
const c4Assets = [
  { id: 'c4b1p1-bg', url: '/textures/chapters/4/c4b1p1-background.png', compress: false },
  { id: 'c4b1p1-fg', url: '/textures/chapters/4/c4b1p1-foreground.png', compress: false },
  { id: 'c4b1p1-composite', url: '/textures/chapters/4/c4b1p1-night-walk-rear.png', compress: false },
  { id: 'c4b1p2-bg', url: '/textures/chapters/4/c4b1p2-background.png', compress: false },
  { id: 'c4b1p2-fg', url: '/textures/chapters/4/c4b1p2-foreground.png', compress: false },
  { id: 'c4b1p2-composite', url: '/textures/chapters/4/c4b1p2-night-walk-front.png', compress: false },
  { id: 'c4b2p1-bg', url: '/textures/chapters/4/c4b2p1-background.png', compress: false },
  { id: 'c4b2p1-fg', url: '/textures/chapters/4/c4b2p1-foreground.png', compress: false },
  { id: 'c4b2p1-composite', url: '/textures/chapters/4/c4b2p1-arrive-home.png', compress: false },
  { id: 'c4b2p2-bg', url: '/textures/chapters/4/c4b2p2-background.png', compress: false },
  { id: 'c4b2p2-fg', url: '/textures/chapters/4/c4b2p2-foreground.png', compress: false },
  { id: 'c4b2p2-composite', url: '/textures/chapters/4/c4b2p2-open-door-detail.png', compress: false },
  { id: 'c4b2p3-bg', url: '/textures/chapters/4/c4b2p3-background.png', compress: false },
  { id: 'c4b2p3-fg', url: '/textures/chapters/4/c4b2p3-foreground.png', compress: false },
  { id: 'c4b2p3-composite', url: '/textures/chapters/4/c4b2p3-set-down-bag.png', compress: false },
  { id: 'c4b3p1-bg', url: '/textures/chapters/4/c4b3p1-background.png', compress: false },
  { id: 'c4b3p1-fg', url: '/textures/chapters/4/c4b3p1-foreground.png', compress: false },
  { id: 'c4b3p1-composite', url: '/textures/chapters/4/c4b3p1-settle-at-desk.png', compress: false },
  { id: 'c4b3p2-bg', url: '/textures/chapters/4/c4b3p2-background.png', compress: false },
  { id: 'c4b3p2-fg', url: '/textures/chapters/4/c4b3p2-foreground.png', compress: false },
  { id: 'c4b3p2-composite', url: '/textures/chapters/4/c4b3p2-open-macbook-correct.png', compress: false },
  { id: 'c4b4p1-bg', url: '/textures/chapters/4/c4b4p1-background.png', compress: false },
  { id: 'c4b4p1-golden-mark', url: '/textures/chapters/4/c4b4p1-golden-mark.png', compress: false },
  { id: 'c4b4p2-bg', url: '/textures/chapters/4/c4b4p2-background.png', compress: false },
  { id: 'c4b4p2-petals', url: '/textures/chapters/4/c4b4p2-petals-from-screen.png', compress: false },
  { id: 'c4b4p3-bg', url: '/textures/chapters/4/c4b4p3-background.png', compress: false },
  { id: 'c4b4p3-fg', url: '/textures/chapters/4/c4b4p3-foreground.png', compress: false },
  { id: 'c4b4p3-composite', url: '/textures/chapters/4/c4b4p3-tifa-curious.png', compress: false },
  { id: 'c4b5p1-bg', url: '/textures/chapters/4/c4b5p1-background.png', compress: false },
  { id: 'c4b5p1-cake', url: '/textures/chapters/4/c4b5p1-cake-emerges.png', compress: false },
  { id: 'c4b5p2-bg', url: '/textures/chapters/4/c4b5p2-background.png', compress: false },
  { id: 'c4b5p2-fg', url: '/textures/chapters/4/c4b5p2-foreground.png', compress: false },
  { id: 'c4b5p2-composite', url: '/textures/chapters/4/c4b5p2-delighted-reaction.png', compress: false },
  { id: 'c4b6p1-bg', url: '/textures/chapters/4/c4b6p1-background.png', compress: false },
  { id: 'c4b6p1-hero', url: '/textures/chapters/4/c4b6p1-cake-hero.png', compress: false },
  { id: 'c4b7p1-bg', url: '/textures/chapters/4/c4b7p1-background.png', compress: false },
  { id: 'c4b7p1-fg', url: '/textures/chapters/4/c4b7p1-foreground.png', compress: false },
  { id: 'c4b7p1-composite', url: '/textures/chapters/4/c4b7p1-friends-surprise.png', compress: false },
  { id: 'c4b7p1-banner', url: '/textures/chapters/4/c4b7p1-bubble-en.svg', compress: false },
  { id: 'c4b7p2-bg', url: '/textures/chapters/4/c4b7p2-background.png', compress: false },
  { id: 'c4b7p2-fg', url: '/textures/chapters/4/c4b7p2-foreground.png', compress: false },
  { id: 'c4b7p2-composite', url: '/textures/chapters/4/c4b7p2-tifa-emotional.png', compress: false },
  { id: 'c4b7p3-bg', url: '/textures/chapters/4/c4b7p3-background.png', compress: false },
  { id: 'c4b7p3-fg', url: '/textures/chapters/4/c4b7p3-foreground.png', compress: false },
  { id: 'c4b7p3-composite', url: '/textures/chapters/4/c4b7p3-friends-cake.png', compress: false },
  { id: 'c4b8p1-bg', url: '/textures/chapters/4/c4b8p1-background.png', compress: false },
  { id: 'c4b8p1-fg', url: '/textures/chapters/4/c4b8p1-foreground.png', compress: false },
  { id: 'c4b8p1-composite', url: '/textures/chapters/4/c4b8p1-keepsake.png', compress: false }
];
mo.chapter4 = c4Assets;

class Chapter4Bg extends DJ {
  createMesh() {
    this.mesh = new ve(this.world.gl, {
      geometry: this.world.geoms.plane,
      program: this.createProgram({
        params: {},
        vertex: oe,
        fragment: UJ,
        uniforms: {
          ...this.uniforms,
          uColor1: { value: new re('#F87800') },
          uColor2: { value: new re('#EB8DB7') },
          uAlpha: { value: 1 }
        }
      })
    });
    this.mesh.position.z = -5;
    this.group.addChild(this.mesh);
  }
}

class Chapter4Panel extends me {
  constructor(world, props) {
    props.usePerspective = true;
    props.fov = 45;
    super(world, props);
    const { bgTexture, fgTexture, compositeTexture, overlayTexture, zBg = -0.6, zFg = 0.35, fgScale = 1.0, fgOffset = {x: 0, y: 0} } = props;

    const textureToUse = bgTexture || compositeTexture;
    if (textureToUse) {
      this.bgMesh = this.createMesh({
        meshId: props.id + '-bg',
        id: 'map',
        uniforms: { tMap: { value: this.getTexture(textureToUse) } }
      });
      const distBg = 5 - zBg;
      const hBg = 2 * Math.tan(45 * Math.PI / 360) * distBg;
      this.bgMesh.oPosition.z = zBg;
      this.bgMesh.oScale.set(hBg * props.ratio, hBg, 1);
      this.bgMesh.sync();
    }

    if (fgTexture) {
      this.fgMesh = this.createMesh({
        meshId: props.id + '-fg',
        id: 'map',
        params: { transparent: true },
        uniforms: { tMap: { value: this.getTexture(fgTexture) } }
      });
      const distFg = 5 - zFg;
      const hFg = 2 * Math.tan(45 * Math.PI / 360) * distFg;
      this.fgMesh.oPosition.z = zFg;
      this.fgMesh.oPosition.x = fgOffset.x;
      this.fgMesh.oPosition.y = fgOffset.y;
      this.fgMesh.oScale.set(hFg * props.ratio * fgScale, hFg * fgScale, 1);
      this.fgMesh.sync();
    }

    if (overlayTexture) {
      this.overlayMesh = this.createMesh({
        meshId: props.id + '-banner',
        id: 'map',
        params: { transparent: true, depthTest: false },
        uniforms: { tMap: { value: this.getTexture(overlayTexture) } }
      });
      this.overlayMesh.oPosition.z = 0.8;
      this.overlayMesh.oPosition.y = 0.65;
      this.overlayMesh.oScale.set(props.ratio * 3.2, 0.75, 1);
      this.overlayMesh.sync();
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
      zBg: -0.7,
      zFg: 0.35
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
      zBg: -0.7,
      zFg: 0.35
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.6
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
      zBg: -0.6
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
      zBg: -0.7,
      zFg: 0.35
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
      zBg: -0.6
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
      zBg: -0.7,
      zFg: 0.35
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
      zBg: -0.6
    });

    this.heroPanel.candleGlow = this.heroPanel.createMesh({
      meshId: 'candle-glow',
      id: 'circle',
      params: { transparent: true, depthTest: false },
      uniforms: {
        uColor: { value: new A(1.0, 0.85, 0.4) },
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
      this.heroPanel.candleGlow.program.uniforms.uAlpha.value = 0.38 + Math.sin(t * 6.0) * 0.12;
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
      compositeTexture: 'c4b7p1-composite',
      overlayTexture: 'c4b7p1-banner',
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.3
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
      zBg: -0.7,
      zFg: 0.35
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

cy.chapter4 = Chapter4;
`;

// Inject before cy is instantiated or at the end of the module
const cyTarget = 'const cy={home:xZ,about:RQ,"debug-panel":LK,"debug-scene":IK,chapters:YQ,chapter1:KK,chapter2:hJ,chapter3:LJ,legal:jQ};';

if (!code.includes(cyTarget)) {
  console.error('Could not find const cy in bundle!');
  process.exit(1);
}

// Append chapter4 to code
code = code + '\n' + chapter4Code;

fs.writeFileSync(bundlePath, code, 'utf8');
console.log('Successfully patched _nuxt/CfE0pqJa.js! New size:', code.length);
